export interface Lote {
  id: string;
  validade: string;
  quantidade: number;
}

export interface Product {
  id: string;
  nome: string;
  codigoId: string;
  unidade: "caixa" | "unidade";
  lotes: Lote[];
}
