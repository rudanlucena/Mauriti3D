export interface RelatoriosKpi {
  pedidosFinalizados: number;
  pedidosAtivos: number;
  pedidosCancelados: number;
  receitaTotal: number;
  totalMinutosImpressos: number;
  minutosMediaPorPedido: number;
  taxaConclusao: number;
}

export interface RelatoriosMes {
  ano: number;
  mes: number;
  rotulo: string;
  receita: number;
  despesas: number;
  lucro: number;
  minutosImpressos: number;
  totalPedidos: number;
  pedidosFinalizados: number;
}

export interface RelatoriosTopCliente {
  nome: string;
  totalPedidos: number;
  totalReceita: number;
}

export interface RelatoriosDiaSemana {
  dia: string;
  count: number;
}

export interface RelatoriosStatus {
  status: string;
  label: string;
  count: number;
}

export interface RelatoriosData {
  kpis: RelatoriosKpi;
  mensal: RelatoriosMes[];
  topClientes: RelatoriosTopCliente[];
  diasSemana: RelatoriosDiaSemana[];
  statusDistribuicao: RelatoriosStatus[];
}
