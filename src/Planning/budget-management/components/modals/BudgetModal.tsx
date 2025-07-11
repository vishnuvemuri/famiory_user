import React, { useState } from 'react';
import { X } from 'lucide-react';

interface BudgetModalProps {
  isOpen: boolean;
  currentBudget: number;
  onClose: () => void;
  onSave: (budget: number) => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  currentBudget,
  onClose,
  onSave
}) => {
  const [budget, setBudget] = useState(currentBudget.toString());

  if (!isOpen) return null;

  const handleSave = () => {
    const budgetValue = parseFloat(budget);
    if (budgetValue && budgetValue > 0) {
      onSave(budgetValue);
      onClose();
    } else {
      alert('Please enter a valid budget amount');
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="budget-modal" onClick={handleOverlayClick}>
      <div className="budget-modal-content">
        <h3>Set Total Budget</h3>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="form-group">
          <label htmlFor="total-budget">Total Budget</label>
          <input
            type="number"
            id="total-budget"
            placeholder="Enter your total budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            autoFocus
          />
        </div>
        
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save Budget
          </button>
        </div>
      </div>
    </div>
  );
};