import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Cadastro = () => {
  const navigate = useNavigate();
  const { cadastrar } = useAuth();

  const [passo, setPasso] = useState(1);
  const [tipo, setTipo] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    telefone: "",
    dataNascimento: "",
    cidade: "",

    peso: "",
    altura: "",
    objetivo: "",
    cref: "",
    especialidade: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Atualiza campos do formulário
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Botão "Sou aluno" / "Sou personal"
  const handleEscolherTipo = (escolha) => {
    setTipo(escolha); // define o tipo
    setPasso(2);      // avança para o formulário
  };

  // 🔹 Submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // validações básicas
    if (
      !formData.nome ||
      !formData.email ||
      !formData.senha ||
      !formData.cidade
    ) {
      setError("Preencha todos os campos obrigatórios");
      setLoading(false);
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (formData.senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    if (tipo === "ALUNO" && !formData.objetivo) {
      setError("Selecione um objetivo");
      setLoading(false);
      return;
    }

    // 🔹 cria objeto para enviar ao backend
    const dadosCadastro = {
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      cidade: formData.cidade,
      telefone: formData.telefone,
      dataNascimento: formData.dataNascimento,
    };

    if (tipo === "ALUNO") {
      if (formData.peso) dadosCadastro.peso = parseFloat(formData.peso);
      if (formData.altura) dadosCadastro.altura = parseFloat(formData.altura);
      dadosCadastro.objetivo = formData.objetivo;
    } else {
      dadosCadastro.cref = formData.cref;
      dadosCadastro.especialidade = formData.especialidade;
    }

    const result = await cadastrar(tipo, dadosCadastro);

    if (result.success) {
      alert("Cadastro realizado com sucesso! Faça login para continuar.");
      navigate("/login");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-secondary flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">💪 MaxFit</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">

          {/* ---------------- PASSO 1 ---------------- */}
          {passo === 1 && (
            <>
              <h2 className="text-2xl font-bold text-dark mb-6 text-center">
                Escolha seu perfil
              </h2>

              <div className="space-y-4">
                <button
                  onClick={() => handleEscolherTipo("ALUNO")}
                  className="w-full bg-white border-2 border-primary hover:bg-primary hover:text-white transition-all p-6 rounded-xl text-left group"
                >
                  <div className="flex items-center">
                    <span className="text-4xl mr-4">🏋️</span>
                    <div>
                      <h3 className="text-xl font-bold mb-1">Sou Aluno</h3>
                      <p className="text-sm text-gray-600 group-hover:text-white/90">
                        Quero treinar e acompanhar meu progresso
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleEscolherTipo("PERSONAL")}
                  className="w-full bg-white border-2 border-secondary hover:bg-secondary hover:text-white transition-all p-6 rounded-xl text-left group"
                >
                  <div className="flex items-center">
                    <span className="text-4xl mr-4">👨‍🏫</span>
                    <div>
                      <h3 className="text-xl font-bold mb-1">Sou Personal</h3>
                      <p className="text-sm text-gray-600 group-hover:text-white/90">
                        Quero gerenciar treinos dos meus alunos
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-gray-600 hover:text-primary">
                  Já tem uma conta?{" "}
                  <span className="font-semibold">Entrar</span>
                </Link>
              </div>
            </>
          )}

          {/* ---------------- PASSO 2 ---------------- */}
          {passo === 2 && (
            <>
              <button
                onClick={() => setPasso(1)}
                className="text-gray-600 hover:text-primary mb-4 flex items-center"
              >
                ← Voltar
              </button>

              <h2 className="text-2xl font-bold text-dark mb-6">
                Cadastro de {tipo === "ALUNO" ? "Aluno" : "Personal"}
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                {/* Cidade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    placeholder="Ex: Florianópolis"
                    className="input-field"
                    required
                  />
                </div>

                {/* Senha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha *
                  </label>
                  <input
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                {/* Confirmar Senha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar senha *
                  </label>
                  <input
                    type="password"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                {/* Data de nascimento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de nascimento
                  </label>
                  <input
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                {/* ALUNO */}
                {tipo === "ALUNO" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Peso (kg)
                        </label>
                        <input
                          type="number"
                          name="peso"
                          value={formData.peso}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Altura (m)
                        </label>
                        <input
                          type="number"
                          name="altura"
                          value={formData.altura}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Objetivo
                      </label>
                      <select
                        name="objetivo"
                        value={formData.objetivo}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="">Selecione...</option>
                        <option value="PERDER_PESO">Perder peso</option>
                        <option value="GANHAR_MASSA">Ganhar massa muscular</option>
                        <option value="MANTER_FORMA">Manter a forma</option>
                        <option value="CONDICIONAMENTO">Melhorar condicionamento</option>
                      </select>
                    </div>
                  </>
                )}

                {/* PERSONAL */}
                {tipo === "PERSONAL" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CREF
                      </label>
                      <input
                        type="text"
                        name="cref"
                        value={formData.cref}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Especialidade
                      </label>
                      <input
                        type="text"
                        name="especialidade"
                        value={formData.especialidade}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? "Cadastrando..." : "Criar conta"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
