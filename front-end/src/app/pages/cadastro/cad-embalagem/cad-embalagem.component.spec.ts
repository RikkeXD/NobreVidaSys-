import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadEmbalagemComponent } from './cad-embalagem.component';

describe('CadEmbalagemComponent', () => {
  let component: CadEmbalagemComponent;
  let fixture: ComponentFixture<CadEmbalagemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadEmbalagemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadEmbalagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
