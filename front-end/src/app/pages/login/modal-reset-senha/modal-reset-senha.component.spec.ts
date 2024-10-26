import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalResetSenhaComponent } from './modal-reset-senha.component';

describe('ModalResetSenhaComponent', () => {
  let component: ModalResetSenhaComponent;
  let fixture: ComponentFixture<ModalResetSenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalResetSenhaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalResetSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
