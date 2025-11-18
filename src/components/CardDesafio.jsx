import { useState } from 'react';

/**
 * Card para exibir informações de um desafio
 */
const CardDesafio = ({
  desafio,
  onParticipar,
  onSair,
  onExcluir,
  onConcluir,
  onVerParticipantes,
  estaParticipando,
}) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [expandido, setExpandido] = useState(false);
  
  const ehCriador = user?.id === desafio.alunoId;

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-dark">{desafio.titulo}</h3>
            {ehCriador && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
                Criador
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">{desafio.descricao}</p>
          <p className="text-sm font-semibold text-primary">
            📋 Meta: {desafio.meta}
          </p>
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

      {/* 🆕 Contador de Participantes */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👥</span>
            <div>
              <p className="text-sm font-semibold text-purple-900">
                {desafio.totalParticipantes || 0} participante(s)
              </p>
              <p className="text-xs text-purple-700">
                Criado por {desafio.alunoNome}
              </p>
            </div>
          </div>
          
          {ehCriador && (
            <button
              onClick={() => onVerParticipantes(desafio.id)}
              className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700"
            >
              Ver lista
            </button>
          )}
        </div>
      </div>

      {/* Status de Participação */}
      {estaParticipando ? (
        <div className="space-y-2">
          <div className="bg-green-50 text-green-700 py-2 px-4 rounded-lg text-center font-semibold">
            ✓ Você está participando
          </div>
          
          {!ehCriador && (
            <button
              onClick={() => onSair(desafio.id)}
              className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600"
            >
              🚪 Sair do Desafio
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={() => onParticipar(desafio.id)}
          className="btn-primary w-full mb-3"
        >
          Participar do Desafio
        </button>
      )}

      {/* Botões do Criador */}
      {ehCriador && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
          <button
            onClick={() => onConcluir(desafio.id)}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600"
          >
            ✔ Concluir
          </button>

          <button
            onClick={() => onExcluir(desafio.id)}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600"
          >
            🗑 Excluir
          </button>
        </div>
      )}

      {/* 🆕 Progresso */}
      {desafio.progressoAtual > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Progresso</span>
            <span className="font-semibold text-primary">
              {desafio.progressoAtual}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${desafio.progressoAtual}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardDesafio;