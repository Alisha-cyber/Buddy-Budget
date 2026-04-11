import api from "./api";

export const getCategories = async ({ userId, type }) => {
  const query = new URLSearchParams({
    userId,
    ...(type ? { type } : {}),
  }).toString();

  const res = await api.get(`/category?${query}`);
  return res.data.data.categories;
};

export const createCategory = async (payload) => {
  const res = await api.post("/category", payload);
  return res.data.data.category;
};

export const deleteCategory = async (id) => {
  const res = await api.delete(`/category/${id}`);
  return res.data;
};