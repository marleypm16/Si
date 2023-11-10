import Home from './componentes/Home';
import Navbar from './componentes/Navbar';
import Registros from './componentes/Registros';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CadastroEmissores from './componentes/Cadastro_emissores';
import { useEffect, useState } from 'react';
import NotaSelecionada from './componentes/NotaSelecionada';

function App() {
  const [emissores,setEmissores] = useState([])
  useEffect(()=>{

    const adquirirDados = async () => {
      try {
        const response = await fetch("http://localhost:8080/emissores", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          },
        });
      
        if (!response.ok) {
          throw new Error(`Erro na solicitação: ${response.status}`);
        }
      
        const data = await response.json();
        setEmissores(data)
      } catch (error) {
        console.log(`Ocorreu um erro:${error}`);
      }
      
    }
    adquirirDados()
  },[])
  
  return (
    <>
      <Navbar texto1='Home' texto2='cadastrar' />
      <Router>
        <Routes>
          <Route path='/' element={<Home listaEmissores={emissores}  />} />
          <Route path='/cadastroemissores' element={<CadastroEmissores />} />
          <Route path='/registros/:id' element={<Registros/>} />
          <Route path='/notaselecionada/:id' element={<NotaSelecionada/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App;
