import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumoPagamentoComponent } from './resumo-pagamento.component';

describe('ResumoPagamentoComponent', () => {
  let component: ResumoPagamentoComponent;
  let fixture: ComponentFixture<ResumoPagamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumoPagamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResumoPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
