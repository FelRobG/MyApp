import { CanActivateFn, Router } from '@angular/router'; // Import de protección de rutas
import { inject } from '@angular/core'; //
import { DataServiceService } from '../data-service.service'; // Importación de servicio

export const authGuard: CanActivateFn = async () => { 
  const router = inject(Router);
  const dataService = inject (DataServiceService);

  // Consulta el almacenamiento local
  const usuario = localStorage.getItem('usuario');

  // Si no existe usuario, lo regresa al login
  if (!usuario){
    router.navigate(['/login']);
    return false;
  }

  // Consulta con la base de datos si la cuenta está iniciada
  const consulta = await dataService.dbInstance.executeSql(`
    SELECT * FROM SESSION
    WHERE usuario = ? AND logged_in = 1
    `, [usuario]
  );

  // La constante obtiene los datos de la consulta si retorna al menos 1 fila
  const sessActiva = consulta.rows.length > 0;

  // Si regresa algo, regresa true
  if (sessActiva) {
    return true
  }

  // Si no regresa nada, lo regresa al login y retorna false
  router.navigate(['/login']);
  return false
}
