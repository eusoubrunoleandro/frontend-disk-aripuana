import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import IconMenuLateral from '../assets/icon-menu-lateral.png'

export default function MenuAreaAdmin (){
    const location = useLocation();
    const [ StatusFechadoMenu, AlterarEstadoFechadoMenu ] = useState(false);

    function verificarLink(url){
        if(url === location.pathname){
            return 'url-ativo'
        }
    }
    return(
        <div className='menu-lateral'>
            <div className={`botao-menu-lateral ${ StatusFechadoMenu ? "botao-menu-lateral-fechado" : "" }`} onClick={() => AlterarEstadoFechadoMenu(atual => !atual)}>
                <img src={ IconMenuLateral } alt="Esconder Menu"/>
            </div>
            <div className={ `links-menu-admin ${ StatusFechadoMenu ? 'menu-escondido' : "" }` }>
                <ul className='box'>
                    <li className={verificarLink('/administrador')}>
                        <Link to={'/administrador'}>
                            Página inicial
                        </Link>
                    </li>
                    <li className={verificarLink('/administrador/clientes')}>
                        <Link to={'/administrador/clientes'}>
                            Clientes
                        </Link>
                    </li>

                    <li className={verificarLink('/administrador/planos')}>
                        <Link to={'/administrador/planos'}>
                            Planos
                        </Link>
                    </li>

                    <li className={verificarLink('/administrador/categorias')}>
                        <Link to={'/administrador/categorias'}>
                            Categorias
                        </Link>
                    </li>

                    <li className={verificarLink('/administrador/promocoes')}>
                        <Link to={'/administrador/promocoes'}>
                            Promoções
                        </Link>
                    </li>

                    <li className={verificarLink('/administrador/nexa')}>
                        <Link to={'/administrador/nexa'}>
                            Empreendedores
                        </Link>
                    </li>

                    <li className={verificarLink('/administrador/relatorios')}>
                        <Link to={'/administrador/relatorios'}>
                            Relatórios
                        </Link>
                    </li>

                    <li className={verificarLink('/')}>
                        <Link to={'/'}>
                            Sair da área administradora
                        </Link>
                    </li>

                </ul>
            </div>
        </div>
    )
}