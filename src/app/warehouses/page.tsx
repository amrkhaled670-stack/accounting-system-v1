import { getWarehouses } from "./actions";
import { WarehousesClient } from "./warehouses-client";

export const dynamic = "force-dynamic";

export default async function WarehousesPage() {
  const warehouses = await getWarehouses();
  return <WarehousesClient warehouses={warehouses} />;
}
