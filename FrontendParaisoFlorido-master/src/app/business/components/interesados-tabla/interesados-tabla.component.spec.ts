import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteresadosTablaComponent } from './interesados-tabla.component';

describe('InteresadosTablaComponent', () => {
  let component: InteresadosTablaComponent;
  let fixture: ComponentFixture<InteresadosTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteresadosTablaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteresadosTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
