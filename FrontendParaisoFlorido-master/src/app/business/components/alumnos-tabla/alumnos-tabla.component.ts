import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alumno } from '../../../shared/models/Alumno';
import { AlumnosService } from '../../../core/services/alumnos.service';
import TableComponent from '../../../shared/components/table/table.component';
import { SelectComponent } from "../../../shared/components/select/select.component";
import TableActionComponent from "../../../shared/components/table-action/table-action.component";
import { Accion } from '../../../shared/models/Tabla';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../core/services/usuarios.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-alumnos-tabla',
  standalone: true,
  imports: [FormsModule, TableComponent, SelectComponent, TableActionComponent],
  templateUrl: './alumnos-tabla.component.html',
  styleUrl: './alumnos-tabla.component.css'
})
export default class AlumnosTablaComponent implements OnInit {
  title:string = 'Lista de alumnos';
  columnas:string[]=["nombre","apellido","documento","edad","fecha","gradoId", "seccion.nombre",]
  alumnos: Alumno[] = []
  alumnosFiltrados: Alumno[] = []
  filtroNombre: string = '';
  filtroGrado: string = '';
  filtroSeccion: string = '';
  nombreColumnas = {
    'nombre': 'Nombre',
    'apellido':'Apellido',
    'gradoId': 'Grado',
    'edad': 'Edad',
    'nacimiento': 'Fecha',
    'grado.nombre': 'Grado',
    'seccion.nombre': 'Sección'
  };
  idAlumno: string ="";


  constructor(private alumnoService: AlumnosService, private usuarioService: UsuariosService, private router: Router) { }

  ngOnInit(): void {
    this.obtenerAlumnos();
  }

  obtenerAlumnos(): void {
    this.alumnoService.getAlumnos(this.filtroGrado, this.filtroSeccion).subscribe(
      (data) => {
        this.alumnos = data;
        this.alumnosFiltrados = [...this.alumnos];
      },
      (error) => {
        console.error('Error al obtener alumnos:', error);
      }
    );
  }

  aplicarFiltro(): void {
    this.obtenerAlumnos();
  }

  onAction(accion: Accion) {
    if (accion.accion == 'verDetalle') {
     this.verDetalle(accion.fila)
   } else if (accion.accion == 'Eliminar') {
     this.eliminar(accion.fila)
   }
  }

  verDetalle(objeto:any){
    this.idAlumno = objeto.id
    this.router.navigate(["/dashboard/lista-alumnos",this.idAlumno]);
  }

  eliminar(objeto:any){
    this.idAlumno = objeto.id
    Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro?',
      text: "¿Quieres eliminar este usuario?",
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, entonces llamamos al servicio para eliminar
        this.usuarioService.deleteUsuario(this.idAlumno).subscribe(
          (response: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Usuario eliminado',
              text: "El usuario ha sido eliminado correctamente",
              confirmButtonText: "Listo"
            });
            // Actualizamos la lista de alumnos en la tabla
            this.alumnosFiltrados = this.alumnos.filter(item => item.id !== this.idAlumno);
          },
          (error: { error: { message: string } }) => {
            Swal.fire({
              icon: 'error',
              title: error.error.message,
              confirmButtonText: "Aceptar"
            });
          }
        );
      }
    });
    console.log("eliminar",objeto)
  }

  buscarAlumnos():void{
    if(this.filtroNombre != ''){
      const filtro = this.filtroNombre.toLowerCase();
      this.alumnosFiltrados = this.alumnos.filter(alumno => 
        alumno.nombre.toLowerCase().includes(filtro) ||
        alumno.apellido.toLowerCase().includes(filtro)
      ); 
    }else{
      this.alumnosFiltrados = [...this.alumnos];
    }
  }
  
  crearAlumno():void{
    this.router.navigate(["/dashboard/crear-alumno"]);
  }

}
