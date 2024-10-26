import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Dashboard } from '../models/Dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = environment.apiUrl
  private httpClient = inject(HttpClient)

  buscar(filter: Dashboard){
    return this.httpClient.post(`${this.apiUrl}/dashboard`,filter)
  }
}
