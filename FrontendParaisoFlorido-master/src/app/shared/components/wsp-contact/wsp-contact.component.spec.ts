import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WspContactComponent } from './wsp-contact.component';

describe('WspContactComponent', () => {
  let component: WspContactComponent;
  let fixture: ComponentFixture<WspContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WspContactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WspContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
