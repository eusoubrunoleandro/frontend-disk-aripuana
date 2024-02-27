import React, { useCallback, useEffect, useState } from 'react';

import Header from '../Components/Header'
import Api from '../Services/Api';
import Footer from '../Components/Footer';
import BoxItemPromocoes from '../Components/BoxItemPromocoes'
import { LoadPromocoes } from '../Components/WhileLoad'
import Message from '../Components/Messagers';

export default function Promocoes(){
    const [ listaPromocoes, alterarListaPromocoes ] = useState([]);
    const [ filtro, StatusFiltro ] = useState( null )
    const [onLoad, StatusLoad] = useState(true);
    const [ mensagens, NovaMensagem ] = useState(null)

    const buscarPromocoes = useCallback(() => {
        (async () => {
            StatusLoad(true)
            try{
                const response = await Api.post(`/promocao/buscaPublica`, filtro);
                const { content } = response.data;
                alterarListaPromocoes(content)
            } catch(error){
                NovaMensagem({ content: error })
            }
            StatusLoad(false)
        })()
    }, [filtro])

    useEffect(() => {
       buscarPromocoes()
    },[buscarPromocoes])

    const filtros = (tipo) => {
        const construtorData = new Date();
        const datasMenoresQueDez = (numero) =>{
            return numero < 10 ? `0${numero}` : numero
        }
        const hoje = `${construtorData.getFullYear()}/${datasMenoresQueDez(construtorData.getMonth())}/${datasMenoresQueDez(construtorData.getDate())}`;

        StatusFiltro({ tipo, dataBase: hoje })
        
    }

    return(
        <>
            <Header title='Promoções - Disk Aripuanã'/>
            <Message message={mensagens}/>
            <div className='controle'>
                <div className='titulos-paginas'>
                    Você está em <span>Promoções</span>
                </div>
                <div className='controle-promocoes'>
                    <section className='filtros-promocoes'>
                        <div>
                            <h1>Filtros</h1>
                            <div className='checkbox'>
                                <div className='checkbox-list' onClick={() => filtros('dia')}>
                                    <div className={`marcador ${filtro !== null ? filtro.tipo === 'dia' ? "marcado-ativo": "" : ""}`}/>
                                    <span>Hoje</span>
                                </div>
                                <div className='checkbox-list' onClick={() => filtros("semana")}>
                                    <div className={`marcador ${filtro !== null ? filtro.tipo === 'semana' ? "marcado-ativo": "" : ""}`}/>
                                    <span>Essa semana</span>
                                </div>
                                <div className='checkbox-list' onClick={() => filtros(null)}>
                                    <span>Limpar filtro</span>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className='controle-box-promocoes'>
                        {
                            onLoad ? <LoadPromocoes/> : 
                            !listaPromocoes.length ? <h1 id="mensagem">Nenhum registro encontrado</h1> : 
                            listaPromocoes.map(content => <BoxItemPromocoes key={content.id_promocao} data={content}/>)
                        }
                    </section>
                </div>
            </div>
            <Footer/>
        </>
    )
}