from django.shortcuts import redirect, render, get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

from ini import models

def inicio(request):
    suscripciones = models.suscripcion.objects.all()
    print('h')
    for x in suscripciones:
        print('hola')
        print (x.name)
        print (x.descuento)
        print (x.description)
    if not suscripciones:

        messages.info(request, 'No hay suscripciones disponibles en este momento.')
        return render(request, 'index.html', {'suscripciones': []})
    return render(request, 'index.html', {'suscripciones': suscripciones})

def login(request):
    return render(request, 'login.html')

def logout_view(request):
    logout(request)
    print ('sesion cerrada correctamente')
    return redirect ('inicio')


def login_view(request):
    if request.method == 'POST':
        try:
            username = request.POST.get('username')
            password = request.POST.get('password')
            print('se obtuvieron los datos')
            if not username or not password:
                print('faltan datos')
                messages.error(request, 'Por favor, ingrese usuario y contraseña')
                return redirect('login')
            
            # Autenticar al usuario 
            user = authenticate(request, username=username, password=password)
            print ('se autentico')
            if user is not None:
                print('usuario encontrado')
                auth_login(request, user)
                messages.info(request, 'Inicio de sesión exitoso')
                print('usuario autenticado')
                return redirect('tienda')  # o tu vista personalizada para admin
            else:
                print('usuario no encontrado')
                messages.error(request, 'Usuario no encontrado')
                return redirect('login')
        except Exception as e:
            print(f'error en el login {str(e)}')
            messages.error(request, f'Error durante el inicio de sesión: {str(e)}')
            return redirect('login')
    return redirect('login')
    
def registrarse(request):
    suscripciones = models.suscripcion.objects.all()
    return render(request, 'registrarse.html', {
        'suscripciones' : suscripciones,
    })

def crear_registro(request):
    if request.method == 'POST':
        try:
            username = request.POST.get('username')
            email = request.POST.get('email')
            password = request.POST.get('password')
            confirm_password = request.POST.get('confirm_password')
            es_vendedor = request.POST.get('es_vendedor')  # Checkbox
            plan_seleccionado = request.POST.get('plan_seleccionado')  # ID del plan
            id_plan = int(plan_seleccionado)
            pla_obje = models.suscripcion.objects.get(id=id_plan)
            print(f"📝 DEPURACIÓN:")
            print(f"Usuario: '{username}'")
            print(f"Email: '{email}'")
            print(f"Es vendedor: '{es_vendedor}'")
            print(f"Plan seleccionado: '{plan_seleccionado}'")

            # Validar contraseñas
            if password != confirm_password:
                messages.error(request, 'Las contraseñas no coinciden')
                return redirect('registrarse')

            # Crear usuario
            user = User.objects.create_user(
                username=username.strip(),
                email=email,
                password=password
            )
            print(f"✅ Usuario creado: {user.id} - {user.username}")

            # ASIGNAR TIPO SEGÚN SI ES VENDEDOR O NO
            if es_vendedor and plan_seleccionado:
                # Es VENDEDOR
                tipo_usuario = models.tipo.objects.create(
                    id_usuario=user,
                    name="vendedor"
                )
                print(f"✅ Tipo asignado: VENDEDOR")
                
                usu_suscr = models.suscripcion_usuario.objects.create(
                    id_usuario = user,
                    id_suscripcion = pla_obje
                )
                
            else:
                # Es CLIENTE
                tipo_usuario = models.tipo.objects.create(
                    id_usuario=user,
                    name="cliente"
                )
                print(f"✅ Tipo asignado: CLIENTE")

            messages.success(request, 'Registro exitoso!')
            return redirect('login')

        except Exception as e:
            print(f'❌ ERROR: {str(e)}')
            messages.error(request, f'Error en el registro: {str(e)}')
            return redirect('registrarse')
    
    return render(request, 'registro.html')


@login_required
def tienda(request):
    # Obtener todos los productos
    productos = models.producto.objects.all()
    
    # Verificar si el usuario actual es vendedor
    es_vendedor = models.tipo.objects.filter(id_usuario=request.user, name='vendedor').exists()
    
    # Obtener el tipo de usuario para el template
    try:
        user_tipo = models.tipo.objects.get(id_usuario=request.user)
        tipo_nombre = user_tipo.name
    except models.tipo.DoesNotExist:
        tipo_nombre = 'cliente'
    
    print(f"🛍️ Usuario: {request.user.username}")
    print(f"📋 Tipo: {tipo_nombre}")
    print(f"📦 Productos encontrados: {productos.count()}")
    
    context = {
        'productos': productos,
        'es_vendedor': es_vendedor,
        'user_type': tipo_nombre,  # Para usar en el template
        'user_tipo': tipo_nombre,   # Alternativa
    }
    
    return render(request, 'tienda.html', context)

@login_required
def agregar_producto (request):
    pass

@login_required
def gestionar_productos(request):
    # Verificar si es vendedor
    es_vendedor = models.tipo.objects.filter(id_usuario=request.user, name='vendedor').exists()
    
    if not es_vendedor:
        messages.error(request, 'No tienes permisos para gestionar productos')
        return redirect('tienda')
    
    # Obtener productos del usuario actual
    productos_usuario = models.producto.objects.filter(id_usuario=request.user)
    
    if request.method == 'POST':
        try:
            nombre = request.POST.get('nombre')
            descripcion = request.POST.get('descripcion')
            precio = request.POST.get('precio')
            imagen = request.FILES.get('imagen')
            
            # Crear producto asociado al usuario
            models.producto.objects.create(
                id_usuario=request.user,
                nombre=nombre,
                descripcion=descripcion,
                precio=precio,
                imagen=imagen
            )
            
            messages.success(request, 'Producto creado exitosamente')
            return redirect('gestionar_productos')
            
        except Exception as e:
            messages.error(request, f'Error al crear producto: {str(e)}')
    
    context = {
        'productos': productos_usuario,
        'es_vendedor': es_vendedor
    }
    return render(request, 'gestionar_productos.html', context)

@login_required
def eliminar_producto(request, producto_id):
    # Verificar si es vendedor
    es_vendedor = models.tipo.objects.filter(id_usuario=request.user, name='vendedor').exists()
    
    if not es_vendedor:
        messages.error(request, 'No tienes permisos para eliminar productos')
        return redirect('tienda')
    
    # Obtener el producto y verificar que pertenece al usuario
    producto_obj = get_object_or_404(models.producto, id=producto_id, id_usuario=request.user)
    
    if request.method == 'POST':
        try:
            # Aquí podrías cambiar el estado en vez de eliminar directamente
            # producto_obj.estado = 'pendiente_eliminacion'
            # producto_obj.save()
            
            # Por ahora eliminamos directamente
            producto_obj.delete()
            messages.success(request, 'Solicitud de eliminación enviada. El producto será eliminado pronto.')
            return redirect('gestionar_productos')
            
        except Exception as e:
            messages.error(request, f'Error al eliminar producto: {str(e)}')
    
    return redirect('gestionar_productos')