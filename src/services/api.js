import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-acompanhamento.herokuapp.com",
});

export default api;