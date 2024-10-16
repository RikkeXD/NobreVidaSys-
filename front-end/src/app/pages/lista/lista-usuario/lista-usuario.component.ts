import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputMaskModule } from 'primeng/inputmask';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NonNullableFormBuilder, Validators,FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Usuario } from '../../../core/models/UsuarioModel';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ConvertEditUser } from '../../../utils/convertUserModel';
import { MultiSelectModule } from 'primeng/multiselect';
import { EmpresasLista } from '../../../core/models/EnterpriseModel';
import { EmpresaService } from '../../../core/services/empresa.service';
import {MatRadioModule} from '@angular/material/radio';

@Component({
  selector: 'app-lista-usuario',
  standalone: true,
  imports: [
    TableModule,
    HttpClientModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
    ButtonModule,
    DialogModule,
    InputMaskModule,
    ToggleButtonModule,
    ConfirmDialogModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MultiSelectModule,
    MatRadioModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './lista-usuario.component.html',
  styleUrl: './lista-usuario.component.scss'
})
export class ListaUsuarioComponent {

  userDialog: boolean = false;
  usuarios!: Omit<Usuario, 'senha'>[];
  selectedCustomers!: Omit<Usuario, 'senha'>;
  empresas!: EmpresasLista[]
  
  private formBuilderService = inject(NonNullableFormBuilder)
  private usuarioService = inject(UsuarioService)
  private confirmationService = inject(ConfirmationService)
  private messageService = inject(MessageService)
  private empresaService = inject(EmpresaService)

  ngOnInit() {
    this.usuarioService.list().subscribe((usuario)=> {
      this.usuarios = usuario
    })
    this.empresaService.listRazaoSocial().subscribe((empresa)=> {
      this.empresas = empresa.map(empresa => ({
        name: empresa.razao_social,
        code: empresa.id,
      }))
    })
    
}

  protected form = this.formBuilderService.group({
    id: [0],
    nome: ['', Validators.required],
    sobrenome: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
    permissao: ["", Validators.required],
    empresas: [<EmpresasLista[]>[], Validators.required]
})

hideDialog() {
  this.userDialog = false;
}

  editUser(usuario: Omit<Usuario, 'senha'>){
    this.form.patchValue({
      id: usuario.id,
      nome: usuario.nome,
      sobrenome: usuario.sobrenome,
      email: usuario.email,
      permissao: usuario.permissao.toString(),
      empresas: usuario.empresas.map(empresa => ({
        name: empresa.razao_social,
        code: empresa.id,
      }))
    })
    this.userDialog = true
  }

  deleteUser(event: Event, usuario: Omit<Usuario, 'senha'>){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja excluir este usuario?',
      header: 'Confirmação de exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      acceptLabel:'Sim',
      rejectLabel:'Não',
      accept: () => {
          this.usuarioService.delete(usuario).subscribe({
              next: (response) => {
                this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Usuario deletado com sucesso!'})
                      this.usuarioService.list().subscribe((data) => {
                          this.usuarios = data;
                      });
              },
              error: (error) => {
                this.messageService.add({severity: 'error', summary: 'Erro', detail: error.error.message})
              }
          })
      }
  })
  }

  onSubmit(){
    if(!this.form.invalid){
      this.usuarioService.edit(ConvertEditUser(this.form.value)).subscribe({
        next: (response) => {
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Usuario editado com sucesso!'})
          this.hideDialog()
          this.usuarioService.list().subscribe((data) => {
            this.usuarios = data;
          });
        },
        error: (error) => {
          this.messageService.add({severity: 'error', summary: 'Erro', detail: error.error.message})
        }
      })
    }
  }

}
