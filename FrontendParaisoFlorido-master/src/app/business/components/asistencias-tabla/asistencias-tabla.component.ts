import { Component } from '@angular/core';
import TableComponent from '../../../shared/components/table/table.component';
import { AsistenciaService } from '../../../core/services/asistencia.service';
import { Asistencia } from '../../../shared/models/Asistencia';
import { FormsModule } from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'app-asistencias-tabla',
  standalone: true,
  imports: [TableComponent, FormsModule],
  templateUrl: './asistencias-tabla.component.html',
  styleUrl: './asistencias-tabla.component.css'
})
export default class AsistenciasTablaComponent {
  title:string = 'Lista de asistencias';
  columnas:string[]=["fecha","ingreso","salida","nombreAlumno","apellidoAlumno","gradoId", "nombreSeccion"]
  asistencias: Asistencia[] = [];
  filtroFecha: string = "";

  nombreColumnas = {
    'fecha': 'Fecha',
    'ingreso':'Hora Ingreso',
    'salida': 'Hora Salida',
    'nombreAlumno': 'Nombres',
    'apellidoAlumno': 'Apellidos',
    'gradoId': 'Grado',
    'nombreSeccion': 'Seccion'
  };

  constructor(private asistenciaService: AsistenciaService) { }

  ngOnInit(): void {
    // Cargar todos los alumnos al iniciar
    this.filtroFecha = moment().format('YYYY-MM-DD')
    this.obtenerAsistencias();
  }

  // Método para obtener alumnos con filtro
  obtenerAsistencias(): void {
    this.asistenciaService.getAsistencias(this.filtroFecha).subscribe(
      (data) => {
        this.asistencias = data;
      },
      (error) => {
        console.error('Error al obtener alumnos:', error);
      }
    );
  }

  mostrarFecha(){
    console.log(this.filtroFecha);
    
  }

  // Método para aplicar el filtro
  aplicarFiltro(): void {
    this.mostrarFecha()
    this.obtenerAsistencias();
  }
}
