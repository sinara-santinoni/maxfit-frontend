import axios from "axios";

// ============================================
//  CONFIGURAÇÃO DA API BASE
// ============================================
const API_BASE_URL = "https://max-fit-api-4bkb.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000, // 30s
});

// ============================================
//  INTERCEPTORS
// ============================================

// Request interceptor - adiciona token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - tratamento global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ============================================
//  HELPERS
// ============================================
const extractData = (response) => response.data?.data || response.data;

const handleError = (error, context) => {
  console.error(`Erro em ${context}:`, error.response?.data || error.message);
  throw error;
};

const getUser = () => JSON.parse(localStorage.getItem("user"));

// ============================================
//  AUTH SERVICE
// ============================================
export const authService = {
  login: async (email, senha) => {
    try {
      const response = await api.post("/login", { email, senha });
      const { token, ...usuario } = response.data;
      return { token, usuario };
    } catch (error) {
      handleError(error, "authService.login");
    }
  },

  cadastrarAluno: async (dados) => {
    try {
      const payload = { ...dados, tipo: "ALUNO" };
      const response = await api.post("/cadastro", payload);
      return extractData(response);
    } catch (error) {
      handleError(error, "authService.cadastrarAluno");
    }
  },

  cadastrarPersonal: async (dados) => {
    try {
      const payload = { ...dados, tipo: "PERSONAL" };
      const response = await api.post("/cadastro", payload);
      return extractData(response);
    } catch (error) {
      handleError(error, "authService.cadastrarPersonal");
    }
  },
};

// ============================================
//  USUARIO SERVICE
// ============================================
export const usuarioService = {
  listarUsuarios: async () => {
    try {
      const response = await api.get("/usuarios");
      return extractData(response);
    } catch (error) {
      handleError(error, "usuarioService.listarUsuarios");
    }
  },

  buscarAlunosDisponiveis: async () => {
    try {
      const response = await api.get("/alunos-disponiveis");
      return extractData(response);
    } catch (error) {
      handleError(error, "usuarioService.buscarAlunosDisponiveis");
    }
  },

  buscarAlunosDoPersonal: async (idPersonal) => {
    try {
      const response = await api.get(`/alunos-do-personal/${idPersonal}`);
      return extractData(response);
    } catch (error) {
      handleError(error, "usuarioService.buscarAlunosDoPersonal");
    }
  },

  vincularAluno: async (dados) => {
    try {
      const response = await api.put("/vincular-aluno", dados);
      return extractData(response);
    } catch (error) {
      handleError(error, "usuarioService.vincularAluno");
    }
  },

  removerAluno: async (idAluno) => {
    try {
      const response = await api.put(`/remover-aluno/${idAluno}`);
      return extractData(response);
    } catch (error) {
      handleError(error, "usuarioService.removerAluno");
    }
  },
};

// ============================================
//  TREINO SERVICE
// ============================================
export const treinoService = {
  listarTodos: async () => {
    try {
      const response = await api.get("/treinos");
      return extractData(response);
    } catch (error) {
      handleError(error, "treinoService.listarTodos");
    }
  },

  listarTreinos: async (alunoId) => {
    try {
      const response = await api.get(`/treinos/${alunoId}`);
      return extractData(response);
    } catch (error) {
      handleError(error, "treinoService.listarTreinos");
    }
  },

  criarTreino: async (dados) => {
    try {
      const response = await api.post("/treinos", dados);
      return extractData(response);
    } catch (error) {
      handleError(error, "treinoService.criarTreino");
    }
  },

  atualizarTreino: async (id, dados) => {
    try {
      const response = await api.put(`/treinos/${id}`, dados);
      return extractData(response);
    } catch (error) {
      handleError(error, "treinoService.atualizarTreino");
    }
  },

  deletarTreino: async (id) => {
    try {
      const response = await api.delete(`/treinos/${id}`);
      return extractData(response);
    } catch (error) {
      handleError(error, "treinoService.deletarTreino");
    }
  },

  registrarTreino: async (dados) => {
    try {
      if (!dados) {
        const user = getUser();
        dados = {
          alunoId: user.id,
          nomeTreino: "Treino do dia",
          concluido: true,
        };
      }
      const response = await api.post("/treinos/registro", dados);
      return extractData(response);
    } catch (error) {
      handleError(error, "treinoService.registrarTreino");
    }
  },

  dashboard: async (alunoId) => {
    try {
      if (!alunoId) alunoId = getUser()?.id;
      const response = await api.get(`/treinos/dashboard/${alunoId}`);
      return extractData(response);
    } catch (error) {
      handleError(error, "treinoService.dashboard");
    }
  },
};

// ============================================
//  PROGRESSO SERVICE
// ============================================
export const progressoService = {
  listarProgresso: async (alunoId) => {
    try {
      if (!alunoId) alunoId = getUser()?.id;
      const response = await api.get(`/progresso/${alunoId}`);
      return extractData(response);
    } catch (error) {
      handleError(error, "progressoService.listarProgresso");
    }
  },

  cadastrarProgresso: async (dados) => {
    try {
      const response = await api.post("/progresso", dados);
      return extractData(response);
    } catch (error) {
      handleError(error, "progressoService.cadastrarProgresso");
    }
  },

  atualizarProgresso: async (id, dados) => {
    try {
      const response = await api.put(`/progresso/${id}`, dados);
      return extractData(response);
    } catch (error) {
      handleError(error, "progressoService.atualizarProgresso");
    }
  },
};

// ============================================
//  PERSONAL SERVICE
// ============================================
export const personalService = {
  listarAlunosDoPersonal: async (personalId) => {
    try {
      const response = await api.get(`/personal/${personalId}/alunos`);
      return extractData(response);
    } catch (error) {
      handleError(error, "personalService.listarAlunosDoPersonal");
    }
  },

  listarAlunosDisponiveis: async () => {
    try {
      const response = await api.get("/personal/alunos-disponiveis");
      return extractData(response);
    } catch (error) {
      handleError(error, "personalService.listarAlunosDisponiveis");
    }
  },

  vincularAluno: async (dados) => {
    try {
      const response = await api.post("/personal/vincular-aluno", dados);
      return extractData(response);
    } catch (error) {
      handleError(error, "personalService.vincularAluno");
    }
  },
};

// ============================================
//  DIARIO SERVICE
// ============================================
export const diarioService = {
  criarRegistro: async (dados) => {
    try {
      const user = getUser();
      const payload = { ...dados, alunoId: user.id };
      const response = await api.post("/diarios", payload);
      return extractData(response);
    } catch (error) {
      handleError(error, "diarioService.criarRegistro");
    }
  },

  listarRegistros: async (alunoId) => {
    try {
      if (!alunoId) alunoId = getUser()?.id;
      const response = await api.get("/diarios", { params: { alunoId } });
      return extractData(response);
    } catch (error) {
      handleError(error, "diarioService.listarRegistros");
    }
  },
};

// ============================================
//  DESAFIOS SERVICE
// ============================================
export const desafioService = {
  listarDesafios: async () => {
    try {
      const response = await api.get("/desafios");
      return extractData(response);
    } catch (error) {
      handleError(error, "desafioService.listarDesafios");
    }
  },

  meusDesafios: async (alunoId) => {
    try {
      if (!alunoId) alunoId = getUser()?.id;
      const response = await api.get(`/desafios/${alunoId}`);
      return extractData(response);
    } catch (error) {
      handleError(error, "desafioService.meusDesafios");
    }
  },

  listarParticipantes: async (desafioId) => {
    try {
      const response = await api.get(`/desafios/${desafioId}/participantes`);
      return extractData(response);
    } catch (error) {
      handleError(error, "desafioService.listarParticipantes");
    }
  },

  criarDesafio: async (dados) => {
    try {
      const user = getUser();
      const payload = { alunoId: user.id, ...dados };
      const response = await api.post("/desafios", payload);
      return extractData(response);
    } catch (error) {
      handleError(error, "desafioService.criarDesafio");
    }
  },

  participar: async (desafioId) => {
    try {
      const user = getUser();
      const response = await api.post(`/desafios/${desafioId}/participar`, {
        alunoId: user.id,
        progressoAtual: 0,
      });
      return extractData(response);
    } catch (error) {
      handleError(error, "desafioService.participar");
    }
  },

  sair: async (desafioId) => {
    try {
      const user = getUser();
      const response = await api.delete(
        `/desafios/${desafioId}/participar/${user.id}`
      );
      return extractData(response);
    } catch (error) {
      handleError(error, "desafioService.sair");
    }
  },

  concluir: async (desafioId) => {
    try {
      const user = getUser();
      const response = await api.post(`/desafios/${desafioId}/concluir`, null, {
        params: { alunoId: user.id },
      });
      return extractData(response);
    } catch (error) {
      handleError(error, "desafioService.concluir");
    }
  },

  excluir: async (desafioId) => {
    try {
      const response = await api.delete(`/desafios/${desafioId}`);
      return extractData(response);
    } catch (error) {
      handleError(error, "desafioService.excluir");
    }
  },
};

// ============================================
//  COMUNIDADE SERVICE
// ============================================
export const comunidadeService = {
  listarPostagens: async () => {
    try {
      const user = getUser();
      const response = await api.get("/comunidade", {
        params: { usuarioId: user?.id },
      });
      return extractData(response);
    } catch (error) {
      handleError(error, "comunidadeService.listarPostagens");
    }
  },

  criarPostagem: async (texto) => {
    try {
      const user = getUser();
      const response = await api.post("/comunidade", {
        usuarioId: user?.id,
        texto,
      });
      return extractData(response);
    } catch (error) {
      handleError(error, "comunidadeService.criarPostagem");
    }
  },

  curtir: async (postagemId) => {
    try {
      const user = getUser();
      const response = await api.post(
        `/comunidade/${postagemId}/curtir`,
        null,
        { params: { usuarioId: user?.id } }
      );
      return extractData(response);
    } catch (error) {
      handleError(error, "comunidadeService.curtir");
    }
  },

  comentar: async (postagemId, texto) => {
    try {
      const user = getUser();
      const response = await api.post(`/comunidade/${postagemId}/comentarios`, {
        usuarioId: user?.id,
        texto,
      });
      return extractData(response);
    } catch (error) {
      handleError(error, "comunidadeService.comentar");
    }
  },

  listarComentarios: async (postagemId) => {
    try {
      const response = await api.get(`/comunidade/${postagemId}/comentarios`);
      return extractData(response);
    } catch (error) {
      handleError(error, "comunidadeService.listarComentarios");
    }
  },
};

// ============================================
//  SUPORTE SERVICE
// ============================================
export const suporteService = {
  listarPsicologos: async (cidade) => {
    try {
      if (!cidade) cidade = getUser()?.cidade;
      const response = await api.get("/suporte/psicologos", {
        params: { cidade },
      });
      return extractData(response);
    } catch (error) {
      handleError(error, "suporteService.listarPsicologos");
    }
  },

  listarNutricionistas: async (cidade) => {
    try {
      if (!cidade) cidade = getUser()?.cidade;
      const response = await api.get("/suporte/nutricionistas", {
        params: { cidade },
      });
      return extractData(response);
    } catch (error) {
      handleError(error, "suporteService.listarNutricionistas");
    }
  },

  listarTutoriais: async () => {
    try {
      const response = await api.get("/suporte/tutoriais");
      return extractData(response);
    } catch {
      return [];
    }
  },

  listarDicas: async () => {
    try {
      const response = await api.get("/suporte/dicas");
      return extractData(response);
    } catch {
      return [];
    }
  },

  buscarDica: async (id) => {
    try {
      const response = await api.get(`/suporte/dicas/${id}`);
      return extractData(response);
    } catch {
      return null;
    }
  },
};

export default api;
