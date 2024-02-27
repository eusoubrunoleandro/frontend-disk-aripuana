import React, { useCallback, useEffect, useState } from 'react';

import Header from '../../Components/Header'
import Api from '../../Services/Api';
import Footer from '../../Components/Footer';
import Messagers from '../../Components/Messagers'
import { LoadCard } from '../../Components/WhileLoad'

export default function Pesquisa(){
    const [ listaPlanos, AlterarListaPlanos ] = useState([]);
    const [ onLoad, handleLoad ] = useState(true);
    const [ message, StatusMessage ] = useState(null);
    

    const buscaDadosPromocoes = useCallback(() => {
        (async () => {
            handleLoad(true)
            try{
                const response = await Api.get(`/negocio/busca`);
                const { content } = response.data;
                AlterarListaPlanos(content)
            } catch(error){
                StatusMessage({ content: error })
            }
            handleLoad(false)
        })()
    }, [])

    useEffect(() => {
        handleLoad(false)
        // buscaDadosPromocoes()
    },[buscaDadosPromocoes])

    function Pesquisar (texto){
    }
    

    return(
        <div className='box-area-cliente'>
            <Messagers message={message}/>
            <Header onPesquisa={content => Pesquisar(content)} title='Meus planos | Cliente - Disk Aripuanã'/>
            <div className='controle area-cliente'>
                <div className='titulos-paginas'>
                    Você está em <span>Cliente / Meus planos</span>
                </div>

                <div className="box-conteudo">
                    {
                        onLoad ? <LoadCard/> :
                        !listaPlanos.length ? 
                        <section className='sessao-padrao'>Nenhum registro encontrado</section> :
                        listaPlanos.map(promocao => 
                        <section className='sessao-padrao'>
                            
                        </section>)
                    }
                </div>
            </div>
            <Footer/>
        </div>
    )
}