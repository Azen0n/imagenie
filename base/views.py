import json

import cv2
import numpy as np
from django.db.models import Count
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import render

from base.processing_functions import methods
from base.utility import params_to_list, image_to_string
from .models import Article, Script, Code, Parameter, FurtherReading, Test, Question, Answer


def index(request):
    articles = Article.objects.all()
    last_modified_article = Article.objects.order_by('-modified_at').first()
    short_theory = trim_theory(last_modified_article.theory)
    context = {
        'articles': articles,
        'last_modified_article': last_modified_article,
        'short_theory': short_theory,
    }
    return render(request, 'index.html', context)


def trim_theory(theory: str) -> str:
    period_indices = [i for i, char in enumerate(theory) if char == '.']
    # Сокращаем количество коротких "предложений" (скорее всего это формулы, раз точки так близко друг к другу)
    # до тех пор, пока не останутся достаточно длинные предложения
    min_index, max_index = 3, 5
    while period_indices[max_index + 1] - period_indices[max_index] < 5 and max_index > min_index:
        max_index -= 1
    return theory[:period_indices[max_index] + 1]


def algorithm(request, id: int):
    article = Article.objects.get(id=id)
    scripts = Script.objects.filter(article_id=id)
    code = Code.objects.filter(article_id=id)
    parameters = Parameter.objects.filter(article_id=id)
    further_reading = FurtherReading.objects.filter(article_id=id)
    number_of_tests = len(Test.objects.filter(article_id=id).annotate(total=Count('article_id')))

    context = {
        'article': article,
        'scripts': scripts,
        'number_of_tests': number_of_tests,
        'code': code,
        'parameters': parameters,
        'further_reading': further_reading,
    }

    return render(request, 'algorithm.html', context)


def process_image(request):
    image_file = request.FILES.get('image')
    image = cv2.imdecode(np.frombuffer(image_file.read(), np.uint8), cv2.IMREAD_UNCHANGED)
    method = request.POST.get('method')
    params = params_to_list(request.POST.get('params'))

    processed_image = image_to_string(methods[method](image, *params))
    context = {'image': processed_image}
    return JsonResponse(context)


def tests(request, id: int):
    number_of_questions = Question.objects.filter(test_id=id).values('test_id').annotate(total=Count('test_id'))

    context = {
        'tests': zip(Test.objects.filter(article_id=id), number_of_questions),
        'article': Article.objects.get(id=id),
    }
    return render(request, 'tests.html', context)


def test(request, article_id: int, test_id: int):
    context = {
        'test': Test.objects.get(id=test_id),
    }
    return render(request, 'test.html', context)


def get_test_results(request, article_id: int, test_id: int):
    answers = json.loads(request.POST.get('answers'))
    questions = Question.objects.filter(test_id=test_id)

    correct_answers = []
    for i, question in enumerate(questions):
        question_answers = question.answer_set.all()
        for j, answer in enumerate(question_answers):
            if answer.is_correct:
                correct_answers.append((answers[i][j], question.text, answer.text))

    context = {'correct_answers': correct_answers}
    return JsonResponse(context)


def search_results(request):
    key = request.GET['key']
    articles = Article.objects.filter(
        Q(title__icontains=key) | Q(lower_en_title__icontains=key) | Q(theory__icontains=key))
    return render(request, 'search.html', {'articles': articles, 'key': key})
