import { useState } from 'react';

/**
 * Card para exibir uma postagem da comunidade
 * Permite adicionar comentários
 */
const CardPostagem = ({ postagem, onComentar }) => {
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [novoComentario, setNovoComentario] = useState('');

  const handleComentar = () => {
    if (novoComentario.trim()) {
      onComentar(postagem.id, novoComentario);
      setNovoComentario('');
    }
  };

  return (
    <div className="card">
      {/* Cabeçalho da postagem */}
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
          {postagem.usuario?.nome?.charAt(0) || 'U'}
        </div>
        <div className="ml-3">
          <p className="font-semibold text-dark">{postagem.usuario?.nome}</p>
          <p className="text-xs text-gray-500">
            {new Date(postagem.dataHora).toLocaleDateString('pt-BR')} às{' '}
            {new Date(postagem.dataHora).toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>

      {/* Conteúdo da postagem */}
      <p className="text-gray-700 mb-4">{postagem.texto}</p>

      {/* Botões de ação */}
      <div className="flex items-center gap-4 pb-3 border-b border-gray-200">
        <button 
          onClick={() => setMostrarComentarios(!mostrarComentarios)}
          className="text-sm text-gray-600 hover:text-primary flex items-center gap-1"
        >
          💬 {postagem.comentarios?.length || 0} comentários
        </button>
      </div>

      {/* Seção de comentários */}
      {mostrarComentarios && (
        <div className="mt-4">
          {/* Lista de comentários */}
          {postagem.comentarios?.map((comentario) => (
            <div key={comentario.id} className="bg-gray-50 p-3 rounded-lg mb-2">
              <p className="text-sm font-semibold text-dark mb-1">
                {comentario.usuario?.nome}
              </p>
              <p className="text-sm text-gray-700">{comentario.texto}</p>
            </div>
          ))}

          {/* Formulário para adicionar comentário */}
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              placeholder="Escreva um comentário..."
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
              className="flex-1 input-field text-sm"
            />
            <button
              onClick={handleComentar}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardPostagem;