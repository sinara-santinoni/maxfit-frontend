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

  const user = JSON.parse(localStorage.getItem('user'));

  // formulário
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

  // PARTICIPAR
  const handleParticipar = async (desafioId) => {
    try {
      await desafioService.participar(desafioId);
      alert('Você entrou no desafio! 🎉');
      await carregarDesafios();
    } catch (error) {
      console.error('Erro ao participar:', error);
      alert('Erro ao participar do desafio');
    }
  };

  // CRIAR
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

  // EXCLUIR
  const handleExcluir = async (desafioId) => {
    if (!window.confirm('Tem certeza que deseja excluir este desafio?')) return;

    try {
      await desafioService.excluirDesafio(desafioId);
      alert('Desafio excluído com sucesso!');
      await carregarDesafios();
    } catch (error) {
      console.error('Erro ao excluir desafio:', error);
      alert('Erro ao excluir desafio');
    }
  };

  // CONCLUIR
  const handleConcluir = async (desafioId) => {
    try {
      await desafioService.concluirDesafio(desafioId);
      alert('Desafio concluído com sucesso! 🔥');
      await carregarDesafios();
    } catch (error) {
      console.error('Erro ao concluir desafio:', error);
      alert('Erro ao concluir desafio');
    }
  };

  // VERIFICA PARTICIPAÇÃO
  const estaParticipando = (desafioId) => {
    return meusDesafios.some((d) => d.id === desafioId);
  };

  // 🔥 AGORA COM 3 ABAS: TODOS / MEUS / CONCLUÍDOS
  let desafiosExibidos = desafios;

  if (abaSelecionada === 'meus') {
    desafiosExibidos = meusDesafios;
  }

  if (abaSelecionada === 'concluidos') {
    desafiosExibidos = desafios.filter((d) => d.status === 'CONCLUIDO');
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="Desafios" />

      <main className="pt-20 px-4 max-w-md mx-auto">

        {/* Criar Desafio */}
        {(user?.tipo === 'PERSONAL' || user?.tipo === 'ALUNO') && (
          <button
            onClick={() => setMostrarFormulario((prev) => !prev)}
            className="btn-primary mb-4 w-full"
          >
            {mostrarFormulario ? '✕ Cancelar' : '+ Criar Desafio'}
          </button>
        )}

        {/* FORMULÁRIO */}
        {(user?.tipo === 'PERSONAL' || user?.tipo === 'ALUNO') &&
          mostrarFormulario && (
            <div className="card mb-6">
              <h3 className="text-lg font-bold text-dark mb-4">
                Novo Desafio
              </h3>

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
                        setFormData({
                          ...formData,
                          dataInicio: e.target.value,
                        })
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
                        setFormData({
                          ...formData,
                          dataFim: e.target.value,
                        })
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
            Todos
          </button>

          <button
            onClick={() => setAbaSelecionada('meus')}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
              abaSelecionada === 'meus'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Meus ({meusDesafios.length})
          </button>

          <button
            onClick={() => setAbaSelecionada('concluidos')}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
              abaSelecionada === 'concluidos'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Concluídos
          </button>
        </div>

        {/* Lista */}
        {!loading && (
          <div className="space-y-4">
            {desafiosExibidos.map((desafio) => (
              <CardDesafio
                key={desafio.id}
                desafio={desafio}
                onParticipar={handleParticipar}
                onExcluir={handleExcluir}
                onConcluir={handleConcluir}
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
