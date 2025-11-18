import { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { diarioService } from '../services/api';

const DiarioTreino = () => {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  // ✅ Campos ajustados para seu backend
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    treinoExecutado: '',
    avaliacao: 3,
    objetivo: '',
    feitoHoje: '',
    comoMeSenti: '',
    imagem: ''
  });

  useEffect(() => {
    carregarRegistros();
  }, []);

  const carregarRegistros = async () => {
    try {
      setLoading(true);
      const data = await diarioService.listarRegistros();
      setRegistros(data);
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await diarioService.criarRegistro(formData);
      
      // Resetar formulário
      setFormData({
        data: new Date().toISOString().split('T')[0],
        treinoExecutado: '',
        avaliacao: 3,
        objetivo: '',
        feitoHoje: '',
        comoMeSenti: '',
        imagem: ''
      });
      
      await carregarRegistros();
      setMostrarFormulario(false);
      
      alert('Registro salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar registro:', error);
      alert('Erro ao salvar registro');
    } finally {
      setLoading(false);
    }
  };

  // Renderizar estrelas de avaliação
  const renderEstrelas = (nivel) => {
    return '⭐'.repeat(nivel) + '☆'.repeat(5 - nivel);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="Diário de Treino" />

      <main className="pt-20 px-4 max-w-md mx-auto">
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="btn-primary mb-6"
        >
          {mostrarFormulario ? '✕ Cancelar' : '+ Novo Registro'}
        </button>

        {/* Formulário */}
        {mostrarFormulario && (
          <div className="card mb-6">
            <h3 className="text-lg font-bold text-dark mb-4">
              Registrar Treino
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Data */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data
                </label>
                <input
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              {/* Treino Executado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Treino Executado *
                </label>
                <input
                  type="text"
                  name="treinoExecutado"
                  value={formData.treinoExecutado}
                  onChange={handleChange}
                  placeholder="Ex: Treino A - Peito e Tríceps"
                  className="input-field"
                  required
                />
              </div>

              {/* Avaliação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avaliação: {renderEstrelas(formData.avaliacao)}
                </label>
                <input
                  type="range"
                  name="avaliacao"
                  min="1"
                  max="5"
                  value={formData.avaliacao}
                  onChange={handleChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Ruim</span>
                  <span>Regular</span>
                  <span>Excelente</span>
                </div>
              </div>

              {/* Objetivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Objetivo
                </label>
                <input
                  type="text"
                  name="objetivo"
                  value={formData.objetivo}
                  onChange={handleChange}
                  placeholder="Ex: Ganhar massa muscular"
                  className="input-field"
                />
              </div>

              {/* Feito Hoje */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  O que fiz hoje
                </label>
                <textarea
                  name="feitoHoje"
                  value={formData.feitoHoje}
                  onChange={handleChange}
                  placeholder="Descreva como foi o treino..."
                  rows="3"
                  className="input-field resize-none"
                ></textarea>
              </div>

              {/* Como me senti */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Como me senti
                </label>
                <textarea
                  name="comoMeSenti"
                  value={formData.comoMeSenti}
                  onChange={handleChange}
                  placeholder="Como você se sentiu durante o treino?"
                  rows="2"
                  className="input-field resize-none"
                ></textarea>
              </div>

              {/* Botão salvar */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Salvar Registro'}
              </button>
            </form>
          </div>
        )}

        {/* Histórico */}
        <div>
          <h3 className="text-lg font-bold text-dark mb-4">
            Histórico de Treinos
          </h3>

          {loading && !mostrarFormulario && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          )}

          {!loading && registros.length === 0 && (
            <div className="text-center py-12">
              <p className="text-5xl mb-4">📝</p>
              <p className="text-gray-600 mb-2">Nenhum registro ainda</p>
              <p className="text-sm text-gray-500">
                Comece registrando seus treinos!
              </p>
            </div>
          )}

          {/* Lista de registros */}
          <div className="space-y-3">
            {registros.map((registro) => (
              <div key={registro.id} className="card">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-dark">{registro.treinoExecutado}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(registro.data).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                      })}
                    </p>
                  </div>
                  {registro.avaliacao && (
                    <span className="text-sm">
                      {renderEstrelas(registro.avaliacao)}
                    </span>
                  )}
                </div>
                
                {registro.objetivo && (
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Objetivo:</strong> {registro.objetivo}
                  </p>
                )}
                
                {registro.feitoHoje && (
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Feito hoje:</strong> {registro.feitoHoje}
                  </p>
                )}
                
                {registro.comoMeSenti && (
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Como me senti:</strong> {registro.comoMeSenti}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default DiarioTreino;