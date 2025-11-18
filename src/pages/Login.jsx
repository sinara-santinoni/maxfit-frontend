import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Página de Login
 * Permite o usuário entrar com email e senha
 */
const Login = () => {
  const navigate = useNavigate();
  const { login, isAluno } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validações básicas
    if (!formData.email || !formData.senha) {
      setError('Preencha todos os campos');
      setLoading(false);
      return;
    }

    // Tentar fazer login
    const result = await login(formData.email, formData.senha);
    
    if (result.success) {
      // Redirecionar conforme o tipo de usuário
      if (isAluno()) {
        navigate('/home-aluno');
      } else {
        navigate('/home-personal');
      }
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Título */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">💪 MaxFit</h1>
          <p className="text-white/90">Seu treino, seu progresso</p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-dark mb-6 text-center">
            Entrar
          </h2>

          {/* Mensagem de erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="input-field"
              />
            </div>

            {/* Senha */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Link para cadastro */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Não tem uma conta?{' '}
              <Link to="/cadastro" className="text-primary font-semibold hover:underline">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;