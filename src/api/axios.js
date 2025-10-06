import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL||"http://localhost:5000/api", // adjust if backend on different host/port
});

export default API;
