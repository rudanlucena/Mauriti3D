import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido, PageResponse, CargaDia } from './pedido.model';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private http = inject(HttpClient);
  private api = '/api/pedidos';

  getAtivos(nome = ''): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.api}?nome=${encodeURIComponent(nome)}`);
  }

  getFinalizados(nome = '', page = 0, size = 10): Observable<PageResponse<Pedido>> {
    return this.http.get<PageResponse<Pedido>>(
      `${this.api}/finalizados?nome=${encodeURIComponent(nome)}&page=${page}&size=${size}`
    );
  }

  create(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.api, pedido);
  }

  update(id: number, pedido: Pedido): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.api}/${id}`, pedido);
  }

  patchStatus(id: number, status: string): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.api}/${id}/status?status=${status}`, null);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  getCargaPorDia(mes: number, ano: number): Observable<CargaDia[]> {
    return this.http.get<CargaDia[]>(`${this.api}/carga-por-dia?mes=${mes}&ano=${ano}`);
  }
}
