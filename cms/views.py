from django.shortcuts import render

# Create your views here.


def cms_home(request):
    return render(request, 'cms/index.html')


def add_cart(request):
    return render(request, 'cms/cart.html')


def shop(request):
    return render(request, 'cms/shop.html')


def single_product(request):
    return render(request, 'cms/single.html')

