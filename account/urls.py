from django.urls import path
from .views import signup, login

app_name = 'App_account'

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    ]

