import api from "./api";

export const setMonthlyBudget = async (payload) => {
  const res = await api.post("/budgets", payload);
  return res.data;
};

export const getMonthlyBudget = async (userId, month) => {
  const res = await api.get(`/budgets/${userId}/${month}`);
  return res.data;
};
