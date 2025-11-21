import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

const SuporteDicas = () => {
  const dicas = [
    {
      id: 1,
      titulo: "Mantenha a constância",
      texto: "Treinar pouco todos os dias é melhor do que exagerar e parar depois.",
    },
    {
      id: 2,
      titulo: "Beba água",
      texto: "A hidratação influencia diretamente no seu desempenho físico.",
    },
    {
      id: 3,
      titulo: "Aqueça antes de treinar",
      texto: "Isso reduz o risco de lesões e melhora sua performance.",
    },
    {
      id: 4,
      titulo: "Descanse bem",
      texto: "Dormir bem ajuda seus músculos a se recuperarem melhor.",
    },
  ];

  return (
    <div className="app">
      <Header titulo="Dicas" />

      <div className="dicas-container">
        <h2 className="titulo-secao">Melhore sua experiência no MaxFit</h2>

        {dicas.map((dica) => (
          <div className="card-dica" key={dica.id}>
            <h3>{dica.titulo}</h3>
            <p>{dica.texto}</p>
          </div>
        ))}
      </div>

      <BottomNav />

      {/* ========= CSS DENTRO DO COMPONENTE ========= */}
      <style jsx="true">{`
        .dicas-container {
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

        .card-dica {
          background: white;
          padding: 16px;
          margin-bottom: 14px;
          border-radius: 12px;
          box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.12);
        }

        .card-dica h3 {
          font-size: 18px;
          margin-bottom: 6px;
          color: #ff6a00;
        }

        .card-dica p {
          font-size: 15px;
          line-height: 1.4;
        }
      `}</style>
      {/* ============================================= */}
    </div>
  );
};

export default SuporteDicas;
