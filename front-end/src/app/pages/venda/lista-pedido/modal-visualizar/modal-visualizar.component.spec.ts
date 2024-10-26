import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVisualizarComponent } from './modal-visualizar.component';

describe('ModalVisualizarComponent', () => {
  let component: ModalVisualizarComponent;
  let fixture: ComponentFixture<ModalVisualizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalVisualizarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalVisualizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
