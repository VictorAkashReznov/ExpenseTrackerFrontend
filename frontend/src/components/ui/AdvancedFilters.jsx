import React from "react";
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Paper,
  Typography,
  Collapse,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Clear as ClearIcon,
  AttachMoney as MoneyIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const AdvancedFilters = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  dateRange,
  setDateRange,
  amountRange,
  setAmountRange,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  showAdvanced,
  setShowAdvanced,
  onClearFilters,
  categories = [],
}) => {
  const hasActiveFilters =
    searchTerm ||
    categoryFilter ||
    dateRange.start ||
    dateRange.end ||
    amountRange.min ||
    amountRange.max;

  const handleDateRangeChange = (field) => (event) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleAmountRangeChange = (field) => (event) => {
    setAmountRange((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (categoryFilter) count++;
    if (dateRange.start || dateRange.end) count++;
    if (amountRange.min || amountRange.max) count++;
    return count;
  };

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Basic Filters */}
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
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
              value={`${sortBy}-${sortOrder}`}
              label="Sort By"
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field);
                setSortOrder(order);
              }}
            >
              <MenuItem value="date-desc">Date (Newest)</MenuItem>
              <MenuItem value="date-asc">Date (Oldest)</MenuItem>
              <MenuItem value="amount-desc">Amount (Highest)</MenuItem>
              <MenuItem value="amount-asc">Amount (Lowest)</MenuItem>
              <MenuItem value="title-asc">Title (A-Z)</MenuItem>
              <MenuItem value="title-desc">Title (Z-A)</MenuItem>
              <MenuItem value="category-asc">Category (A-Z)</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => setShowAdvanced(!showAdvanced)}
              startIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ textTransform: "none", flex: 1 }}
            >
              Advanced
              {getActiveFiltersCount() > 0 && (
                <Chip
                  label={getActiveFiltersCount()}
                  size="small"
                  sx={{ ml: 1, height: 20, fontSize: "0.75rem" }}
                />
              )}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Advanced Filters */}
      <Collapse in={showAdvanced}>
        <Box
          sx={{ mt: 3, pt: 3, borderTop: "1px solid", borderColor: "divider" }}
        >
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Advanced Filters
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={dateRange.start}
                onChange={handleDateRangeChange("start")}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={dateRange.end}
                onChange={handleDateRangeChange("end")}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Min Amount"
                type="number"
                value={amountRange.min}
                onChange={handleAmountRangeChange("min")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Max Amount"
                type="number"
                value={amountRange.max}
                onChange={handleAmountRangeChange("max")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
          </Grid>

          {hasActiveFilters && (
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
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
                {(dateRange.start || dateRange.end) && (
                  <Chip
                    label={`Date: ${dateRange.start || "..."} to ${
                      dateRange.end || "..."
                    }`}
                    onDelete={() => setDateRange({ start: "", end: "" })}
                    size="small"
                  />
                )}
                {(amountRange.min || amountRange.max) && (
                  <Chip
                    label={`Amount: $${amountRange.min || "0"} - $${
                      amountRange.max || "∞"
                    }`}
                    onDelete={() => setAmountRange({ min: "", max: "" })}
                    size="small"
                  />
                )}
              </Box>

              <Button
                variant="outlined"
                size="small"
                onClick={onClearFilters}
                startIcon={<ClearIcon />}
                sx={{ textTransform: "none" }}
              >
                Clear All
              </Button>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default AdvancedFilters;
