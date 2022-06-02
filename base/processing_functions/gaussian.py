import cv2


def gaussian(image, sigma: float):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    kernel_radius = int(2 * sigma + 1)
    return cv2.GaussianBlur(image, (kernel_radius, kernel_radius), sigma)
