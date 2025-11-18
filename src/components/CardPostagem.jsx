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

  // ========= NOME DO AUTOR DA POSTAGEM =========
  const nomeAutor =
    postagem.usuarioNome ||              // vem do backend já pronto
    postagem.usuario?.nome ||            // fallback se vier aninhado
    'Usuário';

  const inicialAutor = nomeAutor.charAt(0).toUpperCase();

  // ========= DATA DA POSTAGEM =========
  let dataFormatada = 'Sem data';
  let horaFormatada = '';

  if (postagem.dataCriacao || postagem.dataHora) {
    const raw =
      postagem.dataCriacao || postagem.dataHora; // usa o que existir
    const dt = new Date(raw.includes('T') ? raw : raw.replace(' ', 'T'));

    if (!isNaN(dt.getTime())) {
      dataFormatada = dt.toLocaleDateString('pt-BR');
      horaFormatada = dt.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }

  return (
    <div className="card">
      {/* Cabeçalho da postagem */}
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
          {inicialAutor}
        </div>
        <div className="ml-3">
          <p className="font-semibold text-dark">{nomeAutor}</p>
          <p className="text-xs text-gray-500">
            {dataFormatada}
            {horaFormatada && <> às {horaFormatada}</>}
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
          {postagem.comentarios?.map((comentario) => {
            const nomeComentario =
              comentario.usuarioNome ||
              comentario.usuario?.nome ||
              'Usuário';

            return (
              <div key={comentario.id} className="bg-gray-50 p-3 rounded-lg mb-2">
                <p className="text-sm font-semibold text-dark mb-1">
                  {nomeComentario}
                </p>
                <p className="text-sm text-gray-700">{comentario.texto}</p>
              </div>
            );
          })}

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
