from django.urls import path
from movie import views

app_name = 'App_movie'


urlpatterns = [
    path('', views.movie_home, name='movie_home'),
    path('movies', views.movie_list, name='movie_list'),
    path('movies/add', views.add_movie, name='add_movie'),
    path('movies/<int:pk>/remove', views.remove_movie, name='remove_movie'),
    path('movies/<int:pk>/edit', views.edit_movie, name='edit_movie'),
]