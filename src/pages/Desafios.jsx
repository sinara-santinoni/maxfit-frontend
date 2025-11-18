import { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import CardDesafio from '../components/CardDesafio';
import { desafioService } from '../services/api';

/**
 * Página de Desafios
 * Lista desafios, permite participar e criar novos (Aluno ou Personal)
 */
const Desafios = () => {
  const [desafios, setDesafios] = useState([]);
  const [meusDesafios, setMeusDesafios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaSelecionada, setAbaSelecionada] = useState('todos');

  // usuário logado
  const user = JSON.parse(localStorage.getItem('user'));

  // formulário de criação
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    meta: '',
    dataInicio: '',
    dataFim: '',
  });

  useEffect(() => {
    carregarDesafios();
  }, []);

  const carregarDesafios = async () => {
    try {
      setLoading(true);
      const [todosDesafios, participando] = await Promise.all([
        desafioService.listarDesafios(),
        desafioService.meusDesafios(),
      ]);

      setDesafios(todosDesafios || []);
      setMeusDesafios(participando || []);
    } catch (error) {
      console.error('Erro ao carregar desafios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleParticipar = async (desafioId) => {
    try {
      await desafioService.participar(desafioId);
      alert('Você entrou no desafio! Boa sorte! 🎉');
      await carregarDesafios();
    } catch (error) {
      console.error('Erro ao participar:', error);
      alert('Erro ao participar do desafio');
    }
  };

  const handleCriarDesafio = async (e) => {
    e.preventDefault();
    try {
      await desafioService.criarDesafio(formData);
      alert('Desafio criado com sucesso! 🏆');

      setMostrarFormulario(false);
      setFormData({
        titulo: '',
        descricao: '',
        meta: '',
        dataInicio: '',
        dataFim: '',
      });

      await carregarDesafios();
    } catch (error) {
      console.error('Erro ao criar desafio:', error);
      alert('Erro ao criar desafio');
    }
  };

  // verifica se já participa
  const estaParticipando = (desafioId) => {
    return meusDesafios.some((d) => d.id === desafioId);
  };

  const desafiosExibidos = abaSelecionada === 'todos' ? desafios : meusDesafios;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="Desafios" />

      <main className="pt-20 px-4 max-w-md mx-auto">

        {/* Botão Criar Desafio (Agora ALUNO e PERSONAL) */}
        {(user?.tipo === 'PERSONAL' || user?.tipo === 'ALUNO') && (
          <button
            onClick={() => setMostrarFormulario((prev) => !prev)}
            className="btn-primary mb-4 w-full"
          >
            {mostrarFormulario ? '✕ Cancelar' : '+ Criar Desafio'}
          </button>
        )}

        {/* Formulário de criação */}
        {(user?.tipo === 'PERSONAL' || user?.tipo === 'ALUNO') && mostrarFormulario && (
          <div className="card mb-6">
            <h3 className="text-lg font-bold text-dark mb-4">Novo Desafio</h3>

            <form onSubmit={handleCriarDesafio} className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  className="input-field resize-none"
                  rows={2}
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta *
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.meta}
                  onChange={(e) =>
                    setFormData({ ...formData, meta: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Início *
                  </label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={formData.dataInicio}
                    onChange={(e) =>
                      setFormData({ ...formData, dataInicio: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fim *
                  </label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={formData.dataFim}
                    onChange={(e) =>
                      setFormData({ ...formData, dataFim: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full">
                Salvar Desafio
              </button>

            </form>
          </div>
        )}

        {/* Abas */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setAbaSelecionada('todos')}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
              abaSelecionada === 'todos'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Todos os Desafios
          </button>

          <button
            onClick={() => setAbaSelecionada('meus')}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
              abaSelecionada === 'meus'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Meus Desafios ({meusDesafios.length})
          </button>
        </div>

        {/* Banner */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-5 mb-6 text-white shadow-lg">
          <h3 className="text-xl font-bold mb-2">🏆 Desafie-se!</h3>
          <p className="text-sm text-white/90">
            Participe dos desafios e supere seus limites!
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Lista vazia */}
        {!loading && desafiosExibidos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">🏆</p>
            <p className="text-gray-600 mb-2">
              {abaSelecionada === 'todos'
                ? 'Nenhum desafio disponível'
                : 'Você não está participando de nenhum desafio'}
            </p>
          </div>
        )}

        {/* Lista de desafios */}
        {!loading && desafiosExibidos.length > 0 && (
          <div className="space-y-4">
            {desafiosExibidos.map((desafio) => (
              <CardDesafio
                key={desafio.id}
                desafio={desafio}
                onParticipar={handleParticipar}
                estaParticipando={estaParticipando(desafio.id)}
              />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Desafios;
