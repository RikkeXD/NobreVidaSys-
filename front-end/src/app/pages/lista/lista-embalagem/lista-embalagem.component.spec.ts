import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEmbalagemComponent } from './lista-embalagem.component';

describe('ListaEmbalagemComponent', () => {
  let component: ListaEmbalagemComponent;
  let fixture: ComponentFixture<ListaEmbalagemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaEmbalagemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaEmbalagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
