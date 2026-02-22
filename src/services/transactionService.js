import api from "./api";

// CREATE
export const createTransaction = async (payload) => {
  const res = await api.post("/transaction", payload);
  return res.data;
};

// UPDATE
export const updateTransaction = async (id, payload) => {
  const res = await api.put(`/transaction/${id}`, payload);
  return res.data;
};

// DELETE
export const deleteTransaction = async (id) => {
  const res = await api.delete(`/transaction/${id}`);
  return res.data;
};

// GET
export const getTransactions = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await api.get(query ? `/transaction?${query}` : "/transaction");
  return res.data;
};
