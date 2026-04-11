import api from "./api";

export const createInsight = async (payload) => {
  const res = await api.post("/insights", payload);
  return res.data;
};

export const getInsights = async (userId) => {
  const res = await api.get(`/insight/${userId}`);
  return res.data.data.insights;
};

export const markInsightRead = async (id) => {
  const res = await api.put(`/insight/${id}/read`);
  return res.data.data.insight;
};