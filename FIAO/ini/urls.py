from django.urls import path
from ini import views

urlpatterns = [
    path('', views.inicio, name='inicio'),
    path('login/', views.login, name='login'),
    path('login_view/', views.login_view, name='login_view'),
    path('logout/', views.logout_view, name='logout'),
    path('registrarse/', views.registrarse, name='registrar'),
    path('tienda/', views.tienda, name='tienda'),
    path('crear_registro/', views.crear_registro, name="crear_registro"),
    path('agregar_producto/', views.agregar_producto, name='agregar_producto'),
    path('gestionar_productos/', views.gestionar_productos, name='gestionar_productos'),
    path('eliminar_producto/<producto_id>/', views.eliminar_producto, name="eliminar_producto"),

]
