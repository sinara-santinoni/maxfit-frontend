import { useEffect, useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { personalService } from "../services/api";
import { useAuth } from "../context/AuthContext";

const GerenciarAlunos = () => {
  const { user } = useAuth();
  const [alunos, setAlunos] = useState([]);
  const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [alunoSelecionado, setAlunoSelecionado] = useState("");

  const personalId = user?.id;

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const listaAlunos = await personalService.listarAlunos(personalId);
      const disponiveis = await personalService.listarAlunosDisponiveis();

      setAlunos(listaAlunos || []);
      setAlunosDisponiveis(disponiveis || []);
    } catch (error) {
      console.error(error);
      setErro("Erro ao carregar os alunos.");
    } finally {
      setLoading(false);
    }
  };

  const vincular = async () => {
    if (!alunoSelecionado) return;

    try {
      setLoading(true);
      await personalService.vincularAluno({
        personalId,
        alunoId: Number(alunoSelecionado),
      });
      await carregarDados();
      setAlunoSelecionado("");
    } catch (error) {
      console.error(error);
      setErro("Erro ao vincular aluno.");
    } finally {
      setLoading(false);
    }
  };

  if (user?.tipo !== "PERSONAL") {
    return <p>Você não tem permissão para acessar esta página.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Meus Alunos" />

      <main className="pt-20 px-4 max-w-md mx-auto">
        {loading && <p>Carregando...</p>}
        {erro && <p className="text-red-500 text-sm mb-2">{erro}</p>}

        {/* Vincular aluno */}
        <section className="bg-white rounded-2xl p-4 mb-4 shadow-md">
          <h3 className="font-bold mb-2 text-sm">Vincular novo aluno</h3>

          <select
            value={alunoSelecionado}
            onChange={(e) => setAlunoSelecionado(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm mb-3"
          >
            <option value="">Selecione um aluno sem personal...</option>
            {alunosDisponiveis.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome} — {a.email}
              </option>
            ))}
          </select>

          <button
            onClick={vincular}
            disabled={!alunoSelecionado}
            className="w-full bg-primary text-white rounded-lg py-2 text-sm disabled:opacity-50"
          >
            Vincular aluno
          </button>
        </section>

        {/* Lista de alunos do personal */}
        <section className="bg-white rounded-2xl p-4 shadow-md">
          <h3 className="font-bold mb-3 text-sm">Alunos vinculados</h3>

          {alunos.length === 0 ? (
            <p className="text-xs text-gray-500">Nenhum aluno vinculado ainda.</p>
          ) : (
            <ul className="space-y-2">
              {alunos.map((aluno) => (
                <li
                  key={aluno.id}
                  className="border rounded-xl px-3 py-2 text-sm flex flex-col"
                >
                  <span className="font-semibold">{aluno.nome}</span>
                  <span className="text-xs text-gray-600">{aluno.email}</span>
                  <span className="text-[11px] text-gray-500">
                    Cidade: {aluno.cidade || "Não informado"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default GerenciarAlunos;
