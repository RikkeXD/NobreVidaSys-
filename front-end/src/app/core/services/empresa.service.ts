import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Enterprise, EnterpriseRazaoSocial } from '../models/EnterpriseModel';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private apiUrl = environment.apiUrl
  private httpClient = inject(HttpClient)

  create(empresa: Enterprise){
    return this.httpClient.post(`${this.apiUrl}/empresa/cadastro`, empresa)
  }

  list(){
    return this.httpClient.get<Enterprise[]>(`${this.apiUrl}/empresa/listar`)
  }
  localizar(empresaId: number){
    return this.httpClient.get<Enterprise>(`${this.apiUrl}/empresa/localizar/${empresaId}`)
  }
  listRazaoSocial(){
    return this.httpClient.get<EnterpriseRazaoSocial[]>(`${this.apiUrl}/empresa/listar/razao-social`)
  }

  edit(empresa: Enterprise){
    return this.httpClient.put(`${this.apiUrl}/empresa/editar`, empresa)
  }

  delete(empresa: Enterprise){
    return this.httpClient.post(`${this.apiUrl}/empresa/deletar`, empresa)
  }
}
