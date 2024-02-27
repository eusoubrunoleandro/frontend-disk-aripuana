import React, { useState, useCallback, useEffect } from 'react';

import HeaderAdmin from '../../Components/HeaderAdmin'
import Api from '../../Services/Api';
import Messagers from '../../Components/Messagers'
import BoxItemCliente from '../../Components/admin/BoxItemClientes';
import ModalClientes from '../../Components/Modals/ModalClientes';

export default function AdminClientes(){
    const [ mensagem, NovaMensagem ] = useState(null);
    const [ dadosClientes, AlterarDadosClientes ] = useState([]);
    const [ StatusLoad, handleLoad ] = useState(true);
    const [ StatusModal, AlterarStatusModal ] = useState({ open: false, dados: null})
    const [ StatusPesquisar, AlterarStatusPesquisar ] = useState('');

    const buscaDadosClientes = useCallback(() => {
        (async () => {
            handleLoad(true)
            try{
                const response = await Api.get(`/administrador/negocio/lista?search=${StatusPesquisar}`);
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

    const _excluirConta = async (dados) => {
        try {
            if(!window.confirm(`Deseja excluir a conta ${dados.nome_negocio}?`)){
                return '';
            }
            
            NovaMensagem({content: `Excluindo a conta ${dados.nome_negocio}`, type: "await"})

            const response = await Api.delete(`/negocio/deletar/${dados.id_negocio}`)
            const { message } = response.data;
            NovaMensagem({content: message, type: "success"})
            AlterarDadosClientes(listaAtual => listaAtual.filter(item => item.id_negocio !== dados.id_negocio))

        } catch (error) {
            NovaMensagem({content: error})
        }
    }

    const _bloquearConta = async (dados) => {
        try {
            if(!window.confirm(`Deseja bloquear a conta ${dados.nome_negocio}?`)) return '';

            const motivo_bloqueio = window.prompt(`Descreva o motivo de bloqueio da conta ${dados.nome_negocio}`)

            const dadosBloqueio = { bloqueado: true, motivo_bloqueio }

            const response = await Api.put(`/acesso/bloqueio-conta/${dados.id_negocio}`, dadosBloqueio)
            const { message } = response.data;
            NovaMensagem({content: message, type: "success"})
            
            AlterarDadosClientes(listaAtual => listaAtual.map(item => {
                if(item.id_negocio === dados.id_negocio){
                    return Object.assign(item, dadosBloqueio)
                }
                else return item
            }))

        } catch (error) {
            NovaMensagem({content: error})
        }
    }

    const _desbloquearConta = async (dados) => {
        try {
            if(!window.confirm(`Deseja desbloquear a conta ${dados.nome_negocio}?`)) return '';

            const dadosDesbloqueio = { bloqueado: false, motivo_bloqueio:"" }

            const response = await Api.put(`/acesso/bloqueio-conta/${dados.id_negocio}`, dadosDesbloqueio)
            const { message } = response.data;
            NovaMensagem({content: message, type: "success"})

            AlterarDadosClientes(listaAtual => listaAtual.map(item => {
                if(item.id_negocio === dados.id_negocio){
                    return Object.assign(item, dadosDesbloqueio)
                }
                else return item
            }))
        } catch (error) {
            NovaMensagem({content: error})
        }
    }

    const _acaoBloqueio = (bloquear, dados) => {
        if(bloquear) return _bloquearConta(dados)

        return _desbloquearConta(dados)
    }


    function fecharModal(dados){
        if(dados !== null){

            const { novoRegistro, conteudo } = dados;
            if(novoRegistro){
                AlterarDadosClientes(listaAtual => {
                    listaAtual.push(conteudo)
                    return listaAtual
                })
            }
            else{
                AlterarDadosClientes(listaAtual => listaAtual.map(item => {
                    return item.id_negocio === conteudo.id_negocio ? conteudo : item
                }))
            }
        }

        AlterarStatusModal({ open: false, dados: null })
    }

    return(
        <>
        <div className={`box-area-admin ${StatusModal.open ? 'desfocado' : ''}`}>
            <Messagers message={mensagem}/>
            <HeaderAdmin 
                onPesquisa={content => Pesquisar(content.pesquisar)} 
                title='Clientes | Administração Disk Aripuanã'
                mostrarBotaoNovo={true}
                onClickBotaoNovo={() => AlterarStatusModal({ open: true, dados: null })}
            />
            <div className='area-admin'>
                <div className="box-conteudo">
                    <section className='sessao-padrao'>
                        <div className='titulo'>
                            <h1>Clientes</h1>
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
                                    <div className='item30'>Bloqueado</div>
                                    <div className='item30'>Verificada?</div>
                                    <div className='item30'></div>

                                </div>
                                {
                                    dadosClientes.map(item => 
                                        <BoxItemCliente
                                            key={item.id_negocio}
                                            dadosItem={item}
                                            novaMensagem={ mensagem => NovaMensagem(mensagem) }
                                            excluirConta={ () => _excluirConta(item) }
                                            bloquearConta={ () => _acaoBloqueio(!item.bloqueado, item) }
                                            verRegistro = { () => AlterarStatusModal({ open: true, dados: item }) }
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
        <ModalClientes
            abrir={StatusModal.open}
            dadosIniciais={StatusModal.dados}
            fecharModal={(dados) => fecharModal(dados)}
            novaMensagemModal = { (dadosMensagem) => NovaMensagem(dadosMensagem) }
        />
        </>
    )
}