from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from main.models import Bookmarks, ClassModel

class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('username', 'password', 'first_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'password': {'write_only': True}
        }


    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
        )

        
        user.set_password(validated_data['password'])
        user.save()
        bookmark = Bookmarks.objects.create(user = user)
        bookmark.save()
        
        return user
# User Register

class SearchClassesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassModel
        fields = '__all__'