import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material'
import { useExpenses } from '../hooks/useExpenses'

const SimpleExpenseList = ({ onNavigate }) => {
  const { expenses, loading, fetchExpenses, deleteExpense } = useExpenses()
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialog, setDeleteDialog] = useState({ open: false, expense: null })

  useEffect(() => {
    fetchExpenses()
  }, [])

  const filteredExpenses = expenses.filter(expense =>
    expense.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async () => {
    if (deleteDialog.expense) {
      try {
        await deleteExpense(deleteDialog.expense._id)
        setDeleteDialog({ open: false, expense: null })
      } catch (error) {
        console.error('Failed to delete expense:', error)
      }
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getCategoryColor = (category) => {
    const colors = {
      food: '#FF6B6B',
      transport: '#4ECDC4',
      housing: '#45B7D1',
      shopping: '#96CEB4',
      health: '#FFEAA7',
      education: '#DDA0DD',
      other: '#98D8C8',
    }
    return colors[category?.toLowerCase()] || colors.other
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          📋 Expenses
        </Typography>
        <Button
          variant="contained"
          onClick={() => onNavigate('add-expense')}
          sx={{ px: 3 }}
        >
          ➕ Add Expense
        </Button>
      </Box>

      {/* Search */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
        />
      </Paper>

      {/* Expenses List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : filteredExpenses.length > 0 ? (
        <Grid container spacing={2}>
          {filteredExpenses.map((expense, index) => (
            <Grid item xs={12} sm={6} md={4} key={expense._id || index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>
                      {expense.title || expense.description}
                    </Typography>
                    <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(expense.value)}
                    </Typography>
                  </Box>
                  
                  {expense.description && expense.title && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {expense.description}
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip
                      label={expense.category || 'other'}
                      size="small"
                      sx={{
                        backgroundColor: getCategoryColor(expense.category),
                        color: 'white',
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(expense.createdAt || expense.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => setDeleteDialog({ open: true, expense })}
                    >
                      🗑️ Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            {expenses.length === 0 ? 'No expenses yet' : 'No expenses match your search'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {expenses.length === 0 
              ? 'Start by adding your first expense'
              : 'Try adjusting your search criteria'
            }
          </Typography>
          {expenses.length === 0 && (
            <Button
              variant="contained"
              onClick={() => onNavigate('add-expense')}
            >
              ➕ Add Your First Expense
            </Button>
          )}
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, expense: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Expense</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.expense?.title || deleteDialog.expense?.description}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, expense: null })}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SimpleExpenseList
