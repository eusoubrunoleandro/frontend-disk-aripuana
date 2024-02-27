import React, { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom'

import Header from '../Components/Header'
import Api from '../Services/Api';
import Footer from '../Components/Footer';
import { LoadCard } from '../Components/WhileLoad';
import Message from '../Components/Messagers';

export default function Categoria(){
    const [ dadosCategorias, listaCategorias ] = useState([]);
    const [ onLoad, handleLoad ] = useState(true);
    const [ textPesquisa, novoTextoPesquisa ] = useState('');
    const [ mensagem, NovaMensagem ] = useState(null);
    const [ parametrosURL, MudancaStatusParametros ] = useSearchParams()

    useEffect(() => {
        if(parametrosURL.get('search') !== null){
            novoTextoPesquisa(parametrosURL.get('search'))
        }
    },[parametrosURL])

    const buscaDeCategorias = useCallback(() => {
        (async () => {
            handleLoad(true)
            try{
                const response = await Api.get(`/categoria/busca?search=${textPesquisa}`);
                const { content } = response.data;
                listaCategorias(content)

            } catch(error){
                NovaMensagem({ content: error })
            }
            handleLoad(false);
        })()
    }, [textPesquisa])

    useEffect(() => {
       buscaDeCategorias()

    },[buscaDeCategorias])


    const BoxItensCategoria = ({ data }) => {
        return (
        <div className='box-item-categoria item'>
            <Link to={`/pesquisa?categoria=${data.id_categoria}`}>
                <h1>{data.nome_categoria}</h1>
                <p>{data.descricao_categoria}</p>
            </Link>
        </div>
        )
    }

    function Pesquisar (texto){
        const { pesquisar } = texto;

        const isParams = {}
        if(pesquisar !== ""){
            Object.assign(isParams, { search: pesquisar })
        }

        MudancaStatusParametros(isParams)
        novoTextoPesquisa(pesquisar)
    }

    return(
        <>
        <Message message={mensagem}/>
            <Header title='Categoria - Disk Aripuanã' onPesquisa={conteudo => Pesquisar(conteudo)}/>
            <div className='controle pesquisa-controle'>
                <div className='titulos-paginas'>
                    Você está em <span>Categorias</span>
                </div>
                <div className='box-itens'>
                {
                    onLoad ? <LoadCard/> :
                    !dadosCategorias.length ? <></> :
                    dadosCategorias.map(content =>
                    <BoxItensCategoria
                        key={content.id_categoria}
                        data={content}
                    />)
                }
                </div>
            </div>
            <Footer/>
        </>
    )
}