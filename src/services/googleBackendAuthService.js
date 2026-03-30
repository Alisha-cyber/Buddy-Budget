import api from "./api";

export const loginWithGoogleToken = async (idToken) => {
  const res = await api.post("/auth/google", { idToken });
  return res.data.data.user;
};