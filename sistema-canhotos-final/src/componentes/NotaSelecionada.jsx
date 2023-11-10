import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const NotaSelecionada = () => {
  const { id } = useParams();
  const [notaSelecionada, setNotaSelecionada] = useState(null);
  const [numNota, setNumNota] = useState("");
  const [moto, setMoto] = useState("");
  const [data, setData] = useState("");
  const [status, setStatus] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [imagem, setImagem] = useState("");
  const [emissor,setEmissor] = useState("")
  const [isFrameVisible, setIsFrameVisible] = useState(false);

  useEffect(() => {
    const getNotas = async () => {
      try {
        const response = await fetch(`http://localhost:8081/notas/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setNotaSelecionada(data);
      } catch (error) {
        console.error("Erro ao buscar a nota:", error);
      }
    };

    getNotas();
  }, [id]);

  useEffect(() => {
    if (notaSelecionada) {
      setStatus(notaSelecionada[0].status);
      setMoto(notaSelecionada[0].motorista);
      setData(notaSelecionada[0].data);
      setNumNota(notaSelecionada[0].numero_da_nota);
      setImagem(notaSelecionada[0].imagem_path);
      setEmissor(notaSelecionada[0].id_emissor)
    }
  }, [notaSelecionada]);

  const atualizarNotas = async () => {
    var notaAtualizada = {
      numero_da_nota: numNota,
      status: status,
      data: data,
      motorista: moto,
      imagem_path: imagem,
    };
    try {
      const response = await fetch(`http://localhost:8081/notas/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notaAtualizada),
      });

      if (response.ok) {
        setMensagem("Nota Atualizada");
      } else {
        setMensagem("Erro ao atualizar a nota");
      }
    } catch (error) {
      setMensagem("Erro ao atualizar a nota");
    }
  };

const openFile = (event) => {
    var input = event.target;

    setIsFrameVisible(true);

    var reader = new FileReader();
    reader.onload = function () {
      var dataURL = reader.result;
      setImagem(dataURL);
    };
    reader.readAsDataURL(input.files[0]);
  };

  return (
    <div>
      <Link to={`/registros/${emissor}`}>Voltar</Link>

      {notaSelecionada ? (
        <div>
          <h1>Numero da nota : </h1>
          <h2>{notaSelecionada[0].numero_da_nota}</h2>
          <select
            name=""
            id=""
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value={notaSelecionada[0].status}>
              Status Atual : {notaSelecionada[0].status}
            </option>
            <option value="Concluído">Concluído</option>
            <option value="Pendente">Pendente</option>
          </select>
          <label htmlFor="">Motorista</label>
          <input
            type="text"
            name=""
            id=""
            value={moto}
            onChange={(e) => setMoto(e.target.value)}
          />
          <label htmlFor="">Data :</label>
          <h1>{new Date(data).toLocaleDateString("pt-br")}</h1>
          <button onClick={atualizarNotas}>Atualizar!</button>
          {mensagem && <p>{mensagem}</p>}
        
        {!imagem && (
                     <input
            type="file"
            name=""
            onChange={(e) => {
              openFile(e);
            }}
            id=""
            accept=".jpg,.png"
          />
        )}

         <img src={imagem} alt="" />
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
};

export default NotaSelecionada;
