import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import all components using the alias
import { Header } from 'src/Planning/budget-management/components/Header';
import { BudgetOverview } from 'src/Planning/budget-management/components/BudgetOverview';
import { BudgetProgress } from 'src/Planning/budget-management/components/BudgetProgress';
import { ExpenseCategories } from 'src/Planning/budget-management/components/ExpenseCategories';
import { TransactionsList } from 'src/Planning/budget-management/components/TransactionsList';
import { BudgetModal } from 'src/Planning/budget-management/components/modals/BudgetModal';
import { CategoryModal } from 'src/Planning/budget-management/components/modals/CategoryModal';
import { TransactionModal } from 'src/Planning/budget-management/components/modals/TransactionModal';
import { ViewAllTransactionsModal } from 'src/Planning/budget-management/components/modals/ViewAllTransactionsModal';
import { useBudgetData } from 'src/Planning/budget-management/hooks/useBudgetData';
import { Category, Transaction } from 'src/Planning/budget-management/types/budget';
import 'src/Planning/budget-management/budget.css';

function BudgetManagementPage() {
  const navigate = useNavigate();
  const {
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
    deleteTransaction
  } = useBudgetData();

  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showViewAllModal, setShowViewAllModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  const handleEditBudget = () => {
    setShowBudgetModal(true);
  };

  const handleSaveBudget = async (budget: number) => {
    await updateTotalBudget(budget);
  };

  const handleAddCategory = () => {
    setEditingCategory(undefined);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (categoryData: { name: string; budget: number; color: string }) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, categoryData);
    } else {
      await addCategory(categoryData);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    await deleteCategory(categoryId);
  };

  const handleAddTransaction = () => {
    setEditingTransaction(undefined);
    setShowTransactionModal(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionModal(true);
  };

  const handleSaveTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, transactionData);
    } else {
      await addTransaction(transactionData);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    await deleteTransaction(transactionId);
  };

  if (loading || !budgetSummary) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="mt-4 text-gray-600">Loading budget data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Header onBack={() => navigate('/')} />
      
      <div className="main-container">
        <div className="page-header">
          <h1>Budget & Expense Management</h1>
          <p>Track your wedding expenses, manage your budget, and stay on top of all financial aspects of your big day.</p>
        </div>

        <BudgetOverview 
          budgetSummary={budgetSummary}
          onEditBudget={handleEditBudget}
        />

        <BudgetProgress budgetSummary={budgetSummary} />

        <ExpenseCategories
          categories={categories}
          onAddCategory={handleAddCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
        />

        <TransactionsList
          transactions={transactions}
          categories={categories}
          onAddTransaction={handleAddTransaction}
          onEditTransaction={handleEditTransaction}
          onDeleteTransaction={handleDeleteTransaction}
          onViewAll={() => setShowViewAllModal(true)}
        />
      </div>

      <BudgetModal
        isOpen={showBudgetModal}
        currentBudget={budgetSummary.totalBudget}
        onClose={() => setShowBudgetModal(false)}
        onSave={handleSaveBudget}
      />

      <CategoryModal
        isOpen={showCategoryModal}
        category={editingCategory}
        onClose={() => {
          setShowCategoryModal(false);
          setEditingCategory(undefined);
        }}
        onSave={handleSaveCategory}
      />

      <TransactionModal
        isOpen={showTransactionModal}
        transaction={editingTransaction}
        categories={categories}
        onClose={() => {
          setShowTransactionModal(false);
          setEditingTransaction(undefined);
        }}
        onSave={handleSaveTransaction}
      />

      <ViewAllTransactionsModal
        isOpen={showViewAllModal}
        transactions={transactions}
        categories={categories}
        onClose={() => setShowViewAllModal(false)}
      />
    </div>
  );
}

export default BudgetManagementPage;