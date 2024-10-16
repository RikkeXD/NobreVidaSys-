import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarVendaComponent } from './criar-venda.component';

describe('CriarVendaComponent', () => {
  let component: CriarVendaComponent;
  let fixture: ComponentFixture<CriarVendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarVendaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CriarVendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
