import React, { useState, useCallback, useEffect } from 'react';

import HeaderAdmin from '../../Components/HeaderAdmin'
import Api from '../../Services/Api';
import Messagers from '../../Components/Messagers'
import BoxItemEmpreendedores from '../../Components/admin/BoxItemEmpreendedores';

export default function AdminNexa(){
    const [ mensagem, NovaMensagem ] = useState(null);
    const [ dadosClientes, AlterarDadosClientes ] = useState([]);
    const [ StatusLoad, handleLoad ] = useState(true);
    const [ StatusPesquisar, AlterarStatusPesquisar ] = useState('');

    const buscaDadosClientes = useCallback(() => {
        (async () => {
            handleLoad(true)
            try{
                const response = await Api.get(`/nexa/lista?search=${StatusPesquisar}`);
                const { content } = response.data;
                AlterarDadosClientes(content)
            } catch(error){
                NovaMensagem({ content: error })
            }
            handleLoad(false)
        })()
    }, [StatusPesquisar])

    useEffect(() => {
        buscaDadosClientes();
    }, [buscaDadosClientes])

    function Pesquisar (texto){
        AlterarStatusPesquisar(texto);
    }

    const _remover = async (dados) => {
        try {
            const response = await Api.put(`/nexa/remover`, { id_negocio: dados.id_negocio })
            const { message } = response.data;
            NovaMensagem({content: message, type: "success"})
            
            AlterarDadosClientes(listaAtual => listaAtual.map(item => {
                if(item.id_negocio === dados.id_negocio){
                    return Object.assign(item, { empreendedor: null })
                }
                else return item
            }))

        } catch (error) {
            NovaMensagem({content: error})
        }
    }

    const _adicionar = async (dados) => {
        try {
            const response = await Api.post(`/nexa/inserir`, { id_negocio: dados.id_negocio })
            const { message } = response.data;
            NovaMensagem({content: message, type: "success"})

            AlterarDadosClientes(listaAtual => listaAtual.map(item => {
                if(item.id_negocio === dados.id_negocio){
                    return Object.assign(item, { empreendedor: dados.id_negocio })
                }
                else return item
            }))
        } catch (error) {
            NovaMensagem({content: error})
        }
    }

    return(
        <>
        <div className='box-area-admin'>
            <Messagers message={mensagem}/>
            <HeaderAdmin 
                onPesquisa={content => Pesquisar(content.pesquisar)} 
                title='Catálogo de empreendedores | Administração Disk Aripuanã'
                mostrarBotaoNovo={false}
            />
            <div className='area-admin'>
                <div className="box-conteudo">
                    <section className='sessao-padrao'>
                        <div className='titulo'>
                            <h1>Catálogo de empreendedores | Nexa</h1>
                        </div>
                        {
                            StatusLoad ?
                            <h3>Carregando dados...</h3> :   
                            <>
                            <div className='conteudo'>
                                <div className='box-item-adm box-item-adm-titulo'>
                                    <div className='item30'>Codigo</div>
                                    <div className='item60'>Nome do negócio</div>
                                    <div className='item60'>Categoria</div>
                                    <div className='item30'>Premium</div>
                                    <div className='item30'>Está no catálogo?</div>
                                    <div className='item30'></div>

                                </div>
                                {
                                    dadosClientes.map(item => 
                                        <BoxItemEmpreendedores
                                            key={item.id_negocio}
                                            dadosItem={item}
                                            novaMensagem={ mensagem => NovaMensagem(mensagem) }
                                            AlterarStatusEmpreendedor = { () => item.empreendedor !== null ? _remover(item) : _adicionar(item) }
                                        />
                                    )
                                }
                            </div>
                            </>
                        }
                    </section>
                </div>
            </div>
        </div>
        </>
    )
}