import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "https://expense-tracker-backend-aq17vglp4.vercel.app", // Backend server URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth tokens (if needed in future)
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    // const token = localStorage.getItem('authToken')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error("Unauthorized access");
    } else if (error.response?.status === 500) {
      console.error("Server error");
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout");
    }

    return Promise.reject(error);
  }
);

// Expense API endpoints
export const expenseAPI = {
  // Get all expenses
  getAll: async () => {
    try {
      const response = await api.get("/expenses");
      return response.data.expenses || response.data;
    } catch (error) {
      console.error("Error fetching expenses:", error);
      throw new Error("Failed to fetch expenses");
    }
  },

  // Get expense by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/expenses/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching expense:", error);
      throw new Error("Failed to fetch expense");
    }
  },

  // Create new expense
  create: async (expenseData) => {
    try {
      const response = await api.post("/expenses", expenseData);
      return response.data;
    } catch (error) {
      console.error("Error creating expense:", error);
      throw new Error("Failed to create expense");
    }
  },

  // Update expense
  update: async (id, expenseData) => {
    try {
      const response = await api.put(`/expenses/${id}`, expenseData);
      return response.data;
    } catch (error) {
      console.error("Error updating expense:", error);
      throw new Error("Failed to update expense");
    }
  },

  // Delete expense
  delete: async (id) => {
    try {
      const response = await api.delete(`/expenses/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw new Error("Failed to delete expense");
    }
  },

  // Get expenses by category
  getByCategory: async (category) => {
    try {
      const response = await api.get(`/expenses?category=${category}`);
      return response.data.expenses || response.data;
    } catch (error) {
      console.error("Error fetching expenses by category:", error);
      throw new Error("Failed to fetch expenses by category");
    }
  },

  // Get expenses by date range
  getByDateRange: async (startDate, endDate) => {
    try {
      const response = await api.get(
        `/expenses?startDate=${startDate}&endDate=${endDate}`
      );
      return response.data.expenses || response.data;
    } catch (error) {
      console.error("Error fetching expenses by date range:", error);
      throw new Error("Failed to fetch expenses by date range");
    }
  },
};

// Utility functions
export const formatApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  } else if (error.message) {
    return error.message;
  } else {
    return "An unexpected error occurred";
  }
};

export const isNetworkError = (error) => {
  return !error.response && error.code !== "ECONNABORTED";
};

export default api;
