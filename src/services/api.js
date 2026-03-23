import axios from "axios";

const apiURL = "https://buddybudget-6j2e.onrender.com";
// const apiURL = "http:localhost:5050";

const api = axios.create({
  baseURL: apiURL, // change
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Optional: global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
