import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectEmpresaComponent } from './select-empresa.component';

describe('SelectEmpresaComponent', () => {
  let component: SelectEmpresaComponent;
  let fixture: ComponentFixture<SelectEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectEmpresaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
