import { Component, inject, OnInit } from '@angular/core';
import { CarruselComponent } from '../carrusel/carrusel.component';
import { initFlowbite } from 'flowbite';
import CardIconComponent from "../../../shared/components/card-icon/card-icon.component";
import MisionVisionComponent from './mision-vision/mision-vision.component';
import WspContactComponent from "../../../shared/components/wsp-contact/wsp-contact.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CarruselComponent, CardIconComponent, MisionVisionComponent, WspContactComponent, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export default class InicioComponent implements OnInit {
  fb = inject(FormBuilder);
  rol: string = "PADRES";
  ngOnInit(): void {
    initFlowbite();
  }

  constructor(private http: AuthService) { }


  form: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    documento: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(11)]],
    grado: [1, Validators.required],
    turno: ['Mañana', Validators.required],
    t_documento: ['DNI', Validators.required],
  });

  registrarPadre(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      console.log('Registrando padre:', this.form.value.grado);
      this.http.registerPadre(this.form.value.nombre, this.form.value.apellido, this.form.value.documento,this.form.value.correo,this.rol,this.form.value.grado, this.form.value.telefono,this.form.value.turno).subscribe(
        (data) => {
          console.log(data= data);
          this.form.reset();
          this.form.get('grado')?.setValue(1);
          this.form.get('turno')?.setValue('Mañana');
          this.form.get('t_documento')?.setValue('DNI');
          alert('Solicitud registrada');
        },
        (error) => {
          console.error('Error al registrar usuario:', error);
        }
      );
    }else{
      console.log('Formulario inválido');
      Object.keys(this.form.controls).forEach(key => {
        const controlErrors = this.form.get(key)?.errors;
        if (controlErrors) {
          console.log(`Control: ${key}, Errores:`, controlErrors);
        }
      });
    }
  }
}
