import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSelectClienteComponent } from './modal-select-cliente.component';

describe('ModalSelectClienteComponent', () => {
  let component: ModalSelectClienteComponent;
  let fixture: ComponentFixture<ModalSelectClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSelectClienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalSelectClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
