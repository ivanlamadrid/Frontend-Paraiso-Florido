import { Component, OnDestroy, OnInit } from '@angular/core';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { AsistenciaService } from '../../../core/services/asistencia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-asistencia',
  standalone: true,
  imports: [],
  templateUrl: './registro-asistencia.component.html',
  styleUrl: './registro-asistencia.component.css'
})
export default class RegistroAsistenciaComponent implements OnInit, OnDestroy  {
  html5QrCodeScanner: Html5QrcodeScanner | null = null;
  isActive = true;

  constructor(private asistenciaService: AsistenciaService){
    this.customizarTextos();
  }

  ngOnInit(): void {
    // Inicializa el escáner QR en el inicio del componente
    this.html5QrCodeScanner = new Html5QrcodeScanner(
      "reader", 
      { fps: 10, qrbox: 200 }, 
      /* verbose= */ false
    );

    this.html5QrCodeScanner.render(
      this.onScanSuccess.bind(this), 
      this.onScanFailure.bind(this)
    );

    this.customizarTextos();
  }

  ngOnDestroy(): void {
    // Detener el escaneo al destruir el componente
    if (this.html5QrCodeScanner) {
      this.html5QrCodeScanner.clear().catch(error => console.error(error));
    }
  }

  onScanSuccess(decodedText: string, decodedResult: any) {
    this.registrarAsistencia(decodedText);
    
    console.log(`Código QR detectado: ${decodedText}`);
    // Puedes manejar el resultado aquí
    // Por ejemplo, si deseas detener el escáner después de la primera detección:
    
  }

  onScanFailure(error: any) {
    // Se ejecuta si la detección falla o no encuentra un QR
    console.log(`Escaneo fallido: ${error}`);
  }

  registrarAsistencia(id: string){
    this.html5QrCodeScanner?.pause();
    this.asistenciaService.registrarAsistencia(id).subscribe(
      (response) => {
        this.playSound();
        Swal.fire({
          icon: 'success',
          title: 'Asistencia Registrada',
          text: "Confirmar para continuar",
          confirmButtonText: "Listo"
        }).then((result)=>{
          if(result.isConfirmed){
            this.html5QrCodeScanner?.resume();
            this.isActive = true;
          }
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: error.error.message,
          confirmButtonText: "Aceptar"
        }).then((result)=>{
          if(result.isConfirmed){
            this.html5QrCodeScanner?.resume();
            this.isActive = true;
          }
        });
      },
    );
  }

  playSound(): void{
    let audio = new Audio();
    audio.src = "sonido-escaner.mp3"
    console.log("funciona1");
    
    audio.load();
    console.log("funciona1");
    audio.play();
    console.log("funciona1");
  }

  customizarTextos(): void{
    const btnComenzar = document.getElementById("html5-qrcode-button-camera-start");
    const btnCerrar = document.getElementById("html5-qrcode-button-camera-stop");

    if (btnComenzar) btnComenzar.innerHTML = "Iniciar Escaneo"

  }

}
