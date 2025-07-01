import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // importación del router
import { AlertController } from '@ionic/angular'; // Importación para alertas
import { DataServiceService } from '../data-service.service'; // Importación de servicio


interface Cuenta { // Definición de la interfaz Cuenta
  usuario: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})

export class LoginPage implements OnInit {
  
  usuario: string = '';
  password: string = '';
  alertButtons = ['OK'];

  cuentas: Cuenta[] = [// Array para almacenar las cuentas
    { usuario: 'usuario1', password: '1234' } // Cuenta predefinida
  ]; 


  constructor(
    private router: Router, 
    private alertController: AlertController, // inyección de alerta
    private dataService: DataServiceService // Inyección de servicio de base de datos
  ) { } 

  async login(){
    // Validación de campos
    let mensaje = '';
    let alerta;

    if (this.usuario.length < 3 || this.usuario.length > 8) {
      mensaje = 'El usuario debe tener entre 3 y 8 caracteres';
      alerta = await this.alertController.create({ // Alerta para nombre inválido
        header: 'Información',
        message: mensaje,
        buttons: this.alertButtons,
      });
      await alerta.present();
      return; // Evita que se ejecute la validación de existencia de la cuenta
    } 
    else if (this.password.length != 4 || !/^\d+$/.test(this.password)){
      mensaje = 'La contraseña debe ser de 4 dígitos';
      alerta = await this.alertController.create({ // Alerta para contraseña inválida
        header: 'Información',
        message: mensaje,
        buttons: this.alertButtons,
      });
      await alerta.present();
      return; // Evita que se ejecute la validación de existencia de la cuenta
    }
    
    // Llama a la función en el servicio que verifica si existe la cuenta ingresada
    const cuentaValida = await this.dataService.loginDatabase(this.usuario, this.password); 

    // Autenticación exitosa
    if (cuentaValida) {
      await this.dataService.loggedIn(this.usuario);
      localStorage.setItem('usuario', this.usuario);
      this.router.navigate(['/home']);
    } else {
    
////////////////////////////////////FALTA CODIGO AUTH GUARD, LOG OUT Y BORRAR USUARIO DE LOCALSTORAGE AL CERRAR SESION////////////////////////
    
      mensaje = 'Usuario o contraseña incorrectos'; // Mensaje de error
      alerta = await this.alertController.create({ // Alerta para error de autenticación
        header: 'Información',
        message: mensaje,
        buttons: this.alertButtons,
      });
      await alerta.present();
      return;

    }
  }

  ngOnInit() {
  }

}
