import express from 'express'
import { get_notas,nova_nota,get_notas_especificas_num_nota_id_emissor, atualizarNotas, DeletarNota} from './db.js'
const app = express()
const port_notas = 8081
app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});


app.get("/notas",(req,res)=>{
    get_notas()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      console.log(error); // Adicione este log de erro
      res.status(500).send(error);
    });
})

app.get("/notas/:id",(req,res)=>{
  const idNota = req.params.id
  get_notas_especificas_num_nota_id_emissor(idNota).then(response => {
    res.status(200).send(response)
  }).catch(error =>{res.status(500).send(error)})
})


app.post("/notas/:id",(req,res)=>{
  const idNota = req.params.id
  atualizarNotas(req.body,idNota)
     .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      console.log(error); // Adicione este log de erro
      res.status(500).send(error);
    });

})


app.post("/notas",(req,res)=>{
    nova_nota(req.body)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
})


app.listen(port_notas,()=>{
    console.log("servidor Rodando")
})

app.delete("/notas/:id", (req,res) =>{
  const id_para_deletar = req.params.id
  DeletarNota(id_para_deletar)
})