import api from "./api";

export const createCategory = async (payload) => {
  const res = await api.post("/categories", payload);
  return res.data;
};

export const getCategories = async (userId) => {
  const res = await api.get(`/categories?userId=${userId}`);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};
