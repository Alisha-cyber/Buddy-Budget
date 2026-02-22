import api from "./api";

export const loginUser = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const registerUser = async (name, email, password) => {
  const res = await api.post("/auth/register", {
    name,
    email,
    password,
    currency: "CAD",
  });
  return res.data;
};

export const logoutUser = () => {
  // return api.post("/auth/logout");
  return true;
};
