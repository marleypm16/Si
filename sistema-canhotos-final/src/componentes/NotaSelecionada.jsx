import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
    }
  }, [notaSelecionada]);

  const atualizarNotas = async () => {
    var notaAtualizada = {
      numero: numNota,
      status: status,
      data_emissao: data,
      motorista: moto,
    };
    console.log(imagem);
    const formData = new FormData();
    var extensao = imagem.name.split(".").pop()
    formData.append("my-image-file", imagem, `${id}.${extensao}`);

    try {
      axios
        .post(`http://localhost:8081/notas/${id}/imagem`, formData)
        .then((res) => {
          console.log("Axios response: ", console.log(res.data));
        });
      const response = await fetch(`http://localhost:8081/notas/${id}`, {
        method: "POST", //TODO colocar o método put
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


  // const handleChange = (e) => {
  //   const formData = new FormData();
  //   var extensao = e.target.files[0].name.split(".").pop()
  //   formData.append("my-image-file", e.target.files[0], `${id}.${extensao}`);
  //   setImagem(formData);
  // };

  return (
    <div>
      <Link to={`/registros/${emissor}`}>Voltar</Link>

      {notaSelecionada ? (
        <div>
          <h1>Numero da nota : </h1>
          <h2>{notaSelecionada[0].numero}</h2>
          <select name="" id="" onChange={(e) => setStatus(e.target.value)}>
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

          <input
            type="file"
            name=""
            onChange={(e) => setImagem(e.target.files[0])}
            id=""
            accept=".png"
          />
          {imagem ? <img src={URL.createObjectURL(imagem)} alt="" /> : "imagem nao selecionada"}
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
};

export default NotaSelecionada;
