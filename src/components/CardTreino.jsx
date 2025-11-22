import { useNavigate } from 'react-router-dom';

/**
 * Card para exibir informações de um treino
 * Usado na listagem de treinos do aluno
 */
const CardTreino = ({ treino }) => {
  const navigate = useNavigate();

  return (
    <div
      className="card cursor-pointer"
      onClick={() => navigate(`/treinos/${treino.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-dark">{treino.titulo}</h3>

          {treino.objetivo && (
            <p className="text-sm text-gray-600">{treino.objetivo}</p>
          )}
        </div>

        {/* badge de dias — removido porque não existe no backend */}
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
          {treino.exercicios?.length || 0} exercícios
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          Criado por: Personal
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation(); // impede conflito com clique no card
            navigate(`/treinos/${treino.id}`);
          }}
          className="text-primary font-semibold hover:underline"
        >
          Ver detalhes →
        </button>
      </div>
    </div>
  );
};

export default CardTreino;
