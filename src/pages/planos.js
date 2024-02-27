import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom'
import Header from '../Components/Header'
import Api from '../Services/Api';
import Footer from '../Components/Footer';
import Messagers from '../Components/Messagers'
import { LoadCard } from '../Components/WhileLoad';
import BoxItemPlano from '../Components/BoxItemCaracteristicaPlano';

export default function Planos(){
    const [ listaPlanos, AlterarDadosPlano ] = useState([]);
    const [ textoPesquisa, novoTextoPesquisa ] = useState('');
    const [ onLoad, handleLoad ] = useState(true);
    const [ parametrosURL, MudancaStatusParametros ] = useSearchParams()
    const [ message, StatusMessage ] = useState(null);

    const buscaPlanos = useCallback(() => {
        (async () => {
            handleLoad(true)
            try{
                const response = await Api.get(`/plano/busca?search=${textoPesquisa}`);
                const { content } = response.data;
                AlterarDadosPlano(content)
                handleLoad(false)
            } catch(error){
                StatusMessage({ content: error })
                handleLoad(false)
            }
        })()
    }, [textoPesquisa])

    useEffect(() => {
        if(parametrosURL.get('search') !== null){
            novoTextoPesquisa(parametrosURL.get('search'))
        }

        buscaPlanos()
    },[buscaPlanos, parametrosURL])

    function Pesquisar (texto){
        const { pesquisar } = texto;

        const isParams = {}
        if(parametrosURL.get('categoria') !== null){
            Object.assign(isParams, { categoria: parametrosURL.get('categoria') })
        }

        if(pesquisar !== ""){
            Object.assign(isParams, { search: pesquisar })
        }

        MudancaStatusParametros(isParams)
        novoTextoPesquisa(pesquisar)
    }

    // const buscarCaracteristica = async (id_plano) => {
    //     try{
    //         const response = await Api.get(`/plano/caracteristica/lista/${id_plano}`);
    //         const { content } = response.data;
    //         AlterarDadosPlano(content)
    //         handleLoad(false)
    //     } catch(error){
    //         StatusMessage({ content: error })
    //         handleLoad(false)
    //     }
    // }

    return(
        <div className='claro-planos'>
            <Messagers message={message}/>
            <Header title='Planos - Disk Aripuanã' onPesquisa={content => Pesquisar(content)}/>
            <div className='controle pesquisa-controle'>
                <div className='titulos-paginas'>
                    Você está em <span>Planos</span>
                </div>
                <div className='controle-planos'>
                {
                    onLoad ? <LoadCard/> :
                    !listaPlanos.length ? <></> :
                    listaPlanos.map(content =>
                    <BoxItemPlano
                        key={content.id_plano}
                        dadosPlano={content}
                    />)
                }
                </div>
            </div>
            <Footer/>
        </div>
    )
}