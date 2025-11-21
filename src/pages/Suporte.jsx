import { useState, useEffect } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { suporteService } from "../services/api";
import "./Suporte.css";

const Suporte = () => {
  const [psicologos, setPsicologos] = useState([]);
  const [nutricionistas, setNutricionistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abaSelecionada, setAbaSelecionada] = useState("psicologico");

  useEffect(() => {
    carregarSuportes();
  }, []);

  const carregarSuportes = async () => {
    try {
      setLoading(true);
      const [psi, nutri] = await Promise.all([
        suporteService.listarPsicologos(),
        suporteService.listarNutricionistas(),
      ]);

      setPsicologos(psi);
      setNutricionistas(nutri);
    } catch (error) {
      console.error("Erro ao carregar suportes:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderProfissionais = (lista) => {
    if (loading) return <div className="loader"></div>;

    return lista.map((item) => (
      <div className="cardSuporte" key={item.id}>
        <h3>{item.nome}</h3>
        <p><strong>Especialidade:</strong> {item.especialidade}</p>
        <p><strong>Cidade:</strong> {item.cidade}</p>
        <p><strong>Telefone:</strong> {item.telefone}</p>
        <p><strong>Email:</strong> {item.email}</p>
      </div>
    ));
  };

  return (
    <div className="app">
      <Header titulo="Suporte" />

      <div className="suporte-container">

        {/* ---- Abas ---- */}
        <div className="abas-container">
          <button
            className={abaSelecionada === "psicologico" ? "aba ativa" : "aba"}
            onClick={() => setAbaSelecionada("psicologico")}
          >
            🧠 Psicológico
          </button>

          <button
            className={abaSelecionada === "nutricional" ? "aba ativa" : "aba"}
            onClick={() => setAbaSelecionada("nutricional")}
          >
            🥗 Nutricionista
          </button>

          <button
            className={abaSelecionada === "tutoriais" ? "aba ativa" : "aba"}
            onClick={() => setAbaSelecionada("tutoriais")}
          >
            📘 Tutoriais
          </button>

          <button
            className={abaSelecionada === "dicas" ? "aba ativa" : "aba"}
            onClick={() => setAbaSelecionada("dicas")}
          >
            💡 Dicas
          </button>
        </div>

        {/* ---- Conteúdo da aba ---- */}
        <div className="conteudo-aba">
          {abaSelecionada === "psicologico" && renderProfissionais(psicologos)}
          {abaSelecionada === "nutricional" && renderProfissionais(nutricionistas)}
          {abaSelecionada === "tutoriais" && <p>Em breve!</p>}
          {abaSelecionada === "dicas" && <p>Em breve!</p>}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Suporte;
