import { useState, useMemo, useEffect } from "react";
import { Product } from "@/types/product";
import ProductForm from "@/components/ProductForm";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, PackageOpen, FileDown } from "lucide-react";
import { exportEstoquePDF } from "@/lib/exportPDF";
import logo from "@/assets/logo.png";

const STORAGE_KEY = "contplus-products";

const Index = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.nome.toLowerCase().includes(q) ||
        p.codigoId.toLowerCase().includes(q)
    );
  }, [products, search]);

  const handleSave = (data: { nome: string; codigoId: string; validade: string; quantidade: number; unidade: "caixa" | "unidade"; editProductId?: string }) => {
    const newLote = { id: crypto.randomUUID(), validade: data.validade, quantidade: data.quantidade };

    if (data.editProductId) {
      // Adding a lote to existing product
      setProducts((prev) =>
        prev.map((p) =>
          p.id === data.editProductId
            ? { ...p, lotes: [...p.lotes, newLote] }
            : p
        )
      );
    } else {
      // Check if product with same codigoId exists
      setProducts((prev) => {
        const existing = prev.find((p) => p.codigoId === data.codigoId);
        if (existing) {
          return prev.map((p) =>
            p.id === existing.id
              ? { ...p, nome: data.nome, unidade: data.unidade, lotes: [...p.lotes, newLote] }
              : p
          );
        }
        return [
          ...prev,
          {
            id: crypto.randomUUID(),
            nome: data.nome,
            codigoId: data.codigoId,
            unidade: data.unidade,
            lotes: [newLote],
          },
        ];
      });
    }
    setEditProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleOpenNew = () => {
    setEditProduct(null);
    setFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Cont+ logo" className="h-14 w-14" />
            <h1 className="text-xl font-bold text-foreground">Cont+</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportEstoquePDF(products)}
              disabled={products.length === 0}
            >
              <FileDown className="mr-1 h-4 w-4" />
              PDF
            </Button>
            <Button onClick={handleOpenNew} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
              <Plus className="mr-1 h-4 w-4" />
              Cadastrar
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 py-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por nome ou código..."
            className="pl-9"
          />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{products.length} produto{products.length !== 1 ? "s" : ""} cadastrado{products.length !== 1 ? "s" : ""}</span>
          {search && (
            <span>• {filtered.length} encontrado{filtered.length !== 1 ? "s" : ""}</span>
          )}
        </div>

        {/* Product List */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <PackageOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              {search ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              {search
                ? "Tente buscar com outros termos"
                : "Clique em \"Cadastrar\" para adicionar seu primeiro produto"}
            </p>
          </div>
        )}
      </main>

      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={handleSave}
        editProduct={editProduct}
      />
    </div>
  );
};

export default Index;
