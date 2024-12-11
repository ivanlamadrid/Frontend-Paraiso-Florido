import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlumnosService } from '../../../core/services/alumnos.service';
import { DetalleAlumno } from '../../../shared/models/Alumno';
import TableComponent from '../../../shared/components/table/table.component';
import { Asistencia } from '../../../shared/models/Asistencia';

@Component({
  selector: 'app-detalle-alumno',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './detalle-alumno.component.html',
  styleUrl: './detalle-alumno.component.css'
})
export default class DetalleAlumnoComponent implements OnInit {
  @Input("id") idAlumno!:string
  dataAlumno!:DetalleAlumno;
  dataAsistencias:Asistencia[]=[];
  columnas:string[]=["fecha","ingreso","salida"]
  nombreColumnas = {
    'fecha': 'Fecha',
    'ingreso':'Hora Ingreso',
    'salida': 'Hora Salida',
  };

  constructor(private alumnoService:AlumnosService,private router:Router){
    
  }

  ngOnInit(): void {
      this.getDetalleAlumno();;
      
  }

  regresarLista(){
    this.router.navigate(["/dashboard/lista-alumnos"])
  }

  getDetalleAlumno(){
    this.alumnoService.getAlumnosById(this.idAlumno).subscribe(
      (data) => {
        console.log(data);
        
        this.dataAlumno = data;
        this.dataAsistencias= data.asistencias;
        console.log(data.asistencias);
        
      },
      (error) => {
        console.error('Error al obtener detalle alumno:', error);
      }
    );
  }

}
