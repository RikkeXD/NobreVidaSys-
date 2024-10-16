import { Component, inject, output } from '@angular/core';
import { FormControl, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { EmpresasLista, Enterprise } from '../../../../core/models/EnterpriseModel';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { EmpresaService } from '../../../../core/services/empresa.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-select-empresa',
  standalone: true,
  imports: [
    FieldsetModule,
    PanelModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './select-empresa.component.html',
  styleUrl: './select-empresa.component.scss'
})
export class SelectEmpresaComponent {
  empresas! : EmpresasLista[]
  selectedEmpresa!: EmpresasLista
  empresa!: Enterprise
  signalEmpresa = output<Enterprise>()

  private usuarioService = inject(UsuarioService)
  private empresaService = inject(EmpresaService)

  ngOnInit(){
    this.usuarioService.listarEmpresa().subscribe((empresa) => {
      this.empresas = empresa.map(empresa => ({
              name: empresa.razao_social,
              code: empresa.id
      }))
    })
    
  }
  empresaSelected(event: any){
    this.empresaService.localizar(event.value.code).subscribe((empresa) => {
      this.empresa = empresa
      this.signalEmpresa.emit(this.empresa)
    }
  )
}


}
