import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataComemorativa, DataComemorativaStats } from './data-comemorativa.model';

@Injectable({ providedIn: 'root' })
export class DataComemorativaService {
  private http = inject(HttpClient);
  private api = '/api/datas';

  getAll(): Observable<DataComemorativa[]> {
    return this.http.get<DataComemorativa[]>(this.api);
  }

  create(data: DataComemorativa): Observable<DataComemorativa> {
    return this.http.post<DataComemorativa>(this.api, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  getStats(id: number): Observable<DataComemorativaStats> {
    return this.http.get<DataComemorativaStats>(`${this.api}/${id}/stats`);
  }
}
