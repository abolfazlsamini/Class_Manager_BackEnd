from django.contrib import admin
from django.urls import path
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from rest_framework.authtoken import views
from main.views import (GetBookmarks,
GetTeacherClasses,
RegisterUser,
AddBookmark,
RemoveBookmark,
GetOneClass,
ModifyClass,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/token/', views.obtain_auth_token, name='obtain_token'),

    path('api/register/', RegisterUser.as_view(), name='register'),

    path('api/user/bookmarks', GetBookmarks.as_view(), name='get_bookmark'),
    path('api/user/single-class', GetOneClass.as_view(), name='get_single_class'),
    path('api/user/modify-class', ModifyClass.as_view(), name='modify_class'),

    path('api/user/bookmarks/add-bookmark/', AddBookmark.as_view(), name='add_bookmark'),
    path('api/user/bookmarks/remove-bookmark/', RemoveBookmark.as_view(), name='remove_bookmark'),

    path('api/teacher/classes', GetTeacherClasses.as_view(), name='get_teacher_classes'),
]
