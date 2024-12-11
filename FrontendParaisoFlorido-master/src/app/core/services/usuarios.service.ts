import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private url = environment.local+'/api/usuario'
  constructor(private http: HttpClient) { }

  //Obtener Usuario con el id PADRES
  obtenerPadres(rol: number): Observable<any>{
    return this.http.get(`${this.url}/${rol}`)
  }

  deleteUsuario(id:string): Observable<any>{
    return this.http.delete(`${this.url}/${id}`)
  }

}
