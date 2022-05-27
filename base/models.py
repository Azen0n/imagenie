from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Article(TimeStampedModel):
    title = models.CharField(max_length=50)
    lower_en_title = models.CharField(max_length=50)
    theory = models.TextField()
    theory_source = models.CharField(max_length=200)
    image_before = models.CharField(max_length=100)
    image_after = models.CharField(max_length=100)


class Script(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    path = models.CharField(max_length=100)


class Code(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    language = models.CharField(max_length=30)
    language_class = models.CharField(max_length=30)
    implementation = models.TextField()


class Parameter(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    name = models.CharField(max_length=30)


class FurtherReading(models.Model):
    LANGUAGE_CHOICES = (
        ('EN', 'English'),
        ('RU', 'Русский'),
    )

    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    name = models.TextField()
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES)
    image = models.CharField(max_length=50)


class Test(TimeStampedModel):
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    description = models.TextField()


class Question(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    text = models.TextField()


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    text = models.TextField()
    is_correct = models.BooleanField()
