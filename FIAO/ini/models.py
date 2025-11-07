from django.db import models
from django.contrib.auth.models import User

class suscripcion(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    descuento = models.FloatField()
    def __str__(self):
        return self.name
    
class suscripcion_usuario(models.Model):
    id_usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    id_suscripcion = models.ForeignKey(suscripcion, on_delete=models.CASCADE)
    

class tipo(models.Model):
    id_usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name
 
class producto(models.Model):
    id_usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=200)
    descripcion = models.CharField(max_length=200)
    precio = models.FloatField(max_length=200)
    imagen = models.ImageField(upload_to='productos/')