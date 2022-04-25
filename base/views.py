import cv2
from django.http import JsonResponse
from django.shortcuts import render

from base.processing_functions import methods
from base.utility import params_to_list


def index(request):
    return render(request, 'binarization.html')


def process_image(request):
    image_file = request.FILES.get('image')
    image = cv2.imread(image_file)
    method = request.POST.get('method')
    params = params_to_list(request.POST.get('params'))

    processed_image = methods[method](image, *params)
    context = {'image': processed_image}
    return JsonResponse(context)
