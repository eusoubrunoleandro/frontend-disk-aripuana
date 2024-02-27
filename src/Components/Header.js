import React, { useState, useContext, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'
import '../css/Main.css'

import Logotipo from '../assets/logotipo-completo-fundo-preto.png'

import LogoBranco from '../assets/Logo_horizontal_bgbranco.png'
import IconeUsuario from '../assets/icone-usuario.png'
import { AuthContext } from '../context/AuthContext'
import IconClose from '../assets/icon-x-close.png';

export default function Header({ title = 'Disk Aripuanã | O seu guia comercial',  onPesquisa = () => {}}){

    const navigate = useNavigate();
    const [ showMenu, StatusMenu ] = useState(false)
    const location = useLocation();
    const { Sair, dadosSessao : { Autenticado, dadosSessaoAtual } } = useContext(AuthContext)
    const [OpenMenuContaUsuario, AlterarStatusMenuContaUsuario] = useState(false);
    const [ valorInput, alterarValorInput ] = useState(null);
    const inputPesquisar = useRef();
    document.title = title    

    function SubmitPesquisa(data){
        data.preventDefault();
        onPesquisa({pesquisar: data.target.pesquisar.value})
    }

    document.onkeydown = function(e){
        if(e.key === "Escape") StatusMenu(false)
    }

    const _alterandoValorInput = (valor) => {
        if(valor === ''){
            alterarValorInput(null)
        }
        else{
            alterarValorInput(valor)
        }
    }

    const limparCampor = () => {
        inputPesquisar.current.value = "";
        alterarValorInput(null)
        onPesquisa({pesquisar: ''})
    }

    const Menu = () => {
        return(
            <>
            <div className='menu'>
                <div className='logo-menu'>
                    <Link to={'/'}>
                        <img src={LogoBranco} alt="Logo do Disk Aripuana" />
                    </Link>
                </div>
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
                    <li>
                        <Link to="/programa-de-empreendedores-ariapuana">
                            Empreendedores de aripuanã
                        </Link>
                    </li>
                </ul>
            </div>
            <div className='overlay' onClick={() => StatusMenu(content => !content )}/>
            </>
        )
    }

    const MenuContaUsuario = () => {

        function verificarLink(url){
            if(url === location.pathname){
                return 'url-ativo'
            }
        }

        if(!OpenMenuContaUsuario){
            return <></>
        }

        return(
            <>
            <div className={ `links-menu` }>
                <ul className='box'>
                    <li className={verificarLink('/cliente/meusdados')}>
                        <Link to={'/cliente/meusdados'}>
                            Meus dados
                        </Link>
                    </li>

                    <li className={verificarLink('/cliente/meusplanos')}>
                        <Link to={'/cliente/meusplanos'}>
                            Meu plano
                        </Link>
                    </li>

                    <li className={verificarLink('/cliente/minhaspromocoes')}>
                        <Link to={'/cliente/minhaspromocoes'}>
                            Minhas promoções
                        </Link>
                    </li>

                    <li className={verificarLink('/cliente/minhaseguranca')}>
                        <Link to={'/cliente/minhaseguranca'}>
                            Minha segurança
                        </Link>
                    </li>

                    {
                        dadosSessaoAtual.tipo_acesso === "1" ? <></> : 
                        <li className={verificarLink('/administrador')}>
                            <Link to={'/administrador'}>
                                Área administradora
                            </Link>
                        </li>
                    }

                    <li onClick={() => Sair()}>
                        <Link to={'/'} className='sair'>
                            Sair da conta
                        </Link>
                    </li>

                </ul>
            </div>
            <div className='overlay' onClick={() => AlterarStatusMenuContaUsuario(prev => !prev)}/>
            </>
        )
    }

    return(
    <>
        <div id="space-nav"/>
        <header>
            <div className='controle'>
                {
                    !showMenu ? <></> : 
                    <Menu/>
                }
                
                <div className={`btn-menu ${showMenu ? "btn-menu-actived" : ""}`} onClick={() => StatusMenu(content => !content )}>
                    <div/>
                    <div/>
                    <div/>
                </div>

                <div className='image-logo'>
                    <Link to={'/'}>
                        <img src={Logotipo} alt="Logo do Disk Aripuana" />
                    </Link>
                </div>

                <div className='pesquisar'>
                    <form onSubmit={(e) => SubmitPesquisa(e)} >
                    <input
                        name="pesquisar" 
                        placeholder="Digite algo para pesquisar"
                        onChange={(e) => _alterandoValorInput(e.target.value)}
                        ref={inputPesquisar}
                    />
                    {
                        valorInput === null ? <></> :
                        <div className='btn-clear' title="Limpar valor" onClick={() => limparCampor()}><img src={IconClose} alt=''/></div>
                    }
                    </form>
                </div>
                
                {
                    !Autenticado ? 
                    <div className='painel-usuario'>
                        <div className='show' onClick={() => navigate('/login')}>
                            <span>Entrar</span>
                        </div>
                    </div>
                    :
                    <div className='painel-usuario'>
                        <div className='show icon-usuario' onClick={() => AlterarStatusMenuContaUsuario(prev => !prev)}>
                            <img src={dadosSessaoAtual.image_perfil === null ? IconeUsuario : dadosSessaoAtual.image_perfil} alt="" />
                        </div>
                        <MenuContaUsuario/>
                    </div>
                    
                }
            </div>
        </header>
    </>
    )
}