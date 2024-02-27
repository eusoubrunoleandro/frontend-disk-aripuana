import React, { useCallback, useEffect, useState } from 'react';

import Header from '../../Components/Header'
import Api from '../../Services/Api';
import Footer from '../../Components/Footer';
import Messagers from '../../Components/Messagers'
import { LoadCard } from '../../Components/WhileLoad'
import PromocaoAreaCliente from '../../Components/promocao-area-cliente';
import ModalPromocao from '../../Components/Modals/ModalPromocao';
import VerificarAcesso from '../../Components/VerificarAcesso';

export default function Pesquisa(){
    const [ listaPromocoes, AlterarListaPromocoes ] = useState([]);
    const [ onLoad, handleLoad ] = useState(true);
    const [ message, StatusMessage ] = useState(null);
    const [ StatusModal, AlterarStatusModal ] = useState({ open: false, dados: null})
    

    const buscaDadosPromocoes = useCallback(() => {
        (async () => {
            handleLoad(true)
            try{
                const response = await Api.get(`/minhas-promocao/lista`);
                const { content } = response.data;
                AlterarListaPromocoes(content)
            } catch(error){
                StatusMessage({ content: error.message })                
            }
            handleLoad(false)
        })()
    }, [])

    useEffect(() => {
        handleLoad(false)
        buscaDadosPromocoes()
    },[buscaDadosPromocoes])

    function Pesquisar (texto){
    }

    function fecharModal(dados){
        window.history.pushState({}, 'Minhas promoções | Cliente - Disk Aripuanã', '/cliente/minhaspromocoes')
        if(dados !== null){

            const { novoRegistro, conteudo } = dados;
            if(novoRegistro){
                AlterarListaPromocoes(listaAtual => {
                    listaAtual.push(conteudo)
                    return listaAtual
                })
            }
            else{
                AlterarListaPromocoes(listaAtual => listaAtual.map(item => {
                    return item.id_promocao === conteudo.id_promocao ? conteudo : item
                }))
            }
        }
        else{
            AlterarStatusModal({ open: false, dados: null })
        }
    }

    async function excluirRegistro(item){

        const confirmacao = window.confirm('Tem certeza que deseja excluir esse registro?')
        if(!confirmacao){
            return '';
        }
        try {
            const response = await Api.delete(`/promocao/deletar/${item.id_promocao}`);
            StatusMessage({ content: response.data.message, type:"success" })
            AlterarListaPromocoes(listaAtual => listaAtual.filter(itemLista => itemLista.id_promocao !== item.id_promocao))
        } catch (error) {
            StatusMessage({ content: error })
        }
    }

    async function publicarPromocao(item){

        const confirmacao = window.confirm(`Tem certeza que deseja ${item.publicar ? "RETIRAR DO AR" : "PUBLICAR"} essa promoção?`)
        if(!confirmacao){
            return '';
        }
        try {
            const publicar = !item.publicar;
            await Api.put(`/promocao/publicar/${item.id_promocao}`, { publicar });
            StatusMessage({ content: publicar ? "Promoção está ativa!" : "Promoção está fora do ar", type:"success" })

            const conteudoNovo = Object.assign(item, { publicar })
            
            AlterarListaPromocoes(listaAtual => listaAtual.map(promocao => {
                return promocao.id_promocao === item.id_promocao ? conteudoNovo : promocao
            }))
        } catch (error) {
            StatusMessage({ content: error })
        }
    }

    return(
        <>
        <div className={`box-area-cliente ${StatusModal.open ? 'desfocado' : ''}`}>
            <Messagers message={message}/>
            <Header onPesquisa={content => Pesquisar(content)} title='Minhas promoções | Cliente - Disk Aripuanã'/>
            <div className='controle area-cliente'>
                <div className='titulos-paginas'>
                    Você está em <span>Cliente / Minhas promoções</span>
                    <VerificarAcesso nivel={10}>
                        <div className='btn-nova-promocao' onClick={() => AlterarStatusModal({ open: true, dados: null })}>Criar</div>
                    </VerificarAcesso>
                </div>                
                <div className="box-conteudo">
                    {
                        onLoad ? <LoadCard/> :
                        !listaPromocoes.length ? 
                        <section className='sessao-padrao sessao-promocao'>Nenhuma promoção encontrada</section> :
                        listaPromocoes.map(dadosPromocao => 
                        <PromocaoAreaCliente
                            key={dadosPromocao.id_promocao}
                            dadosPromocao={dadosPromocao}
                            editarRegistro={ () => AlterarStatusModal({ open: true, dados: dadosPromocao }) }
                            excluirRegistro={ () => excluirRegistro(dadosPromocao) }
                            publicarPromocao={ () => publicarPromocao(dadosPromocao) }
                        />)
                    }
                </div>
            </div>
            <Footer/>
        </div>
        {
            !StatusModal.open ? <></> : 
            <ModalPromocao
                dadosIniciais={StatusModal.dados}
                fecharModal={(dados) => fecharModal(dados)}
                novaMensagemModal={(dadosMensagem) => StatusMessage(dadosMensagem)}
            />
        }
        </>
    )
}