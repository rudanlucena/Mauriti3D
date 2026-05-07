export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export type StatusPagamento = 'PAGO' | 'PENDENTE';
export type StatusPedido = 'FILA' | 'INICIADO' | 'FINALIZADO' | 'CANCELADO';

export interface Pedido {
  id?: number;
  nomeCliente: string;
  whatsapp: string;
  dataEntrega: string;
  item: string;
  nota?: string;
  valor: number;
  statusPagamento: StatusPagamento;
  statusPedido: StatusPedido;
  duracaoHoras: number;
  duracaoMinutos: number;
  endereco?: string;
  dataComemorativaId?: number | null;
  dataFinalizacao?: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface CargaDia {
  data: string;
  totalPedidos: number;
  totalMinutos: number;
}
