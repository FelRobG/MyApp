import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // importación del router
import { AlertController } from '@ionic/angular'; // Importación para alertas
import { DataServiceService } from '../data-service.service'; // Importación de servicio

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage implements OnInit {

  nombre: string = '';
  apellido: string = '';
  usuario: string= '';
  password: string = '';
  confirmPassword: string = '';
  email: string = '';
  educacion: string = '';
  telefono: string = '';
  nacimiento: Date | null = null; // Fecha o null
  alertButtons = ['OK'];

  constructor(
    private router: Router, 
    private alertController: AlertController, // Inyección de alerta
    private dataService: DataServiceService // Inyección de servicio de base de datos
  ) { }

  

  ngOnInit() {
  }

  limpiador() {
    this.nombre = '';
    this.apellido = '';
    this.usuario = '';
    this.password = '';
    this.confirmPassword = '';
    this.educacion = '';
    this.email = '';
    this.telefono = '';
    this.nacimiento = null; // Reiniciar la fecha a null


    const inputs = document.querySelectorAll('.animacion-limp'); // Seleccionar todos los inputs con la clase animacion-limp

    inputs.forEach((input: any) => {
      input.classList.remove('animacion-limp'); // Eliminar la clase de animación si existe
      void input.offsetWidth; // Forzar reinicio de animación
      input.classList.add('animacion-limp'); // Agregar la clase de animación de nuevo
    });
  }

  async guardarDatos() {
    let mensaje = '';
    let alerta;

    // Confirmación que no hayan campos vacíos
    if (!this.nombre 
      || !this.apellido 
      || !this.usuario 
      || !this.password 
      || !this.confirmPassword 
      || !this.educacion 
      || !this.email 
      || !this.telefono 
      || !this.nacimiento) 
      {
      mensaje = 'Debe completar todos los campos';
      alerta = await this.alertController.create({ // Alerta para campos vacíos
        header: 'Información',
        message: mensaje,
        buttons: this.alertButtons,
      });
      await alerta.present();
      return; // Evita que se ejecute más código

    }

    // Verificación usuario
    if (this.usuario.length < 3 || this.usuario.length > 8) {

      mensaje = 'El usuario debe tener entre 3 y 8 caracteres';
      alerta = await this.alertController.create({ // Alerta para nombre inválido
        header: 'Información',
        message: mensaje,
        buttons: this.alertButtons,
      });
      await alerta.present();
      return; // Evita que se ejecute más código

    } 
    // Verificación contraseña
    else if (this.password.length != 4 || !/^\d+$/.test(this.password)){

      mensaje = 'La contraseña debe ser de 4 dígitos';
      alerta = await this.alertController.create({ // Alerta para contraseña inválida
        header: 'Información',
        message: mensaje,
        buttons: this.alertButtons,
      });
      await alerta.present();
      return; // Evita que se ejecute más código

    } 
    
    // Verificación confirmación contraseña
    else if(this.password != this.confirmPassword) {

      mensaje = 'Las contraseñas no coinciden';
      alerta = await this.alertController.create({ // Alerta para contraseñas que no coinciden
        header: 'Información',
        message: mensaje,
        buttons: this.alertButtons,
      });
      await alerta.present();
      return; // Evita que se ejecute más código

    }

    
    localStorage.setItem('usuario', this.usuario);
    // Se pasan los parámetros con la información a la función Insert del servicio
    this.dataService.insertUser(
      this.usuario,
      this.password,
      this.nombre, 
      this.apellido,
      this.email,
      this.educacion,
      this.telefono,
      this.nacimiento
    );

    // Navegación a home
    this.router.navigate(['/home']);

    //Falta verificaciones de datos ingresados en inputs

  }
}
