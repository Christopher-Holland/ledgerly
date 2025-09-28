import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:4000/api" });

API.interceptors.request.use(config => {
  const token = localStorage.getItem("ledgerlyToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;