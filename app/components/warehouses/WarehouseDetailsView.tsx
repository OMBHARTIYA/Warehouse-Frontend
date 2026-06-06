"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../../lib/api";
import type { Project } from "../projects/types";
import type { Task } from "../tasks/types";

type StockItem = {
  id: string | number;
  warehouse_name?: string | null;
  product_name?: string | null;
  sku?: string | null;
  category?: string | null;
  unit?: string | null;
  quantity?: number | null;
  reserved_quantity?: number | null;
  reorder_level?: number | null;
};

export default function WarehouseDetailsView({
  warehouseId,
}: {
  warehouseId: string;
}) {
  const [warehouse, setWarehouse] = useState<Project | null>(null);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [movements, setMovements] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadWarehouse = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [warehouseResponse, stockResponse, movementsResponse] = await Promise.all([
          api.get(`/api/warehouses/${warehouseId}`),
          api.get("/api/stock", { params: { warehouseId } }),
          api.get("/api/movements", { params: { warehouseId } }),
        ]);

        if (ignore) return;

        setWarehouse(warehouseResponse.data ?? null);
        setStockItems(Array.isArray(stockResponse.data) ? stockResponse.data : []);
        setMovements(
          Array.isArray(movementsResponse.data) ? movementsResponse.data : [],
        );
      } catch {
        if (!ignore) {
          setError("Failed to load warehouse details.");
          setWarehouse(null);
          setStockItems([]);
          setMovements([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void loadWarehouse();

    return () => {
      ignore = true;
    };
  }, [warehouseId]);

  const totalUnits = stockItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0,
  );
  const reservedUnits = stockItems.reduce(
    (sum, item) => sum + (Number(item.reserved_quantity) || 0),
    0,
  );
  const lowStockCount = stockItems.filter((item) => {
    const quantity = Number(item.quantity) || 0;
    const reorderLevel = Number(item.reorder_level) || 0;
    return reorderLevel > 0 && quantity <= reorderLevel;
  }).length;

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-[var(--border-soft)] bg-white p-5 shadow-sm transition-colors dark:bg-[var(--surface-2)] dark:shadow-black/20 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-red-strong)]">
              Warehouse Detail
            </p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              {warehouse?.name ?? "Warehouse"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-300 sm:text-base">
              {warehouse?.description?.trim()
                ? warehouse.description
                : "Review location information, on-hand stock, and recent movement activity for this warehouse."}
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)] dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Back to Warehouses
          </Link>
        </div>

        {!isLoading && warehouse ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
            {warehouse.code ? (
              <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2 py-0.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/70">
                Code: {warehouse.code}
              </span>
            ) : null}
            {warehouse.address ? (
              <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2 py-0.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/70">
                Address: {warehouse.address}
              </span>
            ) : null}
            {warehouse.manager_name ? (
              <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2 py-0.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/70">
                Manager: {warehouse.manager_name}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-[var(--border-soft)] bg-white p-5 text-sm text-zinc-500 shadow-sm dark:bg-[var(--surface-2)] dark:text-zinc-300 dark:shadow-black/20 sm:p-6">
          Loading warehouse details...
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="rounded-3xl border border-[var(--border-soft)] bg-white p-5 text-sm text-red-600 shadow-sm dark:bg-[var(--surface-2)] dark:text-rose-300 dark:shadow-black/20 sm:p-6">
          {error}
        </div>
      ) : null}

      {!isLoading && !error && warehouse ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Products", value: stockItems.length },
              { label: "On Hand Units", value: totalUnits },
              { label: "Reserved Units", value: reservedUnits },
              { label: "Low Stock Items", value: lowStockCount },
            ].map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-[var(--border-soft)] bg-white p-4 shadow-sm transition-colors dark:bg-[var(--surface-2)] dark:shadow-black/20"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  {item.value}
                </p>
              </article>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-3xl border border-[var(--border-soft)] bg-white p-5 shadow-sm transition-colors dark:bg-[var(--surface-2)] dark:shadow-black/20 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-red-strong)]">
                    Inventory
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    Current Stock
                  </h3>
                </div>
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {stockItems.length} items
                </span>
              </div>

              {stockItems.length === 0 ? (
                <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-300">
                  No stock records found for this warehouse yet.
                </p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-left text-sm text-zinc-700 dark:text-zinc-300">
                    <thead className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      <tr>
                        <th className="px-3 py-3 font-semibold">Product</th>
                        <th className="px-3 py-3 font-semibold">SKU</th>
                        <th className="px-3 py-3 font-semibold">On Hand</th>
                        <th className="px-3 py-3 font-semibold">Reserved</th>
                        <th className="px-3 py-3 font-semibold">Reorder</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {stockItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-3 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                            {item.product_name ?? "Unknown product"}
                          </td>
                          <td className="px-3 py-3">{item.sku ?? "N/A"}</td>
                          <td className="px-3 py-3">
                            {Number(item.quantity) || 0} {item.unit ?? ""}
                          </td>
                          <td className="px-3 py-3">
                            {Number(item.reserved_quantity) || 0} {item.unit ?? ""}
                          </td>
                          <td className="px-3 py-3">
                            {Number(item.reorder_level) || 0} {item.unit ?? ""}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-[var(--border-soft)] bg-white p-5 shadow-sm transition-colors dark:bg-[var(--surface-2)] dark:shadow-black/20 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-red-strong)]">
                    Activity
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    Recent Movements
                  </h3>
                </div>
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {movements.length} records
                </span>
              </div>

              {movements.length === 0 ? (
                <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-300">
                  No movements recorded for this warehouse yet.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {movements.slice(0, 6).map((movement) => (
                    <article
                      key={movement.id}
                      className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-900/50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {movement.reference_code ??
                            movement.product_name ??
                            "Movement"}
                        </p>
                        <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200">
                          {movement.movement_type ?? "movement"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">
                        {movement.product_name ?? "Unknown product"}
                        {movement.sku ? ` (${movement.sku})` : ""}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <span>Status: {movement.status}</span>
                        <span>Quantity: {movement.quantity ?? 0}</span>
                        {movement.created_at ? (
                          <span>
                            Logged:{" "}
                            {new Date(movement.created_at).toLocaleDateString()}
                          </span>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </>
      ) : null}
    </section>
  );
}
