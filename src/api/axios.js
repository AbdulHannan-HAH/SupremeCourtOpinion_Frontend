import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // adjust if backend on different host/port
});

export default API;
