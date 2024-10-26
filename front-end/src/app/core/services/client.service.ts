import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Client } from '../models/ClientModel';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = environment.apiUrl
  private httpClient = inject(HttpClient)

  post(payload: Omit<Client,'id'>){
    return this.httpClient.post(`${this.apiUrl}/clientes/cadastro`, payload)
  }

  listar(empresaID: number){
    return this.httpClient.get<Client[]>(`${this.apiUrl}/clientes/listar/${empresaID}`)
  }

  putEditClient(client: Client){
    return this.httpClient.put(`${this.apiUrl}/clientes/editar`, client)
  }
  delete(client: Client){
    return this.httpClient.post(`${this.apiUrl}/clientes/deletar`, client)
  }
}
