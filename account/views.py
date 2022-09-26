from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import SignUpFrom

# Create your views here.

def signup(request):
    if request.method == 'POST':
        form = SignUpFrom(request.POST)

        if form.is_valid():
            user = form.save()

            login(request, user)
            return redirect('App_shop:home')
    else:
        form = SignUpFrom()
    return render(request, 'account/signup.html', {'form': form})


def login_form(request):
    return render(request, 'account/login.html')
