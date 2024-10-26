import { Component, inject } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { EmpresasLista } from '../../core/models/EnterpriseModel';
import { UsuarioService } from '../../core/services/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-usuario-config',
  standalone: true,
  imports: [
    DropdownModule,
    CommonModule,
    FormsModule,
    ButtonModule],
  templateUrl: './usuario-config.component.html',
  styleUrl: './usuario-config.component.scss'
})
export class UsuarioConfigComponent {
  empresas!: EmpresasLista[]
  selectedEmpresa!: EmpresasLista
  
  private usuarioService = inject(UsuarioService)
  private messageService = inject(MessageService)

  ngOnInit() {
    this.usuarioService.listarEmpresa().subscribe((empresas) => {
      this.empresas = empresas.empresas.map(empresa => ({
        name: empresa.razao_social,
        code: empresa.id
      }))

      if (empresas.empresaPrincipalId) {
        this.selectedEmpresa = this.empresas.find(
          (empresa) => empresa.code === empresas.empresaPrincipalId
        )!;
      }
    })
  }

atualizarEmpresa(){
  const empresa_id = {empresa_id: this.selectedEmpresa.code}
  this.usuarioService.atualizarEmpresa(empresa_id).subscribe({
    next: () => {
      this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Empresa Atualizada com sucesso'})
    },
    error: (error) => {
      this.messageService.add({severity: 'error', summary: 'Erro', detail: error.error.message});
    }
  })
}
}
