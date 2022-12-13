from django.db import models
from django.contrib.auth.models import User

class ClassState(models.Model):
    state = models.CharField(max_length=100)
    def __str__(self):
        return self.state
class DaysOfTheWeek(models.Model):
    day = models.CharField(max_length=20)
    def __str__(self):
        return self.day

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    is_teacher = models.BooleanField()
    def __str__(self):
        return self.user.username

class ClassModel(models.Model):
    title = models.CharField(max_length=100 )
    teacher = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="classes")
    state = models.ForeignKey(ClassState, on_delete=models.CASCADE)
    time_start = models.TimeField()
    time_end = models.TimeField()
    days_of_the_week = models.ManyToManyField(DaysOfTheWeek)
    def __str__(self):
        return self.title

class Bookmarks(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookmarks")
    bookmarks = models.ManyToManyField(ClassModel, related_name="bookmark", blank=True)

    def numberOfBookmarks(self):
        return str(self.bookmarks.all().count())

    def __str__(self):
        return str(self.user.username + "'s Bookmarks" )