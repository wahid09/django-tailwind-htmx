from django.contrib import admin
from django.urls import path
from shop.views.homeView import home, shop

app_name = 'App_shop'

urlpatterns = [
    path('', home, name='home'),
    path('products', shop, name='products'),
]