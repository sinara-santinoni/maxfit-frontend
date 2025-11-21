import { useEffect, useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { suporteService } from "../services/api";

const SuportePsicologico = () => {
  const [psicologos, setPsicologos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarLista();
  }, []);

  const carregarLista = async () => {
    try {
      setLoading(true);
      const lista = await suporteService.listarPsicologos();
      setPsicologos(lista);
    } catch (error) {
      console.error("Erro ao carregar psicólogos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Header titulo="Psicológico" />

      <div className="psico-container">
        <h2 className="titulo-secao">Profissionais disponíveis</h2>

        {loading && <div className="loader"></div>}

        {psicologos.map((item) => (
          <div className="card-prof" key={item.id}>
            <h3>{item.nome}</h3>
            <p>
              <strong>Especialidade:</strong> {item.especialidade}
            </p>
            <p>
              <strong>Cidade:</strong> {item.cidade}
            </p>
            <p>
              <strong>Telefone:</strong> {item.telefone}
            </p>
            <p>
              <strong>Email:</strong> {item.email}
            </p>
          </div>
        ))}
      </div>

      <BottomNav />

      {/* ============= CSS DENTRO DO COMPONENTE ============= */}
      <style jsx="true">{`
        .psico-container {
          padding: 16px;
          margin-top: 90px;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }

        .titulo-secao {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 16px;
          text-align: center;
          color: #ff6a00;
        }

        .card-prof {
          background: #fff;
          padding: 16px;
          margin-bottom: 14px;
          border-radius: 12px;
          box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.12);
        }

        .loader {
          border: 4px solid #ffd6b5;
          border-top: 4px solid #ff6a00;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          animation: spin 1s linear infinite;
          margin: auto;
          margin-top: 20px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
      {/* ===================================================== */}
    </div>
  );
};

export default SuportePsicologico;
