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
  tempoEstimado?: string;
  endereco?: string;
  dataComemorativaId?: number | null;
  criadoEm?: string;
  atualizadoEm?: string;
}
