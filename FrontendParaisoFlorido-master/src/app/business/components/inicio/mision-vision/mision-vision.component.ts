import { Component } from '@angular/core';
import CardIconComponent from "../../../../shared/components/card-icon/card-icon.component";

@Component({
  selector: 'app-mision-vision',
  standalone: true,
  imports: [CardIconComponent],
  templateUrl: './mision-vision.component.html',
  styleUrl: './mision-vision.component.css'
})
export default class MisionVisionComponent {
  titulo = "Misión"
  descripcion = "Brindar una educación integral, inclusiva y basada en valores. Formar estudiantes con capacidades críticas, creativas e innovadoras, enfocándose en su desarrollo integral y su contribución a una sociedad sostenible y globalizada."
  icono = "ri-focus-2-line"
  class_contenedor = "max-w-xl p-8 bg-white border-2 border-red-700 rounded-lg shadow hover:bg-red-700 cursor-pointer"

  titulo2 = "Visión"
  descripcion2 = 'Ser reconocidos como una "Escuela de la Confianza" que fomente un ambiente integrador, acogedor y libre de violencia, promoviendo el desarrollo integral de los estudiantes y una convivencia escolar democrática.'
  icono2 = "ri-eye-line"
  class_contenedor2 = "max-w-xl p-8 bg-white border-2 border-green-700 rounded-lg shadow hover:bg-green-700 cursor-pointer "
}
