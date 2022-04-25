import cv2


def binarization(image, threshold: int):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    th, new_image = cv2.threshold(image, threshold, 255, cv2.THRESH_BINARY)
    return new_image
