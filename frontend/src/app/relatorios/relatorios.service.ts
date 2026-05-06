import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RelatoriosData } from './relatorios.model';

@Injectable({ providedIn: 'root' })
export class RelatoriosService {
  private http = inject(HttpClient);

  get(meses: number): Observable<RelatoriosData> {
    return this.http.get<RelatoriosData>(`/api/relatorios?meses=${meses}`);
  }
}
