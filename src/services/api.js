import axios from "axios";

// ============================================
//  API BASE (Render)
// ============================================
const API_BASE_URL = "https://max-fit-api-4bkb.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL, // <-- Aqui estava errado
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token (se houver)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========== SERVIÇOS DE SUPORTE ==========
export const suporteService = {
  listarPsicologos: async (cidade = "") => {
    const response = await api.get("/suporte/psicologos", {
      params: { cidade },
    });
    return response.data;
  },

  listarNutricionistas: async (cidade = "") => {
    const response = await api.get("/suporte/nutricionistas", {
      params: { cidade },
    });
    return response.data;
  },

  listarTutoriais: async () => {
    const response = await api.get("/suporte/tutoriais");
    return response.data;
  },

  listarDicas: async () => {
    const response = await api.get("/suporte/dicas");
    return response.data;
  },

  buscarDica: async (id) => {
    const response = await api.get(`/suporte/dicas/${id}`);
    return response.data;
  },
};

export default api;
