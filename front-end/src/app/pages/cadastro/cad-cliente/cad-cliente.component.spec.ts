import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadClienteComponent } from './cad-cliente.component';

describe('CadClienteComponent', () => {
  let component: CadClienteComponent;
  let fixture: ComponentFixture<CadClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadClienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
