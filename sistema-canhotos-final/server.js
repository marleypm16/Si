import express from "express"
const app = express()
const port = 8080
import  {get_emissores, get_emissores_especificos, novo_emissor}  from "./db.js";

app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

app.get('/emissores', (req, res) => {
  get_emissores()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      console.log(error); // Adicione este log de erro
      res.status(500).send(error);
    });
})
app.get('/emissores/:id',(req,res)=>{
  const idEmissor = req.params.id
  get_emissores_especificos(idEmissor)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    console.log(error); // Adicione este log de erro
    res.status(500).send(error);
  });
})
app.post('/emissores', (req, res) => {
  novo_emissor(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})



app.listen(port,()=>{
    console.log("Servidor Rodanddo")
})