import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Address } from '../models/AddressModel';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiEnderecoService {

  private apiUrl = 'https://viacep.com.br/ws/'
  private httpClient = inject(HttpClient)


  searchAddress(cep: string): Observable<Address> {
    return this.httpClient.get(`${this.apiUrl}${cep}/json/`).pipe(
      map((response: any) => {
        if (response.erro) {
          throw new Error('CEP INVALÍDO');
        }
        return {
          cep: response.cep,
          endereco: response.logradouro,
          numero: response.numero,
          bairro: response.bairro,
          uf: response.uf,
          cidade: response.localidade,
          complemento: response.complemento
        };
      }),
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 400) {
            console.error('Erro 400: Verifique a URL');
          } else {
            console.error('Erro desconhecido:', error);
          }
        } else {
          console.error('Erro de API:', error.message);
        }
        return throwError(() => error);
      })
    );
  }

}
