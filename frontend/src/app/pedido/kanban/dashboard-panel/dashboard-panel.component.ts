import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DespesaService } from '../../../despesa/despesa.service';
import { DashboardResumo } from '../../../despesa/despesa.model';

@Component({
  selector: 'app-dashboard-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard-panel.component.html',
  styleUrl: './dashboard-panel.component.scss'
})
export class DashboardPanelComponent implements OnInit {
  private service = inject(DespesaService);
  private fb = inject(FormBuilder);

  readonly MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  readonly TIPOS = [
    { value: 'FILAMENTO',    label: 'Filamento',    cor: '#f97316' },
    { value: 'EMBALAGEM',    label: 'Embalagem',    cor: '#3b82f6' },
    { value: 'EQUIPAMENTOS', label: 'Equipamentos', cor: '#a855f7' },
    { value: 'OUTROS',       label: 'Outros',       cor: '#6b7280' }
  ];

  mesAtual  = signal(new Date().getMonth() + 1);
  anoAtual  = signal(new Date().getFullYear());
  resumo    = signal<DashboardResumo | null>(null);
  showForm  = signal(false);

  form = this.fb.group({
    tipo:      ['FILAMENTO', Validators.required],
    data:      [new Date().toISOString().split('T')[0], Validators.required],
    valor:     [null as number | null, [Validators.required, Validators.min(0.01)]],
    descricao: ['']
  });

  ngOnInit() { this.load(); }

  load() {
    this.service.getResumo(this.mesAtual(), this.anoAtual())
      .subscribe(r => this.resumo.set(r));
  }

  prevMes() {
    if (this.mesAtual() === 1) { this.mesAtual.set(12); this.anoAtual.update(y => y - 1); }
    else { this.mesAtual.update(m => m - 1); }
    this.load();
  }

  nextMes() {
    if (this.mesAtual() === 12) { this.mesAtual.set(1); this.anoAtual.update(y => y + 1); }
    else { this.mesAtual.update(m => m + 1); }
    this.load();
  }

  saveDespesa() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.service.create(this.form.value as any).subscribe(() => {
      this.form.patchValue({ descricao: '', valor: null });
      this.showForm.set(false);
      this.load();
    });
  }

  deleteDespesa(id: number) {
    if (!confirm('Excluir despesa?')) return;
    this.service.delete(id).subscribe(() => this.load());
  }

  getTipo(tipo: string) {
    return this.TIPOS.find(t => t.value === tipo) ?? this.TIPOS[3];
  }

  fmt(v: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  }
}
