import React, { useState, useRef } from 'react';

export default function BoxItemEmpreendedores({ 
    dadosItem, 
    AlterarStatusEmpreendedor = () => {},
}){
    const [ abrirBoxAcao, StatusAbrirBoxAcao ] = useState(false);
    const acaoRef = useRef();

    document.getElementById("root").addEventListener('click', (event) => {
        if(event.target !== acaoRef.current){
            StatusAbrirBoxAcao(false);
        }
    })

    return(
        <div className='box-item-adm'>
            <div className='item30'>{ dadosItem.id_negocio }</div>
            <div className='item60'>{ dadosItem.nome_negocio }</div>
            <div className='item60'>{ dadosItem.nome_categoria }</div>
            <div className='item30'>{ dadosItem.modo_premium ? "Premium" : "Normal" }</div>
            <div className='item30'>{ dadosItem.empreendedor !== null ? "Sim" : "Não" }</div>

            <div className='acao item30'>
                <div className={`botao-indicador${abrirBoxAcao ? " botao-indicador-aberto" : ""}`} onClick={() => StatusAbrirBoxAcao(atual => !atual)} ref={ acaoRef }>
                    <div/>
                    <div/>
                    <div/>
                </div>
                {
                    !abrirBoxAcao ? <></> : 
                    <div className='botoes'>
                        <div onClick={() => AlterarStatusEmpreendedor()}>
                            {
                                dadosItem.empreendedor === null ? "Inserir no catálogo" : 'Remove do catálogo'
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}