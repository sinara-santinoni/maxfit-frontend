import axios from "axios";

// ============================================
//  API BASE (Render)
// ============================================
const API_BASE_URL = "https://max-fit-api-4bkb.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL, // ✔️ Corrigido
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================
//  INTERCEPTOR — TOKEN
// ============================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ======================================================================
//  🔥 AUTH SERVICE (LOGIN / CADASTRO) — OBRIGATÓRIO PARA AUTHCONTEXT
// ======================================================================
export const authService = {
  // LOGIN
  login: async (email, senha) => {
    const response = await api.post("/login", { email, senha });
    return response.data;
  },

  // CADASTRAR ALUNO
  cadastrarAluno: async (dados) => {
    const body = {
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
      cidade: dados.cidade,
      tipo: "ALUNO",
    };
    return (await api.post("/cadastro", body)).data;
  },

  // CADASTRAR PERSONAL
  cadastrarPersonal: async (dados) => {
    const body = {
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
      cidade: dados.cidade,
      tipo: "PERSONAL",
    };
    return (await api.post("/cadastro", body)).data;
  },
};

// ======================================================================
//  SUPORTE SERVICE
// ======================================================================
export const suporteService = {
  listarPsicologos: async (cidade = "") => {
    const response = await api.get("/suporte/psicologos", { params: { cidade } });
    return response.data;
  },

  listarNutricionistas: async (cidade = "") => {
    const response = await api.get("/suporte/nutricionistas", { params: { cidade } });
    return response.data;
  },

  listarTutoriais: async () => (await api.get("/suporte/tutoriais")).data,

  listarDicas: async () => (await api.get("/suporte/dicas")).data,

  buscarDica: async (id) => (await api.get(`/suporte/dicas/${id}`)).data,
};

// ======================================================================
//  PERSONAL SERVICE
// ======================================================================
export const personalService = {
  listarAlunos: async (personalId) => {
    const resp = await api.get(`/personal/${personalId}/alunos`);
    return resp.data.data || [];
  },

  listarAlunosDisponiveis: async () => {
    const resp = await api.get("/personal/alunos-disponiveis");
    return resp.data.data || [];
  },

  vincularAluno: async ({ personalId, alunoId }) => {
    const resp = await api.post("/personal/vincular-aluno", { personalId, alunoId });
    return resp.data.data;
  },
};

// Exporta o axios configurado
export default api;
