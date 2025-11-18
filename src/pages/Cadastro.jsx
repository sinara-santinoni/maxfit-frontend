import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Página de Cadastro
 * Passo 1: Escolher tipo (Aluno ou Personal)
 * Passo 2: Preencher dados e criar conta
 */
const Cadastro = () => {
  const navigate = useNavigate();
  const { cadastrar } = useAuth();
  
  const [passo, setPasso] = useState(1); // 1 = escolher tipo, 2 = formulário
  const [tipo, setTipo] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    dataNascimento: '',
    // Campos específicos para aluno
    peso: '',
    altura: '',
    objetivo: '',
    // Campos específicos para personal
    cref: '',
    especialidade: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEscolherTipo = (tipoSelecionado) => {
    setTipo(tipoSelecionado);
    setPasso(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validações
    if (!formData.nome || !formData.email || !formData.senha) {
      setError('Preencha todos os campos obrigatórios');
      setLoading(false);
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (formData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    // Preparar dados para enviar
    const dadosCadastro = {
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      telefone: formData.telefone,
      dataNascimento: formData.dataNascimento,
    };

    // Adicionar campos específicos
    if (tipo === 'ALUNO') {
      dadosCadastro.peso = parseFloat(formData.peso);
      dadosCadastro.altura = parseFloat(formData.altura);
      dadosCadastro.objetivo = formData.objetivo;
    } else {
      dadosCadastro.cref = formData.cref;
      dadosCadastro.especialidade = formData.especialidade;
    }

    // Tentar cadastrar
    const result = await cadastrar(tipo, dadosCadastro);
    
    if (result.success) {
      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      navigate('/login');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">💪 MaxFit</h1>
        </div>

        {/* Card de Cadastro */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Passo 1: Escolher tipo */}
          {passo === 1 && (
            <>
              <h2 className="text-2xl font-bold text-dark mb-6 text-center">
                Escolha seu perfil
              </h2>
              
              <div className="space-y-4">
                <button
                  onClick={() => handleEscolherTipo('ALUNO')}
                  className="w-full bg-white border-2 border-primary hover:bg-primary hover:text-white transition-all p-6 rounded-xl text-left group"
                >
                  <div className="flex items-center">
                    <span className="text-4xl mr-4">🏋️</span>
                    <div>
                      <h3 className="text-xl font-bold mb-1">Sou Aluno</h3>
                      <p className="text-sm text-gray-600 group-hover:text-white/90">
                        Quero treinar e acompanhar meu progresso
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleEscolherTipo('PERSONAL')}
                  className="w-full bg-white border-2 border-secondary hover:bg-secondary hover:text-white transition-all p-6 rounded-xl text-left group"
                >
                  <div className="flex items-center">
                    <span className="text-4xl mr-4">👨‍🏫</span>
                    <div>
                      <h3 className="text-xl font-bold mb-1">Sou Personal</h3>
                      <p className="text-sm text-gray-600 group-hover:text-white/90">
                        Quero gerenciar treinos dos meus alunos
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-gray-600 hover:text-primary">
                  Já tem uma conta? <span className="font-semibold">Entrar</span>
                </Link>
              </div>
            </>
          )}

          {/* Passo 2: Formulário */}
          {passo === 2 && (
            <>
              <button
                onClick={() => setPasso(1)}
                className="text-gray-600 hover:text-primary mb-4 flex items-center"
              >
                ← Voltar
              </button>

              <h2 className="text-2xl font-bold text-dark mb-6">
                Cadastro de {tipo === 'ALUNO' ? 'Aluno' : 'Personal'}
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campos comuns */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha *
                  </label>
                  <input
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar senha *
                  </label>
                  <input
                    type="password"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de nascimento
                  </label>
                  <input
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                {/* Campos específicos para ALUNO */}
                {tipo === 'ALUNO' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Peso (kg)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          name="peso"
                          value={formData.peso}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Altura (m)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="altura"
                          value={formData.altura}
                          onChange={handleChange}
                          placeholder="Ex: 1.75"
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Objetivo
                      </label>
                      <select
                        name="objetivo"
                        value={formData.objetivo}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="">Selecione...</option>
                        <option value="PERDER_PESO">Perder peso</option>
                        <option value="GANHAR_MASSA">Ganhar massa muscular</option>
                        <option value="MANTER_FORMA">Manter a forma</option>
                        <option value="CONDICIONAMENTO">Melhorar condicionamento</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Campos específicos para PERSONAL */}
                {tipo === 'PERSONAL' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CREF
                      </label>
                      <input
                        type="text"
                        name="cref"
                        value={formData.cref}
                        onChange={handleChange}
                        placeholder="000000-G/XX"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Especialidade
                      </label>
                      <input
                        type="text"
                        name="especialidade"
                        value={formData.especialidade}
                        onChange={handleChange}
                        placeholder="Ex: Musculação, Funcional, Crossfit..."
                        className="input-field"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? 'Cadastrando...' : 'Criar conta'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cadastro;