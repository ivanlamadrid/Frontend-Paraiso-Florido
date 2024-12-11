import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnosTablaComponent } from './alumnos-tabla.component';

describe('AlumnosTablaComponent', () => {
  let component: AlumnosTablaComponent;
  let fixture: ComponentFixture<AlumnosTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlumnosTablaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlumnosTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
