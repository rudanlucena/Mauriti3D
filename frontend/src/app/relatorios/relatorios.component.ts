import {
  Component, OnInit, OnDestroy, inject, signal,
  ViewChild, ElementRef, AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { RelatoriosService } from './relatorios.service';
import { RelatoriosData } from './relatorios.model';

Chart.register(...registerables);

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.scss'
})
export class RelatoriosComponent implements OnInit, OnDestroy {
  private service = inject(RelatoriosService);

  dados    = signal<RelatoriosData | null>(null);
  meses    = signal(6);
  loading  = signal(true);

  @ViewChild('cFaturamento') cFaturamento!: ElementRef<HTMLCanvasElement>;
  @ViewChild('cLucro')       cLucro!:       ElementRef<HTMLCanvasElement>;
  @ViewChild('cHoras')       cHoras!:       ElementRef<HTMLCanvasElement>;
  @ViewChild('cStatus')      cStatus!:      ElementRef<HTMLCanvasElement>;
  @ViewChild('cClientes')    cClientes!:    ElementRef<HTMLCanvasElement>;
  @ViewChild('cDias')        cDias!:        ElementRef<HTMLCanvasElement>;

  private charts: Chart[] = [];

  ngOnInit() { this.load(); }

  ngOnDestroy() { this.destroyCharts(); }

  setMeses(m: number) {
    this.meses.set(m);
    this.load();
  }

  load() {
    this.loading.set(true);
    this.service.get(this.meses()).subscribe(d => {
      this.loading.set(false);
      this.dados.set(d);
      setTimeout(() => this.renderCharts(d), 0);
    });
  }

  private destroyCharts() {
    this.charts.forEach(c => c.destroy());
    this.charts = [];
  }

  private renderCharts(d: RelatoriosData) {
    this.destroyCharts();
    const rotulos = d.mensal.map(m => m.rotulo);

    // ── Faturamento x Custos ───────────────────────────────────────────────
    this.charts.push(new Chart(this.cFaturamento.nativeElement, {
      type: 'bar',
      data: {
        labels: rotulos,
        datasets: [
          {
            label: 'Receita',
            data: d.mensal.map(m => m.receita),
            backgroundColor: 'rgba(22,163,74,0.75)',
            borderRadius: 6,
            order: 2
          },
          {
            label: 'Despesas',
            data: d.mensal.map(m => m.despesas),
            backgroundColor: 'rgba(220,38,38,0.65)',
            borderRadius: 6,
            order: 2
          },
          {
            label: 'Lucro',
            data: d.mensal.map(m => m.lucro),
            type: 'line',
            borderColor: '#f97316',
            backgroundColor: 'rgba(249,115,22,0.1)',
            borderWidth: 2.5,
            pointBackgroundColor: '#f97316',
            pointRadius: 4,
            fill: false,
            tension: 0.35,
            order: 1
          }
        ]
      },
      options: {
        ...this.baseOpts('R$', false),
        plugins: {
          legend: {
            display: true,
            position: 'top' as const,
            align: 'end' as const,
            labels: {
              font: { family: 'Inter', size: 12 },
              padding: 16,
              boxWidth: 14,
              boxHeight: 14,
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx: any) => ` ${ctx.dataset.label}: R$ ${Number(ctx.raw).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
            }
          }
        }
      }
    }));

    // ── Horas Impressas ───────────────────────────────────────────────────
    this.charts.push(new Chart(this.cHoras.nativeElement, {
      type: 'bar',
      data: {
        labels: rotulos,
        datasets: [{
          label: 'Horas',
          data: d.mensal.map(m => +(m.minutosImpressos / 60).toFixed(1)),
          backgroundColor: d.mensal.map((_, i) => `hsla(${24 + i * 8},92%,${52 + i * 2}%,0.8)`),
          borderRadius: 7,
          borderSkipped: false
        }]
      },
      options: this.baseOpts('h')
    }));

    // ── Status ────────────────────────────────────────────────────────────
    const statusColors: Record<string, string> = {
      FILA: '#3b82f6', INICIADO: '#f97316', FINALIZADO: '#16a34a', CANCELADO: '#94a3b8'
    };
    this.charts.push(new Chart(this.cStatus.nativeElement, {
      type: 'doughnut',
      data: {
        labels: d.statusDistribuicao.map(s => s.label),
        datasets: [{
          data: d.statusDistribuicao.map(s => s.count),
          backgroundColor: d.statusDistribuicao.map(s => statusColors[s.status] ?? '#94a3b8'),
          borderWidth: 2,
          borderColor: '#fff',
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '68%',
        plugins: {
          legend: { position: 'bottom', labels: { font: { family: 'Inter', size: 12 }, padding: 16, boxWidth: 12, boxHeight: 12 } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}` } }
        }
      }
    }));

    // ── Top Clientes ──────────────────────────────────────────────────────
    this.charts.push(new Chart(this.cClientes.nativeElement, {
      type: 'bar',
      data: {
        labels: d.topClientes.map(c => c.nome.split(' ')[0]),
        datasets: [{
          label: 'Receita',
          data: d.topClientes.map(c => c.totalReceita),
          backgroundColor: 'rgba(249,115,22,0.75)',
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: { ...this.baseOpts('R$'), indexAxis: 'y' as any }
    }));

    // ── Dias da Semana ────────────────────────────────────────────────────
    this.charts.push(new Chart(this.cDias.nativeElement, {
      type: 'bar',
      data: {
        labels: d.diasSemana.map(d => d.dia),
        datasets: [{
          label: 'Pedidos',
          data: d.diasSemana.map(d => d.count),
          backgroundColor: d.diasSemana.map(d =>
            d.dia === 'Dom' || d.dia === 'Sáb'
              ? 'rgba(148,163,184,0.6)' : 'rgba(37,99,235,0.7)'),
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: this.baseOpts('pedidos')
    }));

    // ── Lucro Mensal ──────────────────────────────────────────────────────
    this.charts.push(new Chart(this.cLucro.nativeElement, {
      type: 'line',
      data: {
        labels: rotulos,
        datasets: [{
          label: 'Lucro',
          data: d.mensal.map(m => m.lucro),
          borderColor: '#f97316',
          backgroundColor: (ctx: any) => {
            const grad = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
            grad.addColorStop(0, 'rgba(249,115,22,0.25)');
            grad.addColorStop(1, 'rgba(249,115,22,0.0)');
            return grad;
          },
          borderWidth: 2.5,
          pointBackgroundColor: '#f97316',
          pointRadius: 4,
          fill: true,
          tension: 0.4
        }]
      },
      options: this.baseOpts('R$', false, true)
    }));
  }

  private baseOpts(unit: string, stacked = false, zeroline = false): any {
    return {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) => {
              const v = ctx.raw;
              if (unit === 'R$') return ` R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
              if (unit === 'h') return ` ${v}h`;
              return ` ${v} ${unit}`;
            }
          }
        }
      },
      scales: {
        x: { stacked, grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } },
        y: {
          stacked,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: {
            font: { family: 'Inter', size: 11 },
            callback: (v: any) => {
              if (unit === 'R$') {
                if (Math.abs(+v) >= 1000) return `R$${(+v / 1000).toFixed(1)}k`;
                return `R$${(+v).toFixed(0)}`;
              }
              if (unit === 'h') return `${v}h`;
              return v;
            }
          },
          ...(zeroline ? { afterDataLimits: (axis: any) => { axis.min = Math.min(axis.min, 0); } } : {})
        }
      }
    };
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  fmtValor(v: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  }

  fmtTempo(minutos: number): string {
    if (!minutos) return '—';
    const h = Math.floor(minutos / 60), m = minutos % 60;
    return m ? `${h}h ${m}min` : `${h}h`;
  }

  fmtPct(v: number): string { return `${v.toFixed(1)}%`; }
}
