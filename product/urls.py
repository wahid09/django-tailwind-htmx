from django.contrib import admin
from django.urls import path
from product.views import product_details

app_name = 'App_product'

urlpatterns = [
    path('/<slug:slug>/', product_details, name='product_detail'),
]