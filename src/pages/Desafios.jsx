import { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import CardDesafio from '../components/CardDesafio';
import { desafioService } from '../services/api';

const Desafios = () => {
  const [desafios, setDesafios] = useState([]);
  const [meusDesafios, setMeusDesafios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaSelecionada, setAbaSelecionada] = useState('todos');
  
  // 🆕 Modal de participantes
  const [modalParticipantes, setModalParticipantes] = useState(false);
  const [participantes, setParticipantes] = useState([]);
  const [desafioSelecionado, setDesafioSelecionado] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  // Formulário
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

  // 🆕 VER PARTICIPANTES
  const handleVerParticipantes = async (desafioId) => {
    try {
      setLoading(true);
      const desafio = desafios.find(d => d.id === desafioId) || 
                      meusDesafios.find(d => d.id === desafioId);
      setDesafioSelecionado(desafio);
      
      const lista = await desafioService.listarParticipantes(desafioId);
      setParticipantes(lista);
      setModalParticipantes(true);
    } catch (error) {
      console.error('Erro ao carregar participantes:', error);
      alert('Erro ao carregar participantes');
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
      alert(error.response?.data?.mensagem || 'Erro ao participar do desafio');
    }
  };

  // 🆕 SAIR DO DESAFIO
  const handleSair = async (desafioId) => {
    if (!window.confirm('Tem certeza que deseja sair deste desafio?')) return;

    try {
      await desafioService.sair(desafioId);
      alert('Você saiu do desafio.');
      await carregarDesafios();
    } catch (error) {
      console.error('Erro ao sair:', error);
      alert('Erro ao sair do desafio');
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

  // FILTRO DAS ABAS
  let desafiosExibidos = [];

  if (abaSelecionada === 'todos') {
    desafiosExibidos = desafios.filter((d) => d.status !== 'CONCLUIDO');
  } 
  else if (abaSelecionada === 'meus') {
    desafiosExibidos = meusDesafios.filter((d) => d.status !== 'CONCLUIDO');
  }
  else if (abaSelecionada === 'concluidos') {
    desafiosExibidos = meusDesafios.filter((d) => d.status === 'CONCLUIDO');
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="Desafios" />

      <main className="pt-20 px-4 max-w-md mx-auto">

        {/* Criar Desafio */}
        <button
          onClick={() => setMostrarFormulario((prev) => !prev)}
          className="btn-primary mb-4 w-full"
        >
          {mostrarFormulario ? '✕ Cancelar' : '+ Criar Desafio'}
        </button>

        {/* FORMULÁRIO */}
        {mostrarFormulario && (
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
                  placeholder="Ex: Treinar 5x por semana"
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
                Criar e Participar
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
            Meus ({meusDesafios.filter(d => d.status !== 'CONCLUIDO').length})
          </button>

          <button
            onClick={() => setAbaSelecionada('concluidos')}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
              abaSelecionada === 'concluidos'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            ✓ Concluídos
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
                onSair={handleSair}
                onExcluir={handleExcluir}
                onConcluir={handleConcluir}
                onVerParticipantes={handleVerParticipantes}
                estaParticipando={estaParticipando(desafio.id)}
              />
            ))}
          </div>
        )}

        {/* 🆕 MODAL DE PARTICIPANTES */}
        {modalParticipantes && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-dark">
                      Participantes
                    </h3>
                    <p className="text-sm text-gray-600">
                      {desafioSelecionado?.titulo}
                    </p>
                  </div>
                  <button
                    onClick={() => setModalParticipantes(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {participantes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-5xl mb-3">👥</p>
                    <p className="text-gray-600">Nenhum participante ainda</p>
                  </div>
                ) : (
                  participantes.map((participante) => (
                    <div
                      key={participante.id}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {participante.alunoNome?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-dark">
                            {participante.alunoNome}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Participando desde{' '}
                            {new Date(
                              participante.dataParticipacao
                            ).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <span className="text-2xl">💪</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Desafios;