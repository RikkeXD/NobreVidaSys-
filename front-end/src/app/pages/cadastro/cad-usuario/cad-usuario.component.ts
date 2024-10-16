import { Component, inject } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidadorPassword } from '../../../utils/validatorsCustom';
import { UsuarioService } from '../../../core/services/usuario.service';
import { EmpresasLista, Enterprise, Enterprise_RazaoSocial } from '../../../core/models/EnterpriseModel';
import { EmpresaService } from '../../../core/services/empresa.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConvertUsuario } from '../../../utils/convertUserModel';
import { MessageService } from 'primeng/api';

//Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatHint } from '@angular/material/form-field';
import { MatSuffix } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';


@Component({
  selector: 'app-cad-usuario',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatHint,
    MatSuffix,
    MatLabel,
    MatRadioModule
  ],
  templateUrl: './cad-usuario.component.html',
  styleUrl: './cad-usuario.component.scss'
})
export class CadUsuarioComponent {

  empresas!: EmpresasLista[]
  selectedEmpresas!: EmpresasLista[]

  private formBuilderService = inject(NonNullableFormBuilder)
  private messageService = inject(MessageService)
  private usuarioService = inject(UsuarioService)
  private empresaService = inject(EmpresaService)
  colaborador?: any

  hide = true;
  hide2 = true;

  ngOnInit() {
    this.empresaService.listRazaoSocial().subscribe((empresas) => {
      this.empresas = empresas.map(empresa => ({
        name: empresa.razao_social,
        code: empresa.id,
      }))
    })
  }

  protected form = this.formBuilderService.group({
    nome: ['', Validators.required],
    sobrenome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(5)]],
    senhaConfirm: ['', Validators.required, Validators.minLength(5)],
    permissao: ["1", Validators.required]
  }, {
    validators: [ValidadorPassword.ValidatePassword]
  })

  verificarTecla(event: KeyboardEvent): void {
    if (event.keyCode === 32) {
      event.preventDefault();
    }
  }
  
  validationForm() {
    if(!this.selectedEmpresas){
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Selecione pelo menos uma empresa!"})
      return false;
    }
    const allFieldsFilled = Object.keys(this.form.controls).every(field => {
      const control = this.form.get(field);
      return control && control.value !== '';
    });
    if (!allFieldsFilled) {
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Verifique os campos e tente novamente!"})
      return false;
    }

    if(this.form.controls.email.errors){
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Email inválido"})
      return false;
    }

    if (this.form.controls.senha.errors?.['minlength']) {
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "A senha deve ter no mínimo 5 caracteres!"})
      return false
    }

    if (this.form.controls.senha.value !== this.form.controls.senhaConfirm.value) {
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "As senhas não coincidem"})
      return false;
    }
    return true
  }

  onSubmit() {
    if (this.validationForm()) {
      this.usuarioService.create(ConvertUsuario(this.form.value, this.selectedEmpresas)).subscribe({
        next: () => {
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Usuário cadastrado com sucesso!'})
          this.form.reset()
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setErrors(null)
          })
        },
        error: (error) => {
          this.messageService.add({severity: 'error', summary: 'Erro', detail: error.error.message})
        }
      })
    }
  }
}
