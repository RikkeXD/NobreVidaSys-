import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Packing } from '../models/PackingModel';

@Injectable({
  providedIn: 'root'
})
export class PackingService {

  private apiUrl = environment.apiUrl
  private httpClient = inject(HttpClient)

  postCreatePacking(payload: Omit<Packing,"id">){
    return this.httpClient.post(`${this.apiUrl}/embalagem/cadastro`,payload)
  }

  listar(empresaId: number){
    return this.httpClient.get<Packing[]>(`${this.apiUrl}/embalagem/listar/${empresaId}`)
  }

  edit(embalagem: Packing){
    return this.httpClient.put(`${this.apiUrl}/embalagem/editar`, embalagem)
  }

  delete(embalagem: Packing){
    return this.httpClient.post(`${this.apiUrl}/embalagem/deletar`, embalagem)
  }

}
