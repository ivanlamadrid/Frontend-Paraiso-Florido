import { Component } from '@angular/core';
import TableComponent from "../../../shared/components/table/table.component";
import { UsuariosService } from '../../../core/services/usuarios.service';

@Component({
  selector: 'app-interesados-tabla',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './interesados-tabla.component.html',
  styleUrl: './interesados-tabla.component.css'
})
export default class InteresadosTablaComponent {
  title:string = 'Padres interesados en matricular';
  columnas:string[]=["nombre","apellido","correo","telefono","tipoDocumento", "documento","gradoId", "turno"]
  lista! : any[];

  nombreColumnas = {
    'nombre': 'Nombres',
    'apellidos':'Apellidos',
    'correo': 'Correo',
    'telefono': 'Teléfono',
    'tipoDocumento': 'Tipo Documento',
    'documento': 'Nro Documento',
    'gradoId': 'Grado de interés',
    'turno': 'Turno',
  };

  constructor(private http: UsuariosService) { }

  ngOnInit(): void {
    // Cargar todos los alumnos al iniciar
    this.obtenerLista();
  }

  // Método para obtener alumnos con filtro
  obtenerLista(): void {
    this.http.obtenerPadres(5).subscribe(
      (data) => {
        this.lista = data;
      },
      (error) => {
        console.error('Error al obtener lista de interesados:', error);
      }
    );
  }


}
