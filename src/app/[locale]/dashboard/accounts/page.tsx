import {
  AccountsGrid,
  AddAccountDialog,
  SummaryCard,
} from "@/components/accounts";

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <SummaryCard />
      <AddAccountDialog />
      <AccountsGrid />
    </div>
  );
}
