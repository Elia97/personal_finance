import {
  TransactionsList,
  FiltersAndSearch,
  SummaryStats,
  AccountSelector,
} from "@/components/transactions";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <AccountSelector />
      <SummaryStats />
      <FiltersAndSearch />
      <TransactionsList />
    </div>
  );
}
