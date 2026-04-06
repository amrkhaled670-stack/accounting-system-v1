import { getInvoices } from "./actions";
import { InvoicesClient } from "./invoices-client";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const invoices = await getInvoices();
  return <InvoicesClient invoices={invoices} />;
}
