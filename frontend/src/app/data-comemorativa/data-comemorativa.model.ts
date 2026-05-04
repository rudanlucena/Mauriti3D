export interface DataComemorativa {
  id?: number;
  nome: string;
  mes: number;
  dia: number;
  cor: string;
}

export interface DataComemorativaStats {
  id: number;
  nome: string;
  mes: number;
  dia: number;
  cor: string;
  diasRestantes: number;
  totalPedidos: number;
  valorArrecadado: number;
}
