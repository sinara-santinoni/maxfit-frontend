import { useEffect, useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { suporteService } from "../services/api";

const Suporte = () => {
  const [aba, setAba] = useState("psicologico");
  const [psicologos, setPsicologos] = useState([]);
  const [nutricionistas, setNutricionistas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const psi = await suporteService.listarPsicologos();
      const nutri = await suporteService.listarNutricionistas();

      setPsicologos(psi?.data || []);
      setNutricionistas(nutri?.data || []);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  };

  const listaAtual =
    aba === "psicologico" ? psicologos : nutricionistas;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="Suporte" />

      {/* MAIN CONTENT */}
      <main className="pt-[90px] px-4 max-w-md mx-auto">

        {/* ABAS VERTICAIS */}
        <div className="flex flex-col gap-3 mb-6">

          <button
            onClick={() => setAba("psicologico")}
            className={`w-full py-3 rounded-xl font-semibold border shadow-sm flex items-center gap-2 px-4
              ${
                aba === "psicologico"
                  ? "bg-pink-100 text-pink-600 border-pink-300"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
          >
            🧠 Psicológico
          </button>

          <button
            onClick={() => setAba("nutricional")}
            className={`w-full py-3 rounded-xl font-semibold border shadow-sm flex items-center gap-2 px-4
              ${
                aba === "nutricional"
                  ? "bg-green-100 text-green-600 border-green-300"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
          >
            🥗 Nutricional
          </button>

          <button
            onClick={() => setAba("tutoriais")}
            className="w-full py-3 rounded-xl font-semibold border shadow-sm flex items-center gap-2 px-4 bg-white text-gray-700 border-gray-300"
          >
            🎓 Tutoriais
          </button>

          <button
            onClick={() => setAba("dicas")}
            className="w-full py-3 rounded-xl font-semibold border shadow-sm flex items-center gap-2 px-4 bg-white text-gray-700 border-gray-300"
          >
            💡 Dicas
          </button>

        </div>

        {/* CARD DE DESCRIÇÃO */}
        <div className={`rounded-xl p-4 shadow-md border mb-6
          ${
            aba === "psicologico"
              ? "bg-pink-50 border-pink-200"
              : "bg-green-50 border-green-200"
          }`}
        >
          <h3 className="font-bold mb-1 text-pink-700">
            {aba === "psicologico"
              ? "Cuide da sua saúde mental"
              : "Cuide da sua saúde nutricional"}
          </h3>

          <p className="text-gray-600 text-sm">
            {aba === "psicologico"
              ? "Entre em contato com nossos profissionais para apoio emocional."
              : "Encontre nutricionistas para te ajudar a manter uma alimentação saudável."}
          </p>
        </div>

        {/* LISTA DE PROFISSIONAIS */}
        {loading ? (
          <p className="text-center text-gray-500">
            Carregando profissionais...
          </p>
        ) : listaAtual.length === 0 ? (
          <p className="text-center text-gray-500">
            Ainda não há profissionais cadastrados.
          </p>
        ) : (
          listaAtual.map((prof, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-200 mb-4 flex gap-4 items-center"
            >
              <div className="text-4xl">👩‍⚕️</div>

              <div>
                <h3 className="font-bold text-primary">{prof.nome}</h3>
                <p className="text-gray-700 text-sm">{prof.especialidade}</p>
                <p className="text-gray-500 text-sm">{prof.cidade}</p>

                <p className="text-sm mt-2">📞 {prof.telefone}</p>
                <p className="text-sm">📧 {prof.email}</p>
              </div>
            </div>
          ))
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Suporte;
