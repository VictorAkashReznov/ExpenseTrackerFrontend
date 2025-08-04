import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://expense-tracker-backend-plum-eight.vercel.app",
  timeout: 10000,
});

export const expenseAPI = {
  getAll: async () => {
    const response = await api.get("/expenses");
    return response.data.expenses || response.data;
  },

  create: async (expenseData) => {
    const response = await api.post("/expenses", expenseData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },
};
