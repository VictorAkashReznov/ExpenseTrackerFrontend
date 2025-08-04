import { useState, useCallback } from 'react'
import { expenseAPI, formatApiError, isNetworkError } from '../services/api'

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all expenses
  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await expenseAPI.getAll()
      setExpenses(Array.isArray(data) ? data : [])
    } catch (err) {
      const errorMessage = formatApiError(err)
      setError(errorMessage)
      console.error('Failed to fetch expenses:', err)
      
      // If it's a network error, keep existing data
      if (!isNetworkError(err)) {
        setExpenses([])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Add new expense
  const addExpense = useCallback(async (expenseData) => {
    setLoading(true)
    setError(null)
    
    try {
      const newExpense = await expenseAPI.create(expenseData)
      
      // Add to local state immediately for better UX
      setExpenses(prevExpenses => [newExpense, ...prevExpenses])
      
      return newExpense
    } catch (err) {
      const errorMessage = formatApiError(err)
      setError(errorMessage)
      console.error('Failed to add expense:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Update expense
  const updateExpense = useCallback(async (id, expenseData) => {
    setLoading(true)
    setError(null)
    
    try {
      const updatedExpense = await expenseAPI.update(id, expenseData)
      
      // Update local state
      setExpenses(prevExpenses =>
        prevExpenses.map(expense =>
          expense._id === id ? { ...expense, ...updatedExpense } : expense
        )
      )
      
      return updatedExpense
    } catch (err) {
      const errorMessage = formatApiError(err)
      setError(errorMessage)
      console.error('Failed to update expense:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Delete expense
  const deleteExpense = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    
    try {
      await expenseAPI.delete(id)
      
      // Remove from local state
      setExpenses(prevExpenses =>
        prevExpenses.filter(expense => expense._id !== id)
      )
      
      return true
    } catch (err) {
      const errorMessage = formatApiError(err)
      setError(errorMessage)
      console.error('Failed to delete expense:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Get expense by ID
  const getExpenseById = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    
    try {
      const expense = await expenseAPI.getById(id)
      return expense
    } catch (err) {
      const errorMessage = formatApiError(err)
      setError(errorMessage)
      console.error('Failed to fetch expense:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Filter expenses by category
  const getExpensesByCategory = useCallback((category) => {
    return expenses.filter(expense => 
      expense.category?.toLowerCase() === category.toLowerCase()
    )
  }, [expenses])

  // Filter expenses by date range
  const getExpensesByDateRange = useCallback((startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.createdAt || expense.date)
      return expenseDate >= start && expenseDate <= end
    })
  }, [expenses])

  // Get total expenses
  const getTotalExpenses = useCallback(() => {
    return expenses.reduce((total, expense) => 
      total + (expense.value || expense.amount || 0), 0
    )
  }, [expenses])

  // Get expenses by month
  const getExpensesByMonth = useCallback((year, month) => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.createdAt || expense.date)
      return expenseDate.getFullYear() === year && expenseDate.getMonth() === month
    })
  }, [expenses])

  // Get category totals
  const getCategoryTotals = useCallback(() => {
    const categoryTotals = {}
    
    expenses.forEach(expense => {
      const category = expense.category || 'other'
      const amount = expense.value || expense.amount || 0
      categoryTotals[category] = (categoryTotals[category] || 0) + amount
    })
    
    return categoryTotals
  }, [expenses])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Refresh expenses (force refetch)
  const refreshExpenses = useCallback(async () => {
    await fetchExpenses()
  }, [fetchExpenses])

  return {
    // State
    expenses,
    loading,
    error,
    
    // Actions
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpenseById,
    refreshExpenses,
    clearError,
    
    // Computed values
    getExpensesByCategory,
    getExpensesByDateRange,
    getExpensesByMonth,
    getTotalExpenses,
    getCategoryTotals,
  }
}
