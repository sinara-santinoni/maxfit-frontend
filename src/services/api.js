import axios from "axios";

// ============================================
//  API BASE (Render)
// ============================================
const API_BASE_URL = "https://max-fit-api-4bkb.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
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

// ========== SERVIÇOS DE AUTENTICAÇÃO ==========
export const authService = {
  /**
   * Faz login do usuário
   */
  login: async (email, senha) => {
    const response = await api.post("/login", { email, senha });
    return {
      token: response.data.token || "fake-token",
      usuario: {
        id: response.data.id,
        nome: response.data.nome,
        email: response.data.email,
        tipo: response.data.tipo,
        cidade: response.data.cidade,
      },
    };
  },

  /**
   * Cadastra um novo aluno
   */
  cadastrarAluno: async (dados) => {
    const payload = {
      ...dados,
      tipo: "ALUNO",
    };
    const response = await api.post("/cadastro", payload);
    return response.data;
  },

  /**
   * Cadastra um novo personal
   */
  cadastrarPersonal: async (dados) => {
    const payload = {
      ...dados,
      tipo: "PERSONAL",
    };
    const response = await api.post("/cadastro", payload);
    return response.data;
  },
};

// ========== SERVIÇOS DE SUPORTE ==========
export const suporteService = {
  /**
   * Lista psicólogos por cidade
   * @param {string} cidade - Nome da cidade (opcional)
   */
  listarPsicologos: async (cidade = "") => {
    try {
      const response = await api.get("/suporte/psicologos", {
        params: { cidade },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao listar psicólogos:", error);
      throw error;
    }
  },

  /**
   * Lista nutricionistas por cidade
   * @param {string} cidade - Nome da cidade (opcional)
   */
  listarNutricionistas: async (cidade = "") => {
    try {
      const response = await api.get("/suporte/nutricionistas", {
        params: { cidade },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao listar nutricionistas:", error);
      throw error;
    }
  },

  /**
   * Lista todos os tutoriais
   */
  listarTutoriais: async () => {
    try {
      const response = await api.get("/suporte/tutoriais");
      return response.data;
    } catch (error) {
      console.error("Erro ao listar tutoriais:", error);
      throw error;
    }
  },

  /**
   * Lista todas as dicas
   */
  listarDicas: async () => {
    try {
      const response = await api.get("/suporte/dicas");
      return response.data;
    } catch (error) {
      console.error("Erro ao listar dicas:", error);
      throw error;
    }
  },

  /**
   * Busca uma dica específica por ID
   * @param {number} id - ID da dica
   */
  buscarDica: async (id) => {
    try {
      const response = await api.get(`/suporte/dicas/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dica:", error);
      throw error;
    }
  },
};

export default api;