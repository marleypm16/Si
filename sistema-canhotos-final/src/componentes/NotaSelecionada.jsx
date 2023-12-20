import React, { useState, useEffect, } from "react";
import { useParams, Link} from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Image } from "primereact/image";

import axios from "axios";

const NotaSelecionada = () => {
  const { id } = useParams();
  const [notaSelecionada, setNotaSelecionada] = useState(null);
  const [numNota, setNumNota] = useState("");
  const [moto, setMoto] = useState("");
  const [data, setData] = useState("");
  const [status, setStatus] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [deleteMensagem, setDeleteMensagem] = useState("");
  const [imagem, setImagem] = useState(null);
  const [emissorId, setEmissorId] = useState("");
  const [mostrarImagem, setMostrarImagem] = useState("");
  const [emissorCnpj, setEmissorCnpj] = useState(null);

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
      setEmissorId(notaSelecionada[0].id_emissor);
      setMostrarImagem(notaSelecionada[0].caminho_imagem);

      const getEmissor = async () => {
        const response = await fetch(
          ` http://localhost:8080/emissores/${emissorId} `,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        setEmissorCnpj(data);
      };
      getEmissor();
    }
  }, [notaSelecionada]);
  const formatarData = (data, formato) => {
    const dataObj = new Date(data);
    dataObj.setDate(dataObj.getDate() + 1);

    const ano = dataObj.getFullYear();
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, "0");
    const dia = dataObj.getDate().toString().padStart(2, "0");

    return `${dia}/${mes}/${ano}`;
  };
  const formatarDataPasta = (data) => {
    const dataObj = new Date(data);
    dataObj.setDate(dataObj.getDate() + 1);

    const ano = dataObj.getFullYear();
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, "0");
    const dia = dataObj.getDate().toString().padStart(2, "0");

    return `${ano}_${mes}_${dia}`;
  };

  const deletarNota = async () =>{
    const response = await fetch(`http://localhost:8081/notas/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    });
    setDeleteMensagem("Nota Deletada")
    setTimeout(() => {
      setMensagem("")
    }, 3000);
  }
  const atualizarNotas = async () => {
    const numNotaToString = String(numNota);
    var notaAtualizada = {
      numero: numNota,
      status: status,
      data_emissao: data,
      motorista: moto,
    };

    const formData = new FormData();
    var extensao = imagem.name.split(".").pop();
    formData.append(
      "my-image-file",
      imagem,
      `${formatarDataPasta(data)}_${
        emissorCnpj[0].cnpj
      }_${numNotaToString.padStart(6, "0")}.${extensao}`
    );

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
        setTimeout(() => {
          setMensagem("")
        }, 3000);
      } else {
        setMensagem("Erro ao atualizar a nota");
      }
    } catch (error) {
      setMensagem("Erro ao atualizar a nota");
    }
  };

  return (
    <div>
      <Link to={`/registros/${emissorId}`}>
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
              <div className="d-flex justify-content-center align-items-center gap-1">
                <label htmlFor="">Motorista:</label>
                <InputText
                  value={moto}
                  onChange={(e) => setMoto(e.target.value)}
                />
              </div>
              <div className="d-flex justify-content-center align-items-center gap-2">
                <label htmlFor="">Data :</label>
                <label>{formatarData(data, "/")}</label>
              </div>
              <input
                type="file"
                name="my-image-file"
                onChange={(e) => {
                  setImagem(e.target.files[0]);
                }}
                id=""
                accept=".png"
              />
            </div>

            <div className="col-6">
              <h1>Imagem</h1>
              <Image
                src=""
                alt="Image"
                width="250"
                preview
              />
            </div>
          </div>
          <Button
            className="mt-5"
            onClick={atualizarNotas}
            label="Atualizar Nota"
          />
          <Link to={`/registros/${emissorId}`}>
            <Button
              className="mt-5"
              onClick={deletarNota}
              label="deletar"
            />
          </Link>
          {mensagem && <p>{mensagem}</p>}
          {deleteMensagem && <p>{deleteMensagem}</p>}
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
};

export default NotaSelecionada;
