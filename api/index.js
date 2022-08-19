const axios = require("axios").default;

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 5000,
});

export default api;
