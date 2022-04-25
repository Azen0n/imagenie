import base64
import io
from urllib.parse import quote

import cv2

from base.processing_functions.binarization import binarization


def get_image_as_string(image) -> str:
    """Image as HTML base64 string."""
    is_success, buffer = cv2.imencode('.png', image)
    output = io.BytesIO(buffer)
    contents = output.getvalue()

    return 'data:image/png;base64,' + quote(base64.b64encode(contents))
