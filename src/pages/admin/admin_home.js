import React from 'react';

import HeaderAdmin from '../../Components/HeaderAdmin'

export default function AdminHome(){

    return(
        <div className='box-area-admin'>
            <HeaderAdmin 
                title='Administração Disk Aripuanã'
                mostrarBotaoNovo={false}
                clear={true}
            />
            <div className='area-admin'>
                <div className="box-conteudo">
                    <section className='sessao-padrao'>
                        <div className='titulo'>
                            <h1>Seja bem vindo(a) a área administradora</h1>
                        </div>

                    </section>
                </div>
            </div>
        </div>
    )
}