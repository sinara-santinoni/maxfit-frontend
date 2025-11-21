import { useEffect, useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

const SuporteTutoriais = () => {
  const [tutoriais, setTutoriais] = useState([
    {
      id: 1,
      titulo: "Como usar o Diário de Treino",
      descricao: "Aprenda a registrar seus treinos no MaxFit de forma rápida.",
      link: "https://www.youtube.com/",
    },
    {
      id: 2,
      titulo: "Como visualizar seus treinos do Personal",
      descricao: "Passo a passo para acessar seus treinos personalizados.",
      link: "https://www.youtube.com/",
    },
    {
      id: 3,
      titulo: "Como participar de desafios",
      descricao: "Tutorial para entrar nos desafios e acompanhar seu progresso.",
      link: "https://www.youtube.com/",
    },
  ]);

  return (
    <div className="app">
      <Header titulo="Tutoriais" />

      <div className="tutorial-container">
        <h2 className="titulo-secao">Aprenda a usar o MaxFit</h2>

        {tutoriais.map((item) => (
          <div className="card-tutorial" key={item.id}>
            <h3>{item.titulo}</h3>
            <p>{item.descricao}</p>

            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-assistir"
            >
              ▶ Assistir
            </a>
          </div>
        ))}
      </div>

      <BottomNav />

      {/* ===== CSS DENTRO DO COMPONENTE ===== */}
      <style jsx="true">{`
        .tutorial-container {
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

        .card-tutorial {
          background: white;
          padding: 16px;
          margin-bottom: 16px;
          border-radius: 12px;
          box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.12);
        }

        .btn-assistir {
          margin-top: 12px;
          display: inline-block;
          background: #ff6a00;
          color: white;
          padding: 10px 16px;
          border-radius: 10px;
          font-weight: bold;
          text-decoration: none;
          transition: 0.2s;
        }

        .btn-assistir:hover {
          opacity: 0.8;
        }
      `}</style>
      {/* ================================ */}
    </div>
  );
};

export default SuporteTutoriais;
