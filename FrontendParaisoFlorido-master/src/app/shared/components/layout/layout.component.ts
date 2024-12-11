import { Component, OnInit } from '@angular/core';
import HeaderComponent from '../header/header.component';
import InicioComponent from '../../../business/components/inicio/inicio.component';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { CommonModule } from '@angular/common';
import FooterComponent from '../footer/footer.component';



@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, InicioComponent, RouterOutlet, CommonModule, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export default class LayoutComponent implements OnInit{
  ngOnInit(): void {
    initFlowbite();
  }
}
