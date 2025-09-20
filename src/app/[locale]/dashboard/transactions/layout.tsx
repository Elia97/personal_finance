import { TransactionsProvider } from "@/contexts/transactions-context";

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TransactionsProvider>{children}</TransactionsProvider>;
}
