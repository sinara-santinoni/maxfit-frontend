import { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import CardPostagem from '../components/CardPostagem';
import { comunidadeService } from '../services/api';

const Comunidade = () => {
  const [postagens, setPostagens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [novaPostagem, setNovaPostagem] = useState('');

  useEffect(() => {
    carregarPostagens();
  }, []);

  const carregarPostagens = async () => {
    try {
      setLoading(true);
      const data = await comunidadeService.listarPostagens();
      setPostagens(data || []);
    } catch (error) {
      console.error('Erro ao carregar postagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCriarPostagem = async (e) => {
    e.preventDefault();

    if (!novaPostagem.trim()) return;

    try {
      setLoading(true);

      // 🔥 AQUI ESTÁ A CORREÇÃO: enviar APENAS o texto (string)
      await comunidadeService.criarPostagem(novaPostagem);

      setNovaPostagem('');
      setMostrarFormulario(false);

      await carregarPostagens();
    } catch (error) {
      console.error('Erro ao criar postagem:', error);
      alert('Erro ao criar postagem');
    } finally {
      setLoading(false);
    }
  };

  const handleComentar = async (postagemId, texto) => {
    try {
      await comunidadeService.comentar(postagemId, texto);
      await carregarPostagens();
    } catch (error) {
      console.error('Erro ao comentar:', error);
      alert('Erro ao comentar');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="Comunidade" />

      <main className="pt-20 px-4 max-w-md mx-auto">
        
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="btn-primary mb-6"
        >
          {mostrarFormulario ? '✕ Cancelar' : '+ Nova Postagem'}
        </button>

        {mostrarFormulario && (
          <div className="card mb-6">
            <h3 className="text-lg font-bold text-dark mb-3">
              O que você está pensando?
            </h3>

            <form onSubmit={handleCriarPostagem}>
              <textarea
                value={novaPostagem}
                onChange={(e) => setNovaPostagem(e.target.value)}
                placeholder="Compartilhe sua conquista, dica ou motivação..."
                rows="4"
                className="input-field resize-none mb-3"
                maxLength="500"
              ></textarea>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {novaPostagem.length}/500
                </span>
                <button
                  type="submit"
                  disabled={loading || !novaPostagem.trim()}
                  className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && !mostrarFormulario && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {!loading && postagens.length === 0 && (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">👥</p>
            <p className="text-gray-600 mb-2">Nenhuma postagem ainda</p>
            <p className="text-sm text-gray-500">
              Seja o primeiro a compartilhar algo!
            </p>
          </div>
        )}

        {!loading && postagens.length > 0 && (
          <div className="space-y-4">
            {postagens.map((postagem) => (
              <CardPostagem
                key={postagem.id}
                postagem={postagem}
                onComentar={handleComentar}
              />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Comunidade;
