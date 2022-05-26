from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Article(TimeStampedModel):
    title = models.CharField(max_length=50)
    theory = models.TextField()
    theory_source = models.CharField(max_length=200)
    image_before = models.CharField(max_length=100)
    image_after = models.CharField(max_length=100)


class Code(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    language = models.CharField(max_length=30)
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
