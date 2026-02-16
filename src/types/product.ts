export interface Product {
  id: string;
  nome: string;
  codigoId: string;
  validade: string;
  quantidade: number;
  unidade: "caixa" | "unidade";
}
