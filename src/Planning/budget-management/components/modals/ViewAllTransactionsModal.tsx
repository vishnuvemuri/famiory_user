import React from 'react';
import { X } from 'lucide-react';
import { Transaction, Category } from 'src/Planning/budget-management/types/budget.ts';

interface ViewAllTransactionsModalProps {
  isOpen: boolean;
  transactions: Transaction[];
  categories: Category[];
  onClose: () => void;
}

export const ViewAllTransactionsModal: React.FC<ViewAllTransactionsModalProps> = ({
  isOpen,
  transactions,
  categories,
  onClose
}) => {
  if (!isOpen) return null;

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      'credit-card': 'Credit Card',
      'debit-card': 'Debit Card',
      'bank-transfer': 'Bank Transfer',
      'check': 'Check',
      'cash': 'Cash',
      'other': 'Other'
    };
    return labels[method] || method;
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#95a5a6';
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="view-all-transactions-modal" onClick={handleOverlayClick}>
      <div className="view-all-transactions-content">
        <h3>All Transactions</h3>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.date)}</td>
                  <td>{transaction.description}</td>
                  <td className="transaction-category">
                    <span 
                      className="category-color" 
                      style={{ backgroundColor: getCategoryColor(transaction.category) }}
                    />
                    {transaction.category}
                  </td>
                  <td className="transaction-amount">-{formatCurrency(transaction.amount)}</td>
                  <td>
                    <span className="payment-method">
                      {getPaymentMethodLabel(transaction.paymentMethod)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};