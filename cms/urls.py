from django.urls import path
from .views import cms_home, add_cart, shop, single_product

app_name = 'App_cms'

urlpatterns = [
    path('', cms_home, name='cms_home'),
    path('add_cart', add_cart, name="add_cart"),
    path('shop', shop, name="shop"),
    path('single-product', single_product, name="single_product")
    ]
