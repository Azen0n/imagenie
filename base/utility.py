import base64
import io
from urllib.parse import quote

import cv2


def image_to_string(image) -> str:
    """Converts Image to HTML base64 string."""
    is_success, buffer = cv2.imencode('.png', image)
    output = io.BytesIO(buffer)
    contents = output.getvalue()

    return 'data:image/png;base64,' + quote(base64.b64encode(contents))


def params_to_list(params: str) -> list:
    """Converts csv params to list.

    Supported types: int, float, str.
    Example:
    '1.5,2,keyword' => [1.5, 2, 'keyword']
    """
    param_list = []
    for param in params:
        try:
            param_list.append(int(param))
        except ValueError:
            try:
                param_list.append(float(param))
            except ValueError:
                param_list.append(param)
    return param_list
