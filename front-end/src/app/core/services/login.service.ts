import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Login } from '../models/LoginModel';
import { ResetPassword } from '../models/ResetPasswordModel';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = environment.apiUrl
  private httpClient = inject(HttpClient)


  post(login: Login){
    return this.httpClient.post(`${this.apiUrl}/auth`, login)
  }


  redefinirSenha(recovery: ResetPassword){
    return this.httpClient.put(`${this.apiUrl}/redefinir-senha`,recovery)
  }
}
