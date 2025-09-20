import { AccountsProvider } from "@/contexts/accounts-context";

export default function AccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AccountsProvider>{children}</AccountsProvider>;
}
