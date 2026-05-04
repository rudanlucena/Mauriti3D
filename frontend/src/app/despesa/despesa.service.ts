import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Despesa, DashboardResumo } from './despesa.model';

@Injectable({ providedIn: 'root' })
export class DespesaService {
  private http = inject(HttpClient);

  getResumo(mes: number, ano: number): Observable<DashboardResumo> {
    return this.http.get<DashboardResumo>(`/api/dashboard/mensal?mes=${mes}&ano=${ano}`);
  }

  create(despesa: Despesa): Observable<Despesa> {
    return this.http.post<Despesa>('/api/despesas', despesa);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/despesas/${id}`);
  }
}
