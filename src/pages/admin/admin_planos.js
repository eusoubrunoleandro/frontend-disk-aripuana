import React, { useState, useCallback, useEffect } from 'react';

import HeaderAdmin from '../../Components/HeaderAdmin'
import Api from '../../Services/Api';
import Messagers from '../../Components/Messagers'
import BoxItemPlanos from '../../Components/admin/BoxItemPlanos';
import ModalPlanos from '../../Components/Modals/ModalPlanos';

export default function AdminPlanos(){
    const [ StatusMensagem, NovaMensagem ] = useState(null);
    const [ listaDados, AlterarListaDados ] = useState([]);
    const [ StatusLoad, handleLoad ] = useState(true);
    const [ StatusModal, AlterarStatusModal ] = useState({ open: false, dados: null})

    const buscaListaDados = useCallback(() => {
        (async () => {
            handleLoad(true)
            try{
                const response = await Api.get(`/plano/busca`);
                const { content } = response.data;
                AlterarListaDados(content)
            } catch(error){
                NovaMensagem({ content: error })
            }
            handleLoad(false)
        })()
    }, [])

    useEffect(() => {
        buscaListaDados();
    }, [buscaListaDados])

    function Pesquisar (texto){
    }

    const _excluirRegistro = async (dados) => {
        try {
            if(!window.confirm(`Deseja excluir o plano ${dados.nome_plano}?`)){
                return '';
            }
            
            NovaMensagem({content: `Excluindo o plano ${dados.nome_plano}`, type: "await"})

            const response = await Api.delete(`/administrador/plano/deletar/${dados.id_plano}`)
            const { message } = response.data;
            NovaMensagem({content: message, type: "success"})
            AlterarListaDados(listaAtual => listaAtual.filter(item => item.id_plano !== dados.id_plano))

        } catch (error) {
            NovaMensagem({content: error})
        }
    }

    function fecharModal(dados){
        if(dados !== null){

            const { novoRegistro, conteudo } = dados;
            if(novoRegistro){
                AlterarListaDados(listaAtual => {
                    listaAtual.push(conteudo)
                    return listaAtual
                })
            }
            else{
                AlterarListaDados(listaAtual => listaAtual.map(item => {
                    return item.id_plano === conteudo.id_plano ? conteudo : item
                }))
            }
        }

        AlterarStatusModal({ open: false, dados: null })
    }
    return(
        <>
        <div className={`box-area-admin ${StatusModal.open ? 'desfocado' : ''}`}>
            <Messagers message={StatusMensagem}/>
            <HeaderAdmin 
                onPesquisa={content => Pesquisar(content)} 
                title='Planos | Administração Disk Aripuanã'
                mostrarBotaoNovo={true}
                onClickBotaoNovo={() => AlterarStatusModal({ open: true, dados: null })}
            />
            <div className='area-admin'>
                <div className="box-conteudo">
                    <section className='sessao-padrao'>
                        <div className='titulo'>
                            <h1>Planos</h1>
                        </div>
                        {
                            StatusLoad ?
                            <h3>Carregando dados...</h3> :   
                            !listaDados.length ? <h3>Nenhum dado encontrado!</h3> : 
                            <>
                            <div className='conteudo'>
                                <div className='box-item-adm box-item-adm-titulo'>
                                    <div className='item30'>Codigo</div>
                                    <div className='item60'>Nome do plano</div>
                                    <div className='item60'>Valor do plano</div>
                                    <div className='item30'></div>

                                </div>
                                {
                                    listaDados.map(item => 
                                        <BoxItemPlanos
                                            key={item.id_plano}
                                            dadosItem={item}
                                            novaMensagem={ mensagem => NovaMensagem(mensagem) }
                                            excluirRegistro={ () => _excluirRegistro(item) }
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
        <ModalPlanos
            abrir={StatusModal.open}
            dadosIniciais={StatusModal.dados}
            fecharModal={(dados) => fecharModal(dados)}
            novaMensagemModal = { (dadosMensagem) => NovaMensagem(dadosMensagem) }
        />
        </>
    )
}