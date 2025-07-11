import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Transaction, Category, PaymentMethodOption } from 'src/Planning/budget-management/types/budget.ts';

interface TransactionModalProps {
  isOpen: boolean;
  transaction?: Transaction;
  categories: Category[];
  onClose: () => void;
  onSave: (transactionData: Omit<Transaction, 'id'>) => void;
}

const paymentMethods: PaymentMethodOption[] = [
  { value: 'credit-card', label: 'Credit Card' },
  { value: 'debit-card', label: 'Debit Card' },
  { value: 'bank-transfer', label: 'Bank Transfer' },
  { value: 'check', label: 'Check' },
  { value: 'cash', label: 'Cash' },
  { value: 'other', label: 'Other' }
];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  transaction,
  categories,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().substr(0, 10),
    description: '',
    category: '',
    amount: '',
    paymentMethod: 'credit-card' as Transaction['paymentMethod'],
    notes: ''
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date,
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount.toString(),
        paymentMethod: transaction.paymentMethod,
        notes: transaction.notes || ''
      });
    } else {
      setFormData({
        date: new Date().toISOString().substr(0, 10),
        description: '',
        category: categories[0]?.name || '',
        amount: '',
        paymentMethod: 'credit-card',
        notes: ''
      });
    }
  }, [transaction, categories]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.description.trim()) {
      alert('Please enter a description for this transaction');
      return;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!formData.category) {
      alert('Please select a category');
      return;
    }

    onSave({
      date: formData.date,
      description: formData.description.trim(),
      category: formData.category,
      amount: parseFloat(formData.amount),
      paymentMethod: formData.paymentMethod,
      notes: formData.notes.trim() || undefined
    });
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="transaction-modal" onClick={handleOverlayClick}>
      <div className="transaction-modal-content">
        <h3>{transaction ? 'Edit Transaction' : 'Add New Transaction'}</h3>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="form-group">
          <label htmlFor="transaction-date">Date</label>
          <input
            type="date"
            id="transaction-date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="transaction-description">Description</label>
          <input
            type="text"
            id="transaction-description"
            placeholder="What was this expense for?"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            autoFocus
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="transaction-category">Category</label>
          <select
            id="transaction-category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {categories.length === 0 ? (
              <option value="" disabled>No categories available</option>
            ) : (
              categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))
            )}
          </select>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="transaction-amount">Amount</label>
            <input
              type="number"
              id="transaction-amount"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="transaction-method">Payment Method</label>
            <select
              id="transaction-method"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as Transaction['paymentMethod'] })}
            >
              {paymentMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="transaction-notes">Notes</label>
          <textarea
            id="transaction-notes"
            placeholder="Add any additional notes about this transaction"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
        
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            {transaction ? 'Save Changes' : 'Save Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
};