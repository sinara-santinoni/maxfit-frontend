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
          <h3 className="text-lg font-bold text-dark">{treino.nome}</h3>
          <p className="text-sm text-gray-600">{treino.objetivo}</p>
        </div>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
          {treino.diasDaSemana?.length || 0} dias
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {treino.diasDaSemana?.map((dia, index) => (
          <span 
            key={index}
            className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700"
          >
            {dia}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          Criado por: {treino.personal?.nome || 'Personal'}
        </span>
        <button className="text-primary font-semibold hover:underline">
          Ver detalhes →
        </button>
      </div>
    </div>
  );
};

export default CardTreino;