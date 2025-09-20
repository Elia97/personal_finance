export interface Account {
  id: number;
  name: string;
  type: string;
  bank: string;
  balance: number;
  currency: string;
  lastTransaction: string;
  status: string;
  accountNumber: string;
  isPrimary: boolean;
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  accountId: number;
  status: string;
  notes?: string;
}
