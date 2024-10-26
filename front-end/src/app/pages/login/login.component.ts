import { Component, inject } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../core/services/login.service';
import { Router } from '@angular/router';
import { TokenService } from '../../core/auth/services/token.service';
import { MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from "primeng/floatlabel";
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ModalResetSenhaComponent } from './modal-reset-senha/modal-reset-senha.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    ButtonModule,
    ModalResetSenhaComponent
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  hide = true;
  showModal: boolean = false

  private formBuilderService = inject(NonNullableFormBuilder)
  private messageService = inject(MessageService)
  private loginService = inject(LoginService)
  private router = inject(Router)
  private tokenService = inject(TokenService)

  protected form = this.formBuilderService.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  })

  abrirModal() {
    this.showModal = true
  }
  fecharModal() {
    this.showModal = false
  }

  logout() {
    this.tokenService.removeToken()
  }
  onSubmit() {
    if (this.form.invalid) {
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Preencha e-mail e senha!"})
      return;
    }
    this.loginService.post(
      {
        email: this.form.controls.email.value,
        password: this.form.controls.password.value,
      }
    ).subscribe({
      next: (response) => {
        const { token, id, nome, sobrenome, permissao,empresaPrincipal } = response as { token: string, id: number, nome: string, sobrenome: string, permissao: number, empresaPrincipal: string };
        this.tokenService.setToken(token, id.toString(), nome, sobrenome, permissao.toString(), empresaPrincipal)
        window.location.reload()
      },
      error: (error) => {
        this.form.reset()
        this.messageService.add({severity: 'error', summary: 'Erro', detail: error.error.message})
      }
    })
  }
}
