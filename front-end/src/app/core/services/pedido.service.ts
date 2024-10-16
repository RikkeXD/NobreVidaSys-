import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CheckShipping, Shipping, ShippingAPI } from '../models/ShippingModel';
import { Order, PrintOrder } from '../models/OrderModel';
import { OrderFinished } from '../models/PackingModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private apiUrl = environment.apiUrl
  private httpClient = inject(HttpClient)

  listar(empresa_id: number){
    return this.httpClient.get<Order[]>(`${this.apiUrl}/pedido/listar/${empresa_id}`);
  }

  consultarFrete(infoEnvio: CheckShipping) {
    return this.httpClient.post<ShippingAPI[]>(`${this.apiUrl}/pedido/frete`, infoEnvio);
  }

  criar(pedido: Order){
    return this.httpClient.post<OrderFinished>(`${this.apiUrl}/pedido/criar`, pedido);
  }

  gerarPDF(infoPedido: PrintOrder): Observable<Blob>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<Blob>(`${this.apiUrl}/pedido/pdf`, infoPedido, {
      headers,
      responseType: 'blob' as 'json'
    });
  }
}
