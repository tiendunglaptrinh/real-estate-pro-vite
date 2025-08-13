import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3000", // URL backend đúng
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token && !config.skipAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(">>> axios request config:", config);
    return config;
  },
  (error) => Promise.reject(error)
);

export default client;
