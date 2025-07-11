import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Transaction, Category } from '../types/budget';

// Corrected props to match BudgetManagementPage
interface TransactionsListProps {
  transactions: Transaction[];
  categories: Category[];
  onAddTransaction: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transactionId: string) => void;
  onViewAll: () => void;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  categories,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onViewAll
}) => {
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredTransactions = transactions.filter(transaction =>
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteTransaction = (transactionId: string, description: string) => {
    if (window.confirm(`Are you sure you want to delete the transaction "${description}"?`)) {
      onDeleteTransaction(transactionId);
    }
  };

  return (
    <div className="transactions-section">
      <div className="transactions-header">
        <h2>Recent Transactions</h2>
        <div className="search-transactions">
          <input
            type="text"
            placeholder="Search by category or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <Search size={16} />
          </button>
        </div>
        <button className="add-transaction-btn" onClick={onAddTransaction}>
          <Plus size={16} />
          Add Transaction
        </button>
      </div>
      
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => (
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
              <td className="transaction-actions">
                <button 
                  className="transaction-btn"
                  onClick={() => onEditTransaction(transaction)}
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  className="transaction-btn delete"
                  onClick={() => handleDeleteTransaction(transaction.id, transaction.description)}
                >
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {transactions.length > 5 && (
        <button className="view-all-btn" onClick={onViewAll}>
          View All Transactions
        </button>
      )}
    </div>
  );
};