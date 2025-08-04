import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material'
import { useExpenses } from '../hooks/useExpenses'

const SimpleDashboard = ({ onNavigate }) => {
  const { expenses, loading, fetchExpenses, addExpense } = useExpenses()
  const [testStatus, setTestStatus] = useState('')

  useEffect(() => {
    fetchExpenses()
  }, [])

  const testConnection = async () => {
    setTestStatus('Testing...')
    try {
      await fetchExpenses()
      setTestStatus('✅ Connection successful!')
    } catch (error) {
      setTestStatus(`❌ Connection failed: ${error.message}`)
    }
  }

  const addTestExpense = async () => {
    setTestStatus('Adding test expense...')
    try {
      const testExpense = {
        title: 'Test Expense',
        description: 'This is a test expense',
        value: 25.99,
        category: 'food',
        date: new Date().toISOString()
      }
      
      await addExpense(testExpense)
      setTestStatus('✅ Test expense added successfully!')
      await fetchExpenses() // Refresh the list
    } catch (error) {
      setTestStatus(`❌ Failed to add expense: ${error.message}`)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.value || 0), 0)

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        💰 Dashboard
      </Typography>

      {/* API Test Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🔧 API Connection Test
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button 
            variant="outlined" 
            onClick={testConnection}
            disabled={loading}
          >
            Test Connection
          </Button>
          
          <Button 
            variant="contained" 
            onClick={addTestExpense}
            disabled={loading}
          >
            Add Test Expense
          </Button>
        </Box>
        
        {testStatus && (
          <Alert severity={testStatus.includes('✅') ? 'success' : 'info'}>
            {testStatus}
          </Alert>
        )}
      </Paper>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Total Expenses
              </Typography>
              <Typography variant="h4">
                {formatCurrency(totalExpenses)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Total Count
              </Typography>
              <Typography variant="h4">
                {expenses.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Average
              </Typography>
              <Typography variant="h4">
                {expenses.length > 0 ? formatCurrency(totalExpenses / expenses.length) : '$0.00'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🚀 Quick Actions
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => onNavigate('add-expense')}
          >
            ➕ Add New Expense
          </Button>
          
          <Button 
            variant="outlined"
            onClick={() => onNavigate('expenses')}
          >
            📋 View All Expenses
          </Button>
        </Box>
      </Paper>

      {/* Recent Expenses */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          📊 Recent Expenses
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : expenses.length > 0 ? (
          <Box>
            {expenses.slice(0, 5).map((expense, index) => (
              <Box 
                key={expense._id || index}
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  py: 2,
                  borderBottom: index < 4 ? '1px solid #eee' : 'none'
                }}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {expense.title || expense.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {expense.category} • {new Date(expense.createdAt || expense.date).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="h6" color="error">
                  {formatCurrency(expense.value)}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            No expenses yet. Add your first expense to get started!
          </Typography>
        )}
      </Paper>
    </Box>
  )
}

export default SimpleDashboard
