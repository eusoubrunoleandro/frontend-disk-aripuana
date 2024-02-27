import React from 'react';
import { Link, useNavigate } from 'react-router-dom'


export default function BoxItemPromocoes({ data }){
    const Navigate = useNavigate();

    return(
        <div className='box-promocoes'>
            <Link to={`/promocoes/visualizar/${data.id_promocao}/${data.nome_promocao}`} replace={true}>
                <div className='imagem-promocao' onClick={() => Navigate('/promocoes/view/')}>
                    <img src={data.url_imagem} alt={`Imagem da Promoção ${data.nome_promocao}`}/>
                </div>
            </Link>
            <div className='content'>
                <Link to={`/promocoes/visualizar/${data.id_promocao}/${data.nome_promocao}`}>
                    <h1>{ data.nome_promocao }</h1>
                </Link>
                <Link to={`/perfil/${data.id_negocio}/${data.nome_negocio}`}>{ data.nome_negocio }</Link>
            </div>
        </div>
    )
}