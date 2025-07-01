import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // importación del router
import { AlertController } from '@ionic/angular'; // Importación para alertas
import { DataServiceService } from '../data-service.service'; // Importación de servicio
import * as M from 'leaflet';

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

  constructor(
    private router: Router,
    private alertController:AlertController,
    private dataService: DataServiceService // Inyección de servicio de base de datos
  ) { }

  // Obtener datos de la base de datos según el usuario
  ngOnInit() {
      // Se obtiene usuario ingresado del almacenamiento local(ingresado en login o register)
      this.usuario = localStorage.getItem('usuario') || '';
      // Si no hay usuario (por borrado de caché o algún otro motivo) se envía al usuario a login
      if (!this.usuario){
        this.router.navigate(['/login']);
        return; //no avanza
      }
      // Llama a la función getCuenta con parámetro usuario y ejecuta una función '=>' con los datos devueltos de getCuenta
      this.dataService.getCuenta(this.usuario).then((cuenta) => {
        this.nombre = cuenta.nombre || '';
        this.apellido = cuenta.apellido || '';
        this.educacion = cuenta.educacion || '';
        this.nacimiento =  cuenta.nacimiento ? new Date(cuenta.nacimiento) : null;
      });
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

  // Muestra el nombnre y apellido si no están vacíos
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

  // Actualiza los datos en la base de datos
  async guardarDatos() {
    let mensaje = '';
    
    if (!this.nombre.trim()) {
      mensaje = 'Debe completar el campo de nombre.';
    } else if (!this.apellido.trim()) {
      mensaje = 'Debe completar el campo de apellido.';
    } else if (!this.educacion.trim()) {
      mensaje = 'Debe completar el campo de educación.';
    } else if (this.nacimiento == null) {
      mensaje = 'Debe completar el campo de la fecha de nacimiento.';
    }

    if (mensaje == ''){
      await this.dataService.updateCuenta(
        this.usuario,
        this.nombre,
        this.apellido,
        this.educacion,
        this.nacimiento! // Nunca será null, la verificación está en el registro
      );
    } else {
      const alerta = await this.alertController.create({
        header: 'Información',
        message: mensaje,
        buttons: this.alertButtons,
      });
      await alerta.present();
    }

  }

  ionviewer(){

    const map = M.map('map').setView([-33.4372, -70.6506], 13);
    M.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      attribution: 'Map data © OpenStreetMap contributors'}).addTo(map);
    
    this.dataService.getLugares().subscribe((lugares: any) => {
      lugares.forEach((lugar: any) => {
        M.marker([lugar.lat, lugar.lng]).addTo(map).bindPopup(lugar.nombre);
      });
    });
  }
  
}
