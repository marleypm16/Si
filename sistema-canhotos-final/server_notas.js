import express from "express";
import multer from "multer";
import fs from "fs";

import {
  get_notas,
  nova_nota,
  get_notas_especificas_num_nota_id_emissor,
  atualizarNotas,
  DeletarNota,
  getNotaPorNumero,
} from "./db.js";
const app = express();
const port_notas = 8081;
// const data = new Date()
// const imageUploadPathMouth = `//172.16.114.252/corp/FINANCEIRO/CR e CP/Teste_Canhotos/${data.getMonth() + 1}`
const imageUploadPath =
  "//172.16.114.252/corp/FINANCEIRO/CR e CP/Teste_Canhotos";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const filename = file.originalname;
    const monthFromFilename = extrairMesDoFileName(filename);
    const yearfromfilename = extrairAnoDoFileName(filename);
    console.log(yearfromfilename);

    const pastaMes = `//172.16.114.252/corp/PUBLIC/Canhotos/${yearfromfilename}/${monthFromFilename}`;
    const pastaAno = `//172.16.114.252/corp/PUBLIC/Canhotos/${yearfromfilename}`;

    if (!fs.existsSync(pastaAno)) {
      // Create the month folder if it doesn't exist
      fs.mkdirSync(pastaAno);
    }
    if (!fs.existsSync(pastaMes)) {
      fs.mkdirSync(pastaMes);
    }

    cb(null, pastaMes);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    console.log(file.originalname);
  },
});

const imageUpload = multer({ storage: storage });

function extrairMesDoFileName(filename) {
  const parts = filename.split("_");
  console.log(parts);
  if (parts) {
    const datePart = parts[1];
    console.log(datePart);
    return datePart;
  }
  return null;
}

function extrairAnoDoFileName(filename) {
  const parts = filename.split("_");
  if (parts) {
    const datePart = parts[0];
    return datePart;
  }
  return null;
}

app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS,PATCH"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  next();
});

app.get("/notas", (req, res) => {
  get_notas()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      console.log(error); // Adicione este log de erro
      res.status(500).send(error);
    });
});

app.get("/notas/emissor/:id", (req, res) => {
  const idNota = req.params.id;
  get_notas_especificas_num_nota_id_emissor(idNota)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
app.get("/notas/:id", (req, res) => {
  const idNota = req.params.id;
  getNotaPorNumero(idNota)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.post("/notas/:id", (req, res) => {
  const idNota = req.params.id;
  atualizarNotas(
    req.body,
    idNota,
    `//172.16.114.252/corp/PUBLIC/Canhotos/2023/12/2023_12_01_12345678910112_000001.png`
  )
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      console.log(error); // Adicione este log de erro
      res.status(500).send(error);
    });
});

app.post("/notas", (req, res) => {
  nova_nota(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
app.post(
  "/notas/:id/imagem",
  imageUpload.array("my-image-file"),
  (req, res) => {
    console.log("POST request received to /notas/:id/imagem.");
    console.log("Axios POST body: ", req.body);
    res.status(200).send("oi");
  }
);

app.listen(port_notas, () => {
  console.log("servidor Rodando");
});

app.delete("/notas/:id", (req, res) => {
  const id_para_deletar = req.params.id;
  DeletarNota(id_para_deletar);
});
