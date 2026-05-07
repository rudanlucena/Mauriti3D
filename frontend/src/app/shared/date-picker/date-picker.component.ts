import { Component, OnInit, inject, signal, computed, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../pedido/pedido.service';
import { CargaDia } from '../../pedido/pedido.model';

export interface DayCell {
  day: number | null;
  dateStr: string;
  loadLevel: 'none' | 'low' | 'medium' | 'high' | 'full';
  isSelected: boolean;
  isToday: boolean;
  badge: number;
  tooltip: string;
}

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent implements OnInit {
  value            = input<string>('');
  metaTotalMinutos = input<number>(480);
  invalid          = input<boolean>(false);
  valueChange      = output<string>();

  private pedidoService = inject(PedidoService);

  viewYear  = signal(new Date().getFullYear());
  viewMonth = signal(new Date().getMonth() + 1);
  cargaMap  = signal<Record<string, CargaDia>>({});

  readonly MESES = [
    'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
  ];
  readonly DIAS_SEMANA = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

  // Único computed que encapsula todo o estado de exibição das células
  cells = computed<DayCell[]>(() => {
    const year     = this.viewYear();
    const month    = this.viewMonth();
    const carga    = this.cargaMap();
    const meta     = this.metaTotalMinutos();
    const selected = this.value();
    const today    = new Date();

    const firstDay   = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const result: DayCell[] = [];

    for (let i = 0; i < firstDay; i++) {
      result.push({ day: null, dateStr: '', loadLevel: 'none', isSelected: false, isToday: false, badge: 0, tooltip: '' });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const c       = carga[dateStr] ?? null;
      const isSel   = selected === dateStr;
      const isTod   = today.getFullYear() === year && today.getMonth() + 1 === month && today.getDate() === d;

      let loadLevel: DayCell['loadLevel'] = 'none';
      if (c && c.totalMinutos > 0 && meta > 0) {
        const pct = c.totalMinutos / meta;
        loadLevel = pct < 0.5 ? 'low' : pct < 0.8 ? 'medium' : pct < 1.0 ? 'high' : 'full';
      }

      let tooltip = '';
      if (c && c.totalPedidos > 0) {
        const h  = Math.floor(c.totalMinutos / 60);
        const mn = c.totalMinutos % 60;
        const t  = h > 0 ? (mn > 0 ? `${h}h${mn}m` : `${h}h`) : `${mn}m`;
        tooltip = `${c.totalPedidos} pedido(s) — ${t} alocado(s)`;
      }

      result.push({ day: d, dateStr, loadLevel, isSelected: isSel, isToday: isTod, badge: c?.totalPedidos ?? 0, tooltip });
    }

    return result;
  });

  ngOnInit() {
    const v = this.value();
    if (v) {
      const d = new Date(v + 'T12:00:00');
      this.viewYear.set(d.getFullYear());
      this.viewMonth.set(d.getMonth() + 1);
    }
    this.loadCarga();
  }

  loadCarga() {
    this.pedidoService.getCargaPorDia(this.viewMonth(), this.viewYear())
      .subscribe(list => {
        const map: Record<string, CargaDia> = {};
        list.forEach(c => { map[c.data] = c; });
        this.cargaMap.set(map);
      });
  }

  prevMes() {
    if (this.viewMonth() === 1) { this.viewMonth.set(12); this.viewYear.update(y => y - 1); }
    else { this.viewMonth.update(m => m - 1); }
    this.cargaMap.set({});
    this.loadCarga();
  }

  nextMes() {
    if (this.viewMonth() === 12) { this.viewMonth.set(1); this.viewYear.update(y => y + 1); }
    else { this.viewMonth.update(m => m + 1); }
    this.cargaMap.set({});
    this.loadCarga();
  }

  selectDay(cell: DayCell) {
    if (cell.day === null) return;
    this.valueChange.emit(cell.dateStr);
  }

  formatSelected(): string {
    const v = this.value();
    if (!v) return '';
    const [y, m, d] = v.split('-');
    return `${d}/${m}/${y}`;
  }
}
