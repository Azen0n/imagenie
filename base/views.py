import cv2
import numpy as np
from django.db.models import Count
from django.http import JsonResponse
from django.shortcuts import render

from base.processing_functions import methods
from base.utility import params_to_list, image_to_string
from .models import Article, Script, Code, Parameter, FurtherReading, Test, Question, Answer


def index(request):
    articles = Article.objects.all()
    last_modified_article = Article.objects.order_by('-modified_at').first()

    context = {
        'articles': articles,
        'last_modified_article': last_modified_article,
    }
    return render(request, 'index.html', context)



def algorithm(request, id: int):
    article = Article.objects.get(id=id)
    scripts = Script.objects.filter(article_id=id)
    code = Code.objects.filter(article_id=id)
    parameters = Parameter.objects.filter(article_id=id)
    further_reading = FurtherReading.objects.filter(article_id=id)

    context = {
        'article': article,
        'scripts': scripts,
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
    number_of_questions = Question.objects.all().values('test_id').annotate(total=Count('test_id'))

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
