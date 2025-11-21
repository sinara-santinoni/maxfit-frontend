import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { alunoPersonalService, treinoService } from "../services/api";

const CriarTreino = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [alunosVinculados, setAlunosVinculados] = useState([]);
  const [loading, setLoading] = useState(true);

  const [titulo, setTitulo] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [nivel, setNivel] = useState("");
  const [validade, setValidade] = useState("");

  const [exercicios, setExercicios] = useState([
    { nome: "", series: "", repeticoes: "", descanso: "", observacoes: "" },
  ]);

  const [erro, setErro] = useState("");

  // ============================================================
  // Carregar alunos vinculados ao personal
  // ============================================================
  useEffect(() => {
    const load = async () => {
      try {
        const lista = await alunoPersonalService.listarVinculados(user.id);
        setAlunosVinculados(lista || []);
      } catch (e) {
        setErro("Erro ao carregar alunos vinculados");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  // ============================================================
  // Adicionar exercício
  // ============================================================
  const addExercicio = () => {
    setExercicios((prev) => [
      ...prev,
      { nome: "", series: "", repeticoes: "", descanso: "", observacoes: "" },
    ]);
  };

  // Atualizar campos de exercício
  const atualizarExercicio = (index, campo, valor) => {
    const clone = [...exercicios];
    clone[index][campo] = valor;
    setExercicios(clone);
  };

  // Remover exercício
  const removerExercicio = (index) => {
    if (exercicios.length === 1) return;
    setExercicios((prev) => prev.filter((_, i) => i !== index));
  };

  // ============================================================
  // Salvar treino
  // ============================================================
  const handleSalvar = async (e) => {
    e.preventDefault();

    const alunoSelecionado = document.getElementById("alunoSelect").value;

    if (!alunoSelecionado) {
      alert("Selecione um aluno!");
      return;
    }

    if (exercicios.some((ex) => !ex.nome.trim())) {
      alert("Todos os exercícios precisam ter nome!");
      return;
    }

    const payload = {
      alunoId: Number(alunoSelecionado),
      personalId: user.id,
      titulo,
      objetivo,
      nivel,
      validade: validade || null,
      exercicios: exercicios.map((ex) => ({
        nome: ex.nome,
        series: Number(ex.series) || null,
        repeticoes: Number(ex.repeticoes) || null,
        descanso: Number(ex.descanso) || null,
        observacoes: ex.observacoes,
      })),
    };

    try {
      await treinoService.criarTreino(payload);
      alert("🔥 Treino criado com sucesso!");
      navigate("/home-personal");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar treino.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="Criar Treino" />

      <main className="pt-20 px-4 max-w-md mx-auto">

        <button
          onClick={() => navigate("/home-personal")}
          className="mb-4 text-primary font-semibold"
        >
          ← Voltar
        </button>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin w-10 h-10 border-primary border-b-2 rounded-full mx-auto"></div>
          </div>
        ) : (
          <form onSubmit={handleSalvar} className="space-y-6">

            {/* SELECIONAR ALUNO */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Aluno *</label>
              <select id="alunoSelect" className="input-field" required>
                <option value="">Selecione um aluno</option>
                {alunosVinculados.map((aluno) => (
                  <option key={aluno.id} value={aluno.id}>
                    {aluno.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* TÍTULO */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Título *</label>
              <input
                type="text"
                className="input-field"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>

            {/* Objetivo */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Objetivo</label>
              <input
                type="text"
                className="input-field"
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
              />
            </div>

            {/* Nível */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Nível</label>
              <select
                className="input-field"
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
              >
                <option value="">Não informado</option>
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>

            {/* Validade */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Validade</label>
              <input
                type="date"
                className="input-field"
                value={validade}
                onChange={(e) => setValidade(e.target.value)}
              />
            </div>

            {/* EXERCÍCIOS */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-dark">Exercícios</h3>

              {exercicios.map((ex, index) => (
                <div key={index} className="bg-white p-4 rounded-xl shadow space-y-3">

                  {/* Nome */}
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Nome do exercício *"
                    value={ex.nome}
                    onChange={(e) => atualizarExercicio(index, "nome", e.target.value)}
                    required
                  />

                  {/* Series / Repeticoes / Descanso */}
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      className="input-field"
                      placeholder="Séries"
                      value={ex.series}
                      onChange={(e) => atualizarExercicio(index, "series", e.target.value)}
                    />
                    <input
                      type="number"
                      className="input-field"
                      placeholder="Reps"
                      value={ex.repeticoes}
                      onChange={(e) => atualizarExercicio(index, "repeticoes", e.target.value)}
                    />
                    <input
                      type="number"
                      className="input-field"
                      placeholder="Descanso (seg)"
                      value={ex.descanso}
                      onChange={(e) => atualizarExercicio(index, "descanso", e.target.value)}
                    />
                  </div>

                  {/* Observações */}
                  <textarea
                    className="input-field"
                    rows={2}
                    placeholder="Observações"
                    value={ex.observacoes}
                    onChange={(e) => atualizarExercicio(index, "observacoes", e.target.value)}
                  />

                  {/* Remover */}
                  {exercicios.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removerExercicio(index)}
                      className="text-red-500 text-sm font-semibold"
                    >
                      Remover exercício
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addExercicio}
                className="btn-primary w-full"
              >
                + Adicionar Exercício
              </button>
            </div>

            {/* SALVAR */}
            <button type="submit" className="btn-primary w-full">
              Salvar Treino
            </button>
          </form>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default CriarTreino;
