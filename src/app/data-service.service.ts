import { Injectable } from '@angular/core';
import {SQLite, SQLiteObject} from '@awesome-cordova-plugins/sqlite/ngx';
import { HttpClient } from '@angular/common/http';

// Se puede usar el servicio en cualquier componente o página inyectándolo en el constructor
@Injectable({
  providedIn: 'root'
})

export class DataServiceService {

  private apiUrl = 'http://192.168.1.100:3000/lugares';
  public dbInstance!: SQLiteObject;
  
  constructor(
    private sqlite: SQLite, 
    private http: HttpClient
  ) {
    this.initializeDatabase();
  }

  // Función para iniciar base de datos
  async initializeDatabase() {
    this.dbInstance = await this.sqlite.create({
      name: 'mydatabase.db',
      location: 'default'
    });
    await this.createTables();
  }

  async createTables() {
    // Creación de tabla usuario
    const sqlUserTable = ` 
      CREATE TABLE IF NOT EXISTS USERS (
        usuario TEXT PRIMARY KEY,
        password INTEGER NOT NULL,
        nombre TEXT,
        apellido TEXT,
        email TEXT NOT NULL UNIQUE,
        educacion TEXT,
        tel TEXT,
        nacimiento TEXT
      )
    `;  
    // Creación de tabla que define si el usuario esta logeado
    const sqlUserSession = `
      CREATE TABLE IF NOT EXISTS SESSION (
        usuario TEXT PRIMARY KEY,
        logged_in INTEGER
      )
    `;
    
    await this.dbInstance.executeSql(sqlUserTable, []); // Ejecuta sentencia de la tabla mientras el código espera la ejecución
    await this.dbInstance.executeSql(sqlUserSession, []); // Ejecuta sentencia de la tabla mientras el código espera la ejecución
  }

  // Función que retorna un booleano dependiendo si existe la tabla
  async tablaExiste(nombreTabla: string): Promise<boolean> {
    const resultado = await this.dbInstance.executeSql(
      `SELECT 
        name 
      FROM sqlite_master 
      WHERE type='table' AND name = ?`,
      [nombreTabla]
    );
    return resultado.rows.length > 0; // Se necesita que la variable equivalga a un comando
  }

  // Llamado a tablaExiste
  async tablaCheck(nombreTabla: string){
    const existe = await this.tablaExiste(nombreTabla);
    console.log('¿Existe la tabla?', existe);
  }
  
  // Verifica si nombre y usuario existen en la base de datos y devuelve un booleano
  async loginDatabase(usuario: string, password: string): Promise<boolean> {
    const consulta = await this.dbInstance.executeSql(
      'SELECT * FROM USERS WHERE usuario = ? AND password = ?',
      [usuario, password]
    );
    return consulta.rows.length > 0; // Si hay al menos una fila devuelta, devuelve true
  }

  async insertUser(
    usuario: string, 
    password: string, 
    nombre: string, 
    apellido: string, 
    email: string, 
    educacion: string, 
    tel: string, 
    nacimiento: Date) {

    try { 
      // Inserta el usuario creado en la base de datos
      await this.dbInstance.executeSql(`
      INSERT INTO users 
        (usuario, 
        password, 
        nombre, 
        apellido, 
        email, 
        educacion, 
        tel, 
        nacimiento)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
      [
        usuario, 
        password, 
        nombre, 
        apellido, 
        email, 
        educacion, 
        tel, 
        nacimiento.toISOString().split('T')[0]// formato de fecha: YYYY-MM--DD
      ]); 
      
      return true; // Retorna true si la inserción es exitosa
    } catch (error) {
      console.error('Error al registrar al usuario:', error);
      return false; // Retorna false si hay un error
      ////////////////////////////////////////////////////////////////falta mostrar un error al usuario en ts de página
    }

  }

  // Busca y retorna información de la cuenta si existe
  async getCuenta(
    usuario: string
  ){

    const consulta = await this.dbInstance.executeSql(
      `SELECT 
        nombre,
        apellido,
        educacion,
        tel,
        nacimiento
      FROM USERS WHERE usuario = ?`, [usuario]
    );

    // Si devuelve al menos 1 línea, devuelve la información a la página
    if (consulta.rows.length > 0){
      return consulta.rows.item(0);
    } else {
      return null;
    }

  }

  async updateCuenta(
    usuario: string, 
    nombre: string, 
    apellido: string, 
    educacion: string, 
    nacimiento: Date){
    
    const consulta = await this.dbInstance.executeSql(
      // Actualiza los datos de la cuenta que coincida con el usuario actual
      `UPDATE users 
       SET 
        nombre = ?, 
        apellido = ?, 
        educacion = ?, 
        nacimiento = ? 
       WHERE usuario = ?`,
      [
        nombre, 
        apellido, 
        educacion, 
        nacimiento.toISOString().split('T')[0], // formato de fecha: YYYY-MM--DD
        usuario
      ]
    );
  }

  // actualiza el estado de la tabla SESSION a conectado para el guard
  async loggedIn(usuario: string){

    const loggedIn = `
      UPDATE SESSION 
      SET logged_in = 1
      WHERE usuario = ? 
    `;
    await this.dbInstance.executeSql(loggedIn, [usuario]);

  }

  // actualiza el estado de la tabla SESSION a conectado para el guard
  async loggedOut(usuario: string){

    const loggedOut = `
      UPDATE SESSION 
      SET logged_in = 0
      WHERE usuario = ? 
    `;
    await this.dbInstance.executeSql(loggedOut, [usuario]);

  }
  

  getLugares() {
    return this.http.get(this.apiUrl);
  }
  
}
