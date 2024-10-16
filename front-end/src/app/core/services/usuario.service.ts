import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { payloadUsuario } from '../models/Payload.UsuarioModel';
import { Usuario } from '../models/UsuarioModel';
import { Enterprise_RazaoSocial } from '../models/EnterpriseModel';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private httpClient = inject(HttpClient)
  private apiUrl = environment.apiUrl

  create(payload: payloadUsuario){
    return this.httpClient.post(`${this.apiUrl}/usuario/cadastro`,payload)
  }

  list(){
    return this.httpClient.get<Omit<Usuario, 'senha'>[]>(`${this.apiUrl}/usuario/listar`)
  }

  listarEmpresa(){
    return this.httpClient.get<Enterprise_RazaoSocial[]>(`${this.apiUrl}/usuario/listar/empresa`)
  }

  edit(usuario: Omit<Usuario, 'senha'>){
    return this.httpClient.put(`${this.apiUrl}/usuario/editar`, usuario)
  }

  delete(usuario: Omit<Usuario, 'senha'>){
    return this.httpClient.post(`${this.apiUrl}/usuario/deletar/`, usuario)
  }

}
