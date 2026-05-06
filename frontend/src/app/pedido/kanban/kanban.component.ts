import { Component, OnInit, OnDestroy, inject, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { PedidoService } from '../pedido.service';
import { Pedido, StatusPedido } from '../pedido.model';
import { PedidoFormComponent } from '../form/pedido-form.component';
import { DashboardPanelComponent } from './dashboard-panel/dashboard-panel.component';
import { DiaPanelComponent } from './dia-panel/dia-panel.component';
import { DataComemorativaService } from '../../data-comemorativa/data-comemorativa.service';
import { DataComemorativa } from '../../data-comemorativa/data-comemorativa.model';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, PedidoFormComponent, DashboardPanelComponent, DiaPanelComponent],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.scss'
})
export class KanbanComponent implements OnInit, OnDestroy {
  @ViewChild(DiaPanelComponent) private diaPanel!: DiaPanelComponent;

  private pedidoService = inject(PedidoService);
  private dataService = inject(DataComemorativaService);
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  searchNome = signal('');
  datasComem = signal<DataComemorativa[]>([]);
  selectedPedido = signal<Pedido | null>(null);
  showForm = signal(false);
  editingPedido = signal<Pedido | null>(null);

  // FILA + INICIADO
  ativos = signal<Pedido[]>([]);
  limites = signal<Record<string, number>>({ FILA: 10, INICIADO: 10 });

  colunasAtivas = [
    {
      status: 'FILA' as StatusPedido,
      label: 'Na Fila',
      cssClass: 'fila',
      allPedidos: computed(() => this.ativos().filter(p => p.statusPedido === 'FILA')),
      pedidos: computed(() => this.ativos().filter(p => p.statusPedido === 'FILA').slice(0, this.limites()['FILA']))
    },
    {
      status: 'INICIADO' as StatusPedido,
      label: 'Iniciado',
      cssClass: 'iniciado',
      allPedidos: computed(() => this.ativos().filter(p => p.statusPedido === 'INICIADO')),
      pedidos: computed(() => this.ativos().filter(p => p.statusPedido === 'INICIADO').slice(0, this.limites()['INICIADO']))
    }
  ];

  // FINALIZADO (paginado)
  finalizados = signal<Pedido[]>([]);
  finalizadosPagina = signal(0);
  finalizadosTotalPaginas = signal(0);
  finalizadosTotalItems = signal(0);
  readonly pageSize = 10;

  ngOnInit() {
    this.searchSubject.pipe(debounceTime(350), takeUntil(this.destroy$)).subscribe(() => {
      this.limites.set({ FILA: 10, INICIADO: 10 });
      this.finalizadosPagina.set(0);
      this.loadAtivos();
      this.loadFinalizados();
    });
    this.loadAtivos();
    this.loadFinalizados();
    this.dataService.getAll().subscribe(d => this.datasComem.set(d));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAtivos() {
    this.pedidoService.getAtivos(this.searchNome()).subscribe(d => this.ativos.set(d));
  }

  loadFinalizados() {
    this.pedidoService.getFinalizados(this.searchNome(), this.finalizadosPagina(), this.pageSize)
      .subscribe(page => {
        this.finalizados.set(page.content);
        this.finalizadosTotalPaginas.set(page.totalPages);
        this.finalizadosTotalItems.set(page.totalElements);
      });
  }

  onSearch(event: Event) {
    const nome = (event.target as HTMLInputElement).value;
    this.searchNome.set(nome);
    this.searchSubject.next(nome);
  }

  paginaAnterior() {
    if (this.finalizadosPagina() > 0) {
      this.finalizadosPagina.update(p => p - 1);
      this.loadFinalizados();
    }
  }

  proximaPagina() {
    if (this.finalizadosPagina() < this.finalizadosTotalPaginas() - 1) {
      this.finalizadosPagina.update(p => p + 1);
      this.loadFinalizados();
    }
  }

  verMais(status: string) {
    this.limites.update(l => ({ ...l, [status]: l[status] + 10 }));
  }

  openDetail(pedido: Pedido) { this.selectedPedido.set(pedido); }
  closeDetail() { this.selectedPedido.set(null); }

  openCreate() {
    this.editingPedido.set(null);
    this.showForm.set(true);
  }

  openEdit(pedido: Pedido) {
    this.closeDetail();
    this.editingPedido.set(pedido);
    this.showForm.set(true);
  }

  closeForm() { this.showForm.set(false); }

  onSaved() {
    this.closeForm();
    this.loadAtivos();
    this.loadFinalizados();
    this.diaPanel?.load();
  }

  delete(id: number) {
    if (!confirm('Excluir este pedido?')) return;
    const isLast = this.finalizados().length === 1 && this.finalizadosPagina() > 0;
    this.pedidoService.delete(id).subscribe(() => {
      this.closeDetail();
      if (isLast) this.finalizadosPagina.update(p => p - 1);
      this.loadAtivos();
      this.loadFinalizados();
      this.diaPanel?.load();
    });
  }

  moverStatus(pedido: Pedido, status: StatusPedido, event: Event) {
    event.stopPropagation();
    this.pedidoService.patchStatus(pedido.id!, status).subscribe(() => {
      this.loadAtivos();
      this.loadFinalizados();
      this.diaPanel?.load();
    });
  }

  whatsappLink(phone: string): string {
    const clean = phone.replace(/\D/g, '');
    return `https://wa.me/${clean.startsWith('55') ? clean : '55' + clean}`;
  }

  formatValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  }

  formatTempo(pedido: Pedido): string {
    const h = pedido.duracaoHoras ?? 0;
    const m = pedido.duracaoMinutos ?? 0;
    if (h === 0 && m === 0) return '';
    if (m === 0) return `${h}h`;
    if (h === 0) return `${m}min`;
    return `${h}h ${m}min`;
  }

  formatData(date: string): string {
    if (!date) return '';
    const [y, m, d] = date.split('T')[0].split('-');
    return `${d}/${m}/${y}`;
  }

  formatDateTime(dt: string | undefined): string {
    if (!dt) return '-';
    const [datePart, timePart] = dt.split('T');
    const [y, m, d] = datePart.split('-');
    return `${d}/${m}/${y} ${timePart?.substring(0, 5) ?? ''}`;
  }

  initials(nome: string): string {
    return nome.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  }

  getNomeDataComem(id: number | null | undefined): string {
    if (!id) return '';
    return this.datasComem().find(d => d.id === id)?.nome ?? '';
  }

  labelStatus(status: StatusPedido): string {
    const map: Record<StatusPedido, string> = {
      FILA: 'Na Fila', INICIADO: 'Iniciado', FINALIZADO: 'Finalizado', CANCELADO: 'Cancelado'
    };
    return map[status];
  }
}
