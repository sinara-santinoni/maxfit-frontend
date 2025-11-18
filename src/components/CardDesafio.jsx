/**
 * Card para exibir informações de um desafio
 */
const CardDesafio = ({
  desafio,
  onParticipar,
  onExcluir,
  onConcluir,
  estaParticipando,
}) => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-dark mb-2">{desafio.titulo}</h3>
          <p className="text-sm text-gray-600 mb-3">{desafio.descricao}</p>
        </div>
        <span className="text-3xl ml-2">🏆</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Início</p>
          <p className="text-sm font-semibold">
            {new Date(desafio.dataInicio).toLocaleDateString("pt-BR")}
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Término</p>
          <p className="text-sm font-semibold">
            {new Date(desafio.dataFim).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>

      {/* Participando */}
      {estaParticipando ? (
        <div className="bg-green-50 text-green-700 py-2 px-4 rounded-lg text-center font-semibold mb-3">
          ✓ Você está participando
        </div>
      ) : (
        <button
          onClick={() => onParticipar(desafio.id)}
          className="btn-primary w-full mb-3"
        >
          Participar do Desafio
        </button>
      )}

      {/* BOTÕES DE EXCLUIR E CONCLUIR — só aparecem se o usuário criou o desafio */}
      {user?.id === desafio.alunoId && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onConcluir(desafio.id)}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold"
          >
            ✔ Concluir
          </button>

          <button
            onClick={() => onExcluir(desafio.id)}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold"
          >
            🗑 Excluir
          </button>
        </div>
      )}
    </div>
  );
};

export default CardDesafio;
