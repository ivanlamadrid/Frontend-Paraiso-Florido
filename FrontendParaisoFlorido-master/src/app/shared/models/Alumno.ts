import { Asistencia } from "./Asistencia";

interface Grado {
  nombre: string;
}

interface Seccion {
  nombre: string;
}

export interface Alumno {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  sexo: string; 
  edad: number;
  correo: string | null;
  password: string | null;
  gradoId: number;
  seccionId: number;
  RolId: number;
  grado: Grado;
  seccion: Seccion;
}

export interface DetalleAlumno {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  sexo: string; 
  edad: number;
  gradoId: number;
  nombreSeccion: string;
  asistencias: Asistencia[];
}

export class AlumnoResponse{
  nombre= "";
  apellido="";
  documento= "";
  sexo= "";
  edad= 0;
  correo= "";
  password= "";
  gradoId= 0;
  seccionId= 0;
  RolId= 0;
  grado= "";
  seccion= "";
}
