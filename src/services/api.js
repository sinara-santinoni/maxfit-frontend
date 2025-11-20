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

// ============================================
//  INTERCEPTOR — TOKEN NO HEADER
// ============================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
//  INTERCEPTOR — SESSÃO EXPIRADA
// ============================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ============================================
//  AUTENTICAÇÃO
// ============================================
export const authService = {
  // LOGIN
  login: async (email, senha) => {
    const response = await api.post("/login", { email, senha });
    const data = response.data;

    return {
      token: data.token,
      usuario: {
        id: data.id,
        nome: data.nome,
        email: data.email,
        tipo: data.tipo,
        cidade: data.cidade,
      },
    };
  },

  // CADASTRAR ALUNO
  cadastrarAluno: async (dados) => {
    const payload = {
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
      tipo: "ALUNO",
      cidade: dados.cidade,
    };
    return (await api.post("/cadastro", payload)).data;
  },

  // CADASTRAR PERSONAL
  cadastrarPersonal: async (dados) => {
    const payload = {
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
      tipo: "PERSONAL",
      cidade: dados.cidade,
    };
    return (await api.post("/cadastro", payload)).data;
  },
};

// ============================================
//  TREINOS
// ============================================
export const treinoService = {
  listarTreinosAluno: async (alunoId) => {
    if (!alunoId) alunoId = JSON.parse(localStorage.getItem("user"))?.id;
    return (await api.get(`/treinos/${alunoId}`)).data;
  },

  buscarTreino: async (id) => (await api.get(`/treinos/${id}`)).data,

  criarTreino: async (dados) => (await api.post("/treinos", dados)).data,

  registrarTreino: async (data) => {
    if (!data) {
      const user = JSON.parse(localStorage.getItem("user"));
      data = {
        alunoId: user?.id,
        nomeTreino: "Treino do dia",
        concluido: true,
      };
    }
    return (await api.post("/treinos/registro", data)).data;
  },

  dashboard: async (alunoId) => {
    let id = alunoId;
    if (!id) id = JSON.parse(localStorage.getItem("user"))?.id;
    const resp = await api.get(`/treinos/dashboard/${id}`);
    return resp.data.data;
  },
};

// ============================================
//  PROGRESSO FÍSICO
// ============================================
export const progressoService = {
  listarProgresso: async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const resp = await api.get(`/progresso/${user.id}`);
    return resp.data.data || [];
  },
};

// ============================================
//  DIÁRIO
// ============================================
export const diarioService = {
  criarRegistro: async (dados) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const payload = { ...dados, alunoId: user.id };
    const resp = await api.post("/diarios", payload);
    return resp.data.data;
  },

  listarRegistros: async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const response = await api.get("/diarios", {
      params: { alunoId: user.id },
    });
    return response.data.data || [];
  },
};

// ============================================
//  DESAFIOS
// ============================================
export const desafioService = {
  listarDesafios: async () => (await api.get("/desafios")).data,

  meusDesafios: async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return (await api.get(`/desafios/${user.id}`)).data;
  },

  listarParticipantes: async (id) => {
    const resp = await api.get(`/desafios/${id}/participantes`);
    return resp.data.data || [];
  },

  participar: async (desafioId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    return (
      await api.post(`/desafios/${desafioId}/participar`, {
        alunoId: user.id,
        progressoAtual: 0,
      })
    ).data;
  },

  sair: async (desafioId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    return (
      await api.delete(`/desafios/${desafioId}/participar/${user.id}`)
    ).data;
  },

  criarDesafio: async (dados) => {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
      await api.post("/desafios", {
        alunoId: user.id,
        titulo: dados.titulo,
        descricao: dados.descricao,
        meta: dados.meta,
        dataInicio: new Date(dados.dataInicio).toISOString(),
        dataFim: new Date(dados.dataFim).toISOString(),
      })
    ).data;
  },

  concluirDesafio: async (id) => {
    const user = JSON.parse(localStorage.getItem("user"));
    return (await api.post(`/desafios/${id}/concluir?alunoId=${user.id}`)).data;
  },

  excluirDesafio: async (id) => (await api.delete(`/desafios/${id}`)).data,
};

// ============================================
//  COMUNIDADE
// ============================================
export const comunidadeService = {
  listarPostagens: async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const resp = await api.get("/comunidade", {
      params: { usuarioId: user?.id },
    });
    return resp.data;
  },

  criarPostagem: async (texto) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const resp = await api.post("/comunidade", {
      usuarioId: user?.id,
      texto,
    });
    return resp.data.data;
  },

  curtir: async (postagemId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const resp = await api.post(
      `/comunidade/${postagemId}/curtir`,
      null,
      { params: { usuarioId: user?.id } }
    );
    return resp.data.data;
  },

  comentar: async (postagemId, texto) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const resp = await api.post(`/comunidade/${postagemId}/comentarios`, {
      usuarioId: user?.id,
      texto,
    });
    return resp.data.data;
  },

  listarComentarios: async (postagemId) => {
    const resp = await api.get(`/comunidade/${postagemId}/comentarios`);
    return resp.data;
  },
};

// ============================================
//  SUPORTE (BUSCA PROFISSIONAIS POR CIDADE)
// ============================================
export const suporteService = {
  listarPsicologos: async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const resp = await api.get("/suporte/psicologos", {
      params: { cidade: user?.cidade },
    });
    return resp.data.data || [];
  },

  listarNutricionistas: async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const resp = await api.get("/suporte/nutricionistas", {
      params: { cidade: user?.cidade },
    });
    return resp.data.data || [];
  },
};

// ============================================
//  PERSONAL (NOVO)
// ============================================
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
    const resp = await api.post("/personal/vincular-aluno", {
      personalId,
      alunoId,
    });
    return resp.data.data;
  },
};

export default api;
