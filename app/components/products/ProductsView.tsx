import { useEffect, useState } from "react";
import api from "@/lib/api";
import EmptyState from "../common/states/EmptyState";
import ErrorMessage from "../ErrorMessage";
import Skeleton from "../Skeleton";

type Product = {
  id: string | number;
  sku: string;
  name: string;
  category?: string | null;
  unit?: string | null;
  reorder_level?: number;
  total_quantity?: number;
  total_reserved?: number;
};

export default function ProductsView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/api/products");
        const data = Array.isArray(response.data) ? response.data : [];
        if (!ignore) setProducts(data as Product[]);
      } catch {
        if (!ignore) setError("Failed to load products.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    void load();
    return () => { ignore = true; };
  }, []);

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="rounded-3xl border border-[var(--border-soft)] bg-white p-5"><Skeleton className="h-5 w-40" /><Skeleton className="mt-3 h-4 w-full" /></div>)}</div>;
  }

  if (error) {
    return <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-5 sm:p-6"><ErrorMessage message={error} /></div>;
  }

  if (products.length === 0) {
    return <EmptyState title="No products yet" description="Products will appear here once they are added to the warehouse catalog." />;
  }

  return (
    <section className="space-y-6">
      <header className="rounded-3xl border border-[var(--border-soft)] bg-white p-5 shadow-sm dark:bg-[var(--surface-2)] sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-red-strong)]">Catalog</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Products</h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-300 sm:text-base">Browse the inventory catalog and current product quantities.</p>
      </header>
      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-[var(--surface-2)]">
        <div className="overflow-x-auto">
          <table className="min-w-[820px] text-left text-sm text-zinc-700 dark:text-zinc-300">
            <thead className="bg-gradient-to-r from-zinc-50 to-white text-[11px] uppercase tracking-[0.14em] text-zinc-500 dark:from-zinc-900/80 dark:to-zinc-950/60 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-4 font-bold">SKU</th>
                <th className="px-4 py-4 font-bold">Product</th>
                <th className="px-4 py-4 font-bold">Category</th>
                <th className="px-4 py-4 font-bold">Unit</th>
                <th className="px-4 py-4 font-bold">On Hand</th>
                <th className="px-4 py-4 font-bold">Reserved</th>
                <th className="px-4 py-4 font-bold">Reorder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-4 font-semibold text-zinc-900 dark:text-zinc-100">{product.sku}</td>
                  <td className="px-4 py-4">{product.name}</td>
                  <td className="px-4 py-4">{product.category || "Uncategorized"}</td>
                  <td className="px-4 py-4">{product.unit || "pcs"}</td>
                  <td className="px-4 py-4">{Number(product.total_quantity ?? 0)}</td>
                  <td className="px-4 py-4">{Number(product.total_reserved ?? 0)}</td>
                  <td className="px-4 py-4">{Number(product.reorder_level ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
