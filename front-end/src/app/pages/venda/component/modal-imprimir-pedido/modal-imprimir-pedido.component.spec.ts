import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalImprimirPedidoComponent } from './modal-imprimir-pedido.component';

describe('ModalImprimirPedidoComponent', () => {
  let component: ModalImprimirPedidoComponent;
  let fixture: ComponentFixture<ModalImprimirPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalImprimirPedidoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalImprimirPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
