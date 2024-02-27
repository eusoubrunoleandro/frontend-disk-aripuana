import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom'

import Header from '../Components/Header'
import Api from '../Services/Api';
import BoxItensClients from '../Components/BoxItens'
import { LoadCard } from '../Components/WhileLoad';
import Footer from '../Components/Footer';
import Messagers from '../Components/Messagers'
import LogoNexa from '../assets/logo-nexa.png';

export default function PesquisaNexa(){
    const [ listaClientes, AlterarDadosCliente ] = useState([]);
    const [ textPesquisa, novoTextoPesquisa ] = useState('');
    const [ pesquisaPorCategoria, AlterarPesquisaPorCategoria ] = useState('');
    const [ onLoad, handleLoad ] = useState(true);
    const [ parametrosURL, MudancaStatusParametros ] = useSearchParams()
    const [ message, StatusMessage ] = useState(null);

    const buscaDadosClientes = useCallback(() => {
        (async () => {
            handleLoad(true)
            try{
                const response = await Api.get(`/nexa?search=${textPesquisa}&categoria=${pesquisaPorCategoria}`);
                const { content } = response.data;
                AlterarDadosCliente(content)
                handleLoad(false)
            } catch(error){
                StatusMessage({ content: error })
                handleLoad(false)
            }
        })()
    }, [textPesquisa, pesquisaPorCategoria])

    useEffect(() => {
        if(parametrosURL.get('search') !== null){
            novoTextoPesquisa(parametrosURL.get('search'))
        }

        if(parametrosURL.get('categoria') !== null){
            AlterarPesquisaPorCategoria(parametrosURL.get('categoria'))
        }

        buscaDadosClientes()
    },[buscaDadosClientes, parametrosURL])

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

    function PesquisaPorCategoria(id_categoria){
        MudancaStatusParametros({ categoria: id_categoria })
    }

    return(
        <div className='nexa'>
            <Messagers message={message}/>
            <Header onPesquisa={content => Pesquisar(content)} title='Programa de empreendedores e fornecedores | Nexa - Disk Aripuanã'/>
            <div className='controle'>
                <div className='titulos-paginas'>
                    Você está em PROGRAMA DE DESENVOLVIMENTO DE EMPREENDEDORES E FORNECEDORES LOCAIS - NEXA
                </div>
                <div className='nexa-centro'>
                    <h1>CATÁLOGO EMPREENDEDORES DE ARIPUANÃ</h1>
                    <img src={LogoNexa} alt="Logo Nexa - Programas de Empreendedores e fornecedores de Aripuanã"/>
                </div>

                <div className='box-itens'>
                {
                    onLoad ? <LoadCard/> :
                    !listaClientes.length ? <></> :
                    listaClientes.map(content =>
                    <BoxItensClients
                        key={content.id_negocio}
                        data={content}
                        OnPesquisaCategoria={id_categoria => PesquisaPorCategoria(id_categoria)}
                    />)
                }
                </div>
            </div>
            <Footer/>
        </div>
    )
}