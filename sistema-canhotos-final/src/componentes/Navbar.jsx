import logo from './imagens/logo_hortifrios.jpg'

function navbar ({texto1,texto2}){
    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark static-top">
            <div className="container">
                <a class="navbar-brand" href="#">
                   <a href="/"><img href="/#" src={logo} alt="Logo" height='75'/></a> 
                </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="/">{texto1}</a>
        </li>
        <li class="nav-item">
            <a href="/cadastroemissores" className="nav-link">{texto2}</a>
        </li>
      </ul>
    </div>
  </div>
  </nav>

    )
}

export default navbar