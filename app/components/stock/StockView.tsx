import { useEffect, useState } from "react";
import api from "@/lib/api";
import EmptyState from "../common/states/EmptyState";
import ErrorMessage from "../ErrorMessage";
import Skeleton from "../Skeleton";

type StockRecord = {
  id: string | number;
  warehouse_name?: string;
  warehouse_code?: string;
  product_name?: string;
  sku?: string;
  category?: string;
  unit?: string;
  quantity?: number;
  reserved_quantity?: number;
  reorder_level?: number;
};

export default function StockView() {
  const [rows, setRows] = useState<StockRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const lowStockCount = rows.filter((row) => {
    const quantity = Number(row.quantity ?? 0);
    const reorderLevel = Number(row.reorder_level ?? 0);
    return reorderLevel > 0 && quantity <= reorderLevel;
  }).length;

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/api/stock");
        const data = Array.isArray(response.data) ? response.data : [];
        if (!ignore) setRows(data as StockRecord[]);
      } catch {
        if (!ignore) setError("Failed to load stock records.");
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

  if (rows.length === 0) {
    return <EmptyState title="No stock records yet" description="Warehouse stock will appear here once products are assigned to locations." />;
  }

  return (
    <section className="space-y-6">
      <header className="rounded-3xl border border-[var(--border-soft)] bg-white p-5 shadow-sm dark:bg-[var(--surface-2)] sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-red-strong)]">Inventory</p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Stock</h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-300 sm:text-base">Review quantities, reserved stock, and reorder thresholds by warehouse.</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
          <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2.5 py-1 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/70">
            Stock Rows: {rows.length}
          </span>
          <span className="inline-flex items-center rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-amber-700 shadow-sm dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-300">
            Low Stock Alerts: {lowStockCount}
          </span>
        </div>
      </header>
      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-[var(--surface-2)]">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] text-left text-sm text-zinc-700 dark:text-zinc-300">
            <thead className="bg-gradient-to-r from-zinc-50 to-white text-[11px] uppercase tracking-[0.14em] text-zinc-500 dark:from-zinc-900/80 dark:to-zinc-950/60 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-4 font-bold">Warehouse</th>
                <th className="px-4 py-4 font-bold">Product</th>
                <th className="px-4 py-4 font-bold">Category</th>
                <th className="px-4 py-4 font-bold">Unit</th>
                <th className="px-4 py-4 font-bold">On Hand</th>
                <th className="px-4 py-4 font-bold">Reserved</th>
                <th className="px-4 py-4 font-bold">Reorder Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {rows.map((row) => (
                <tr key={row.id} className={Number(row.reorder_level ?? 0) > 0 && Number(row.quantity ?? 0) <= Number(row.reorder_level ?? 0) ? "bg-amber-50/50 dark:bg-amber-950/10" : undefined}>
                  <td className="px-4 py-4 font-semibold text-zinc-900 dark:text-zinc-100">{row.warehouse_name} {row.warehouse_code ? `(${row.warehouse_code})` : ""}</td>
                  <td className="px-4 py-4">{row.product_name} {row.sku ? `(${row.sku})` : ""}</td>
                  <td className="px-4 py-4">{row.category || "Uncategorized"}</td>
                  <td className="px-4 py-4">{row.unit || "pcs"}</td>
                  <td className="px-4 py-4">{Number(row.quantity ?? 0)}</td>
                  <td className="px-4 py-4">{Number(row.reserved_quantity ?? 0)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${Number(row.reorder_level ?? 0) > 0 && Number(row.quantity ?? 0) <= Number(row.reorder_level ?? 0) ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"}`}>
                      {Number(row.reorder_level ?? 0)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
