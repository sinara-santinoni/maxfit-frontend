import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

// Criar o contexto
const AuthContext = createContext({});

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provider do contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ao carregar a aplicação, verificar se há usuário salvo no localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Função de login
  const login = async (email, senha) => {
    try {
      // Chamar API de login
      const data = await authService.login(email, senha);
      
      // Salvar token e usuário
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      
      setUser(data.usuario);
      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao fazer login' 
      };
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Função de cadastro
  const cadastrar = async (tipo, dados) => {
    try {
      // Chamar serviço de cadastro conforme o tipo
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
        message: error.response?.data?.message || 'Erro ao cadastrar' 
      };
    }
  };

  // Verificar se o usuário está autenticado
  const isAuthenticated = () => {
    return !!user;
  };

  // Verificar se o usuário é aluno
  const isAluno = () => {
    return user?.tipo === 'ALUNO';
  };

  // Verificar se o usuário é personal
  const isPersonal = () => {
    return user?.tipo === 'PERSONAL';
  };

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