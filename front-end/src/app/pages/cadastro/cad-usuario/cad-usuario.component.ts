import { Component, inject } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidadorPassword } from '../../../utils/validatorsCustom';
import { UsuarioService } from '../../../core/services/usuario.service';
import { EmpresasLista } from '../../../core/models/EnterpriseModel';
import { EmpresaService } from '../../../core/services/empresa.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConvertUsuario } from '../../../utils/convertUserModel';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { Permissao } from '../../../core/models/UsuarioModel';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-cad-usuario',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    RadioButtonModule,
    DropdownModule,
    ButtonModule,
    DialogModule
  ],
  templateUrl: './cad-usuario.component.html',
  styleUrl: './cad-usuario.component.scss'
})
export class CadUsuarioComponent {

  empresas!: EmpresasLista[]
  selectedEmpresas!: EmpresasLista[]

  visible: boolean = false;

  private formBuilderService = inject(NonNullableFormBuilder)
  private messageService = inject(MessageService)
  private usuarioService = inject(UsuarioService)
  private empresaService = inject(EmpresaService)
  protected optionsPermissao: Permissao[] | undefined
  protected recoveryCode!: string

  ngOnInit() {
    this.optionsPermissao = [
      {
        name: 'Usuario Padrão',
        code: '1'
      },
      {
        name: 'Administrador',
        code: '0'
      }
    ]

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
    confirmarSenha: ['', [Validators.required, Validators.minLength(5)]],
    permissao: ["1", Validators.required]
  }, {
    validators: [ValidadorPassword.ValidatePassword]
  })

  showDialog() {
    this.visible = true;
  }

  copiarCodigo() {
    navigator.clipboard.writeText(this.recoveryCode).then(() => {
      this.messageService.add({severity: 'contrast', summary: 'Copiado', detail: 'Codigo de segurança copiado com sucesso'})
    }).catch(err => {
      console.error('Erro ao copiar código: ', err);
    });
  }

  fecharModal() {
    this.visible = false;
  }

  validationForm() {
    if (!this.selectedEmpresas) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: "Selecione pelo menos uma empresa!" })
      return false;
    }
    const allFieldsFilled = Object.keys(this.form.controls).every(field => {
      const control = this.form.get(field);
      return control && control.value !== '';
    });
    if (!allFieldsFilled) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: "Verifique os campos e tente novamente!" })
      return false;
    }

    if (this.form.controls.email.errors) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: "Email inválido" })
      return false;
    }

    if (this.form.controls.senha.errors?.['minlength']) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: "A senha deve ter no mínimo 5 caracteres!" })
      return false
    }

    if (this.form.controls.senha.value !== this.form.controls.confirmarSenha.value) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: "As senhas não coincidem" })
      return false;
    }
    return true
  }

  onSubmit() {
    if (this.validationForm()) {
      this.usuarioService.create(ConvertUsuario(this.form.value, this.selectedEmpresas)).subscribe({
        next: (res: any) => {
          this.recoveryCode = res.recovery_code
          this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Usuario criado com sucesso'})
          this.showDialog()
          this.selectedEmpresas = []
          this.form.reset()
          Object.keys(this.form.controls).forEach((key) => {
            this.form.get(key)?.setErrors(null)
          })
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message })
        }
      })
    }
  }
}
