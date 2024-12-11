import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciasTablaComponent } from './asistencias-tabla.component';

describe('AsistenciasTablaComponent', () => {
  let component: AsistenciasTablaComponent;
  let fixture: ComponentFixture<AsistenciasTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsistenciasTablaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsistenciasTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
