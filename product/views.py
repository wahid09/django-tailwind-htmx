from django.shortcuts import render, get_object_or_404
from product.models.product import Product

# Create your views here.


def product_details(request, slug):
    product = get_object_or_404(Product, slug=slug)
    context = {
        'product': product,
    }
    return render(request, 'product/product_details.html', context)

