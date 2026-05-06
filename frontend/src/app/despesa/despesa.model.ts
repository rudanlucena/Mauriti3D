export type TipoDespesa = 'FILAMENTO' | 'EMBALAGEM' | 'EQUIPAMENTOS' | 'OUTROS';

export interface Despesa {
  id?: number;
  tipo: TipoDespesa;
  data: string;
  valor: number;
  descricao?: string;
  criadoEm?: string;
}

export interface DashboardResumo {
  mes: number;
  ano: number;
  totalDespesas: number;
  valorArrecadado: number;
  saldoEsperado: number;
  despesasMes: Despesa[];
}

export interface DashboardDiario {
  data: string;
  totalMinutos: number;
  totalValor: number;
  totalPedidos: number;
  mediaMinutosPorDia: number;
  mediaValorPorDia: number;
}
