import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Payment } from '../models/PaymentModel';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  private apiUrl = environment.apiUrl
  private httpClient = inject(HttpClient)

  listar(){
    return this.httpClient.get<Payment[]>(`${this.apiUrl}/pagamento/listar`);
  }
}
