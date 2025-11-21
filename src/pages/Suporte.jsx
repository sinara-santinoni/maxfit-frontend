import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import "./Suporte.css";

const Suporte = () => {

  const navigate = useNavigate();

  return (
    <div className="app">
      <Header titulo="Suporte" />

      <div className="suporte-container">

        {/* ---- Abas ---- */}
        <div className="abas-container">

          <button
            className="aba"
            onClick={() => navigate("/suporte/psicologico")}
          >
            🧠 Psicológico
          </button>

          <button
            className="aba"
            onClick={() => navigate("/suporte/nutricionista")}
          >
            🥗 Nutricionista
          </button>

          <button
            className="aba"
            onClick={() => navigate("/suporte/tutoriais")}
          >
            📘 Tutoriais
          </button>

          <button
            className="aba"
            onClick={() => navigate("/suporte/dicas")}
          >
            💡 Dicas
          </button>

        </div>

      </div>

      <BottomNav />
    </div>
  );
};

export default Suporte;
