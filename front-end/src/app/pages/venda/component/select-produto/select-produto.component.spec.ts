import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectProdutoComponent } from './select-produto.component';

describe('SelectProdutoComponent', () => {
  let component: SelectProdutoComponent;
  let fixture: ComponentFixture<SelectProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectProdutoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
