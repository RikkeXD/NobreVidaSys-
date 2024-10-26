import { Component, inject, input, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, NonNullableFormBuilder, Validators,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { LoginService } from '../../../core/services/login.service';
import { ResetPassword } from '../../../core/models/ResetPasswordModel';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modal-reset-senha',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    FormsModule,
    CommonModule,
    PasswordModule,
    ButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './modal-reset-senha.component.html',
  styleUrl: './modal-reset-senha.component.scss'
})
export class ModalResetSenhaComponent {
  value!: string
  visible: boolean = false;
  showModal = input(false)
  close = output<void>();

  private formBuilderService = inject(NonNullableFormBuilder)
  private loginService = inject(LoginService)
  private messageService = inject(MessageService)

  protected form = this.formBuilderService.group({
    recovery_code: ['', [Validators.required, Validators.minLength(6)]],
    senha: ['', [Validators.required, Validators.minLength(5)]],
    confirmarSenha: ['', [Validators.required, Validators.minLength(5)]]
  })

  ngOnChanges() {
    if (this.showModal() === true) {
      this.showDialog()
    } else {
      this.closeDialog()
    }
  }

  showDialog() {
      this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.close.emit();
  }

  onHide() {
    this.closeDialog()
  }

  onSubmit(){
    if(this.form.value.senha !== this.form.value.confirmarSenha){
      this.messageService.add({severity:'warn', summary:'Atenção', detail:'As senhas não são iguais'})
      return
    }
    if (this.form.valid ) {
      const recovery: ResetPassword = {
        recovery_code: this.form.value.recovery_code!,
        senha: this.form.value.senha!,
        confirmarSenha: this.form.value.confirmarSenha!
      }
      this.loginService.redefinirSenha(recovery).subscribe({
        next: () => {
          this.messageService.add({severity:'success', summary:'Sucesso', detail:'Senha alterada com sucesso!'})
          this.closeDialog()
        },
        error: (error) => {
          this.messageService.add({severity:'error', summary:'Erro ao alterar a senha!', detail:error.error.message})
        }
      })
      
    } else {
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Verifique os campos"})
      Object.values(this.form.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }
}
