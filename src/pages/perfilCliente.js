import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import Api from '../Services/Api';

import IconWhatsapp from '../assets/icon-whatsapp.png'
import IconTelefone from '../assets/icon-telefone.png'
import IconFacebook from '../assets/icon-facebook.png'
import IconInstagram from '../assets/icon-instagram.png'
import IconSite from '../assets/icon-site.png'
import IconEmail from '../assets/icon-email.png'
import IconEndereco from '../assets/icon-endereco.png'
import { LoadLine, LoadImage, LoadLogotipo, LoadPromocoes } from '../Components/WhileLoad';
import Message from '../Components/Messagers';

import Header from '../Components/Header'
import Footer from '../Components/Footer'
import BoxItemPromocoes from '../Components/BoxItemPromocoes';

export default function PerfilCliente(){
    const [ dataClient, handleDataCliente ] = useState(null);
    const [ onLoad, handleLoad ] = useState(true);
    const [ Mensagem, NovaMensagem ] = useState(null);
    const { id_negocio } = useParams();
    const [ listaPromocoes, alterarListaPromocoes ] = useState([]);
    const NavigateInterno = useNavigate();

    const getDataCliente = useCallback(() => {
        (async () => {
            handleLoad(true);
            try {
                const { data } = await Api.get(`/negocio/busca/perfil/${id_negocio}`);
                const { content, vitrine, promocoes } = data;
                if(!content.length){
                    NavigateInterno('/pesquisa', { replace: true })
                }

                const dadosCliente = Object.assign(content[0], { vitrine })
                alterarListaPromocoes(promocoes)
                handleDataCliente(dadosCliente);
            } catch (error) {
                NovaMensagem({ content: error })
            }
            handleLoad(false)
        })()
    }, [NavigateInterno, id_negocio])

    useEffect(() => {
        getDataCliente();
    }, [getDataCliente])

    const BoxTelefones = ({ data }) => {
        const numero_telefone = data[0]
        const whatsapp = data[1];
        if(numero_telefone === "") return<></>

        if(whatsapp === 's') return (
            <div>
                <a href={`https://api.whatsapp.com/send/?phone=55${numero_telefone}&text&type=phone_number&app_absent=1`} target="_blank" rel="noreferrer">
                <img src={IconWhatsapp} alt="Whatapp"/>
                {numero_telefone}
                </a>
            </div>
        )
        
        return(
            <div>
                <img src={IconTelefone} alt="Telefone"/>
                {numero_telefone}
            </div>
        )
    }

    const BoxVitrine = ({ dados }) => {
        const { url_arquivo } = dados;

        return(
            <div className='card-vitrine'>
                <img src={url_arquivo} alt="Imagem não carregou! Atualize a página novamente."/>
            </div>
        )
    }

    const imagemDestaque = (vitrine)=>{
        if(vitrine === null) return;
        const dadosImagem = vitrine.filter(item => item.destaque === true)
        if(!dadosImagem.length) return;
        return dadosImagem[0].url_arquivo
    }

    return(
        <>
        <div className='topo'>
            <div className='background'>
                {
                    dataClient === null ? <></> : 
                    <img src={imagemDestaque(dataClient.vitrine)} alt="imagem não carregou"/>
                }
            </div>
            <div className='conteudo'>
                <div>
                    <Message message={Mensagem} />
                    <Header/>
                </div>
                <section className='section-default'>
                    <div className='controle'>
                        <div className='imagem'>
                            <div className='logotipo'>
                                {
                                    onLoad ? <LoadLogotipo/> :
                                    <img src={ dataClient.image_perfil } alt={`Logotipo de ${dataClient.nome_negocio}`}/>
                                }
                            </div>
                        </div>
                        <div className='content'>                            
                            <h2>{ onLoad ? <LoadLine size='large'/> : dataClient.nome_negocio }</h2>
                            <h4>{ onLoad ? <LoadLine/> : dataClient.nome_categoria }</h4>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <section className='section-default descricao'>
            <div className='controle'>
                <h3>Sobre nós</h3>
                { 
                    onLoad ? 
                    <LoadLine/> : 
                    dataClient.descricao_negocio === "" ? "Nenhuma descrição!" : dataClient.descricao_negocio
                }
            </div>
        </section>

        <section className='section-default perfil-contato'>
            <div className='telefones'>
                <div className='controle-interno'>
                    <h1 className='perfil-titulo'>Nossos telefones</h1>
                    {
                        onLoad ? <LoadLine/> :
                        <BoxTelefones key={dataClient.telefone_1} data={ dataClient.telefone_1 }/>
                    }

                    {
                        onLoad ? <LoadLine/> :
                        dataClient.telefone_2 === undefined ? <></> :
                        <BoxTelefones key={dataClient.telefone_2} data={ dataClient.telefone_2 }/>
                    }
                </div>
            </div>
            <div className='redes'>
                <div className='controle-interno'>
                    <h1 className='perfil-titulo'>Redes sociais e outros contatos</h1>
                    {
                        onLoad ? <LoadLine/> :
                        dataClient.link_site === null ? <></> :
                        <div>
                            <a href={dataClient.link_site} target="_blank" rel="noreferrer">
                                <img src={IconSite} alt="Site"/>
                                { dataClient.link_site }
                            </a>
                        </div>
                    }

                    {
                        onLoad ? <LoadLine/> :
                        dataClient.link_instagram === null ? <></> :
                        <div>
                            <a href={`https://www.instagram.com/${dataClient.link_instagram}`} target="_blank" rel="noreferrer">
                                <img src={IconInstagram} alt="Instagram"/>
                                {dataClient.link_instagram}
                            </a>
                        </div>
                    }

                    {
                        onLoad ? <LoadLine/> :
                        dataClient.link_facebook === null ? <></> :
                        <div>
                            <a href={`https://www.instagram.com/${dataClient.link_facebook}`} target="_blank" rel="noreferrer">
                                <img src={IconFacebook} alt="Facebook"/>
                                {dataClient.link_facebook}
                            </a>
                        </div>
                    }

                    {
                        onLoad ? <LoadLine/> :
                        dataClient.email_comercial === null ? <></> :
                        <div>
                            <img src={IconEmail} alt="Email"/>
                            {dataClient.email_comercial}
                        </div>
                    }
                </div>
            </div>
        </section>

        <section className='section-default perfil-endereco'>
            <div className='controle'>
                <div>
                    <img src={IconEndereco} alt="Ícone de endereço"/>
                    <h1 className='perfil-titulo'>Nosso endereço</h1>
                </div>
                <span>
                    {
                        onLoad ? <LoadLine/> : dataClient.endereco
                    }
                </span>

                <span>
                    {
                        onLoad ? <LoadLine/> : `${dataClient.cidade}, ${dataClient.uf}, ${dataClient.pais}`
                    }
                </span>

                <span>
                    {
                        onLoad ? <LoadLine/> : `CEP ${dataClient.cep}`
                    }
                </span>
            </div>
        </section>

        <section className='section-default perfil-vitrine'>
            <div className='titulos-vitrine'>
                <h1 className='perfil-titulo'>Nos conheça de forma visual</h1>
                Aqui você verá algumas imagens de nossa empresa!
            </div>
            <div className='box-control-vitrine'>
                {
                    onLoad ? <LoadImage/> :
                    dataClient.vitrine.map(content => <BoxVitrine key={content.id_vitrine} dados={ content }/>)
                }
            </div>
        </section>

        <section className='section-default perfil-promocao'>
            <div className='controle'>
                <h1 className='perfil-titulo'>Promoções</h1>
                <section className='controle-box-promocoes'>
                    {
                        onLoad ? <LoadPromocoes/> : 
                        !listaPromocoes.length ? <h1>Nenhuma promoção ativa</h1> : 
                        listaPromocoes.map(content => <BoxItemPromocoes key={content.id_promocao} data={content}/>)
                    }
                </section>
            </div>
        </section>

        <Footer/>
        </>
    )
}