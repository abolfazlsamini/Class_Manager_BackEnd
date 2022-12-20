from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.http import JsonResponse
from main.models import Bookmarks, ClassModel, DaysOfTheWeek, Profile
from django.contrib.auth.models import User
from main.serializer import RegisterSerializer, SearchClassesSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.db.models import Min, Max, Q
# TODO search between classes for bookmarking

class GetBookmarks(ListAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = Bookmarks

    def get(self, request):
        try:
            user = request.user
            users_bookmarks = Bookmarks.objects.get(user = user)
            classes = users_bookmarks.bookmarks.values("id", "title", "bookmark",
            "days_of_the_week", "state", "state_id", "teacher", "teacher_id", "time_end", "time_start", )

            # for i,cls in enumerate(classes):
            #     techer_name = Profile.objects.get(id= cls["teacher_id"])
            #     classes[i]["teacher"] = techer_name.user.username
                # return Response(list(classes), status=200)


            classes = list(classes)
            day_week = []
            ids = []
            flag = []
            big_return_list = []
            for i,cls in enumerate(classes):
                techer_name = Profile.objects.get(id= cls["teacher_id"])# add teacher name to bookmark
                classes[i]["teacher"] = techer_name.user.first_name

                if cls["id"] not in ids:# trying to remove unnesseri multiple bookmarks that only thair week_day was diffent
                    ids.append(cls["id"])

            for i,id in enumerate(ids):
                day_week = []
                for cl in classes:
                    
                    if id == cl["id"]:
                        if cl["id"] not in flag:
                            big_return_list.append(cl)
                            flag.append(cl["id"])
                        day_week.append(cl["days_of_the_week"])
                big_return_list[i]["days_of_the_week"] = day_week
            return Response(big_return_list, status=200)
        except Exception as e:
            return Response({'ERROR:': str(e)}, status=404)
# returns user's bookmarks

class GetTeacherClasses(ListAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = ClassModel

    def get(self, request):
        try:
            user = request.user
            is_teacher = user.profile.is_teacher
            if not is_teacher:
                return Response("You are forbidden to make this request. You are not a teacher")

            classes = ClassModel.objects.filter(teacher = user.profile).values("id", "title", "bookmark",
            "days_of_the_week", "state", "state_id", "teacher", "teacher_id", "time_end", "time_start", )
            classes = list(classes)
            day_week = []
            ids = []
            flag = []
            big_return_list = []
            for i,cls in enumerate(classes):
                techer_name = Profile.objects.get(id= cls["teacher_id"])# add teacher name to bookmark
                classes[i]["teacher"] = techer_name.user.first_name

                if cls["id"] not in ids:# trying to remove unnesseri multiple bookmarks that only thair week_day was diffent
                    ids.append(cls["id"])

            for i,id in enumerate(ids):
                day_week = []
                for cl in classes:
                    
                    if id == cl["id"]:
                        if cl["id"] not in flag:
                            big_return_list.append(cl)
                            flag.append(cl["id"])
                        day_week.append(cl["days_of_the_week"])
                big_return_list[i]["days_of_the_week"] = day_week
            return Response(big_return_list)

        except Exception as e:
            return Response({'ERROR:': str(e)}, status=404)
# returns Teacher's classes

class GetOneClass(ListAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = ClassModel

    def get(self, request):
        try:
            user = request.user
            is_teacher = user.profile.is_teacher
            
            if not is_teacher:
                return Response("You are forbidden to make this request. You are not a teacher")

            class_id = self.request.GET.get('class_id', None)
            classes = ClassModel.objects.filter(id = class_id).values("id", "title", "bookmark",
            "days_of_the_week", "state", "state_id", "teacher", "teacher_id", "time_end", "time_start", )
            classes = list(classes)

            day_week = []
            ids = []
            flag = []
            big_return_list = []
            for cls in classes:
                if cls["id"] not in ids:
                    ids.append(cls["id"])
            for id in ids:
                day_week = []
                for cl in classes:
                    if id == cl["id"]:
                        if cl["id"] not in flag:
                            big_return_list.append(cl)
                            flag.append(cl["id"])
                        day_week.append(cl["days_of_the_week"])
                big_return_list.append(day_week)
            if big_return_list == []:
                return Response({'ERROR:': "No Object were found with provided information."}, status=404)
            return Response(big_return_list, status=200)

        except Exception as e:
            return Response({'ERROR:': str(e)}, status=404)
# returns Teacher's classes

class RegisterUser(CreateAPIView):
    permission_classes = (AllowAny,)
    queryset = User
    serializer_class = RegisterSerializer
# user registration

class AddBookmark(UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = Bookmarks
    def post(self, request):
        try:
            user = request.user
            class_id = request.data["class_id"]
            class_model = ClassModel.objects.get(id = class_id)
            Bookmarks.objects.get(user = user).bookmarks.add(class_model)
            return Response(str(class_model), status=200)
        except Exception as e:
            return Response({'ERROR:': str(e)}, status=404)
    def patch(self, request):
        return Response({'ERROR:': "Patch not allowed"})
    def put(self, request):
        return Response({'ERROR:': "put not allowed"})
    def head(self, request):
        return Response({'ERROR:': "head not allowed"})
    def options(self, request):
        return Response({'ERROR:': "options not allowed"})
# add bookmark   
     
class RemoveBookmark(UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = Bookmarks
    def post(self, request):
        try:
            user = request.user
            class_id = request.data["class_id"]
            class_model = ClassModel.objects.get(id = class_id)
            Bookmarks.objects.get(user = user).bookmarks.remove(class_model)
            return Response(str(class_model), status=200)
        except Exception as e:
            return Response({'ERROR:': str(e)}, status=404)
    def patch(self, request):
        return Response({'ERROR:': "Patch not allowed"})
    def put(self, request):
        return Response({'ERROR:': "put not allowed"})
    def head(self, request):
        return Response({'ERROR:': "head not allowed"})
    def options(self, request):
        return Response({'ERROR:': "options not allowed"})
# remove bookmark

class ModifyClass(UpdateAPIView):
    permission_classes = (IsAuthenticated,)

    def patch(self, request):
        try:
            user = request.user
            class_id = request.data["class_id"]
            class_title = request.data["class_title"]
            class_state = request.data["class_state"]
            class_time_start = request.data["class_time_start"]
            class_time_end = request.data["class_time_end"]
            class_days = request.data["class_days"]
            days_list = []
            days_of_week = DaysOfTheWeek.objects.get_queryset()
            for day in class_days:
                days_list.append(days_of_week[int(day)])


            classes = user.profile.classes
            classes.filter(id = class_id).update(title = class_title, state = class_state, time_start = class_time_start, time_end = class_time_end)
            classes.get(id = class_id).days_of_the_week.set(days_list)

            return Response({"SUCCESS": "successfully updated!"})
        except Exception as e:
            return Response({'ERROR': str(e)}, status=404)
# update class

class SearchClasses(ListAPIView):
    permission_classes = [AllowAny,]
    # queryset = ClassModel.objects.filter(title__contains='ر')
    serializer_class = SearchClassesSerializer
    # def get(self, request):
    #     title = self.request.GET.get('title', None)
    #     classes = list(ClassModel.objects.filter(title__contains=title).values("id", "title", "bookmark",
    #          "state", "state_id", "teacher", "teacher_id", "time_end", "time_start", ))

    #     return(Response(classes))


    # def get_queryset(self):
    #     try:
    #         title = self.request.GET.get('title', None)
    #         if not title or title == "" or title == None or title == "%D8%B1%DB%8C%D8%A7" or title == "undefined":
    #             return ClassModel.objects.filter(title="Error")
    #             return Response({'ERROR': "title can't be empty"}, status=404)
    #         return ClassModel.objects.filter(title__contains=title)
    #     except Exception as e:
    #         return ClassModel.objects.filter(title="Error")
    #         return Response({'ERROR': str(e)}, status=404)
    
    def get(self, requests):
        try:
            title = self.request.GET.get('title', None)
            classes = list(ClassModel.objects.filter(title__contains = title).values("id", "title", "bookmark",
              "state", "state_id", "teacher", "teacher_id", "time_end", "time_start", "days_of_the_week"))

            day_week = []
            ids = []
            flag = []
            big_return_list = []
            for i,cls in enumerate(classes):
                techer_name = Profile.objects.get(id= cls["teacher_id"])# add teacher name to bookmark
                classes[i]["teacher"] = techer_name.user.first_name

                if cls["id"] not in ids:# trying to remove unnesseri multiple bookmarks that only thair week_day was diffent
                    ids.append(cls["id"])

            for i,id in enumerate(ids):
                day_week = []
                for cl in classes:
                    
                    if id == cl["id"]:
                        if cl["id"] not in flag:
                            big_return_list.append(cl)
                            flag.append(cl["id"])
                        if(cl["days_of_the_week"] not in day_week):
                            day_week.append(cl["days_of_the_week"])
                big_return_list[i]["days_of_the_week"] = day_week
            return Response(big_return_list, status=200)
        except Exception as e:
            return Response({'ERROR:': str(e)}, status=404)



    # filter_backends = (filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend)
    # filter_backends = [DjangoFilterBackend]
    # search_fields = ['^title',]
    # filterset_fields = ['title',]
    # filter_backends = [filters.SearchFilter]