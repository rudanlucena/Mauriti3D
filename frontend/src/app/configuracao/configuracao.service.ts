import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Configuracao } from './configuracao.model';

@Injectable({ providedIn: 'root' })
export class ConfiguracaoService {
  private http = inject(HttpClient);
  private api = '/api/configuracao';

  get(): Observable<Configuracao> {
    return this.http.get<Configuracao>(this.api);
  }

  update(cfg: Configuracao): Observable<Configuracao> {
    return this.http.put<Configuracao>(this.api, cfg);
  }
}
