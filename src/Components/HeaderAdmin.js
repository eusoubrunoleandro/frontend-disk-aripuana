import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import '../css/Main.css'

import { Form } from '@unform/web'
import InputSearch from './Forms/InputSearch'

import Logo from '../assets/Logo_horizontal_bgbranco.png'
import IconeUsuario from '../assets/icone-usuario.png'

import iconNovo from '../assets/icon-novo.png'

export default function HeaderAdmin({
    clear = false, 
    title = 'Disk Aripuanã | O seu guia comercial', 
    onPesquisa = () => {},
    onClickBotaoNovo = () => {},
    mostrarBotaoNovo = false
}){
    const navigate = useNavigate();
    const [ showMenu, StatusMenu ] = useState(false)
    document.title = title

    function SubmitPesquisa(data){
        onPesquisa(data)
    }

    const Menu = () => {
        return(
            <>
            <div className='menu'>
                <ul className='box'>
                    <li>
                        <Link to={'/administrador'}>
                            Página inicial
                        </Link>
                    </li>
                    <li>
                        <Link to={'/administrador/clientes'}>
                            Clientes
                        </Link>
                    </li>

                    <li>
                        <Link to={'/administrador/planos'}>
                            Planos
                        </Link>
                    </li>

                    <li>
                        <Link to={'/administrador/categorias'}>
                            Categorias
                        </Link>
                    </li>

                    <li>
                        <Link to={'/administrador/promocoes'}>
                            Promoções
                        </Link>
                    </li>

                    <li>
                        <Link to={'/administrador/nexa'}>
                            Empreendedores
                        </Link>
                    </li>

                    <li>
                        <Link to={'/administrador/relatorios'}>
                            Relatórios
                        </Link>
                    </li>

                    <li>
                        <Link to={'/'}>
                            Sair da área administradora
                        </Link>
                    </li>

                </ul>
            </div>
            <div className='overlay' onClick={() => StatusMenu(content => !content)}/>
            </>
        )
    }

    return(
    <>
        <div id="space-nav"/>
        <header className='area-admin-header'>
            <div className='controle'>
                {
                    !showMenu ? <></> : 
                    <Menu/>
                }

                <div className={`btn-menu ${showMenu ? "btn-menu-actived" : ""}`} onClick={() => StatusMenu(content => !content)}>
                    <div/>
                    <div/>
                    <div/>
                </div>

                <div className='image-logo' onClick={() => navigate('/administrador/clientes')}>
                    <img src={Logo} alt="Logo do Disk Aripuana" />
                </div>
                {
                    clear ? <></> : 
                    <div className='pesquisar'>
                        <Form onSubmit={SubmitPesquisa}>
                            <InputSearch name="pesquisar" placeholder="Digite algo e pressione enter para pesquisar"/>
                        </Form>
                    </div>
                }
                {
                    mostrarBotaoNovo ? <div className='botao-novo-registro' title="Criar um novo registro" onClick={() => onClickBotaoNovo()}><img src={iconNovo} alt="Novo"/></div> : <></>
                }
                <div className='painel-usuario'>
                    <div className='show icon-usuario' onClick={() => navigate(`/cliente/meusdados`)}>
                        <img src={IconeUsuario} alt="Icône usuário" />
                    </div>
                </div>
            </div>
        </header>
    </>
    )
}