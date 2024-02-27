import React from 'react';
import { useNavigate, Link } from 'react-router-dom'
import LogotipoHorizontal from '../assets/logotipo-horizontal.png'
import LogoDesenvolvedor from '../assets/logo-desenvolvedor.png'


export default function Footer({...rest}){
    const Navigate = useNavigate();
    return(
        <footer {...rest}>
            <div className='content-footer'>
                <div className='controle-footer'>
                    <div className='links'>
                        Links de acesso rápido
                        <ul>
                            <li>
                                <Link to="/pesquisa">
                                    Pesquisar
                                </Link>
                            </li>
                            <li>
                                <Link to="/categoria">
                                    Categorias
                                </Link>
                            </li>
                            <li>
                                <Link to="/promocoes">
                                    Promoções
                                </Link>
                            </li>
                            <li>
                                <Link to="/planos">
                                    Contratar planos
                                </Link>
                            </li>
                            <li>
                                <Link to="/sobre-nos">
                                    Sobre nós
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="logotipo" onClick={() => Navigate.push('/')}>
                        <img src={LogotipoHorizontal} alt="Disk Aripuanã"/>
                    </div>
                </div>
            </div>
            <div className='footer-desenvolvedor' title="Conheça o desenvolvedor. wwww.eusoubrunoleandro.com.br">
                <a href="https://www.eusoubrunoleandro.com.br" target="_blank" rel="noreferrer">Desenvolvido por <img src={LogoDesenvolvedor} alt="eusoubrunoleandro"/></a>
            </div>
        </footer>
    )
}