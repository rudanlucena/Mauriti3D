import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DespesaService } from '../../../despesa/despesa.service';
import { DashboardDiario } from '../../../despesa/despesa.model';

@Component({
  selector: 'app-dia-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dia-panel.component.html',
  styleUrl: './dia-panel.component.scss'
})
export class DiaPanelComponent implements OnInit {
  private service = inject(DespesaService);

  dataAtual = signal(new Date().toISOString().split('T')[0]);
  resumo    = signal<DashboardDiario | null>(null);

  ngOnInit() { this.load(); }

  load() {
    this.service.getDiario(this.dataAtual()).subscribe(r => this.resumo.set(r));
  }

  prevDia() {
    const d = new Date(this.dataAtual() + 'T12:00:00');
    d.setDate(d.getDate() - 1);
    this.dataAtual.set(d.toISOString().split('T')[0]);
    this.load();
  }

  nextDia() {
    const d = new Date(this.dataAtual() + 'T12:00:00');
    d.setDate(d.getDate() + 1);
    this.dataAtual.set(d.toISOString().split('T')[0]);
    this.load();
  }

  isHoje(): boolean {
    return this.dataAtual() === new Date().toISOString().split('T')[0];
  }

  labelData(): string {
    const hoje = new Date().toISOString().split('T')[0];
    const ontem = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (this.dataAtual() === hoje) return 'Hoje';
    if (this.dataAtual() === ontem) return 'Ontem';
    const [y, m, d] = this.dataAtual().split('-');
    const ano = y !== hoje.split('-')[0] ? `/${y}` : '';
    return `${d}/${m}${ano}`;
  }

  fmtTempo(minutos: number): string {
    if (!minutos) return '—';
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    if (m === 0) return `${h}h`;
    if (h === 0) return `${m}min`;
    return `${h}h ${m}min`;
  }

  fmtValor(v: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  }
}
