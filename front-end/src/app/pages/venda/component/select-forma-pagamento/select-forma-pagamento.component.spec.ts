import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFormaPagamentoComponent } from './select-forma-pagamento.component';

describe('SelectFormaPagamentoComponent', () => {
  let component: SelectFormaPagamentoComponent;
  let fixture: ComponentFixture<SelectFormaPagamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectFormaPagamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectFormaPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
