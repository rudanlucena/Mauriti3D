import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ConfiguracaoService } from './configuracao.service';

@Component({
  selector: 'app-configuracao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './configuracao.component.html',
  styleUrl: './configuracao.component.scss'
})
export class ConfiguracaoComponent implements OnInit {
  private service = inject(ConfiguracaoService);
  private fb = inject(FormBuilder);

  loading = signal(true);
  saving  = signal(false);
  saved   = signal(false);

  form = this.fb.group({
    metaHorasDia:   [8,   [Validators.required, Validators.min(0), Validators.max(24)]],
    metaMinutosDia: [0,   [Validators.required, Validators.min(0), Validators.max(59)]],
    metaValorDia:   [100, [Validators.required, Validators.min(0)]]
  });

  ngOnInit() {
    this.service.get().subscribe(c => {
      this.form.patchValue({
        metaHorasDia:   c.metaHorasDia,
        metaMinutosDia: c.metaMinutosDia,
        metaValorDia:   c.metaValorDia
      });
      this.loading.set(false);
    });
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    this.saved.set(false);
    this.service.update(this.form.value as any).subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.set(true);
        setTimeout(() => this.saved.set(false), 3000);
      },
      error: () => this.saving.set(false)
    });
  }

  get metaTotalMinutos(): number {
    const h = this.form.get('metaHorasDia')?.value ?? 0;
    const m = this.form.get('metaMinutosDia')?.value ?? 0;
    return (h as number) * 60 + (m as number);
  }
}
