import { getItems } from "./actions";
import { ItemsClient } from "./items-client";

export const dynamic = "force-dynamic";

export default async function ItemsPage() {
  const items = await getItems();
  return <ItemsClient items={items} />;
}
