import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Package, Box, CalendarDays, Hash } from "lucide-react";
import { format, parseISO, isBefore, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  const validadeDate = parseISO(product.validade);
  const isExpired = isBefore(validadeDate, new Date());
  const isExpiringSoon = !isExpired && isBefore(validadeDate, addDays(new Date(), 30));

  return (
    <Card className="group relative overflow-hidden border border-border/60 bg-card p-4 transition-all hover:shadow-md hover:border-secondary/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-card-foreground truncate text-base">
              {product.nome}
            </h3>
            <Badge
              variant="secondary"
              className="shrink-0 text-xs bg-secondary/15 text-secondary border-0"
            >
              {product.unidade === "caixa" ? (
                <Box className="mr-1 h-3 w-3" />
              ) : (
                <Package className="mr-1 h-3 w-3" />
              )}
              {product.unidade}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Hash className="h-3.5 w-3.5" />
              {product.codigoId}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              <span className={isExpired ? "text-destructive font-medium" : isExpiringSoon ? "text-warning font-medium" : ""}>
                {format(validadeDate, "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="text-2xl font-bold text-primary tabular-nums">
            {product.quantidade}
          </span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => onEdit(product)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(product.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
