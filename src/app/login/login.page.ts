import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // importación del router
import { AlertController } from '@ionic/angular'; // Importación para alertas

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


  constructor(private router: Router, private alertController: AlertController) { }//inyección
  
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

    const cuentaValida = this.cuentas.find( // Verifica si existe la cuenta ingresada
      cuenta => cuenta.usuario === this.usuario && cuenta.password === this.password
    );

    if (cuentaValida) { // Autenticación exitosa
      this.router.navigate(['/home'], { // Redirige a home
        state: { // envía datos a home
          usuario: this.usuario
        }
      });
    } else {
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
