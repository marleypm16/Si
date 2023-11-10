import { useState } from "react";
import { Link } from "react-router-dom";

const CadastroEmissores = () => {
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [mensagem, setMensagem] = useState(""); // Novo estado para controlar a exibição da mensagem
  const [erroCnpj, setErroCnpj] = useState("");
  const [erroRazaoSocial, setErroRazaoSocial] = useState("");

  const EnviarDados = (e) => {
    e.preventDefault();
    let erro = 0;

    if (!cnpj || cnpj.length !== 14 || isNaN(Number(cnpj))) {
      setErroCnpj("Digite um CNPJ válido");
      erro += 1;
    } else {
      setErroCnpj("");
    }

    if (!razaoSocial || !isNaN(Number(razaoSocial))) {
      setErroRazaoSocial("Digite uma razão social válida");
      erro += 1;
    } else {
      setErroRazaoSocial("");
    }

    if (erro === 0) {
      fetch("http://localhost:8080/emissores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ razao_social: razaoSocial, cnpj: cnpj }),
      })
        .then((response) => {
          if (response.ok) {
            setRazaoSocial("")
            setCnpj("")
            setMensagem("Emissor cadastrado"); // Define a mensagem após o cadastro bem-sucedido
          } else {
            setMensagem("Erro ao cadastrar emissor"); // Em caso de erro no cadastro
          }
        })
        .catch((error) => {
          setMensagem("Erro ao cadastrar emissor"); // Em caso de erro no cadastro
          console.error(error);
        });
    }
  };

  return (
    <>
    <Link to="/">Voltar</Link>
      <form onSubmit={EnviarDados} className="cadastro d-flex justify-content-center align-items-center flex-column gap-3">
        <h1>Cadastro de Emissores</h1>
        <div className="form-group">
          <label htmlFor="razaoSocial">Razão Social</label>
          <input
            id="razaoSocial"
            className="form-control"
            type="text"
            value={razaoSocial}
            onChange={(e) => setRazaoSocial(e.target.value)}
          />
          {erroRazaoSocial && <p style={{ color: "red" }}>{erroRazaoSocial}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="cnpj">CNPJ</label>
          <input
            id="cnpj"
            type="text"
            className="form-control"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
          />
          {erroCnpj && <p style={{ color: "red" }}>{erroCnpj}</p>}
        </div>
        <button type="submit" className="btn btn-primary">
          Enviar
        </button>
        {mensagem && <p>{mensagem}</p>} {/* Exibe a mensagem, se houver */}
        <Link to='/'>Voltar</Link>
      </form>
    </>
  );
};

export default CadastroEmissores;
