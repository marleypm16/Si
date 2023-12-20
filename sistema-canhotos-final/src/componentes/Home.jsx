import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import "primereact/resources/themes/fluent-light/theme.css";
import { Button } from "primereact/button";
const PaginaInicial = () => {
  const [emissores, setEmissores] = useState([]);
  const [emissorSelecionado, setEmissorSelecionado] = useState("");
  const [emissorCorrespondente, setEmissorCorrespondente] = useState(null);

  useEffect(() => {
    const getEmissor = async () => {
      try {
        const response = await fetch("http://localhost:8080/emissores", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
   
        const data = await response.json();
        setEmissores(data);
      } catch (error) {
        console.error("Erro ao obter os emissores: ", error);
      }
    };

    getEmissor();
  }, []);

  useEffect(() => {
    const correspondente = emissores.find(
      (emissor) => emissor.razao_social === emissorSelecionado.razao_social
    );
    setEmissorCorrespondente(correspondente);
  }, [emissores, emissorSelecionado]);

  const linkToRegistros = emissorCorrespondente
    ? `/registros/${emissorCorrespondente.id || ""}`
    : "/";

  return (
    <main className="d-flex align-items-center justify-content-center gap-2">
      
      {emissores.length > 0 ? (
        <>
          <Dropdown
            value={emissorSelecionado}
            onChange={(e) => setEmissorSelecionado(e.value)}
            options={emissores}
            optionLabel="razao_social" // ou outra propriedade desejada
            placeholder="Selecione um emissor"
            className="w-full md:w-14rem"
          />

          <Link to={linkToRegistros}>
            <Button label="Ok!" link />
          </Link>
        </>
      ) : (
        <>
          <p value="">Sem Emissores Cadastrados</p>
          <Link to="/cadastroemissores">
            <Button label="Cadastrar Emissor" link />
          </Link>
        </>
      )}
    </main>
  );
};

export default PaginaInicial;
