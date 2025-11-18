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

  // CONCLUIR (AJUSTADO PARA O BACKEND)
  concluirDesafio: async (desafioId) => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
      await api.post(`/desafios/${desafioId}/concluir?alunoId=${user.id}`)
    ).data;
  },

  // EXCLUIR (OK)
  excluirDesafio: async (desafioId) =>
    (await api.delete(`/desafios/${desafioId}`)).data,
};

// ========== COMUNIDADE (AGORA BATENDO NO BACK) ==========

export const comunidadeService = {
  listarPostagens: async () => {
    const resp = await api.get('/comunidade');
    // backend retorna List<PostagemResponse>
    return resp.data;
  },

  criarPostagem: async (texto) => {
    const user = JSON.parse(localStorage.getItem('user'));

    const resp = await api.post('/comunidade', {
      usuarioId: user?.id,
      texto,
    });

    // backend retorna ApiResponse<PostagemResponse>
    return resp.data.data;
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
