from django.urls import path
from .views import user_login, user_register, user_dashboard

app_name = "App_user_account"

urlpatterns = [
    path('login/', user_login, name="user_login"),
    path('register/', user_register, name="user_register"),
    path('dashboard/', user_dashboard, name="user_dashboard"),
]







