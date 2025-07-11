import React from 'react';
import { BudgetSummary } from '../types/budget';

interface BudgetProgressProps {
  budgetSummary: BudgetSummary;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({ budgetSummary }) => {
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

  return (
    <div className="budget-progress">
      <div className="progress-header">
        <h2>Budget Progress</h2>
        <div className="progress-stats">
          <div className="stat-item">
            <div className="stat-value">{formatCurrency(budgetSummary.totalSpent)}</div>
            <div className="stat-label">Spent</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{formatCurrency(budgetSummary.remainingAmount)}</div>
            <div className="stat-label">Remaining</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{budgetSummary.percentageUsed}%</div>
            <div className="stat-label">Used</div>
          </div>
        </div>
      </div>
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${Math.min(budgetSummary.percentageUsed, 100)}%` }}
        />
      </div>
      <div className="progress-details">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
};