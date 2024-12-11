import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export default class TableComponent implements OnInit {
  ngOnInit(): void {
      ;
  }
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

}
