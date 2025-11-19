import axios from 'axios';

// ✅ SUA API DO RENDER
const API_BASE_URL = 'https://max-fit-api-4bkb.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== AUTENTICAÇÃO ==========
export const authService = {
  login: async (email, senha) => {
    const response = await api.post('/login', { email, senha });
    const data = response.data;

    return {
      token: data.token,
      usuario: {
        id: data.id,
        nome: data.nome,
        email: data.email,
        tipo: data.tipo
      }
    };
  },

  cadastrarAluno: async (dados) => {
    const payload = {
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
      tipo: 'ALUNO'
    };
    return (await api.post('/cadastro', payload)).data;
  },

  cadastrarPersonal: async (dados) => {
    const payload = {
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
      tipo: 'PERSONAL'
    };
    return (await api.post('/cadastro', payload)).data;
  },
};

// ========== TREINOS ==========
export const treinoService = {
  listarTreinosAluno: async (alunoId) => {
    if (!alunoId) alunoId = JSON.parse(localStorage.getItem('user'))?.id;
    return (await api.get(`/treinos/${alunoId}`)).data;
  },

  buscarTreino: async (id) => (await api.get(`/treinos/${id}`)).data,

  criarTreino: async (dados) => (await api.post('/treinos', dados)).data,

  // 🆕 REGISTRAR TREINO DO DIA (registro de frequência do aluno)
  registrarTreino: async (data) => {
    // se não vier data, monta usando o usuário logado
    if (!data) {
      const user = JSON.parse(localStorage.getItem('user'));
      data = {
        alunoId: user?.id,
        nomeTreino: 'Treino do dia',
        concluido: true,
      };
    }
    // endpoint correto do RegistroTreinoController
    const resp = await api.post('/treinos/registro', data);
    return resp.data; // ApiResponse<Void>
  },

  // 🆕 DASHBOARD DE PROGRESSO (semana / mês / streak / últimos treinos)
  dashboard: async (alunoId) => {
    let id = alunoId;
    if (!id) {
      const user = JSON.parse(localStorage.getItem('user'));
      id = user?.id;
    }
    const resp = await api.get(`/treinos/dashboard/${id}`);
    return resp.data.data; // ApiResponse<DashboardTreinoResponse>
  },
};

// ========== PROGRESSO FÍSICO ==========
export const progressoService = {
  listarProgresso: async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const resp = await api.get(`/progresso/${user.id}`);
    // ApiResponse<List<ProgressoResponse>>
    return resp.data.data || [];
  },
};

// ========== DIÁRIO ==========
export const diarioService = {
  criarRegistro: async (dados) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const payload = { ...dados, alunoId: user.id };
    return (await api.post('/diarios', payload)).data.data;
  },

  listarRegistros: async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await api.get('/diarios', {
      params: { alunoId: user.id }
    });
    return response.data.data || [];
  },
};

// ========== DESAFIOS ==========
export const desafioService = {
  // LISTAR TODOS
  listarDesafios: async () => (await api.get('/desafios')).data,

  // LISTAR DO ALUNO
  meusDesafios: async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return (await api.get(`/desafios/${user.id}`)).data;
  },

  // 🆕 LISTAR PARTICIPANTES
  listarParticipantes: async (desafioId) => {
    const response = await api.get(`/desafios/${desafioId}/participantes`);
    return response.data.data || [];
  },

  // PARTICIPAR
  participar: async (desafioId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return (
      await api.post(`/desafios/${desafioId}/participar`, {
        alunoId: user.id,
        progressoAtual: 0
      })
    ).data;
  },

  // 🆕 SAIR DO DESAFIO
  sair: async (desafioId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return (
      await api.delete(`/desafios/${desafioId}/participar/${user.id}`)
    ).data;
  },

  // CRIAR
  criarDesafio: async (dados) => {
    const user = JSON.parse(localStorage.getItem('user'));

    const payload = {
      alunoId: user.id,
      titulo: dados.titulo,
      descricao: dados.descricao,
      meta: dados.meta,
      dataInicio: new Date(dados.dataInicio).toISOString(),
      dataFim: new Date(dados.dataFim).toISOString(),
    };

    return (await api.post('/desafios', payload)).data;
  },

  // CONCLUIR
  concluirDesafio: async (desafioId) => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
      await api.post(`/desafios/${desafioId}/concluir?alunoId=${user.id}`)
    ).data;
  },

  // EXCLUIR
  excluirDesafio: async (desafioId) =>
    (await api.delete(`/desafios/${desafioId}`)).data,
};

// ========== COMUNIDADE ==========
export const comunidadeService = {
  // Listar postagens
  listarPostagens: async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const resp = await api.get('/comunidade', {
      params: { usuarioId: user?.id }
    });
    return resp.data;
  },
  
  // Criar postagem
  criarPostagem: async (texto) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const resp = await api.post('/comunidade', {
      usuarioId: user?.id,
      texto,
    });
    return resp.data.data;
  },
  
  // Curtir/Descurtir postagem
  curtir: async (postagemId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const resp = await api.post(`/comunidade/${postagemId}/curtir`, null, {
      params: { usuarioId: user?.id }
    });
    return resp.data.data; // true se curtiu, false se descurtiu
  },
  
  // Comentar em postagem
  comentar: async (postagemId, texto) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const resp = await api.post(`/comunidade/${postagemId}/comentarios`, {
      usuarioId: user?.id,
      texto,
    });
    return resp.data.data;
  },
  
  // Listar comentários de uma postagem
  listarComentarios: async (postagemId) => {
    const resp = await api.get(`/comunidade/${postagemId}/comentarios`);
    return resp.data;
  },
};

// ========== SUPORTE ==========
export const suporteService = {
  listarPsicologos: async () => [
    {
      id: 1,
      nome: 'Em breve',
      especialidade: 'Aguarde atualização',
      telefone: '',
      email: ''
    }
  ],
  listarNutricionistas: async () => [
    {
      id: 1,
      nome: 'Em breve',
      especialidade: 'Aguarde atualização',
      telefone: '',
      email: ''
    }
  ],
};

export default api;
