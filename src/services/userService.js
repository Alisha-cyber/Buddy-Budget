import api from "./api";

export const getUserProfile = async (userId) => {
  const res = await api.get(`/user/${userId}`);
  return res.data;
};

export const updateUserProfile = async (userId, payload) => {
  const res = await api.put(`/user/${userId}`, payload);
  return res.data;
};
