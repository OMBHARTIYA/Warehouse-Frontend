"use client";

import { useParams } from "next/navigation";
import WarehouseDetailsView from "../../components/warehouses/WarehouseDetailsView";

export default function WarehouseDetailsPage() {
  const params = useParams<{ id: string }>();
  const warehouseId = params?.id ?? "";

  return <WarehouseDetailsView warehouseId={warehouseId} />;
}
