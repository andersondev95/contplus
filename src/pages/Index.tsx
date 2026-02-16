import { useState, useMemo } from "react";
import { Product } from "@/types/product";
import ProductForm from "@/components/ProductForm";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, PackageOpen, ClipboardList } from "lucide-react";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.nome.toLowerCase().includes(q) ||
        p.codigoId.toLowerCase().includes(q)
    );
  }, [products, search]);

  const handleSave = (data: Omit<Product, "id"> & { id?: string }) => {
    if (data.id) {
      setProducts((prev) =>
        prev.map((p) => (p.id === data.id ? { ...p, ...data } as Product : p))
      );
    } else {
      setProducts((prev) => [
        ...prev,
        { ...data, id: crypto.randomUUID() } as Product,
      ]);
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
            <ClipboardList className="h-6 w-6 text-secondary" />
            <h1 className="text-xl font-bold text-foreground">Estoque</h1>
          </div>
          <Button onClick={handleOpenNew} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
            <Plus className="mr-1 h-4 w-4" />
            Cadastrar
          </Button>
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
