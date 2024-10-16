import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSelectEnvioComponent } from './modal-select-envio.component';

describe('ModalSelectEnvioComponent', () => {
  let component: ModalSelectEnvioComponent;
  let fixture: ComponentFixture<ModalSelectEnvioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSelectEnvioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalSelectEnvioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
