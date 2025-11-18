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
  // ✅ LOGIN - Ajustado para seu backend
  login: async (email, senha) => {
    const response = await api.post('/login', { email, senha });
    
    // Seu backend retorna: { id, nome, email, tipo, token }
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

  // ✅ CADASTRAR ALUNO - Usando endpoint /cadastro
  cadastrarAluno: async (dados) => {
    const payload = {
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
      tipo: 'ALUNO' // Força o tipo como ALUNO
    };
    
    const response = await api.post('/cadastro', payload);
    return response.data;
  },

  // ✅ CADASTRAR PERSONAL - Usando endpoint /cadastro
  cadastrarPersonal: async (dados) => {
    const payload = {
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
      tipo: 'PERSONAL' // Força o tipo como PERSONAL
    };
    
    const response = await api.post('/cadastro', payload);
    return response.data;
  },
};

// ========== TREINOS ==========

export const treinoService = {
  // ✅ LISTAR TREINOS DO ALUNO - Usando path param
  listarTreinosAluno: async (alunoId) => {
    // Se não passar alunoId, pega do localStorage
    if (!alunoId) {
      const user = JSON.parse(localStorage.getItem('user'));
      alunoId = user?.id;
    }
    
    const response = await api.get(`/treinos/${alunoId}`);
    return response.data;
  },

  // ✅ BUSCAR DETALHES DE UM TREINO
  buscarTreino: async (id) => {
    const response = await api.get(`/treinos/${id}`);
    return response.data;
  },

  // ✅ CRIAR TREINO
  criarTreino: async (dados) => {
    const response = await api.post('/treinos', dados);
    return response.data;
  },
};

// ========== DIÁRIO DE TREINO ==========

export const diarioService = {
  // ✅ CRIAR REGISTRO - Endpoint: /diarios
  criarRegistro: async (dados) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user?.id) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const payload = {
      ...dados,
      alunoId: user.id, // obrigatório para o backend
    };

    const response = await api.post('/diarios', payload);
    // Backend retorna ApiResponse<DiarioResponse>
    return response.data.data;
  },

  // ✅ LISTAR REGISTROS - Endpoint: /diarios?alunoId=...
  listarRegistros: async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user?.id) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const response = await api.get('/diarios', {
      params: { alunoId: user.id },
    });

    // Backend retorna ApiResponse<List<DiarioResponse>>
    return response.data.data || [];
  },
};

// ========== DESAFIOS ==========

export const desafioService = {
  // ✅ LISTAR TODOS OS DESAFIOS
  listarDesafios: async () => {
    const response = await api.get('/desafios');
    return response.data;
  },

  // ✅ PARTICIPAR DE UM DESAFIO
  participar: async (desafioId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await api.post(`/desafios/${desafioId}/participar`, {
      alunoId: user?.id,
      progressoAtual: 0
    });
    return response.data;
  },

  // ✅ LISTAR MEUS DESAFIOS
  meusDesafios: async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await api.get(`/desafios/${user?.id}`);
    return response.data;
  },

  // ✅ CRIAR DESAFIO
  criarDesafio: async (dados) => {
    const response = await api.post('/desafios', dados);
    return response.data;
  },
};

// ========== COMUNIDADE (NÃO IMPLEMENTADO NO BACKEND) ==========

export const comunidadeService = {
  // ⚠️ Seu backend não tem esses endpoints ainda
  // Vamos retornar dados mockados por enquanto
  
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

  criarPostagem: async (dados) => {
    console.warn('Endpoint /postagens não existe no backend');
    return { success: true, message: 'Funcionalidade em desenvolvimento' };
  },

  comentar: async (postagemId, texto) => {
    console.warn('Endpoint /postagens não existe no backend');
    return { success: true };
  },
};

// ========== SUPORTE (NÃO IMPLEMENTADO NO BACKEND) ==========

export const suporteService = {
  // ⚠️ Seu backend não tem esses endpoints ainda
  
  listarPsicologos: async () => {
    console.warn('Endpoint /suporte-psicologico não existe no backend');
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
    console.warn('Endpoint /suporte-nutricional não existe no backend');
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
