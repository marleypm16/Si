import { useState } from "react";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const CadastroEmissores = () => {
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [mensagem, setMensagem] = useState(""); // Novo estado para controlar a exibição da mensagem
  const [erroCnpj, setErroCnpj] = useState("");
  const [erroRazaoSocial, setErroRazaoSocial] = useState("");

  const novoEmissor = (e) => {
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
            setRazaoSocial("");
            setCnpj("");
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
      <Link to="/">
        <Button label="Voltar" link />
      </Link>
      <form
        onSubmit={novoEmissor}
        className="cadastro d-flex justify-content-center align-items-center flex-column gap-3"
      >
        <h1>Cadastro de Emissores</h1>
        <span className="p-float-label">
          <InputText
            id="username"
            value={razaoSocial}
            onChange={(e) => setRazaoSocial(e.target.value)}
          />
          <label htmlFor="username">Username</label>
        </span>
        {erroRazaoSocial && <p style={{ color: "red" }}>{erroRazaoSocial}</p>}
        <div className="form-group">
          <span className="p-float-label">
            <InputText
              id="username"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
            />
            <label htmlFor="username">Cnpj</label>
          </span>
          {erroCnpj && <p style={{ color: "red" }}>{erroCnpj}</p>}
        </div>
        <Button id="1" label="Cadastrar Emissor" severity="info" />
        {mensagem && <p>{mensagem}</p>} {/* Exibe a mensagem, se houver */}
      </form>
    </>
  );
};

export default CadastroEmissores;
