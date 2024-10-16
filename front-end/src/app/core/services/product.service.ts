import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/ProductModel';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.apiUrl
  private httpClient = inject(HttpClient)

  create(payload: Omit<Product, 'id'>){
    return this.httpClient.post(`${this.apiUrl}/produtos/cadastro`,payload)
  }

  listar(empresaId: number) {
    return this.httpClient.get<Product[]>(`${this.apiUrl}/produtos/listar/${empresaId}`)
  }

  edit(product: Product){
    return this.httpClient.put(`${this.apiUrl}/produtos/editar`, product)
  }

  delete(product: Product){
    return this.httpClient.post(`${this.apiUrl}/produtos/deletar`, product)
  }

}
