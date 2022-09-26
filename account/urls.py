from django.urls import path
from .views import signup, login_form
from django.contrib.auth import views

app_name = 'App_account'

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login_form, name='login_form'),
    path('logout/', views.LogoutView.as_view(), name="logout")
    ]

