import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // importación del router
import { AlertController } from '@ionic/angular'; // Importación para alertas

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})

export class HomePage {

  nombre: string = '';
  apellido: string = '';
  usuario: string = '';
  educacion: string = '';
  nacimiento: Date | null = null; // Fecha o null
  alertButtons = ['OK'];
  constructor(private router: Router, private alertController: AlertController) {
  }
// Obtener datos de login o home
  ngOnInit() {
      const nav = this.router.getCurrentNavigation();
      const state = nav?.extras?.state as {
        usuario?: string;
        nombre?: string;
        apellido?: string;
        educacion?: string;
        nacimiento?: Date;
      };

      this.usuario = state?.usuario || ''; // Asignar el nombre del usuario
      this.nombre = state?.nombre || '';
      this.apellido = state?.apellido || '';
      this.educacion = state?.educacion || '';
      this.nacimiento = state?.nacimiento || null;
  }

// Limpiar datos con animación en nombre y apellido
  limpiador() {
    this.nombre = '';
    this.apellido = '';
    this.usuario = '';
    this.educacion = '';
    this.nacimiento = null; // Reiniciar la fecha a null

    const inputs = document.querySelectorAll('.animacion-limp');

    inputs.forEach((input: any) => {
      input.classList.remove('animacion-limp'); // Eliminar la clase de animación si existe
      void input.offsetWidth; // Forzar reinicio de animación
      input.classList.add('animacion-limp'); // Agregar la clase de animación de nuevo
    });
  }

  async mostrarDatos() {
    let mensaje = '';
    if (!this.nombre.trim()) {
      mensaje = 'Debe completar el campo de nombre.';
    } else if (!this.apellido.trim()) {
      mensaje = 'Debe completar el campo de apellido.';
    } else {
      mensaje = `Nombre ingresado: ${this.nombre} ${this.apellido}`;
    }

    const alerta = await this.alertController.create({
      header: 'Información',
      message: mensaje,
      buttons: this.alertButtons,
    });

    await alerta.present();
  }

  guardarDatos() {
  }
}
