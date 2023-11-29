import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import axios from "axios";

const NotaSelecionada = () => {
  const { id } = useParams();
  const [notaSelecionada, setNotaSelecionada] = useState(null);
  const [numNota, setNumNota] = useState("");
  const [moto, setMoto] = useState("");
  const [data, setData] = useState("");
  const [status, setStatus] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [imagem, setImagem] = useState(null);
  const [emissor, setEmissor] = useState("");
  const [mostrarImagem, setMostrarImagem] = useState("");

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
      setData(notaSelecionada[0].data_emissao);
      setNumNota(notaSelecionada[0].numero);
      setEmissor(notaSelecionada[0].id_emissor);
      setMostrarImagem(notaSelecionada[0].caminho_imagem);
      console.log(notaSelecionada)
    }
  }, [notaSelecionada]);
  const formatarData = (data) => {
    const dataObj = new Date(data);
    dataObj.setDate(dataObj.getDate() + 1);
  
    const ano = dataObj.getFullYear();
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
    const dia = dataObj.getDate().toString().padStart(2, '0');
  
    return `${dia}/${mes}/${ano}`;
  };

  const atualizarNotas = async () => {
    var notaAtualizada = {
      numero: numNota,
      status: status,
      data_emissao: data,
      motorista: moto,
    };

    const formData = new FormData();
    var extensao = imagem.name.split(".").pop();
    formData.append("my-image-file", imagem, `${id}.${extensao}`);

    try {
      axios
        .post(`http://localhost:8081/notas/${id}/imagem`, formData)
        .then((res) => {
          console.log("Axios response:", res.data);
        });

      const response = await fetch(`http://localhost:8081/notas/${id}`, {
        method: "POST", // TODO: considerar a substituição pelo método PUT
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

  return (
    <div>
      <Link to={`/registros/${emissor}`}>
        <Button label="Voltar" link />
      </Link>

      {notaSelecionada ? (
        <div className="d-flex justify-content-center align-items-center flex-column ">
          <div className=" row ">
            <div className="col-6 d-flex flex-column justify-content-center align-items-start gap-3 ">
              <h1>Numero da nota : {notaSelecionada[0].numero} </h1>
              <select name="" id="" onChange={(e) => setStatus(e.target.value)}>
                <option value={notaSelecionada[0].status}>
                  Status Atual : {notaSelecionada[0].status}
                </option>
                <option value="Concluído">Concluído</option>
                <option value="Pendente">Pendente</option>
              </select>
              <div className="d-flex justify-content-center align-items-center gap-2">
                <label htmlFor="">Motorista :</label>
                <InputText
                  value={moto}
                  onChange={(e) => setMoto(e.target.value)}
                />
              </div>
              <div className="d-flex justify-content-center align-items-center gap-2">
                <label htmlFor="">Data :</label>
                <label>{formatarData(data)}</label>
              </div>
              <input
              type="file"
              name=""
              onChange={(e) => {
                setImagem(e.target.files[0]);
              }}
              id=""
              accept=".png"
            />
            </div>

            <div className="col-6">
              <h1>Imagem</h1>
                <img src={mostrarImagem} alt="" />
  
            </div>
          </div>
          <Button className="mt-5" onClick={atualizarNotas} label="Atualizar Nota" />
          {mensagem && <p>{mensagem}</p>}
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
};

export default NotaSelecionada;
