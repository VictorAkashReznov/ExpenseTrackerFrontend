import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  MoreVert as MoreVertIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Sort as SortIcon,
  DateRange as DateRangeIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import ExpenseCard from "../components/ui/ExpenseCard";
import Loading from "../components/ui/Loading";
import { useExpenses } from "../hooks/useExpenses";
import { exportToCSV, formatCurrency, formatDate } from "../utils/helpers";

const ExpenseList = ({ onNavigate }) => {
  const { expenses, loading, fetchExpenses, deleteExpense } = useExpenses();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [amountRange, setAmountRange] = useState({ min: "", max: "" });
  const [viewMode, setViewMode] = useState("card");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const categories = [
    "food",
    "transport",
    "housing",
    "shopping",
    "health",
    "education",
    "other",
  ];

  // Advanced filtering and sorting logic
  const filteredExpenses = useMemo(() => {
    let filtered = expenses.filter((expense) => {
      // Search filter
      const matchesSearch =
        expense.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory =
        !categoryFilter || expense.category === categoryFilter;

      // Date range filter
      let matchesDateRange = true;
      if (dateRange.start || dateRange.end) {
        const expenseDate = new Date(expense.createdAt || expense.date);
        if (dateRange.start) {
          matchesDateRange =
            matchesDateRange && expenseDate >= new Date(dateRange.start);
        }
        if (dateRange.end) {
          matchesDateRange =
            matchesDateRange && expenseDate <= new Date(dateRange.end);
        }
      }

      // Amount range filter
      let matchesAmountRange = true;
      if (amountRange.min || amountRange.max) {
        const amount = expense.value || expense.amount;
        if (amountRange.min) {
          matchesAmountRange =
            matchesAmountRange && amount >= parseFloat(amountRange.min);
        }
        if (amountRange.max) {
          matchesAmountRange =
            matchesAmountRange && amount <= parseFloat(amountRange.max);
        }
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDateRange &&
        matchesAmountRange
      );
    });

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison =
            new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date);
          break;
        case "amount":
          comparison = (a.value || a.amount) - (b.value || b.amount);
          break;
        case "title":
          comparison = (a.title || a.description).localeCompare(
            b.title || b.description
          );
          break;
        case "category":
          comparison = (a.category || "").localeCompare(b.category || "");
          break;
        default:
          return 0;
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

    return filtered;
  }, [
    expenses,
    searchTerm,
    categoryFilter,
    dateRange,
    amountRange,
    sortBy,
    sortOrder,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteClick = (expense) => {
    setExpenseToDelete(expense);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (expenseToDelete) {
      await deleteExpense(expenseToDelete._id);
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setExpenseToDelete(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setDateRange({ start: "", end: "" });
    setAmountRange({ min: "", max: "" });
    setSortBy("date");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const exportData = filteredExpenses.map((expense) => ({
      Title: expense.title || expense.description,
      Description: expense.description || "",
      Amount: expense.value || expense.amount,
      Category: expense.category || "other",
      Date: formatDate(expense.createdAt || expense.date),
    }));

    exportToCSV(
      exportData,
      `expenses-${new Date().toISOString().split("T")[0]}.csv`
    );
    setMenuAnchor(null);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const getTotalAmount = () => {
    return filteredExpenses.reduce(
      (sum, expense) => sum + (expense.value || expense.amount),
      0
    );
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Expenses
        </Typography>
        <Loading type="cards" count={5} />
      </Box>
    );
  }

  return (
    <Box className="fade-in">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          Expenses
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => onNavigate && onNavigate("add-expense")}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Add Expense
        </Button>
      </Box>

      {/* Filters */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="amount">Amount</MenuItem>
                <MenuItem value="title">Title</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={clearFilters}
              startIcon={<FilterIcon />}
              sx={{ textTransform: "none" }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>

        {(searchTerm || categoryFilter) && (
          <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {searchTerm && (
              <Chip
                label={`Search: "${searchTerm}"`}
                onDelete={() => setSearchTerm("")}
                size="small"
              />
            )}
            {categoryFilter && (
              <Chip
                label={`Category: ${categoryFilter}`}
                onDelete={() => setCategoryFilter("")}
                size="small"
              />
            )}
          </Box>
        )}
      </Paper>

      {/* Expenses List */}
      {filteredExpenses.length > 0 ? (
        <Box>
          {filteredExpenses.map((expense, index) => (
            <ExpenseCard
              key={expense._id || index}
              expense={expense}
              onDelete={handleDeleteClick}
              className="slide-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            />
          ))}
        </Box>
      ) : (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <ReceiptIcon
            sx={{ fontSize: 64, mb: 2, opacity: 0.5, color: "text.secondary" }}
          />
          <Typography variant="h6" sx={{ mb: 1, color: "text.primary" }}>
            {expenses.length === 0
              ? "No expenses yet"
              : "No expenses match your filters"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {expenses.length === 0
              ? "Start by adding your first expense"
              : "Try adjusting your search or filter criteria"}
          </Typography>
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Expense</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "
            {expenseToDelete?.title || expenseToDelete?.description}"? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpenseList;
