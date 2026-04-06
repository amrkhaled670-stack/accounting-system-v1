import { getPurchaseOrders } from "./actions";
import { PurchaseOrdersClient } from "./po-client";

export const dynamic = "force-dynamic";

export default async function PurchaseOrdersPage() {
  const orders = await getPurchaseOrders();
  return <PurchaseOrdersClient orders={orders} />;
}
