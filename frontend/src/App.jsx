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
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const API_BASE = "http://localhost:3001";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState("list");
  const [message, setMessage] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    value: "",
    category: "other",
  });

  // Fetch expenses
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/expenses`);
      setExpenses(response.data.expenses || []);
      setMessage("✅ Expenses loaded successfully!");
    } catch (error) {
      setMessage("❌ Failed to load expenses: " + error.message);
      console.error("Error:", error);
    }
    setLoading(false);
  };

  // Add expense
  const addExpense = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.value) {
      setMessage("❌ Please fill in title and amount");
      return;
    }

    setLoading(true);
    try {
      const expenseData = {
        title: formData.title,
        description: formData.description,
        value: parseFloat(formData.value),
        category: formData.category,
      };

      await axios.post(`${API_BASE}/expenses`, expenseData);
      setMessage("✅ Expense added successfully!");
      setFormData({ title: "", description: "", value: "", category: "other" });
      fetchExpenses(); // Refresh list
      setCurrentView("list");
    } catch (error) {
      setMessage("❌ Failed to add expense: " + error.message);
      console.error("Error:", error);
    }
    setLoading(false);
  };

  // Delete expense
  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;

    setLoading(true);
    try {
      await axios.delete(`${API_BASE}/expenses/${id}`);
      setMessage("✅ Expense deleted successfully!");
      fetchExpenses(); // Refresh list
    } catch (error) {
      setMessage("❌ Failed to delete expense: " + error.message);
      console.error("Error:", error);
    }
    setLoading(false);
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
        💰 Simple Expense Tracker
      </Typography>

      {/* Navigation */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, justifyContent: "center" }}>
        <Button
          variant={currentView === "list" ? "contained" : "outlined"}
          onClick={() => setCurrentView("list")}
        >
          📋 View Expenses
        </Button>
        <Button
          variant={currentView === "add" ? "contained" : "outlined"}
          onClick={() => setCurrentView("add")}
        >
          ➕ Add Expense
        </Button>
        <Button variant="outlined" onClick={fetchExpenses} disabled={loading}>
          🔄 Refresh
        </Button>
      </Box>

      {/* Message */}
      {message && (
        <Alert
          severity={message.includes("✅") ? "success" : "error"}
          sx={{ mb: 3 }}
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Add Expense Form */}
      {currentView === "add" && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            ➕ Add New Expense
          </Typography>
          <form onSubmit={addExpense}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Title *"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Lunch"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Amount *"
                  type="number"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  placeholder="0.00"
                  inputProps={{ min: 0, step: 0.01 }}
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
                  placeholder="Optional details"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mr: 2 }}
                >
                  💾 Save Expense
                </Button>
                <Button
                  variant="outlined"
                  onClick={() =>
                    setFormData({
                      title: "",
                      description: "",
                      value: "",
                      category: "other",
                    })
                  }
                >
                  🔄 Clear
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}

      {/* Expenses List */}
      {currentView === "list" && (
        <>
          {/* Summary */}
          <Paper sx={{ p: 3, mb: 3, textAlign: "center" }}>
            <Typography variant="h4" color="primary">
              Total: {formatCurrency(totalExpenses)}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
            </Typography>
          </Paper>

          {/* Expenses */}
          {expenses.length > 0 ? (
            <Grid container spacing={2}>
              {expenses.map((expense) => (
                <Grid item xs={12} sm={6} md={4} key={expense._id}>
                  <Card>
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
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
                      <Typography
                        variant="h5"
                        color="error"
                        sx={{ fontWeight: "bold", mb: 2 }}
                      >
                        {formatCurrency(expense.value)}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 2 }}
                      >
                        {new Date(
                          expense.createdAt || expense.date
                        ).toLocaleDateString()}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => deleteExpense(expense._id)}
                        disabled={loading}
                      >
                        🗑️ Delete
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 6, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No expenses yet
              </Typography>
              <Button variant="contained" onClick={() => setCurrentView("add")}>
                ➕ Add Your First Expense
              </Button>
            </Paper>
          )}
        </>
      )}
    </Container>
  );
}

export default App;
