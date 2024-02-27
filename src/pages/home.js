import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

import Header from '../Components/Header'
import HomemCelular from '../assets/homem-celular-home.png'
import LogoNexa from '../assets/logo-nexa.png'
import CelularLogo from '../assets/celular-logo.png'
import Api from '../Services/Api';
import BoxItensClients from '../Components/BoxItens'
import Footer from '../Components/Footer';
import { LoadCard } from '../Components/WhileLoad';
import Messagers from '../Components/Messagers'

import IconSetaEsquerda from '../assets/icon-seta-esquerda.png'
import IconSetaDireita from '../assets/icon-seta-direita.png'

export default function Home(){
    const [ dataCliente, AlterDataCliente ] = useState([]);
    const [ onLoad, handleLoad ] = useState(true);
    const [ message, StatusMessage ] = useState(null);
    const navigate = useNavigate();
    const BoxItens = useRef();

    const getDataClientes = useCallback(() => {
        (async () => {
            handleLoad(true)
            try{
                const response = await Api.get(`/negocio/busca?premium=true`);
                const { content } = response.data;
                AlterDataCliente(content)
                
            } catch(error){
                StatusMessage({ content: error })
            }
            handleLoad(false)
            
        })()
    }, [])

    useEffect(() => {
        getDataClientes()
    },[getDataClientes])

    function Pesquisar(content){
        const { pesquisar } = content
        if(pesquisar !== ''){
            navigate(`/pesquisa?search=${pesquisar}`)
        }
    }

    const retroceder = () => {
        const elementosFilhos = BoxItens.current.childNodes
        BoxItens.current.scrollLeft -= elementosFilhos[0].clientWidth
    }

    const avancar = () => {
        const elementosFilhos = BoxItens.current.childNodes
        BoxItens.current.scrollLeft += elementosFilhos[0].clientWidth
    }

    return(
        <>
            <Messagers message={message}/>
            <Header onPesquisa={contentSearch => Pesquisar(contentSearch)}/>
            <section className='sessao sessao-inicio-pesquisa'>
                <div className='controle'>
                    <div className='imagem'>
                        <img src={HomemCelular} alt="Homem segurando celular"/>
                    </div>
                    <div className='content'>
                        <h1 className='titulos'>
                            Pesquise e encontre contato de empresas e profissionais.
                        </h1>
                        <div className='box-control-link'>
                            <Link to={'/pesquisa'}>Iniciar uma pesquisa</Link>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className='sessao sessao-clientes'>
                <div className='controle'>
                    <h1 className='titulos'>Nossos clientes premium</h1>
                    <div className='todos-clientes-home'>
                        <div className='box-itens' ref={BoxItens}>
                            {
                                onLoad ? <LoadCard/> : 
                                !dataCliente.length ? <></> :
                                dataCliente.map(content =>
                                    <BoxItensClients
                                        key={content.id_negocio}
                                        data={content}
                                    />
                                )
                            }
                        </div>
                        <div className='box-controler-carrousel'>
                            <div className='controle-carrousel' onClick={() => retroceder()}><img src={IconSetaEsquerda} alt=''/></div>
                            <div className='controle-carrousel' onClick={() => avancar()}><img src={IconSetaDireita} alt=''/></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='sessao sessao-nexa'>
                <div className='controle'>
                    <div className='content'>
                        <h1 className='titulos'>
                            Programa de desenvolvimento de empreendedores e fornecedores locais
                        </h1>
                        <h2>Catálogo Empreendedores de Aripuanã</h2>
                        <div className='box-control-link'>
                            <Link to={'/programa-de-empreendedores-ariapuana'}>Conheça mais</Link>
                        </div>
                    </div>
                    <div className='imagem'>
                        <img src={LogoNexa} alt="Logotipo da nexa"/>
                    </div>
                </div>
            </section>

            <section className='sessao sessao-app'>
                <div className='controle'>
                    <div className='content'>
                        <h1 className='titulos'>
                            WHATSAPP, TELEFONE, E-MAIL, LOCALIZAÇÃO...
                        </h1>
                        <h2>Tudo na palma da sua mão</h2>
                        <div className='box-control-link'>
                            Logo logo estará disponível para download
                            {/* <Link to={'/app'}>Fazer download do app</Link> */}
                        </div>
                    </div>
                    <div className='imagem'>
                        <img src={CelularLogo} alt="Smartphone com logo do disk"/>
                    </div>
                </div>
            </section>

            <section className='sessao sessao-conhecanos'>
                <div className='controle'>
                    <div className='content'>
                        <h1 className='titulos'>
                            Fácil e simples! <br/> Esse é nosso maior dilema
                        </h1>
                        <div className='box-control-link'>
                            <Link to={'/sobre-nos'}>Conheça-nos</Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer style={{marginTop: 0}}/>
        </>
    )
}