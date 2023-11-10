import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const PaginaInicial = () => {
  const [emissores, setEmissores] = useState([]);
  const [emissorSelecionado, setEmissorSelecionado] = useState('');
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
    const correspondente = emissores.find((emissor) => emissor.razao_social === emissorSelecionado);
    setEmissorCorrespondente(correspondente);
  }, [emissores, emissorSelecionado]);

  const linkToRegistros = emissorCorrespondente ? `/registros/${emissorCorrespondente.razao_social}` : '/';

  return (
    <main className="d-flex align-items-center justify-content-center gap-2">
        <select name="" id="" className="form-select w-25" onChange={(e) => setEmissorSelecionado(e.target.value)}>
          <option value="">Emissores</option>
          {emissores.length > 0 ? (
            emissores.map((emissor) => (
              <option key={emissor.id} value={emissor.razao_social}>
                {emissor.razao_social}
              </option>
            ))
          ) : (
            <option value="">Sem Emissores Cadastrados</option>
          )}
        </select>
        <Link to={linkToRegistros}>Ok!</Link>
    </main>
  );
};

export default PaginaInicial;
