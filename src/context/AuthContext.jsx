import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api.js';  // 🔥 EXTENSÃO .js É OBRIGATÓRIA NO VITE

// Criar o contexto
const AuthContext = createContext({});

// Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar sessão salva
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // LOGIN ---------------------------------------------------------
  const login = async (email, senha) => {
    try {
      const data = await authService.login(email, senha);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));

      setUser(data.usuario);
      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        message: error.response?.data?.mensagem || 'Erro ao fazer login',
      };
    }
  };

  // LOGOUT ---------------------------------------------------------
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // CADASTRO ------------------------------------------------------
  const cadastrar = async (tipo, dados) => {
    try {
      if (tipo === 'ALUNO') {
        await authService.cadastrarAluno(dados);
      } else {
        await authService.cadastrarPersonal(dados);
      }

      return { success: true };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return {
        success: false,
        message: error.response?.data?.mensagem || 'Erro ao cadastrar',
      };
    }
  };

  // Regras de perfil ---------------------------------------------
  const isAuthenticated = () => !!user;

  const isAluno = () => user?.tipo === 'ALUNO';

  const isPersonal = () => user?.tipo === 'PERSONAL';

  // Provider --------------------------------------------------------
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        cadastrar,
        isAuthenticated,
        isAluno,
        isPersonal,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
