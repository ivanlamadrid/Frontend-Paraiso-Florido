import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-icon',
  standalone: true,
  imports: [],
  templateUrl: './card-icon.component.html',
  styleUrl: './card-icon.component.css'
})
export default class CardIconComponent {
  title="";
  description="";
  icon="";
  class_contenedor=""

  @Input() set titulo(title:string){
    this.title = title
  }

  @Input() set descripcion(description:string){
    this.description = description
  }

  @Input() set icono(icon:string){
    this.icon = icon
  }

  @Input() set container(class_contenedor:string){
    this.class_contenedor = class_contenedor
  }
}
