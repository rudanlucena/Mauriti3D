import { Component, OnInit, input, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PedidoService } from '../pedido.service';
import { Pedido } from '../pedido.model';
import { DataComemorativaService } from '../../data-comemorativa/data-comemorativa.service';
import { DataComemorativa } from '../../data-comemorativa/data-comemorativa.model';
import { ConfiguracaoService } from '../../configuracao/configuracao.service';
import { DatePickerComponent } from '../../shared/date-picker/date-picker.component';

@Component({
  selector: 'app-pedido-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePickerComponent],
  templateUrl: './pedido-form.component.html',
  styleUrl: './pedido-form.component.scss'
})
export class PedidoFormComponent implements OnInit {
  pedido = input<Pedido | null>(null);
  saved = output<void>();
  cancelled = output<void>();

  private fb = inject(FormBuilder);
  private service = inject(PedidoService);
  private dataService = inject(DataComemorativaService);
  private configService = inject(ConfiguracaoService);

  form!: FormGroup;
  loading = signal(false);
  datasComem = signal<DataComemorativa[]>([]);
  metaTotalMinutos = signal<number>(480);

  ngOnInit() {
    this.dataService.getAll().subscribe(d => this.datasComem.set(d));
    this.configService.get().subscribe(c => {
      this.metaTotalMinutos.set(c.metaHorasDia * 60 + c.metaMinutosDia);
    });
    const p = this.pedido();
    this.form = this.fb.group({
      nomeCliente:       [p?.nomeCliente ?? '', Validators.required],
      whatsapp:          [p?.whatsapp ?? '', Validators.required],
      dataEntrega:       [p?.dataEntrega?.split('T')[0] ?? '', Validators.required],
      item:              [p?.item ?? '', Validators.required],
      valor:             [p?.valor ?? null, [Validators.required, Validators.min(0)]],
      statusPagamento:   [p?.statusPagamento ?? 'PENDENTE', Validators.required],
      statusPedido:      [p?.statusPedido ?? 'FILA', Validators.required],
      duracaoHoras:      [p?.duracaoHoras ?? null, [Validators.required, Validators.min(0)]],
      duracaoMinutos:    [p?.duracaoMinutos ?? null, [Validators.required, Validators.min(0), Validators.max(59)]],
      endereco:          [p?.endereco ?? ''],
      nota:              [p?.nota ?? ''],
      dataComemorativaId:[p?.dataComemorativaId ?? null]
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    const raw = this.form.value;
    const data: Pedido = {
      ...raw,
      dataComemorativaId: raw.dataComemorativaId ? Number(raw.dataComemorativaId) : null
    };
    const p = this.pedido();
    const op = p?.id ? this.service.update(p.id, data) : this.service.create(data);
    op.subscribe({
      next: () => { this.loading.set(false); this.saved.emit(); },
      error: () => this.loading.set(false)
    });
  }

  cancel() { this.cancelled.emit(); }
}
