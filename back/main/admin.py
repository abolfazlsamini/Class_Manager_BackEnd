from django.contrib import admin
from main.models import Profile, Bookmarks, ClassModel, ClassState, DaysOfTheWeek
# from django.contrib.auth.admin import UserAdmin
# from django.contrib.auth.models import User


# class Teacherness(admin.StackedInline):
#     model = Profile
#     can_delete = False
#     verbose_name_plural = 'teacher'

# class UserAdmin(UserAdmin):
#     teacher = [Teacherness,]



# admin.site.unregister(User, )
# admin.site.register(User, UserAdmin)

admin.site.register(Profile)
admin.site.register(Bookmarks)
admin.site.register(ClassModel)
admin.site.register(ClassState)
admin.site.register(DaysOfTheWeek)