import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Category } from 'src/Planning/budget-management/types/budget.ts';

interface CategoryModalProps {
  isOpen: boolean;
  category?: Category;
  onClose: () => void;
  onSave: (categoryData: { name: string; budget: number; color: string }) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  category,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [color, setColor] = useState('#d4af37');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setBudget(category.budget.toString());
      setColor(category.color);
    } else {
      setName('');
      setBudget('');
      setColor('#d4af37');
    }
  }, [category]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a category name');
      return;
    }
    
    const budgetValue = parseFloat(budget);
    if (!budgetValue || budgetValue <= 0) {
      alert('Please enter a valid budget amount');
      return;
    }

    onSave({ name: name.trim(), budget: budgetValue, color });
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const colorOptions = [
    '#d4af37', '#2ecc71', '#8b4513', '#e74c3c', 
    '#f39c12', '#3498db', '#9b59b6', '#e67e22'
  ];

  return (
    <div className="add-category-modal" onClick={handleOverlayClick}>
      <div className="add-category-modal-content">
        <h3>{category ? 'Edit Category' : 'Add New Category'}</h3>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="form-group">
          <label htmlFor="category-name">Category Name</label>
          <input
            type="text"
            id="category-name"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category-budget">Budget</label>
          <input
            type="number"
            id="category-budget"
            placeholder="Enter budget for this category"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Color</label>
          <div className="color-options">
            {colorOptions.map((colorOption) => (
              <button
                key={colorOption}
                type="button"
                className={`color-option ${color === colorOption ? 'selected' : ''}`}
                style={{ backgroundColor: colorOption }}
                onClick={() => setColor(colorOption)}
              />
            ))}
          </div>
        </div>
        
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            {category ? 'Save Changes' : 'Add Category'}
          </button>
        </div>
      </div>
    </div>
  );
};