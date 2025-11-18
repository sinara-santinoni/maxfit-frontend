import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

const MeuProgresso = () => {
  // DADOS MOCKADOS (depois você troca pelos dados da API)
  const progressoMensal = 60; // %
  const totalTreinos = 12;
  const treinosRealizados = 7;

  const pesoAtual = 72.4;
  const pesoInicial = 76.0;

  const medidas = {
    peito: 98,
    cintura: 76,
    quadril: 102,
    braco: 29,
  };

  const humorSemana = ["😀", "😀", "🙂", "😐", "😐", "😞", "😀"];

  const conquistas = [
    "🏅 1 semana sem faltar",
    "🔥 3 treinos seguidos",
    "💧 Hidratação em dia",
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="Meu Progresso" />

      <main className="pt-20 px-4 max-w-md mx-auto space-y-5">

        {/* Card Progresso Mensal */}
        <div className="card">
          <h2 className="text-lg font-bold mb-2 text-dark">Progresso Mensal</h2>

          <p className="text-sm text-gray-600 mb-2">
            Meta de {totalTreinos} treinos — você completou {treinosRealizados}
          </p>

          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
            <div
              className="bg-primary h-3 rounded-full"
              style={{ width: `${progressoMensal}%` }}
            ></div>
          </div>

          <p className="text-sm text-gray-700 mt-2 font-semibold">
            {progressoMensal}% concluído
          </p>
        </div>

        {/* Card Peso */}
        <div className="card">
          <h2 className="text-lg font-bold mb-1 text-dark">Peso</h2>
          <p className="text-gray-700 text-sm">
            Peso atual: <strong>{pesoAtual} kg</strong>
          </p>
          <p className="text-gray-600 text-sm">
            Mudança:{" "}
            <strong className={pesoAtual < pesoInicial ? "text-green-600" : "text-red-600"}>
              {(pesoAtual - pesoInicial).toFixed(1)} kg
            </strong>
          </p>
        </div>

        {/* Card Medidas */}
        <div className="card">
          <h2 className="text-lg font-bold mb-2 text-dark">Medidas Corporais</h2>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>Peito: {medidas.peito} cm</li>
            <li>Cintura: {medidas.cintura} cm</li>
            <li>Quadril: {medidas.quadril} cm</li>
            <li>Braço: {medidas.braco} cm</li>
          </ul>

          <button className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 w-full">
            + Adicionar Medição
          </button>
        </div>

        {/* Card Humor */}
        <div className="card">
          <h2 className="text-lg font-bold mb-2 text-dark">Seu Humor</h2>
          <p className="text-2xl">
            {humorSemana.map((emoji, i) => (
              <span key={i} className="mr-1">{emoji}</span>
            ))}
          </p>
          <p className="text-xs text-gray-500 mt-1">Últimos 7 dias</p>
        </div>

        {/* Card Frequência */}
        <div className="card">
          <h2 className="text-lg font-bold mb-2 text-dark">Frequência</h2>
          <p className="text-sm text-gray-700">
            Treinos realizados esta semana:
          </p>
          <p className="text-lg font-bold text-primary">
            3/4 treinos concluídos
          </p>
        </div>

        {/* Card Conquistas */}
        <div className="card">
          <h2 className="text-lg font-bold mb-2 text-dark">Conquistas</h2>
          <ul className="space-y-2">
            {conquistas.map((c, i) => (
              <li key={i} className="text-sm text-gray-700">{c}</li>
            ))}
          </ul>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default MeuProgresso;
