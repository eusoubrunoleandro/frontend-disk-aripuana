import React, { useState, useRef } from 'react';

export default function BoxItemPlanos({ 
    dadosItem, 
    excluirRegistro = () => {},
    verRegistro = () => {}
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
            <div className='item30'>{ dadosItem.id_plano }</div>
            <div className='item60'>{ dadosItem.nome_plano }</div>
            <div className='item60'>{ dadosItem.valor }</div>

            <div className='acao item30'>
                <div className={`botao-indicador${abrirBoxAcao ? " botao-indicador-aberto" : ""}`} onClick={() => StatusAbrirBoxAcao(atual => !atual)} ref={ acaoRef }>
                    <div/>
                    <div/>
                    <div/>
                </div>
                {
                    !abrirBoxAcao ? <></> : 
                    <div className='botoes'>
                        <div onClick={() => verRegistro()}>
                            Ver/Editar
                        </div>
                        <div onClick={() => excluirRegistro()}>
                            Excluir plano
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}