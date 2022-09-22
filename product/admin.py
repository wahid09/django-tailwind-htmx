from django.contrib import admin
from product.models.category import Category
from product.models.product import Product

# Register your models here.


class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    list_display = ('name', 'is_active')
    list_editable = ['is_active']
    search_fields = ['name', 'slug']


admin.site.register(Category, CategoryAdmin)


class ProductAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    list_display = ('name', 'category', 'price', 'is_active', 'created_at')
    list_editable = ['is_active']
    search_fields = ['name', 'slug']


admin.site.register(Product, ProductAdmin)
