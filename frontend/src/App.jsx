import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  Paper,
} from "@mui/material";
import { expenseAPI } from "./services/api";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [currentView, setCurrentView] = useState("list");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    value: "",
  });

  const fetchExpenses = async () => {
    try {
      const expenses = await expenseAPI.getAll();
      setExpenses(expenses || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.value) return;

    try {
      const expenseData = {
        title: formData.title,
        description: formData.description,
        value: parseFloat(formData.value),
      };

      await expenseAPI.create(expenseData);
      setFormData({ title: "", description: "", value: "" });
      fetchExpenses();
      setCurrentView("list");
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;

    try {
      await expenseAPI.delete(id);
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + (expense.value || 0),
    0
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" align="center" sx={{ mb: 4, color: "#1976d2" }}>
        💰 Expense Tracker
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3, justifyContent: "center" }}>
        <Button
          variant={currentView === "list" ? "contained" : "outlined"}
          onClick={() => setCurrentView("list")}
        >
          View Expenses
        </Button>
        <Button
          variant={currentView === "add" ? "contained" : "outlined"}
          onClick={() => setCurrentView("add")}
        >
          Add Expense
        </Button>
      </Box>

      {currentView === "add" && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Add New Expense
          </Typography>
          <form onSubmit={addExpense}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  inputProps={{ min: 0, step: 0.01 }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" sx={{ mr: 2 }}>
                  Save
                </Button>
                <Button
                  variant="outlined"
                  onClick={() =>
                    setFormData({ title: "", description: "", value: "" })
                  }
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}

      {currentView === "list" && (
        <>
          <Paper sx={{ p: 3, mb: 3, textAlign: "center" }}>
            <Typography variant="h4" color="primary">
              Total: {formatCurrency(totalExpenses)}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {expenses.length} expenses
            </Typography>
          </Paper>

          {expenses.length > 0 ? (
            <Grid container spacing={2}>
              {expenses.map((expense) => (
                <Grid item xs={12} sm={6} key={expense._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {expense.title}
                      </Typography>
                      {expense.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {expense.description}
                        </Typography>
                      )}
                      <Typography variant="h5" color="error" sx={{ mb: 2 }}>
                        {formatCurrency(expense.value)}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => deleteExpense(expense._id)}
                      >
                        Delete
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No expenses yet
              </Typography>
              <Button variant="contained" onClick={() => setCurrentView("add")}>
                Add Your First Expense
              </Button>
            </Paper>
          )}
        </>
      )}
    </Container>
  );
}

export default App;
