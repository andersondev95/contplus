import { useState, useEffect } from "react";
import { Product, Lote } from "@/types/product";
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
import { Package, Save, X, Plus, Trash2 } from "lucide-react";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (product: {
    nome: string;
    codigoId: string;
    unidade: "caixa" | "unidade";
    lotes: { id: string; validade: string; quantidade: number }[];
    editProductId?: string;
  }) => void;
  editProduct?: Product | null;
}

const ProductForm = ({ open, onOpenChange, onSave, editProduct }: ProductFormProps) => {
  const [nome, setNome] = useState("");
  const [codigoId, setCodigoId] = useState("");
  const [unidade, setUnidade] = useState<"caixa" | "unidade">("unidade");
  const [lotes, setLotes] = useState<{ id: string; validade: string; quantidade: string }[]>([
    { id: crypto.randomUUID(), validade: "", quantidade: "" },
  ]);

  useEffect(() => {
    if (editProduct) {
      setNome(editProduct.nome);
      setCodigoId(editProduct.codigoId);
      setUnidade(editProduct.unidade);
      setLotes(
        editProduct.lotes.map((l) => ({
          id: l.id,
          validade: l.validade,
          quantidade: String(l.quantidade),
        }))
      );
    } else {
      setNome("");
      setCodigoId("");
      setUnidade("unidade");
      setLotes([{ id: crypto.randomUUID(), validade: "", quantidade: "" }]);
    }
  }, [editProduct, open]);

  const addLote = () => {
    setLotes((prev) => [...prev, { id: crypto.randomUUID(), validade: "", quantidade: "" }]);
  };

  const removeLote = (id: string) => {
    if (lotes.length <= 1) return;
    setLotes((prev) => prev.filter((l) => l.id !== id));
  };

  const updateLote = (id: string, field: "validade" | "quantidade", value: string) => {
    setLotes((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      nome,
      codigoId,
      unidade,
      lotes: lotes.map((l) => ({ id: l.id, validade: l.validade, quantidade: Number(l.quantidade) })),
      ...(editProduct ? { editProductId: editProduct.id } : {}),
    });
    onOpenChange(false);
  };

  const isValid = nome && codigoId && lotes.every((l) => l.validade && l.quantidade && Number(l.quantidade) > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
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

          {/* Lotes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Lotes</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addLote} className="h-7 text-xs">
                <Plus className="mr-1 h-3 w-3" />
                Adicionar Lote
              </Button>
            </div>
            <div className="space-y-2">
              {lotes.map((lote, idx) => (
                <div key={lote.id} className="flex items-center gap-2 rounded-md bg-muted/40 p-2">
                  <div className="flex-1 space-y-1">
                    <Input
                      type="date"
                      value={lote.validade}
                      onChange={(e) => updateLote(lote.id, "validade", e.target.value)}
                      placeholder="Validade"
                      required
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      min="1"
                      value={lote.quantidade}
                      onChange={(e) => updateLote(lote.id, "quantidade", e.target.value)}
                      placeholder="Qtd"
                      required
                      className="h-8 text-sm"
                    />
                  </div>
                  {lotes.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => removeLote(lote.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
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
            <Button type="submit" disabled={!isValid} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
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
