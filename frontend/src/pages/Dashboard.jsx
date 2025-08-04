import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, Paper, useTheme } from "@mui/material";
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Receipt as ReceiptIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import StatsCard from "../components/ui/StatsCard";
import ExpenseCard from "../components/ui/ExpenseCard";
import Loading from "../components/ui/Loading";
import TestConnection from "../components/ui/TestConnection";
import { useExpenses } from "../hooks/useExpenses";

const Dashboard = () => {
  const theme = useTheme();
  const { expenses, loading, fetchExpenses } = useExpenses();
  const [stats, setStats] = useState({
    totalExpenses: 0,
    monthlyExpenses: 0,
    expenseCount: 0,
    avgExpense: 0,
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    if (expenses.length > 0) {
      calculateStats();
    }
  }, [expenses]);

  const calculateStats = () => {
    const total = expenses.reduce(
      (sum, expense) => sum + (expense.value || expense.amount),
      0
    );
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyExpenses = expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.createdAt || expense.date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, expense) => sum + (expense.value || expense.amount), 0);

    setStats({
      totalExpenses: total,
      monthlyExpenses,
      expenseCount: expenses.length,
      avgExpense: expenses.length > 0 ? total / expenses.length : 0,
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const recentExpenses = expenses.slice(0, 5);

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Dashboard
        </Typography>
        <Loading type="stats" count={4} />
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recent Expenses
          </Typography>
          <Loading type="cards" count={3} />
        </Box>
      </Box>
    );
  }

  return (
    <Box className="fade-in">
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: "text.primary",
        }}
      >
        Dashboard
      </Typography>

      {/* Temporary test component */}
      <TestConnection />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Expenses"
            value={formatCurrency(stats.totalExpenses)}
            icon={<AccountBalanceIcon />}
            color="primary"
            trend="up"
            trendValue="+12% from last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="This Month"
            value={formatCurrency(stats.monthlyExpenses)}
            icon={<CalendarIcon />}
            color="secondary"
            trend="down"
            trendValue="-5% from last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Transactions"
            value={stats.expenseCount.toString()}
            icon={<ReceiptIcon />}
            color="success"
            subtitle="All time"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Average Expense"
            value={formatCurrency(stats.avgExpense)}
            icon={<TrendingUpIcon />}
            color="warning"
            subtitle="Per transaction"
          />
        </Grid>
      </Grid>

      {/* Recent Expenses */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          Recent Expenses
        </Typography>

        {recentExpenses.length > 0 ? (
          <Box>
            {recentExpenses.map((expense, index) => (
              <ExpenseCard
                key={expense._id || index}
                expense={expense}
                className="slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              color: "text.secondary",
            }}
          >
            <ReceiptIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No expenses yet
            </Typography>
            <Typography variant="body2">
              Start by adding your first expense to see it here
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;
