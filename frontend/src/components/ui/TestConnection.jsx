import React, { useState } from 'react'
import { Button, Box, Typography, Alert } from '@mui/material'
import { expenseAPI } from '../../services/api'

const TestConnection = () => {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setStatus('')
    
    try {
      // Test fetching expenses
      const expenses = await expenseAPI.getAll()
      setStatus(`✅ Connection successful! Found ${expenses.length} expenses.`)
    } catch (error) {
      setStatus(`❌ Connection failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const addTestExpense = async () => {
    setLoading(true)
    setStatus('')
    
    try {
      const testExpense = {
        title: 'Test Expense',
        description: 'This is a test expense',
        value: 25.99,
        category: 'food',
        date: new Date().toISOString()
      }
      
      const result = await expenseAPI.create(testExpense)
      setStatus(`✅ Test expense created successfully! ID: ${result._id}`)
    } catch (error) {
      setStatus(`❌ Failed to create expense: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        API Connection Test
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
      
      {status && (
        <Alert severity={status.includes('✅') ? 'success' : 'error'}>
          {status}
        </Alert>
      )}
    </Box>
  )
}

export default TestConnection
