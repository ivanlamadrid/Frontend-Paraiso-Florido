import { AlumnoResponse } from "./Alumno";

export interface Accion<T = any>{
    accion: string,
    fila?: T
}

export const getEntityPropiedades = (entidad: string): Array<any> => {
    let resultados: any = [];
    let clase: any;
  
    switch(entidad){
      case 'alumno':
        clase = new AlumnoResponse(); break;  
    }
  
    if(clase){
      resultados = Object.keys(clase);
    }
    return resultados
}
  