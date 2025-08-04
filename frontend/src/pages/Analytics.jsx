import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  PieChart,
  BarChart,
  LineChart,
} from '@mui/x-charts'
import StatsCard from '../components/ui/StatsCard'
import Loading from '../components/ui/Loading'
import { useExpenses } from '../hooks/useExpenses'
import {
  TrendingUp as TrendingUpIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material'

const Analytics = () => {
  const { expenses, loading, fetchExpenses } = useExpenses()
  const [timeRange, setTimeRange] = useState('all')
  const [chartData, setChartData] = useState({
    categoryData: [],
    monthlyData: [],
    dailyData: [],
  })

  useEffect(() => {
    fetchExpenses()
  }, [])

  useEffect(() => {
    if (expenses.length > 0) {
      processChartData()
    }
  }, [expenses, timeRange])

  const processChartData = () => {
    let filteredExpenses = expenses

    // Filter by time range
    if (timeRange !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (timeRange) {
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          break
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3)
          break
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1)
          break
      }
      
      filteredExpenses = expenses.filter(expense => 
        new Date(expense.createdAt || expense.date) >= filterDate
      )
    }

    // Process category data for pie chart
    const categoryTotals = {}
    filteredExpenses.forEach(expense => {
      const category = expense.category || 'other'
      categoryTotals[category] = (categoryTotals[category] || 0) + (expense.value || expense.amount)
    })

    const categoryData = Object.entries(categoryTotals).map(([category, total]) => ({
      id: category,
      label: category.charAt(0).toUpperCase() + category.slice(1),
      value: total,
    }))

    // Process monthly data for line chart
    const monthlyTotals = {}
    filteredExpenses.forEach(expense => {
      const date = new Date(expense.createdAt || expense.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + (expense.value || expense.amount)
    })

    const monthlyData = Object.entries(monthlyTotals)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, total]) => ({
        month,
        amount: total,
      }))

    setChartData({
      categoryData,
      monthlyData,
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getTotalExpenses = () => {
    return chartData.categoryData.reduce((sum, item) => sum + item.value, 0)
  }

  const getTopCategory = () => {
    if (chartData.categoryData.length === 0) return 'N/A'
    const top = chartData.categoryData.reduce((max, item) => 
      item.value > max.value ? item : max
    )
    return top.label
  }

  const getAverageMonthly = () => {
    if (chartData.monthlyData.length === 0) return 0
    const total = chartData.monthlyData.reduce((sum, item) => sum + item.amount, 0)
    return total / chartData.monthlyData.length
  }

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Analytics
        </Typography>
        <Loading type="stats" count={4} />
      </Box>
    )
  }

  return (
    <Box className="fade-in">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          Analytics
        </Typography>
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="all">All Time</MenuItem>
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="quarter">Last Quarter</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Expenses"
            value={formatCurrency(getTotalExpenses())}
            icon={<AccountBalanceIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Top Category"
            value={getTopCategory()}
            icon={<CategoryIcon />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Avg Monthly"
            value={formatCurrency(getAverageMonthly())}
            icon={<CalendarIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Transactions"
            value={expenses.length.toString()}
            icon={<TrendingUpIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: 400,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Expenses by Category
            </Typography>
            {chartData.categoryData.length > 0 ? (
              <PieChart
                series={[
                  {
                    data: chartData.categoryData,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  },
                ]}
                height={300}
              />
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                <Typography color="text.secondary">No data available</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: 400,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Monthly Trend
            </Typography>
            {chartData.monthlyData.length > 0 ? (
              <LineChart
                xAxis={[
                  {
                    dataKey: 'month',
                    scaleType: 'point',
                  },
                ]}
                series={[
                  {
                    dataKey: 'amount',
                    label: 'Amount',
                    color: '#1976d2',
                  },
                ]}
                data={chartData.monthlyData}
                height={300}
              />
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                <Typography color="text.secondary">No data available</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Analytics
