import React, { useState, useCallback, useEffect } from 'react';

import HeaderAdmin from '../../Components/HeaderAdmin'
import Api from '../../Services/Api';
import Messagers from '../../Components/Messagers'
import BoxItemCategorias from '../../Components/admin/BoxItemCategorias';
import ModalCategoria from '../../Components/Modals/ModalCategoria';

export default function AdminCategoria(){
    const [ StatusMensagem, NovaMensagem ] = useState(null);
    const [ listaDados, AlterarListaDados ] = useState([]);
    const [ StatusLoad, handleLoad ] = useState(true);
    const [ StatusModal, AlterarStatusModal ] = useState({ open: false, dados: null})

    const buscaListaDados = useCallback(() => {
        (async () => {
            handleLoad(true)
            try{
                const response = await Api.get(`/categoria/busca`);
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
            if(!window.confirm(`Deseja excluir a categoria ${dados.nome_categoria}?`)){
                return '';
            }
            
            NovaMensagem({content: `Excluindo a categoria ${dados.nome_categoria}`, type: "await"})

            const response = await Api.delete(`/administrador/categoria/deletar/${dados.id_categoria}`)
            const { message } = response.data;
            NovaMensagem({content: message, type: "success"})
            AlterarListaDados(listaAtual => listaAtual.filter(item => item.id_categoria !== dados.id_categoria))

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
                    return item.id_categoria === conteudo.id_categoria ? conteudo : item
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
                title='Categorias | Administração Disk Aripuanã'
                mostrarBotaoNovo={true}
                onClickBotaoNovo={() => AlterarStatusModal({ open: true, dados: null })}
            />
            <div className='area-admin'>
                <div className="box-conteudo">
                    <section className='sessao-padrao'>
                        <div className='titulo'>
                            <h1>Categorias</h1>
                        </div>
                        {
                            StatusLoad ?
                            <h3>Carregando dados...</h3> :   
                            !listaDados.length ? <h3>Nenhum dado encontrado!</h3> : 
                            <>
                            <div className='conteudo'>
                                <div className='box-item-adm box-item-adm-titulo'>
                                    <div className='item30'>Codigo</div>
                                    <div className='item60'>Nome da categoria</div>
                                    <div className='item60'>Descrição da categoria</div>
                                    <div className='item30'></div>

                                </div>
                                {
                                    listaDados.map(item => 
                                        <BoxItemCategorias
                                            key={item.id_categoria}
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
        <ModalCategoria
            abrir={StatusModal.open}
            dadosIniciais={StatusModal.dados}
            fecharModal={(dados) => fecharModal(dados)}
            novaMensagemModal = { (dadosMensagem) => NovaMensagem(dadosMensagem) }
        />
        </>
    )
}