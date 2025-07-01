import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router'; // importación del router

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  constructor(
    private menuC: MenuController,
    private router: Router
  ) {}

  async opHome(){
    this.menuC.close();
    this.router.navigate(['/home']);
  }

  async opTienda(){
    this.menuC.close();
    this.router.navigate(['/tienda']);
  }

  async opMapa(){
    this.menuC.close();
    this.router.navigate(['/home']);
  }

  async opLogout(){
    this.menuC.close();
    this.router.navigate(['/home']);
  }
}
