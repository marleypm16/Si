import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

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
        console.log(data);
        setEmissores(data);
      } catch (error) {
        console.error("Erro ao obter os emissores: ", error);
      }
    };

    getEmissor();
  }, []);

  useEffect(() => {
    const correspondente = emissores.find(
      (emissor) => emissor.razao_social === emissorSelecionado
    );
    setEmissorCorrespondente(correspondente);
  }, [emissores, emissorSelecionado]);

  const linkToRegistros = emissorCorrespondente
    ? `/registros/${emissorCorrespondente.id}`
    : "/";

  return (
    <main className="d-flex align-items-center justify-content-center gap-2">
      {emissores.length > 0 ? (
        <>
          <Dropdown
            value={emissorSelecionado}
            onChange={(e) => setEmissorSelecionado(e.target.value)}
            options={emissores.map((em) => ({ value: em.razao_social }))}
            optionLabel="razao_social" // ou outra propriedade desejada
            placeholder="Selecione um emissor"
            className="w-full md:w-14rem"
          />

          <Link to={linkToRegistros}>Ok!</Link>
        </>
      ) : (
        <>
          <p value="">Sem Emissores Cadastrados</p>
          <Link to="/cadastroemissores">Ok!</Link>
        </>
      )}
    </main>
  );
};

export default PaginaInicial;
