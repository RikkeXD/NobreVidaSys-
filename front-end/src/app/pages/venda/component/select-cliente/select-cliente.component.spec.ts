import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectClienteComponent } from './select-cliente.component';

describe('SelectClienteComponent', () => {
  let component: SelectClienteComponent;
  let fixture: ComponentFixture<SelectClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectClienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
