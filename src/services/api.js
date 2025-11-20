import axios from "axios";

// ============================================
//  CONFIGURAÇÃO DA API BASE
// ============================================
const API_BASE_URL = "https://max-fit-api-4bkb.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 segundos
});

// ============================================
//  INTERCEPTORS
// ============================================

// Interceptor de Request - Adiciona token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Erro na requisição:", error);
    return Promise.reject(error);
  }
);

// Interceptor de Response - Trata erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token inválido ou expirado
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    // Erro de conexão
    if (!error.response) {
      console.error("Erro de conexão com o servidor");
    }

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

// ========== SERVIÇOS DE TREINO ==========
export const treinoService = {
  /**
   * Lista todos os treinos do aluno
   */
  listarTreinos: async () => {
    try {
      const response = await api.get("/treinos");
      return response.data;
    } catch (error) {
      console.error("Erro ao listar treinos:", error);
      throw error;
    }
  },

  /**
   * Busca um treino específico por ID
   * @param {number} id - ID do treino
   */
  buscarTreino: async (id) => {
    try {
      const response = await api.get(`/treinos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar treino:", error);
      throw error;
    }
  },

  /**
   * Cria um novo treino
   * @param {Object} dados - Dados do treino
   */
  criarTreino: async (dados) => {
    try {
      const response = await api.post("/treinos", dados);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar treino:", error);
      throw error;
    }
  },

  /**
   * Atualiza um treino existente
   * @param {number} id - ID do treino
   * @param {Object} dados - Dados atualizados
   */
  atualizarTreino: async (id, dados) => {
    try {
      const response = await api.put(`/treinos/${id}`, dados);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar treino:", error);
      throw error;
    }
  },

  /**
   * Deleta um treino
   * @param {number} id - ID do treino
   */
  deletarTreino: async (id) => {
    try {
      const response = await api.delete(`/treinos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar treino:", error);
      throw error;
    }
  },
};

// ============================================
//  HELPER FUNCTIONS
// ============================================

// Função para tratar erros de forma consistente
const handleError = (error, context) => {
  console.error(`Erro em ${context}:`, error.response?.data || error.message);
  throw error;
};

// Função para extrair dados da resposta
const extractData = (response) => response.data;

// ============================================
//  AUTENTICAÇÃO E USUÁRIOS
// ============================================
export const authService = {
  // Login
  login: async (email, senha) => {
    try {
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
    } catch (error) {
      handleError(error, "authService.login");
    }
  },

  // Cadastro de Aluno
  cadastrarAluno: async (dados) => {
    try {
      const payload = {
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
        tipo: "ALUNO",
        cidade: dados.cidade,
      };
      const response = await api.post("/cadastro", payload);
      return extractData(response);
    } catch (error) {
      handleError(error, "authService.cadastrarAluno");
    }
  },

  // Cadastro de Personal
  cadastrarPersonal: async (dados) => {
    try {
      const payload = {
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
        tipo: "PERSONAL",
        cidade: dados.cidade,
      };
      const response = await api.post("/cadastro", payload);
      return extractData(response);
    } catch (error) {
      handleError(error, "authService.cadastrarPersonal");
    }
  },
};

// ============================================
//  USUÁRIOS
// ============================================
export const usuarioService = {
  // Listar todos os usuários
  listarUsuarios: async () => {
    try {
      const response = await api.get("/usuarios");
      return extractData(response);
    } catch (error) {
      handleError(error, "usuarioService.listarUsuarios");
    }
  },

  // Buscar alunos disponíveis (sem personal)
  buscarAlunosDisponiveis: async () => {
    try {
      const response = await api.get("/alunos-disponiveis");
      return extractData(response);
    } catch (error) {
      handleError(error, "usuarioService.buscarAlunosDisponiveis");
    }
  },

  // Buscar alunos do personal
  buscarAlunosDoPersonal: async (idPersonal) => {
    try {
      const response = await api.get(`/alunos-do-personal/${idPersonal}`);
      return extractData(response);
    } catch (error) {
      handleError(error, "usuarioService.buscarAlunosDoPersonal");
    }
  },

  // Vincular aluno ao personal
  vincularAluno: async (dados) => {
    try {
      const response = await api.put("/vincular-aluno", dados);
      return extractData(response);
    } catch (error) {
      handleError(error, "usuarioService.vincularAluno");
    }
  },

  // Remover aluno do personal
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
//  TREINOS
// ============================================
export const treinoService = {
  // Listar treinos do aluno
  listarTreinosAluno: async (alunoId) => {
    try {
      if (!alunoId) {
        const user = JSON.parse(localStorage.getItem("user"));
        alunoId = user?.id;
      }
      const response = await api.get(`/treinos/${alunoId}`);
      return extractData(response);
    } catch (error) {
      handleError(error, "treinoService.listarTreinosAluno");
    }
  },

  // Listar todos os treinos (para o personal)
  listarTodos: async () => {
    try {
      const response = await api.get("/treinos");
      return extractData(response);
    } catch (error) {
      handleError(error, "treinoService.listarTodos");
    }
  },

  // Buscar treino específico
  buscarTreino: async (id) => {
    try {
      const response = await api.get(`/treinos/${id}`);
      return extractData(response);
    } catch (error) {
      handleError(error, "treinoService.buscarTreino");
    }
  },

  // Criar treino
  criarTreino: async (dados) => {
    try {
      const response = await api.post("/treinos", dados);
      return extractData(response);
    } catch (error) {
      handleError(error, "treinoService.criarTreino");
    }
  },

  // Registrar treino do dia
  registrarTreino: async (dados) => {
    try {
      if (!dados) {
        const user = JSON.parse(localStorage.getItem("user"));
        dados = {
          alunoId: user?.id,
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

  // Dashboard de treinos do aluno
  dashboard: async (alunoId) => {
    try {
      if (!alunoId) {
        const user = JSON.parse(localStorage.getItem("user"));
        alunoId = user?.id;
      }
      const response = await api.get(`/treinos/dashboard/${alunoId}`);
      return response.data.data;
    } catch (error) {
      handleError(error, "treinoService.dashboard");
    }
  },
};

// ============================================
//  PROGRESSO FÍSICO
// ============================================
export const progressoService = {
  // Listar progresso do aluno
  listarProgresso: async (alunoId) => {
    try {
      if (!alunoId) {
        const user = JSON.parse(localStorage.getItem("user"));
        alunoId = user?.id;
      }
      const response = await api.get(`/progresso/${alunoId}`);
      return response.data.data || [];
    } catch (error) {
      handleError(error, "progressoService.listarProgresso");
    }
  },

  // Cadastrar progresso
  cadastrarProgresso: async (dados) => {
    try {
      const response = await api.post("/progresso", dados);
      return extractData(response);
    } catch (error) {
      handleError(error, "progressoService.cadastrarProgresso");
    }
  },

  // Atualizar progresso
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
//  PERSONAL TRAINER
// ============================================
export const personalService = {
  // Listar alunos do personal
  listarAlunosDoPersonal: async (personalId) => {
    try {
      const response = await api.get(`/personal/${personalId}/alunos`);
      return extractData(response);
    } catch (error) {
      handleError(error, "personalService.listarAlunosDoPersonal");
    }
  },

  // Listar alunos disponíveis (sem personal)
  listarAlunosDisponiveis: async () => {
    try {
      const response = await api.get("/personal/alunos-disponiveis");
      return extractData(response);
    } catch (error) {
      handleError(error, "personalService.listarAlunosDisponiveis");
    }
  },

  // Vincular aluno ao personal
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
//  DIÁRIO
// ============================================
export const diarioService = {
  // Registrar entrada no diário
  criarRegistro: async (dados) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const payload = { ...dados, alunoId: user.id };
      const response = await api.post("/diarios", payload);
      return response.data.data;
    } catch (error) {
      handleError(error, "diarioService.criarRegistro");
    }
  },

  // Listar registros do diário
  listarRegistros: async (alunoId) => {
    try {
      if (!alunoId) {
        const user = JSON.parse(localStorage.getItem("user"));
        alunoId = user?.id;
      }
      const response = await api.get("/diarios", { params: { alunoId } });
      return response.data.data || [];
    } catch (error) {
      handleError(error, "diarioService.listarRegistros");
    }
  },
};

// ============================================
//  DESAFIOS
// ============================================
export const desafioService = {
  // Listar todos os desafios
  listarDesafios: async () => {
    try {
      const response = await api.get("/desafios");
      return extractData(response);
    } catch (error) {
      handleError(error, "desafioService.listarDesafios");
    }
  },

  // Listar desafios do aluno
  meusDesafios: async (alunoId) => {
    try {
      if (!alunoId) {
        const user = JSON.parse(localStorage.getItem("user"));
        alunoId = user?.id;
      }
      const response = await api.get(`/desafios/${alunoId}`);
      return extractData(response);
    } catch (error) {
      handleError(error, "desafioService.meusDesafios");
    }
  },

  // Listar participantes de um desafio
  listarParticipantes: async (desafioId) => {
    try {
      const response = await api.get(`/desafios/${desafioId}/participantes`);
      return response.data.data || [];
    } catch (error) {
      handleError(error, "desafioService.listarParticipantes");
    }
  },

  // Criar desafio
  criarDesafio: async (dados) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const payload = {
        alunoId: user.id,
        titulo: dados.titulo,
        descricao: dados.descricao,
        meta: dados.meta,
        dataInicio: new Date(dados.dataInicio).toISOString(),
        dataFim: new Date(dados.dataFim).toISOString(),
      };
      const response = await api.post("/desafios", payload);
      return extractData(response);
    } catch (error) {
      handleError(error, "desafioService.criarDesafio");
    }
  },

  // Participar de desafio
  participar: async (desafioId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await api.post(`/desafios/${desafioId}/participar`, {
        alunoId: user.id,
        progressoAtual: 0,
      });
      return extractData(response);
    } catch (error) {
      handleError(error, "desafioService.participar");
    }
  },

  // Sair de desafio
  sair: async (desafioId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await api.delete(
        `/desafios/${desafioId}/participar/${user.id}`
      );
      return extractData(response);
    } catch (error) {
      handleError(error, "desafioService.sair");
    }
  },

  // Concluir desafio
  concluirDesafio: async (desafioId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await api.post(`/desafios/${desafioId}/concluir`, null, {
        params: { alunoId: user.id },
      });
      return extractData(response);
    } catch (error) {
      handleError(error, "desafioService.concluirDesafio");
    }
  },

  // Excluir desafio
  excluirDesafio: async (desafioId) => {
    try {
      const response = await api.delete(`/desafios/${desafioId}`);
      return extractData(response);
    } catch (error) {
      handleError(error, "desafioService.excluirDesafio");
    }
  },
};

// ============================================
//  COMUNIDADE
// ============================================
export const comunidadeService = {
  // Listar postagens
  listarPostagens: async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await api.get("/comunidade", {
        params: { usuarioId: user?.id },
      });
      return extractData(response);
    } catch (error) {
      handleError(error, "comunidadeService.listarPostagens");
    }
  },

  // Criar postagem
  criarPostagem: async (texto) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await api.post("/comunidade", {
        usuarioId: user?.id,
        texto,
      });
      return response.data.data;
    } catch (error) {
      handleError(error, "comunidadeService.criarPostagem");
    }
  },

  // Curtir postagem
  curtir: async (postagemId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await api.post(
        `/comunidade/${postagemId}/curtir`,
        null,
        { params: { usuarioId: user?.id } }
      );
      return response.data.data;
    } catch (error) {
      handleError(error, "comunidadeService.curtir");
    }
  },

  // Comentar em postagem
  comentar: async (postagemId, texto) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await api.post(`/comunidade/${postagemId}/comentarios`, {
        usuarioId: user?.id,
        texto,
      });
      return response.data.data;
    } catch (error) {
      handleError(error, "comunidadeService.comentar");
    }
  },

  // Listar comentários
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
//  SUPORTE
// ============================================
export const suporteService = {
  // Listar psicólogos por cidade
  listarPsicologos: async (cidade) => {
    try {
      if (!cidade) {
        const user = JSON.parse(localStorage.getItem("user"));
        cidade = user?.cidade;
      }
      const response = await api.get("/suporte/psicologos", {
        params: { cidade },
      });
      return response.data.data || [];
    } catch (error) {
      handleError(error, "suporteService.listarPsicologos");
    }
  },

  // Listar nutricionistas por cidade
  listarNutricionistas: async (cidade) => {
    try {
      if (!cidade) {
        const user = JSON.parse(localStorage.getItem("user"));
        cidade = user?.cidade;
      }
      const response = await api.get("/suporte/nutricionistas", {
        params: { cidade },
      });
      return response.data.data || [];
    } catch (error) {
      handleError(error, "suporteService.listarNutricionistas");
    }
  },

  // Listar tutoriais (se houver endpoint)
  listarTutoriais: async () => {
    try {
      const response = await api.get("/suporte/tutoriais");
      return extractData(response);
    } catch (error) {
      console.warn("Endpoint de tutoriais não implementado");
      return [];
    }
  },

  // Listar dicas (se houver endpoint)
  listarDicas: async () => {
    try {
      const response = await api.get("/suporte/dicas");
      return extractData(response);
    } catch (error) {
      console.warn("Endpoint de dicas não implementado");
      return [];
    }
  },

  // Buscar dica específica (se houver endpoint)
  buscarDica: async (id) => {
    try {
      const response = await api.get(`/suporte/dicas/${id}`);
      return extractData(response);
    } catch (error) {
      console.warn("Endpoint de dica específica não implementado");
      return null;
    }
  },
};

export default api;