import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
  Alert,
  Snackbar,
} from '@mui/material'
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material'
import { useExpenses } from '../hooks/useExpenses'

const AddExpense = ({ onExpenseAdded }) => {
  const { addExpense, loading } = useExpenses()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  })
  const [errors, setErrors] = useState({})
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const categories = [
    { value: 'food', label: 'Food & Dining' },
    { value: 'transport', label: 'Transportation' },
    { value: 'housing', label: 'Housing' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'health', label: 'Health & Medical' },
    { value: 'education', label: 'Education' },
    { value: 'other', label: 'Other' },
  ]

  const handleInputChange = (field) => (event) => {
    const value = event.target.value
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const expenseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        value: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
      }

      await addExpense(expenseData)
      
      setSnackbar({
        open: true,
        message: 'Expense added successfully!',
        severity: 'success'
      })

      // Reset form
      setFormData({
        title: '',
        description: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
      })

      // Navigate back to expenses list after a short delay
      setTimeout(() => {
        if (onExpenseAdded) {
          onExpenseAdded()
        }
      }, 1500)

    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to add expense. Please try again.',
        severity: 'error'
      })
    }
  }

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
    })
    setErrors({})
  }

  return (
    <Box className="fade-in">
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: 'text.primary',
        }}
      >
        Add New Expense
      </Typography>

      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          maxWidth: 600,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={handleInputChange('title')}
                error={!!errors.title}
                helperText={errors.title}
                placeholder="e.g., Lunch at restaurant"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleInputChange('description')}
                placeholder="Additional details (optional)"
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange('amount')}
                error={!!errors.amount}
                helperText={errors.amount}
                placeholder="0.00"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon />
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  min: 0,
                  step: 0.01,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={handleInputChange('category')}
                  required
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.category}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={formData.date}
                onChange={handleInputChange('date')}
                error={!!errors.date}
                helperText={errors.date}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  startIcon={<CancelIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={<SaveIcon />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {loading ? 'Adding...' : 'Add Expense'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default AddExpense
