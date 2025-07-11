import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Category } from '../types/budget';

// Corrected props to match BudgetManagementPage
interface ExpenseCategoriesProps {
  categories: Category[];
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export const ExpenseCategories: React.FC<ExpenseCategoriesProps> = ({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}) => {
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    if (window.confirm(`Are you sure you want to delete the ${categoryName} category?`)) {
      onDeleteCategory(categoryId);
    }
  };

  return (
    <div className="expense-categories">
      <div className="categories-header">
        <h2>Expense Categories</h2>
        <button className="add-category-btn" onClick={onAddCategory}>
          <Plus size={16} />
          Add Category
        </button>
      </div>
      <div className="categories-grid">
        {categories.map((category) => {
          const remaining = category.budget - category.spent;
          const percentage = category.budget > 0 ? Math.min((category.spent / category.budget) * 100, 100) : 0;
          const isOverBudget = category.spent > category.budget;

          return (
            <div 
              key={category.id} 
              className={`category-card ${isOverBudget ? 'over-budget' : ''}`}
              style={{ borderLeftColor: category.color }}
            >
              <div className="category-header">
                <div className="category-name">{category.name}</div>
                <div className="category-amount">{formatCurrency(category.budget)}</div>
              </div>
              <div className="category-progress">
                <div 
                  className="category-progress-bar" 
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: isOverBudget ? '#e74c3c' : category.color 
                  }}
                />
              </div>
              <div className="category-details">
                <span className="category-spent">{formatCurrency(category.spent)} spent</span>
                <span className={`category-remaining ${isOverBudget ? 'over-budget' : ''}`}>
                  {formatCurrency(Math.abs(remaining))} {remaining >= 0 ? 'remaining' : 'over budget'}
                </span>
              </div>
              <div className="category-actions">
                <button 
                  className="category-btn" 
                  onClick={() => onEditCategory(category)}
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  className="category-btn delete" 
                  onClick={() => handleDeleteCategory(category.id, category.name)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};