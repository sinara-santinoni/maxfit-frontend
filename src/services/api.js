import axios from 'axios';

// ✅ SUA API DO RENDER
const API_BASE_URL = 'https://max-fit-api-4bkb.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros
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
    
    const response = await api.post('/cadastro', payload);
    return response.data;
  },

  cadastrarPersonal: async (dados) => {
    const payload = {
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
      tipo: 'PERSONAL'
    };
    
    const response = await api.post('/cadastro', payload);
    return response.data;
  },
};

// ========== TREINOS ==========

export const treinoService = {
  listarTreinosAluno: async (alunoId) => {
    if (!alunoId) {
      const user = JSON.parse(localStorage.getItem('user'));
      alunoId = user?.id;
    }
    
    const response = await api.get(`/treinos/${alunoId}`);
    return response.data;
  },

  buscarTreino: async (id) => {
    const response = await api.get(`/treinos/${id}`);
    return response.data;
  },

  criarTreino: async (dados) => {
    const response = await api.post('/treinos', dados);
    return response.data;
  },
};

// ========== DIÁRIO DE TREINO ==========

export const diarioService = {
  criarRegistro: async (dados) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user?.id) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const payload = {
      ...dados,
      alunoId: user.id,
    };

    const response = await api.post('/diarios', payload);
    return response.data.data;
  },

  listarRegistros: async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user?.id) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const response = await api.get('/diarios', {
      params: { alunoId: user.id },
    });

    return response.data.data || [];
  },
};

// ========== DESAFIOS ==========

export const desafioService = {
  // LISTAR TODOS
  listarDesafios: async () => {
    const response = await api.get('/desafios');
    return response.data; // List<DesafioResponse>
  },

  // PARTICIPAR
  participar: async (desafioId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await api.post(`/desafios/${desafioId}/participar`, {
      alunoId: user?.id,
      progressoAtual: 0
    });
    return response.data;
  },

  // MEUS DESAFIOS
  meusDesafios: async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await api.get(`/desafios/${user?.id}`);
    return response.data;
  },

  // CRIAR DESAFIO (CORRIGIDO)
  criarDesafio: async (dados) => {
    const user = JSON.parse(localStorage.getItem('user'));

    const payload = {
      alunoId: user?.id,                     // obrigatório no backend
      titulo: dados.titulo,
      descricao: dados.descricao,
      meta: dados.meta,
      dataInicio: new Date(dados.dataInicio).toISOString(),
      dataFim: new Date(dados.dataFim).toISOString(),
    };

    const response = await api.post('/desafios', payload);
    return response.data;
  },
};

// ========== COMUNIDADE (mock) ==========

export const comunidadeService = {
  listarPostagens: async () => {
    console.warn('Endpoint /postagens não existe no backend');
    return [
      {
        id: 1,
        usuario: { nome: 'Sistema' },
        texto: 'Bem-vindo ao MaxFit! Em breve teremos a funcionalidade de comunidade.',
        dataHora: new Date().toISOString(),
        comentarios: []
      }
    ];
  },

  criarPostagem: async () => {
    console.warn('Endpoint /postagens não existe no backend');
    return { success: true };
  },

  comentar: async () => {
    console.warn('Endpoint /postagens não existe no backend');
    return { success: true };
  },
};

// ========== SUPORTE (mock) ==========

export const suporteService = {
  listarPsicologos: async () => {
    return [
      {
        id: 1,
        nome: 'Em breve',
        especialidade: 'Aguarde atualização',
        telefone: '',
        email: ''
      }
    ];
  },

  listarNutricionistas: async () => {
    return [
      {
        id: 1,
        nome: 'Em breve',
        especialidade: 'Aguarde atualização',
        telefone: '',
        email: ''
      }
    ];
  },
};

export default api;
