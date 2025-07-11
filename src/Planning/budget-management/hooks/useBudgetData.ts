import { useState, useEffect, useCallback } from 'react';
import { Transaction, Category, BudgetSummary } from 'src/Planning/budget-management/types/budget';

// API Integration Layer - Replace these with your actual API calls
const API = {
  // GET /api/budget/summary
  getBudgetSummary: async (): Promise<BudgetSummary> => {
    // Replace with: return await fetch('/api/budget/summary').then(res => res.json());
    return mockBudgetSummary;
  },
  
  // GET /api/categories
  getCategories: async (): Promise<Category[]> => {
    // Replace with: return await fetch('/api/categories').then(res => res.json());
    return mockCategories;
  },
  
  // GET /api/transactions
  getTransactions: async (): Promise<Transaction[]> => {
    // Replace with: return await fetch('/api/transactions').then(res => res.json());
    return mockTransactions;
  },
  
  // POST /api/budget
  updateTotalBudget: async (budget: number): Promise<void> => {
    // Replace with: await fetch('/api/budget', { method: 'POST', body: JSON.stringify({ budget }) });
    console.log('Update total budget:', budget);
  },
  
  // POST /api/categories
  createCategory: async (category: Omit<Category, 'id' | 'spent'>): Promise<Category> => {
    // Replace with: return await fetch('/api/categories', { method: 'POST', body: JSON.stringify(category) }).then(res => res.json());
    return { ...category, id: Date.now().toString(), spent: 0 };
  },
  
  // PUT /api/categories/:id  
  updateCategory: async (id: string, updates: Partial<Category>): Promise<void> => {
    // Replace with: await fetch(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    console.log('Update category:', id, updates);
  },
  
  // DELETE /api/categories/:id
  deleteCategory: async (id: string): Promise<void> => {
    // Replace with: await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    console.log('Delete category:', id);
  },
  
  // POST /api/transactions
  createTransaction: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    // Replace with: return await fetch('/api/transactions', { method: 'POST', body: JSON.stringify(transaction) }).then(res => res.json());
    return { ...transaction, id: Date.now().toString() };
  },
  
  // PUT /api/transactions/:id
  updateTransaction: async (id: string, updates: Partial<Transaction>): Promise<void> => {
    // Replace with: await fetch(`/api/transactions/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    console.log('Update transaction:', id, updates);
  },
  
  // DELETE /api/transactions/:id
  deleteTransaction: async (id: string): Promise<void> => {
    // Replace with: await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
    console.log('Delete transaction:', id);
  }
};

// Mock data for demonstration
const mockBudgetSummary: BudgetSummary = {
  totalBudget: 25000,
  totalSpent: 9750,
  remainingAmount: 15250,
  percentageUsed: 39
};

const mockCategories: Category[] = [
  { id: '1', name: 'Venue', budget: 8000, spent: 3600, color: '#d4af37' },
  { id: '2', name: 'Catering', budget: 6000, spent: 1500, color: '#2ecc71' },
  { id: '3', name: 'Photography', budget: 3000, spent: 1800, color: '#8b4513' },
  { id: '4', name: 'Attire', budget: 2500, spent: 2000, color: '#e74c3c' },
  { id: '5', name: 'Flowers', budget: 1500, spent: 150, color: '#f39c12' },
  { id: '6', name: 'Music', budget: 1200, spent: 0, color: '#3498db' }
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-10-15',
    description: 'Venue deposit',
    category: 'Venue',
    amount: 2500,
    paymentMethod: 'credit-card'
  },
  {
    id: '2',
    date: '2024-10-10',
    description: 'Photography package',
    category: 'Photography',
    amount: 1800,
    paymentMethod: 'bank-transfer'
  },
  {
    id: '3',
    date: '2024-10-05',
    description: 'Wedding dress',
    category: 'Attire',
    amount: 1500,
    paymentMethod: 'credit-card'
  },
  {
    id: '4',
    date: '2024-10-01',
    description: 'Catering deposit',
    category: 'Catering',
    amount: 1500,
    paymentMethod: 'check'
  },
  {
    id: '5',
    date: '2024-09-25',
    description: 'Florist consultation',
    category: 'Flowers',
    amount: 150,
    paymentMethod: 'cash'
  }
];

export const useBudgetData = () => {
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to calculate budget summary from current data
  const calculateBudgetSummary = useCallback((totalBudget: number, currentTransactions: Transaction[], currentCategories: Category[]) => {
    // Calculate total spent from transactions
    const totalSpent = currentTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    
    // Calculate remaining amount
    const remainingAmount = totalBudget - totalSpent;
    
    // Calculate percentage used
    const percentageUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
    
    return {
      totalBudget,
      totalSpent,
      remainingAmount,
      percentageUsed
    };
  }, []);

  // Helper function to update category spent amounts
  const updateCategorySpentAmounts = useCallback((currentCategories: Category[], currentTransactions: Transaction[]) => {
    return currentCategories.map(category => {
      const categoryTransactions = currentTransactions.filter(t => t.category === category.name);
      const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
      return { ...category, spent };
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [summary, categoriesData, transactionsData] = await Promise.all([
        API.getBudgetSummary(),
        API.getCategories(),
        API.getTransactions()
      ]);
      
      // Update categories with calculated spent amounts
      const updatedCategories = updateCategorySpentAmounts(categoriesData, transactionsData);
      
      // Recalculate budget summary with current data
      const updatedSummary = calculateBudgetSummary(summary.totalBudget, transactionsData, updatedCategories);
      
      setBudgetSummary(updatedSummary);
      setCategories(updatedCategories);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching budget data:', error);
    } finally {
      setLoading(false);
    }
  }, [calculateBudgetSummary, updateCategorySpentAmounts]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateTotalBudget = async (newBudget: number) => {
    await API.updateTotalBudget(newBudget);
    
    // Recalculate budget summary with new total budget
    const updatedSummary = calculateBudgetSummary(newBudget, transactions, categories);
    setBudgetSummary(updatedSummary);
  };

  const addCategory = async (categoryData: Omit<Category, 'id' | 'spent'>) => {
    const newCategory = await API.createCategory(categoryData);
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    await API.updateCategory(id, updates);
    const updatedCategories = categories.map(cat => cat.id === id ? { ...cat, ...updates } : cat);
    setCategories(updatedCategories);
  };

  const deleteCategory = async (id: string) => {
    await API.deleteCategory(id);
    const updatedCategories = categories.filter(cat => cat.id !== id);
    setCategories(updatedCategories);
  };

  const addTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction = await API.createTransaction(transactionData);
    const updatedTransactions = [newTransaction, ...transactions];
    
    // Update categories with new spent amounts
    const updatedCategories = updateCategorySpentAmounts(categories, updatedTransactions);
    
    // Recalculate budget summary
    const updatedSummary = calculateBudgetSummary(budgetSummary!.totalBudget, updatedTransactions, updatedCategories);
    
    setTransactions(updatedTransactions);
    setCategories(updatedCategories);
    setBudgetSummary(updatedSummary);
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    await API.updateTransaction(id, updates);
    const updatedTransactions = transactions.map(t => t.id === id ? { ...t, ...updates } : t);
    
    // Update categories with new spent amounts
    const updatedCategories = updateCategorySpentAmounts(categories, updatedTransactions);
    
    // Recalculate budget summary
    const updatedSummary = calculateBudgetSummary(budgetSummary!.totalBudget, updatedTransactions, updatedCategories);
    
    setTransactions(updatedTransactions);
    setCategories(updatedCategories);
    setBudgetSummary(updatedSummary);
  };

  const deleteTransaction = async (id: string) => {
    await API.deleteTransaction(id);
    const updatedTransactions = transactions.filter(t => t.id !== id);
    
    // Update categories with new spent amounts
    const updatedCategories = updateCategorySpentAmounts(categories, updatedTransactions);
    
    // Recalculate budget summary
    const updatedSummary = calculateBudgetSummary(budgetSummary!.totalBudget, updatedTransactions, updatedCategories);
    
    setTransactions(updatedTransactions);
    setCategories(updatedCategories);
    setBudgetSummary(updatedSummary);
  };

  return {
    budgetSummary,
    categories,
    transactions,
    loading,
    updateTotalBudget,
    addCategory,
    updateCategory,
    deleteCategory,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchData
  };
};