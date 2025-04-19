import React, { useState, useMemo } from 'react';
import InteractiveSimulation from './InteractiveSimulation';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
}

interface ExpenseTrackerProps {
  onComplete: () => void;
  config?: {
    initialExpenses?: Expense[];
    initialCategories?: string[];
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF66C3', '#FFD700'];

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ onComplete, config }) => {
  const [expenses, setExpenses] = useState<Expense[]>(config?.initialExpenses || []);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: '' });
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  const [editedExpense, setEditedExpense] = useState({ description: '', amount: '', category: '' });
  const [categories, setCategories] = useState<string[]>(config?.initialCategories || ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Other']);
  const [newCategory, setNewCategory] = useState('');

  const handleNewInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedExpense({ ...editedExpense, [name]: value });
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    setCategories(categories.filter(category => category !== categoryToRemove));
    // Also update expenses that used this category
    setExpenses(expenses.map(expense =>
      expense.category === categoryToRemove ? { ...expense, category: 'Other' } : expense
    ));
  };

  const addExpense = () => {
    if (newExpense.description && newExpense.amount && newExpense.category) {
      const expense: Expense = {
        id: Date.now(),
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
      };
      setExpenses([...expenses, expense]);
      setNewExpense({ description: '', amount: '', category: '' });
    }
  };

  const handleDeleteClick = (id: number) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const handleEditClick = (expense: Expense) => {
    setEditingExpenseId(expense.id);
    setEditedExpense({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
    });
  };

  const handleSaveEdit = (id: number) => {
    if (editedExpense.description && editedExpense.amount && editedExpense.category) {
      setExpenses(expenses.map(expense =>
        expense.id === id
          ? {
              ...expense,
              description: editedExpense.description,
              amount: parseFloat(editedExpense.amount),
              category: editedExpense.category,
            }
          : expense
      ));
      setEditingExpenseId(null);
      setEditedExpense({ description: '', amount: '', category: '' });
    }
  };

  const handleCancelEdit = () => {
    setEditingExpenseId(null);
    setEditedExpense({ description: '', amount: '', category: '' });
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const expenseDataForChart = useMemo(() => {
    const data: { name: string; value: number }[] = [];
    const categoryTotals: { [key: string]: number } = {};

    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    Object.entries(categoryTotals).forEach(([category, total]) => {
      data.push({ name: category, value: parseFloat(total.toFixed(2)) });
    });

    return data;
  }, [expenses]);


  return (
    <InteractiveSimulation
      title="Expense Tracker"
      description="Add, edit, and delete your expenses and categories, and visualize your spending."
      onComplete={onComplete}
    >
      <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
        <h4 className="text-lg font-semibold mb-3">Manage Categories</h4>
        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            placeholder="New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            onClick={handleAddCategory}
          >
            Add Category
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span key={category} className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {category}
              {category !== 'Other' && ( // Prevent removing 'Other' category
                <button
                  className="ml-1 text-blue-800 hover:text-blue-900"
                  onClick={() => handleRemoveCategory(category)}
                >
                  &times;
                </button>
              )}
            </span>
          ))}
        </div>
      </div>


      <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
        <h4 className="text-lg font-semibold mb-3">Add New Expense</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={newExpense.description}
            onChange={handleNewInputChange}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={handleNewInputChange}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            min="0"
          />
          <select
            name="category"
            value={newExpense.category}
            onChange={handleNewInputChange}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={addExpense}
        >
          Add Expense
        </button>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3">Expenses</h4>
        {expenses.length === 0 ? (
          <p className="text-gray-500">No expenses added yet.</p>
        ) : (
          <ul className="space-y-3">
            {expenses.map((expense) => (
              <li key={expense.id} className="p-3 border border-gray-200 rounded-md bg-white shadow-sm">
                {editingExpenseId === expense.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <input
                      type="text"
                      name="description"
                      value={editedExpense.description}
                      onChange={handleEditInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="number"
                      name="amount"
                      value={editedExpense.amount}
                      onChange={handleEditInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                     <select
                      name="category"
                      value={editedExpense.category}
                      onChange={handleEditInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <div className="col-span-1 md:col-span-3 flex justify-end space-x-2">
                      <button
                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        onClick={() => handleSaveEdit(expense.id)}
                      >
                        Save
                      </button>
                      <button
                        className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-gray-500">{expense.category}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold">${expense.amount.toFixed(2)}</span>
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditClick(expense)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteClick(expense.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-md">
        <p className="font-semibold text-lg mb-4">Expense Summary by Category</p>
        {expenseDataForChart.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseDataForChart}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {expenseDataForChart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">Add expenses to see the chart.</p>
        )}
        <p className="font-semibold text-lg mt-4">Total Expenses: ${totalExpenses.toFixed(2)}</p>
      </div>
    </InteractiveSimulation>
  );
};

export default ExpenseTracker;