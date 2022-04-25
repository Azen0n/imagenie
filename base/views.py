import cv2
import numpy as np
from django.http import JsonResponse
from django.shortcuts import render

from base.processing_functions import methods
from base.utility import params_to_list, image_to_string


def index(request):
    return render(request, 'binarization.html')


def process_image(request):
    image_file = request.FILES.get('image')
    image = cv2.imdecode(np.frombuffer(image_file.read(), np.uint8), cv2.IMREAD_UNCHANGED)
    method = request.POST.get('method')
    params = params_to_list(request.POST.get('params'))

    processed_image = image_to_string(methods[method](image, *params))
    context = {'image': processed_image}
    return JsonResponse(context)
