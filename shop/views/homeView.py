from django.shortcuts import render
from product.models.product import Product
from product.models.category import Category
from django.db.models import Q

# Create your views here.

def home(request):
    products = Product.objects.all()
    context = {
        'products': products,
    }
    return render(request, 'shop/home.html', context)

def shop(request):
    products = Product.objects.all()
    categories = Category.objects.filter(is_active=True)
    active_category = request.GET.get('category', '')

    if active_category:
        products = products.filter(category__slug = active_category)

    query = request.GET.get('query', '')
    if query:
        products = products.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        )
    context = {
        'products': products,
        'categories': categories,
        'active_category': active_category,
    }
    return render(request, 'shop/shop.html', context)