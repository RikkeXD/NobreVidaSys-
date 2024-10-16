import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSelectProdutoComponent } from './modal-select-produto.component';

describe('ModalSelectProdutoComponent', () => {
  let component: ModalSelectProdutoComponent;
  let fixture: ComponentFixture<ModalSelectProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSelectProdutoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalSelectProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
