import sqlite3


def insert_article():
    con = sqlite3.connect('db.sqlite3')
    cursor = con.cursor()
    sql = '''insert into base_article(title, lower_en_title, theory, theory_source, image_before, image_after, created_at, modified_at)
             values (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))'''
    data = [('Бинаризация', 'binarization',
             '''Процесс бинаризации — это перевод цветного (или в градациях серого)
             изображения в двухцветное черно-белое. Главным параметром такого преобразования является порог \(T\)
             — значение, с которым сравнивается яркость каждого пикселя. По результатам сравнения, пикселю
             присваивается значение \(0\) или \(1\).
             $$\\begin{cases}1,\\text{if }\\text{brightness}\ge T\\\ 0\\text{ otherwise}\end{cases}$$
             $$\\text{brightness}=0.299\cdot\\text{Red}+0.587\cdot\\text{Green}+0.114\cdot\\text{Blue}$$
             Существуют различные методы бинаризации, которые можно условно разделить на две группы — глобальные и
             локальные. В первом случае величина порога остается неизменной в течение всего процесса бинаризации.
             Во втором изображение разбивается на области, в каждой из которых вычисляется локальный порог.
             Главная цель бинаризации — это радикальное уменьшение количества информации, с которой приходится
             работать. Просто говоря, удачная бинаризация сильно упрощает последующую работу с изображением. С
             другой стороны, неудачи в процессе бинаризации могут привети к искажениям, таким, как разрывы в
             линиях, потеря значащих деталей, нарушение целостности объектов, появление шума и непредсказуемое
             искажение символов из-за неоднородностей фона. Различные методы бинаризации имеют свои слабые места:
             так, например, метод Оцу может приводить к утрате мелких деталей и «слипанию» близлежащих символов,
             а метод Ниблэка грешит появлением ложных объектов в случае неоднородностей фона с низкой
             контрастностью. Отсюда следует, что каждый метод должен быть применен в своей области.''',
             'https://habr.com/ru/post/278435/',
             '../static/img/original.png',
             '../static/img/binarization.png'),
            ('Размытие по Гауссу', 'gaussian',
             '''Размытие по Гауссу в цифровой обработке изображений — способ размытия изображения с помощью функции Гаусса.
             Этот эффект широко используется в графических редакторах для уменьшения шума изображения и снижения
                 детализации. Размытие по Гауссу также используется в качестве этапа предварительной обработки в
                 алгоритмах компьютерного зрения для улучшения структуры изображения в различных масштабах.
             Применение размытия по Гауссу к изображению математически аналогично свёртке изображения с помощью
                 функции Гаусса.
             Функция Гаусса в двух измерениях
             $$f(x,y)=\\frac{1}{\sqrt{2\pi}\sigma^{2}}e^{\\frac{-(x^{2}+y^{2})}{2\sigma^{2}}}\\tag{1}$$
             где \(x\), \(y\) — координаты точки,
             а \(𝜎\) — среднеквадратическое отклонение нормального распределения.
             Чем больше параметр \(𝜎\), тем сильнее размывается изображение. Как правило, радиус фильтра \(𝑟 = 3𝜎\). В
                 таком случае размер маски \(2𝑟+1×2𝑟+1\).
             При применении в двух измерениях эта формула даёт поверхность, контуры которой представляют собой
                 концентрические окружности с нормальным распределением относительно центральной точки, то есть если
                 использовать эти пиксели как свертку для изображения, то пиксели, расположенные ближе к анализируемому
                 пикселю, будут оказывать влияние на результат больше, чем крайние.
             Для изображения \(I\) итоговое изображение \(I'\) будет получено с использованием следующей формулы.
             $$I'(x,y)=\sum_{i=-r}^{+r}\sum_{j=-r}^{+r}I(x+i)(y+j)\cdot
                 \\frac{1}{\sqrt{2\pi}\sigma^{2}}e^{\\frac{-(i^{2}+j^{2})}{2\sigma^{2}}}\\tag{2}$$''',
             'https://ru.wikipedia.org/wiki/%D0%A0%D0%B0%D0%B7%D0%BC%D1%8B%D1%82%D0%B8%D0%B5_%D0%BF%D0%BE_%D0%93%D0%B0%D1%83%D1%81%D1%81%D1%83',
             '../static/img/original.png',
             '../static/img/gaussian.png')]
    cursor.executemany(sql, data)
    con.commit()


def insert_code():
    con = sqlite3.connect('db.sqlite3')
    cursor = con.cursor()
    sql = '''insert into base_code(language, language_class, implementation, article_id)
                 values (?, ?, ?, ?)'''
    data = [('Python', 'language-python', '''from PIL import Image, ImageDraw


def binarization(image_path: str, threshold: int) -> Image:
    image = Image.open(image_path)
    image = image.convert('L')
    pix = image.load()
    new_image = Image.new(size=image.size, mode='L')
    draw = ImageDraw.Draw(new_image)
    for y in range(image.width):
        for x in range(image.height):
            if (pix[x, y] >= threshold):
                draw.point((x, y), 255)
            else:
                draw.point((x, y), 0)
    return new_image''', 1),
            ('C#', 'language-csharp', '''using System;
using System.Drawing;

private Bitmap binarization(Bitmap image, int threshold)
{
    Bitmap newImage = new Bitmap(image.Width, image.Height);
    for (int y = 0; y < image.Height; y++)
    {
        for (int x = 0; x < image.Width; x++)
        {
            var pixel = image.GetPixel(x, y);
            double brightness = 0.299 * pixel.R + 0.587 * pixel.G + 0.114 * pixel.B;
            if (brightness > threshold)
            {
                newImage.SetPixel(x, y, Color.White);
            }
            else
                {
                    newImage.SetPixel(x, y, Color.Black);
                }
        }
    }
    return newImage;
}''', 1),
            ('Python', 'language-python', '''import math

import numpy as np
from PIL import Image, ImageDraw


def get_gaussian_kernel(sigma: float) -> np.ndarray:
    r = int(sigma * 2)
    kernel = np.ndarray((2 * r + 1, 2 * r + 1))
    for y in range(2 * r + 1):
        for x in range(2 * r + 1):
            kernel[x][y] = 1 / (2 * math.pi * math.pow(sigma, 2)) * math.exp(
                -(math.pow(x - r, 2) + math.pow(y - r, 2)) / (2 * math.pow(sigma, 2)))
    return kernel


def gaussian_blur(image_path: str, sigma: float) -> Image:
    image = Image.open(image_path)
    image = image.convert('L')
    pix = image.load()
    new_image = Image.new(size=image.size, mode='L')
    draw = ImageDraw.Draw(new_image)
    kernel = get_gaussian_kernel(sigma)
    r = int(kernel.shape[0] / 2)
    for y in range(image.height):
        for x in range(image.width):
            amount = 0
            for y_kernel in range(kernel.shape[0]):
                for x_kernel in range(kernel.shape[0]):
                    if (0 <= (y - r + y_kernel) < image.height) and (0 <= (x - r + x_kernel) < image.width):
                        amount += pix[x + x_kernel - r, y + y_kernel - r] * kernel[x_kernel, y_kernel]
            draw.point((x, y), round(amount))
    return new_image''', 2),
            ('C#', 'language-csharp', '''using System;
using System.Drawing;
                    
private double[,] getGaussianKernel(double sigma)
{
    int r = (int)(sigma * 2);

    double[,] kernel = new double[2*r+1, 2*r+1];
    for (int y = 0; y < 2*r+1; y++)
    {
        for (int x = 0; x < 2 * r + 1; x++)
        {
            kernel[x, y] = 1 / (2 * Math.PI * Math.Pow(sigma, 2)) * Math.Exp(-(Math.Pow(x - r, 2) + Math.Pow(y - r, 2)) / (2 * Math.Pow(sigma, 2)));
        }
    }
    return kernel;
}

private Bitmap gaussianBlur(Bitmap image, double sigma)
{
    Bitmap newImage = new Bitmap(image.Width, image.Height);
    double[,] kernel = getGaussianKernel(sigma);
    int r = kernel.GetLength(0) / 2;
    for (int y = 0; y < image.Height; y++)
    {
        for (int x = 0; x < image.Width; x++)
        {
            double amount = 0;
            for (int y_kernel = 0; y_kernel < kernel.GetLength(0); y_kernel++)
            {
                for (int x_kernel = 0; x_kernel < kernel.GetLength(1); x_kernel++)
                {
                    if (((y-r+y_kernel) >= 0 && (y-r+y_kernel) < image.Height) && ((x-r+x_kernel) >= 0 && (x-r+x_kernel) < image.Width))
                    {
                        var pixel = image.GetPixel(x + x_kernel - r, y + y_kernel - r);
                        double brightness = 0.299 * pixel.R + 0.587 * pixel.G + 0.114 * pixel.B;
                        amount += brightness * kernel[x_kernel, y_kernel];
                    }
                }
            }
            newImage.SetPixel(x, y, Color.FromArgb((int)amount, (int)amount, (int)amount));
        }
    }
    return newImage;
}''', 2)]
    cursor.executemany(sql, data)
    con.commit()


def insert_params():
    con = sqlite3.connect('db.sqlite3')
    cursor = con.cursor()
    sql = '''insert into base_parameter(name, article_id)
                 values (?, ?)'''
    data = [('Пороговое значение', 1),
            ('Сигма', 2)]
    cursor.executemany(sql, data)
    con.commit()


def insert_further_reading():
    con = sqlite3.connect('db.sqlite3')
    cursor = con.cursor()
    sql = '''insert into base_furtherreading(name, language, image, article_id)
                     values (?, ?, ?, ?)'''
    data = [(
        'Gonzalez, Rafael C. & Woods, Richard E. (2002). Thresholding. In Digital Image Processing, pp. 760–785. Pearson Education. ISBN 81-7808-629-8',
        'EN', '../static/img/flags/gb.svg', 1),
        (
            'Алексеев В.В., Лакомов Д.В., Шишкин А.А., Аль Маамари Г. Обработка графических изображений сосредоточенных и площадных объектов // Бизнес-информатика. 2019. Т. 13. № 4. С. 49–59. DOI: 10.17323/1998-0663.2019.4.49.59',
            'RU', '../static/img/flags/ru.svg', 2)]
    cursor.executemany(sql, data)
    con.commit()


def insert_script():
    con = sqlite3.connect('db.sqlite3')
    cursor = con.cursor()
    sql = '''insert into base_script(path, article_id)
                         values (?, ?)'''
    data = [('../static/js/binarization-visualization.js', 1),
            ('../static/js/gaussian-visualization.js', 2)]
    cursor.executemany(sql, data)
    con.commit()


def truncate_all_tables():
    con = sqlite3.connect('db.sqlite3', isolation_level=None)
    cursor = con.cursor()
    queries = [
        "delete from base_article",
        "delete from base_script",
        "delete from base_code",
        "delete from base_parameter",
        "delete from base_furtherreading",
        "update sqlite_sequence set seq=0 where name='base_article'",
        "update sqlite_sequence set seq=0 where name='base_script'",
        "update sqlite_sequence set seq=0 where name='base_code'",
        "update sqlite_sequence set seq=0 where name='base_parameter'",
        "update sqlite_sequence set seq=0 where name='base_furtherreading'",
    ]
    for sql in queries:
        cursor.execute(sql)
        cursor.execute('vacuum')
        con.commit()


def truncate_test_question_answer():
    con = sqlite3.connect('db.sqlite3', isolation_level=None)
    cursor = con.cursor()
    queries = [
        "delete from base_test",
        "delete from base_question",
        "delete from base_answer",
        "update sqlite_sequence set seq=0 where name='base_test'",
        "update sqlite_sequence set seq=0 where name='base_question'",
        "update sqlite_sequence set seq=0 where name='base_answer'",
    ]
    for sql in queries:
        cursor.execute(sql)
        cursor.execute('vacuum')
        con.commit()


def insert_test():
    con = sqlite3.connect('db.sqlite3')
    cursor = con.cursor()
    sql = '''insert into base_test(title, description, article_id, created_at, modified_at)
    values (?, ?, ?, datetime('now'), datetime('now'))'''
    data = [('Тест по теории', '''Простые вопросы на знание теоретического материала.''', 1),
            ('Тест по теории', '''Простые вопросы на знание теоретического материала.''', 2)]
    cursor.executemany(sql, data)
    con.commit()


def insert_questions():
    con = sqlite3.connect('db.sqlite3')
    cursor = con.cursor()
    sql = '''insert into base_question(text, test_id) values (?, ?)'''
    data = [
        ('Выберите верное суждение о пороге в глобальной бинаризации', 1),
        ('Главная цель бинаризации', 1),
        ('''Верны ли следующие суждения о фильтре Гаусса?
         А. Применение фильтра Гаусса увеличивает шум изображения Б. Применение фильтра Гаусса снижает детализацию изображения''', 2),
        ('Как определяют радиус фильтра r через сигму σ?', 2),
        ('Как зависит степень размытия изображения с увеличением сигмы σ?', 2),
        ('Если использовать двумерные значения функции Гаусса как квадратную свертку, то какое влияние будет оказывать пиксель, расположенный в центре?', 2),
    ]
    cursor.executemany(sql, data)
    con.commit()


def insert_answers():
    con = sqlite3.connect('db.sqlite3')
    cursor = con.cursor()
    sql = '''insert into base_answer(text, question_id, is_correct) values (?, ?, ?)'''
    data = [
        ('верно только А', 3, False),
        ('верно только Б', 3, True),
        ('верны оба суждения', 3, False),
        ('оба суждения неверны', 3, False),

        ('r = 2σ', 4, False),
        ('r = σ/3', 4, False),
        ('r = 3σ', 4, True),
        ('r = σ', 4, False),

        ('размытие прямо пропорционально значению сигмы', 5, True),
        ('размытие прямо пропорционально квадрату значения сигмы', 5, False),
        ('размытие обратно пропорционально значению сигмы', 5, False),
        ('размытие обратно пропорционально квадрату значения сигмы', 5, False),

        ('минимальное', 6, False),
        ('максимальное', 6, True),
        ('случайное', 6, False),
        ('влияние не зависит от расположения', 6, False),

        ('порог остается неизменной в течение всего процесса бинаризации', 1, True),
        ('порог вычисляется для каждой зоны изображения отдельно', 1, False),
        ('порог зависит от яркости изображения', 1, False),
        ('порог определяется случайным образом', 1, False),

        ('выделение светлых участков', 2, False),
        ('поглощение обнаруженных шумов', 2, False),
        ('радикальное уменьшение количества информации', 2, True),
        ('перевод изображение в двоичную последовательность', 2, False),
    ]
    cursor.executemany(sql, data)
    con.commit()


def insert_article_stuff():
    truncate_all_tables()
    insert_article()
    insert_script()
    insert_code()
    insert_params()
    insert_further_reading()


def insert_test_stuff():
    truncate_test_question_answer()
    insert_test()
    insert_questions()
    insert_answers()


def insert_sobel_article():
    con = sqlite3.connect('db.sqlite3')
    cursor = con.cursor()
    sql = '''insert into base_article(title, lower_en_title, theory, theory_source, image_before, image_after, created_at, modified_at)
                 values (?, ?, ?, ?, '', '', datetime('now'), datetime('now'))'''
    data = ['Оператор Собеля', 'sobel',
            '''Оператор Собеля используется в области обработки изображений. Часто его применяют в алгоритмах выделения границ. По сути, это дискретный дифференциальный оператор, вычисляющий приближенное значение градиента яркости изображения. Результатом применения оператора Собеля в каждой точке изображения является либо вектор градиента яркости в этой точке, либо его норма. Оператор Собеля основан на свёртке изображения фильтрами в вертикальном и горизонтальном направлениях, поэтому его относительно легко вычислять.
Оператор собеля использует ядра \(3×3\), с которыми сворачивают исходное изображение для вычисления приближенных значений производных по горизонтали и по вертикали. 
Пусть A исходное изображение, а \(G_x\) и \(G_y\) — два изображения, где каждая точка содержит приближенные производные по \(x\) и по \(y\). Они вычисляются следующим образом:
$$G_y = \\left[  \\begin{matrix}-1 & -2 & -1\\\\ 0 & 0 & 0\\\\ +1 & +2 & +1\\\\\\end{matrix}\\right] *A$$
$$G_y = \\left[  \\begin{matrix}-1 & -2 & -1\\\\ 0 & 0 & 0\\\\ +1 & +2 & +1\\\\\\end{matrix}\\right] *A$$
(\(*\) обозначает двумерную операцию свертки.)
В каждой точке изображения приближенное значение величины градиента можно вычислить, используя полученные приближенные значения производных:
$$G = \sqrt{G^{2}_x + G^{2}_y}$$
''', 'https://ru.wikipedia.org/wiki/%D0%9E%D0%BF%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80_%D0%A1%D0%BE%D0%B1%D0%B5%D0%BB%D1%8F']
    cursor.execute(sql, data)
    con.commit()


def insert_sobel_code():
    con = sqlite3.connect('db.sqlite3')
    cursor = con.cursor()
    sql = '''insert into base_code(language, language_class, implementation, article_id)
                     values (?, ?, ?, ?)'''
    data = [('C#', 'language-csharp', '''using System;
using System.Drawing;

private Bitmap sobel(Bitmap image)
{
    Bitmap newImage = new Bitmap(image.Width, image.Height);
    int[,] kernel_dx = new int[3, 3]
    {
        {-1, 0, 1},
        {-2, 0, 2},
        {-1, 0, 1}
    };
    int[,] kernel_dy = new int[3, 3]
    {
        {-1, -2, -1},
        {0, 0, 0},
        {1, 2, 1}
    };
    for (int y = 1; y < image.Height-1; y++)
    {
        for (int x = 1; x < image.Width-1; x++)
        {
            double gx = 0;
            double gy = 0;
            double brightness;
            for (int i = -1; i <= 1; i++)
            {
                for (int j = -1; j <= 1; j++)
                {
                    var pixel = image.GetPixel(x+i, y+j);
                    brightness = (0.299 * pixel.R + 0.587 * pixel.G + 0.114 * pixel.B);
                    gx += brightness * kernel_dx[i + 1,j + 1];
                    gy += brightness * kernel_dy[i + 1,j + 1];
                }
            }
            double g = Math.Sqrt(Math.Pow(gx, 2) + Math.Pow(gy, 2))>255?255 : Math.Sqrt(Math.Pow(gx, 2) + Math.Pow(gy, 2));
            newImage.SetPixel(x, y, Color.FromArgb((int)g, (int)g, (int)g));
        }
    }
    return newImage;
}''', 3),
            ('python', 'language-python', '''def sobel(image: Image) -> Image:
    image = image.convert('L')
    kernel_dx = np.array([[-1, 0, 1],
                          [-2, 0, 2],
                          [-1, 0, 1]])
    kernel_dy = np.array([[-1, -2, -1],
                          [0, 0, 0],
                          [1, 2, 1]])
    kernel_size = 3
    pixels = np.asarray(image).astype(int)
    new_pixels = np.zeros((image.height, image.width))
    for x in range(image.height - kernel_size + 1):
        for y in range(1, image.width - kernel_size + 1):
            kernel_pixels = pixels[x:x + kernel_size, y:y + kernel_size]
            new_pixels[x + 1, y + 1] = int(
                ((np.sum(kernel_dx * kernel_pixels)) ** 2 + (np.sum(kernel_dy * kernel_pixels)) ** 2) ** 0.5)
    new_image = Image.fromarray(np.uint8(new_pixels), 'L')

    return new_image''', 3)]
    cursor.executemany(sql, data)
    con.commit()


def insert_sobel_script():
    con = sqlite3.connect('db.sqlite3')
    cursor = con.cursor()
    sql = '''insert into base_script(path, article_id)
                             values (?, ?)'''
    data = ['../static/js/sobel-visualization.js', 3]
    cursor.execute(sql, data)
    con.commit()


def insert_sobel_further_reading():
    con = sqlite3.connect('db.sqlite3')
    cursor = con.cursor()
    sql = '''insert into base_furtherreading(name, language, image, article_id)
                         values (?, ?, ?, ?)'''
    data = ['''Визильтер Ю.В., Желтов С.Ю., Бондаренко А.В., Осоков М.В., Моржин А.В. Обработка и анализ изображений в задачах машинного зрения: Курс лекций и практических занятий. М. : Физматкнига, 2010. – с. 152–161''',
            'RU', '../static/img/flags/ru.svg', 3]
    cursor.execute(sql, data)
    con.commit()


def update_sobel_images():
    con = sqlite3.connect('db.sqlite3')
    cursor = con.cursor()
    sql = '''update base_article set image_before = ?, image_after = ? where id = 3'''
    data = ['../static/img/original.png', '../static/img/sobel.png']
    cursor.execute(sql, data)
    con.commit()


def update_sobel_theory():
    con = sqlite3.connect('db.sqlite3')
    cursor = con.cursor()
    sql = '''update base_article set theory = ? where id = 3'''
    data = ['''Оператор Собеля используется в области обработки изображений. Часто его применяют в алгоритмах выделения границ. По сути, это дискретный дифференциальный оператор, вычисляющий приближенное значение градиента яркости изображения. Результатом применения оператора Собеля в каждой точке изображения является либо вектор градиента яркости в этой точке, либо его норма. Оператор Собеля основан на свёртке изображения фильтрами в вертикальном и горизонтальном направлениях, поэтому его относительно легко вычислять.
Оператор собеля использует ядра \(3×3\), с которыми сворачивают исходное изображение для вычисления приближенных значений производных по горизонтали и по вертикали. 
Пусть A исходное изображение, а \(G_x\) и \(G_y\) — два изображения, где каждая точка содержит приближенные производные по \(x\) и по \(y\). Они вычисляются следующим образом:
$$G_x = \\left[  \\begin{matrix}+1 & 0 & -1\\\\ +2 & 0 & -2\\\\ +1 & 0 & -1\\\\\\end{matrix}\\right] *A$$
$$G_y = \\left[  \\begin{matrix}+1 & +2 & +1\\\\ 0 & 0 & 0\\\\ -1 & -2 & -1\\\\\\end{matrix}\\right] *A$$
(\(*\) обозначает двумерную операцию свертки.)
В каждой точке изображения приближенное значение величины градиента можно вычислить, используя полученные приближенные значения производных:
$$G = \sqrt{G^{2}_x + G^{2}_y}$$
''']
    cursor.execute(sql, data)
    con.commit()


if __name__ == '__main__':
    insert_test()
    insert_questions()
    insert_answers()
