import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadProdutoComponent } from './cad-produto.component';

describe('CadProdutoComponent', () => {
  let component: CadProdutoComponent;
  let fixture: ComponentFixture<CadProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadProdutoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
