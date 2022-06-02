from base.processing_functions.binarization import binarization
from base.processing_functions.gaussian import gaussian
from base.processing_functions.sobel import sobel

methods = {
    'binarization': binarization,
    'gaussian': gaussian,
    'sobel': sobel,
}
