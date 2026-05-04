import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DataComemorativaService } from '../data-comemorativa.service';
import { DataComemorativa, DataComemorativaStats } from '../data-comemorativa.model';

interface MonthData { index: number; name: string; days: (number | null)[]; }

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.scss'
})
export class CalendarioComponent implements OnInit {
  private service = inject(DataComemorativaService);
  private fb = inject(FormBuilder);

  readonly weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  readonly monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                         'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  readonly cores = ['#ef4444','#f97316','#eab308','#22c55e',
                    '#3b82f6','#a855f7','#ec4899','#06b6d4'];

  anoAtual = signal(new Date().getFullYear());
  datas = signal<DataComemorativa[]>([]);
  stats = signal<DataComemorativaStats | null>(null);
  showAddForm = signal(false);
  loadingStats = signal(false);

  meses = computed(() => this.buildCalendar(this.anoAtual()));

  form = this.fb.group({
    nome: ['', Validators.required],
    mes:  [new Date().getMonth() + 1, [Validators.required, Validators.min(1), Validators.max(12)]],
    dia:  [1, [Validators.required, Validators.min(1), Validators.max(31)]],
    cor:  ['#3b82f6', Validators.required]
  });

  ngOnInit() { this.load(); }

  load() { this.service.getAll().subscribe(d => this.datas.set(d)); }

  buildCalendar(year: number): MonthData[] {
    return Array.from({ length: 12 }, (_, i) => {
      const firstDay = new Date(year, i, 1).getDay();
      const daysInMonth = new Date(year, i + 1, 0).getDate();
      const days: (number | null)[] = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, d) => d + 1)
      ];
      while (days.length % 7 !== 0) days.push(null);
      return { index: i, name: this.monthNames[i], days };
    });
  }

  getEvent(monthIndex: number, day: number | null): DataComemorativa | undefined {
    if (!day) return undefined;
    return this.datas().find(d => d.mes === monthIndex + 1 && d.dia === day);
  }

  isToday(monthIndex: number, day: number | null): boolean {
    if (!day) return false;
    const hoje = new Date();
    return hoje.getFullYear() === this.anoAtual() &&
           hoje.getMonth() === monthIndex &&
           hoje.getDate() === day;
  }

  clickDay(event: DataComemorativa) {
    this.loadingStats.set(true);
    this.stats.set(null);
    this.service.getStats(event.id!).subscribe(s => {
      this.stats.set(s);
      this.loadingStats.set(false);
    });
  }

  closeStats() { this.stats.set(null); }

  delete(id: number) {
    if (!confirm('Excluir esta data comemorativa?')) return;
    this.service.delete(id).subscribe(() => {
      this.load();
      this.closeStats();
    });
  }

  saveData() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.service.create(this.form.value as DataComemorativa).subscribe(() => {
      this.load();
      this.showAddForm.set(false);
      this.form.reset({ mes: 1, dia: 1, cor: '#3b82f6' });
    });
  }

  selectCor(cor: string) { this.form.patchValue({ cor }); }

  formatValor(v: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  }

  prevYear() { this.anoAtual.update(y => y - 1); }
  nextYear() { this.anoAtual.update(y => y + 1); }
}
