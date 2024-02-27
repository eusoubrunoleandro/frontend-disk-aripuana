import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'

import Header from '../Components/Header'
import Api from '../Services/Api';
import Footer from '../Components/Footer';
import { LoadLine, LoadImage } from '../Components/WhileLoad';
import Message from '../Components/Messagers';

export default function Promocoes(){
    const [ dadosPromocao, AlterarDadosPromocao ] = useState({});
    const [ mensagens, NovaMensagem ] = useState(null);
    const [ onLoad, StatusLoad ] = useState(true);
    const [ carregandoImagens, StatusCarregandoImagens ] = useState(true);
    const [ listaImagensPromocao, alterarListaImagensPromocao ] = useState([]);
    const { id_promocao } = useParams();

    const buscarDadosPromocao = useCallback(async () => {
        StatusLoad(true)
        try{
            const response = await Api.get(`/promocao/busca/publica/perfil/${id_promocao}`);
            const { content } = response.data;
            AlterarDadosPromocao(content)

        } catch(error){ NovaMensagem({ content: error }) }
        StatusLoad(false)
    }, [id_promocao])

    const buscarImagensPromocao = useCallback(async () => {
        StatusCarregandoImagens(true)
        try{
            const response = await Api.get(`/promocao/listar-imagem/${id_promocao}`);
            const { content } = response.data;
            alterarListaImagensPromocao(content)
            
        } catch(error){ NovaMensagem({ content: error }) }
        StatusCarregandoImagens(false)
    }, [id_promocao])

    useEffect(() => {
       buscarDadosPromocao()
       buscarImagensPromocao();
    },[buscarDadosPromocao, buscarImagensPromocao])


    const ImagensPromocao = ({ data }) => {
        return(
            <div>
                <img src={data.url_imagem} alt={`Imagem da promoção ${dadosPromocao.nome_promocao}`}/>
            </div>
        )
    }

    const formatDate = (data) => {
        function validacaoCaracateres(dado){
            return dado < 10 ? `0${dado}` : dado
        }

        const construtorData = new Date(data);
        const dia = construtorData.getDate();
        const mes = construtorData.getMonth();
        const ano = construtorData.getFullYear();

        return `${validacaoCaracateres(dia)}/${validacaoCaracateres(mes)}/${ano}`
    }

    return(
        <>
            <Message message={mensagens}/>
            <Header title={`Promoção de ${dadosPromocao.nome_promocao} de ${dadosPromocao.nome_negocio} - Disk Aripuanã`}/>
            <div className='controle promocao-view'>
                <div className='titulos-paginas'>
                    Você está vendo a <span>{ onLoad ? <LoadLine width='30%'/> : `promoção ${dadosPromocao.nome_promocao}`}</span>
                </div>
                <div className='promocao-view-dados-iniciais'>
                    <div className='promocao-view-identificacao'>
                        <h1>
                            { onLoad ? <LoadLine size='large'/> : dadosPromocao.nome_promocao }
                        </h1>

                        <Link to={`/perfil/${dadosPromocao.id_negocio}/${dadosPromocao.nome_negocio}`}>
                            <span>
                                { onLoad ? <LoadLine width='40%'/> : dadosPromocao.nome_negocio }
                            </span>
                        </Link>

                    </div>
                    <div className='promocao-view-datas'>
                        <div>
                            <div className='datas'>Data de início</div>
                            { onLoad ? <LoadLine width='50%'/> : formatDate(dadosPromocao.inicio_promocao) }
                        </div>
                        <div>
                            <div className='datas'>Data final</div>
                            { onLoad ? <LoadLine width='50%'/> : formatDate(dadosPromocao.fim_promocao) }
                        </div>
                    </div>
                </div>
                <div className='promocao-view-descricao'>
                { onLoad ? <LoadLine/> : dadosPromocao.descricao_promocao }
                </div>
                <div className='promocao-fotos'>
                    {
                        carregandoImagens ? <LoadImage/> :
                        listaImagensPromocao.map(content => <ImagensPromocao key={content.id_imagem_promocao} data={ content }/>)
                    }
                </div>
                <div className='promocao-contato'>
                    Clique e saiba mais ou entre em contato com 
                    {
                        onLoad ?
                        <LoadLine size='large'/> :
                        (<Link to={`/perfil/${dadosPromocao.id_negocio}/${dadosPromocao.nome_negocio}`}> {dadosPromocao.nome_negocio}</Link>)
                    }
                </div>
            </div>
            <Footer/>
        </>
    )
}