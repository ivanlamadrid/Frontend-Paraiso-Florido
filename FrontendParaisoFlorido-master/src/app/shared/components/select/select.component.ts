import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent implements OnInit {

  ngOnInit(): void {
      console.log("ok");
      
  }
  placeholderSelect: string = ""
  options: string[] = []
  values: string[] = []

  @Input() set placeholder(placeholder:string){
    this.placeholderSelect = placeholder
  } 

  @Input() set dataOptions(data:string[]){
    this.options = data
  }

  @Input() set dataValues(data:string[]){
    this.values = data
  }

}
