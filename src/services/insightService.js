import api from "./api";

export const getInsights = async (userId, month) => {
  const res = await api.get(`/insights?userId=${userId}&month=${month}`);
  return res.data;
};

export const createInsight = async (payload) => {
  const res = await api.post("/insights", payload);
  return res.data;
};
