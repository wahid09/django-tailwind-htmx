from django.shortcuts import render

# Create your views here.


def user_login(request):
    return render(request, 'user_account/login.html')


def user_register(request):
    return render(request, "user_account/register.html")


def user_dashboard(request):
    return render(request, 'user_account/dashboard/dhashboard.html')
