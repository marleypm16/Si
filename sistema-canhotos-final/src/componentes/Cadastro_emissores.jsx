import { useState } from "react";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

// import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/themes/fluent-light/theme.css";

const CadastroEmissores = () => {
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [mensagem, setMensagem] = useState(""); // Novo estado para controlar a exibição da mensagem
  const [erroCnpj, setErroCnpj] = useState("");
  const [erroRazaoSocial, setErroRazaoSocial] = useState("");
  const [inputAlertRazaoSocial, setInputAlertRazaoSocial] = useState("");
  const [inputAlertCnpj, setInputAlertCnpj] = useState("");
  const[corCorreto,setCorCorreto] = useState(null)

  const novoEmissor = (e) => {
    e.preventDefault();
    let erro = 0;

    if (!cnpj || cnpj.length !== 14 || isNaN(Number(cnpj))) {
      setErroCnpj("Digite um CNPJ válido");
      setInputAlertCnpj("p-invalid");
      erro += 1;
    } else {
      setErroCnpj("");
      setInputAlertCnpj("");
    }

    if (!razaoSocial || !isNaN(Number(razaoSocial))) {
      setErroRazaoSocial("Digite uma razão social válida");
      setInputAlertRazaoSocial("p-invalid");
      erro += 1;
    } else {
      setErroRazaoSocial("");
      setInputAlertRazaoSocial("");
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
            setTimeout(() => {
              setMensagem("");
            }, 3000);
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
        className="cadastro d-flex justify-content-center align-items-center flex-column gap-4"
      >
        <h1>Cadastro de Emissores</h1>
        <div className="card flex justify-content-center">
          <span className="p-float-label">
            <InputText
              className={inputAlertRazaoSocial}
              id="razaoSocial"
              value={razaoSocial}
              onChange={(e) => setRazaoSocial(e.target.value)}
            />
            <label htmlFor="razaoSocial">Razão Social</label>
          </span>
        </div>
        {erroRazaoSocial && <p style={{ color: "red" }}>{erroRazaoSocial}</p>}
        <div className="card flex justify-content-center">
          <span className="p-float-label">
            <InputText
              className={inputAlertCnpj}
              id="cnpj"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
            />
            <label htmlFor="cnpj">Cnpj</label>
          </span>
        </div>
        {erroCnpj && <p style={{ color: "red" }}>{erroCnpj}</p>}
        <Button label="Cadastrar Emissor" onSubmit={novoEmissor} />

            {mensagem && <p>{mensagem}</p>} {/* Exibe a mensagem, se houver */} 
      </form>
    </>
  );
};

export default CadastroEmissores;
