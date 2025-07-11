import React from 'react';
import { Wallet, CreditCard, PiggyBank, Percent, Edit2 } from 'lucide-react';
import { BudgetSummary } from '../types/budget';

// Corrected props to match BudgetManagementPage
interface BudgetOverviewProps {
  budgetSummary: BudgetSummary;
  onEditBudget: () => void;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({
  budgetSummary,
  onEditBudget
}) => {
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

  const budgetCards = [
    {
      icon: Wallet,
      title: 'Total Budget',
      amount: formatCurrency(budgetSummary.totalBudget),
      label: 'For your wedding',
      className: 'total-budget',
      showEdit: true
    },
    {
      icon: CreditCard,
      title: 'Amount Spent',
      amount: formatCurrency(budgetSummary.totalSpent),
      label: 'So far',
      className: 'amount-spent'
    },
    {
      icon: PiggyBank,
      title: 'Amount Remaining',
      amount: formatCurrency(budgetSummary.remainingAmount),
      label: 'Available',
      className: 'amount-remaining'
    },
    {
      icon: Percent,
      title: 'Budget Used',
      amount: `${budgetSummary.percentageUsed}%`,
      label: 'Of total budget',
      className: ''
    }
  ];

  return (
    <div className="budget-overview">
      {budgetCards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div key={index} className="budget-card">
            <div className="budget-icon">
              <IconComponent size={24} />
            </div>
            <div className="budget-title">{card.title}</div>
            <div className={`budget-amount ${card.className}`}>
              {card.amount}
              {card.showEdit && (
                <button className="edit-budget-btn" onClick={onEditBudget}>
                  <Edit2 size={14} />
                </button>
              )}
            </div>
            <div className="budget-label">{card.label}</div>
          </div>
        );
      })}
    </div>
  );
};