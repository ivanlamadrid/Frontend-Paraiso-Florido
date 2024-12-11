import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Asistencia } from '../../shared/models/Asistencia';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private url= environment.local+"/api/asistencia"
  constructor(private http: HttpClient) { }

  getAsistencias(filtroFecha: string = ""):Observable<Asistencia[]>{
    let params: any = {};
    if(filtroFecha) params.fecha = filtroFecha;

    return this.http.get<Asistencia[]>(this.url,{params})
  }

  registrarAsistencia(id: string){
    return this.http.post<any>(this.url,{id})
  }



}
