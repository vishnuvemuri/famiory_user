export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  paymentMethod: 'credit-card' | 'debit-card' | 'bank-transfer' | 'check' | 'cash' | 'other';
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  budget: number;
  spent: number;
  color: string;
}

export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remainingAmount: number;
  percentageUsed: number;
}

export interface PaymentMethodOption {
  value: string;
  label: string;
}