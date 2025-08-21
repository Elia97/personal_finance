import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const accounts = [
  {
    id: 1,
    name: "Checking Account",
    type: "CHECKING",
    balance: 1000,
  },
  {
    id: 2,
    name: "Savings Account",
    type: "SAVINGS",
    balance: 5000,
  },
  {
    id: 3,
    name: "Investments",
    type: "INVESTMENT",
    balance: 15000,
  },
];

export async function AccountsOverview() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Your Accounts</CardTitle>
        <CardDescription>Overview of your financial accounts</CardDescription>
      </CardHeader>
      <CardContent>
        {accounts.length > 0 ? (
          <div className="space-y-4">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <div className="font-medium">{account.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {account.type === "CHECKING"
                      ? "Checking Account"
                      : account.type === "SAVINGS"
                      ? "Savings Account"
                      : "Investment Account"}
                  </div>
                </div>
                <div className="font-medium">{account.balance}</div>
              </div>
            ))}
            <div className="flex items-center justify-between rounded-lg bg-muted p-4">
              <div className="font-medium">Total Balance</div>
              <div className="text-lg font-bold">
                {accounts.reduce((acc, account) => acc + account.balance, 0)}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            No accounts found. Add an account to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
