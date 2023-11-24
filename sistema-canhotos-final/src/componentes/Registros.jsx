import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const Registros = () => {
  const { id } = useParams();
  const [listaEmissores, setListaEmissores] = useState([]);
  const [emissorSelecionado, setEmissorSelecionado] = useState(null);
  const [inicio, setIncio] = useState("");
  const [fim, setFim] = useState("");
  const [data, setData] = useState("");
  const [notasDoEmissorSelecionado, setNotasDoEmissorSelecionado] = useState(
    []
  );
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    const getEmissor = async () => {
      const response = await fetch(` http://localhost:8080/emissores `, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setListaEmissores(data);
    };
    getEmissor();
  }, [id]);
  useEffect(() => {
    if (listaEmissores.length > 0) {
      const emissor = listaEmissores.find(
        (emissor) => emissor.id == id
      );
      setEmissorSelecionado(emissor);
    }
  }, [listaEmissores, id]);
  const formatarData = (data) => {
    const dataObj = new Date(data).toLocaleDateString("pt-br");
    return dataObj;
  };

  useEffect(() => {
    const getNotas = async () => {
      const response = await fetch(`http://localhost:8081/notas/emissor/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setNotasDoEmissorSelecionado(data);
    };
    getNotas();
  }, [emissorSelecionado, id, notasDoEmissorSelecionado]);

  const novas_notas = async () => {
    var validarSeCompleto = inicio && fim && data;

    if (!validarSeCompleto) {
      setErro(
        "Preencha os campos 'Início', 'Fim' e 'Data' para criar novas notas."
      );
      return;
    }

    const inicioRange = parseInt(inicio)
    const fimRange = parseInt(fim)

    if (!(inicioRange < fimRange)) {
      setErro("O valor 'Início' deve ser menor que 'Fim' para criar notas."); // Mensagem de erro para quando o início for maior que o fim
      return;
    }
    for (let i = inicioRange; i <= fimRange; i++) {
      var notas = {
        numero: i,
        status: "pendente",
        data_emissao: data,
        motorista: "",
        id_emissor: emissorSelecionado.id,
      };
      await fetch("http://localhost:8081/notas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notas),
      });
    }
    setMensagem("Notas cadastradas"); // Define a mensagem após a criação bem-sucedida das notas
  };

  return (
    <>
      <Link to="/">Voltar</Link>
      <label htmlFor="inicio">Inicio:</label>
      <input
        type="number"
        id="inicio"
        placeholder="inicio"
        onChange={(e) => setIncio(e.target.value)}
      />
      <label htmlFor="fim">Fim:</label>
      <input
        type="number"
        id="fim"
        placeholder="fim"
        onChange={(e) => setFim(e.target.value)}
      />
      <input
        type="date"
        id="data"
        name="data"
        onChange={(e) => setData(e.target.value)}
      />
      <button onClick={novas_notas}>Criar!</button>
      {mensagem && <p>{mensagem}</p>} {/* Exibe a mensagem, se houver */}
      {erro && <p>{erro}</p>}
      <div className="">
        <div className="d-flex align-items-center justify-content-center">
          {emissorSelecionado ? (
            <div className="d-flex align-items-center justify-content-center gap-5">
              <h1>{emissorSelecionado.razao_social}</h1>
              <h1>{emissorSelecionado.cnpj}</h1>
            </div>
          ) : (
            <p>Carregando...</p>
          )}
        </div>
        {notasDoEmissorSelecionado.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Número da nota</th>
                <th scope="col">Status</th>
                <th scope="col">Motorista</th>
                <th scope="col">Data</th>
              </tr>
            </thead>
            <tbody>
              {notasDoEmissorSelecionado.map((nota, index) => (
                <tr key={index}>
                  <td>
                    <a href={`/notaselecionada/${nota.id}`}>
                      {nota.numero}
                    </a>
                  </td>
                  <td>{nota.status}</td>
                  <td>{nota.motorista}</td>
                  <td>{formatarData(nota.data_emissao)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Não há notas cadastradas</p>
        )}
      </div>
    </>
  );
};

export default Registros;
