import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Package, Save, X } from "lucide-react";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (product: Omit<Product, "id"> & { id?: string }) => void;
  editProduct?: Product | null;
}

const ProductForm = ({ open, onOpenChange, onSave, editProduct }: ProductFormProps) => {
  const [nome, setNome] = useState("");
  const [codigoId, setCodigoId] = useState("");
  const [validade, setValidade] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidade, setUnidade] = useState<"caixa" | "unidade">("unidade");

  useEffect(() => {
    if (editProduct) {
      setNome(editProduct.nome);
      setCodigoId(editProduct.codigoId);
      setValidade(editProduct.validade);
      setQuantidade(String(editProduct.quantidade));
      setUnidade(editProduct.unidade);
    } else {
      setNome("");
      setCodigoId("");
      setValidade("");
      setQuantidade("");
      setUnidade("unidade");
    }
  }, [editProduct, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(editProduct ? { id: editProduct.id } : {}),
      nome,
      codigoId,
      validade,
      quantidade: Number(quantidade),
      unidade,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5 text-secondary" />
            {editProduct ? "Editar Produto" : "Cadastrar Produto"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Produto</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Arroz Integral"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="codigoId">Código ID</Label>
              <Input
                id="codigoId"
                value={codigoId}
                onChange={(e) => setCodigoId(e.target.value)}
                placeholder="Ex: 001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validade">Validade</Label>
              <Input
                id="validade"
                type="date"
                value={validade}
                onChange={(e) => setValidade(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                min="0"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unidade">Unidade</Label>
              <Select value={unidade} onValueChange={(v) => setUnidade(v as "caixa" | "unidade")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unidade">Unidade</SelectItem>
                  <SelectItem value="caixa">Caixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              <X className="mr-1 h-4 w-4" />
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              <Save className="mr-1 h-4 w-4" />
              {editProduct ? "Salvar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
