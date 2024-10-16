import { Component, inject } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../core/services/login.service';
import { Router } from '@angular/router';
import { TokenService } from '../../core/auth/services/token.service';
import { MessageService } from 'primeng/api';

//Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatHint } from '@angular/material/form-field';
import { MatSuffix } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatHint,
    MatSuffix,
    MatLabel,
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  hide = true;

  private formBuilderService = inject(NonNullableFormBuilder)
  private messageService = inject(MessageService)
  private loginService = inject(LoginService)
  private router = inject(Router)
  private tokenService = inject(TokenService)

  protected form = this.formBuilderService.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

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
        const { token, id, nome } = response as { token: string, id: number, nome: string };
        this.tokenService.setToken(token, id.toString(), nome)
        window.location.reload()
      },
      error: (error) => {
        this.form.reset()
        this.messageService.add({severity: 'error', summary: 'Erro', detail: "Ocorreu um erro ao logar"})
      }
    })
  }
}
