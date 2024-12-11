import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Accion } from '../../models/Tabla';

@Component({
  selector: 'app-table-action',
  standalone: true,
  imports: [],
  templateUrl: './table-action.component.html',
  styleUrl: './table-action.component.css'
})
export default class TableActionComponent {

  title= '';
  columnas: string[]=[];
  nombreColumnas: { [key: string]: string } = {}
  dataSource: any = []

  @Input() set titulo(title: any){
    this.title = title
  }

  @Input() set columns(columns: string[]){
    this.columnas = columns;
  }

  @Input() set nombreColumns(nombreColumns: { [key: string]: string } ){
    this.nombreColumnas = nombreColumns;
  }

  @Input() set data(data: any){
    this.dataSource = data
  }

  @Output() action: EventEmitter<Accion> = new EventEmitter();

  onAction(accion: string, row?: any) {
    this.action.emit({ accion: accion, fila: row });
  }
}
