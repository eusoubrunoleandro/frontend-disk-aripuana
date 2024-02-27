import React,{ useEffect, useRef, useState, useCallback } from 'react'
import api from '../../Services/Api';

import InputForm from '../Forms/InputForm'
import IconExcluir from '../../assets/icon-x-close.png';

export default function ModalPlanos({ 
    dadosIniciais, 
    abrir = false, 
    fecharModal = () => {}, 
    novaMensagemModal = () => {} 
}){
    const [ StatusMensagem, NovaMensagem ] = useState(null)
    const [ StatusSalvando, AlterarStatusSalvando ] = useState(false);
    const [ listaCaracteristica, AlterarListaCaracteristica ] = useState([]);
    const [ buscaCaracteristica, StatusBuscaCaracteristica ] = useState(false);
    const [ salvandoCaracteristica, StatusSalvandoCaracteristicas ] = useState(false);
    const formularioModal = useRef();

    useEffect(() => {
        novaMensagemModal(StatusMensagem)
    }, [ StatusMensagem, novaMensagemModal ])

    async function AlterarRegistro(){

        if(StatusSalvando){
            return NovaMensagem({ content: "Estamos salvando, aguarde!" })
        }

        AlterarStatusSalvando(true)
        try {
            const formulario = new FormData(formularioModal.current);
            const nome_plano = formulario.get('nome_plano')
            const valor = formulario.get('valor')

            const dadosEnvio = {};
            if(nome_plano !== dadosIniciais.nome_plano){
                dadosEnvio['nome_plano'] = nome_plano
            }
            if(valor !== dadosIniciais.valor){
                dadosEnvio['valor'] = valor
            }

            if(!Object.keys(dadosEnvio).length){
                NovaMensagem({ content: "Nenhuma alteração!", type: "await" })
                fecharModal(null)
                return '';
            }

            const response = await api.put(`/administrador/plano/alterar/${dadosIniciais.id_plano}`, dadosEnvio)
            const { message } = response.data;

            NovaMensagem({ content: message, type: "success" })
            fecharModal({novoRegistro: false, conteudo: Object.assign(dadosIniciais, dadosEnvio)})

        } catch (error) { return NovaMensagem({ content: error }) }
        AlterarStatusSalvando(false)
    }

    async function CriarRegistro(){

        if(StatusSalvando){
            return NovaMensagem({ content: "Estamos salvando, aguarde!" })
        }

        try {
            const formulario = new FormData(formularioModal.current);
            const nome_plano = formulario.get('nome_plano')
            const valor = formulario.get('valor')

            if(nome_plano === "") { return NovaMensagem({ content: "Nome do plano não pode ser vazio!" }) }
            if(valor === "") { return NovaMensagem({ content: "Valor do plano não pode ser vazio!" }) }

            const response = await api.post(`/administrador/plano/inserir`, { nome_plano, valor })
            const { content } = response.data;

            NovaMensagem({ content: "Plano criado!", type: "success" })
            fecharModal({novoRegistro: true, conteudo: content})

        } catch (error) { 
            return NovaMensagem({ content: error }) }
    }

    const CriarCaracteristica = async () => {
        StatusSalvandoCaracteristicas(true)
        const formulario = new FormData(formularioModal.current);
        const caracteristica = formulario.get('caracteristica')
        if(caracteristica === "") { return NovaMensagem({ content: "Caracteristica do plano não pode ser vazio!" }) }

        try {
            const response = await api.post(`/plano/caracteristica/cadastrar`, { 
                caracteristica, 
                id_plano: dadosIniciais.id_plano
            })
            const { content } = response.data;

            AlterarListaCaracteristica(listaAtual => listaAtual.concat(content))

        } catch (error) { 
            return NovaMensagem({ content: error })
        }

        StatusSalvandoCaracteristicas(false)
    }

    async function excluirCaracteristicas (dados) {
        try {
            const response = await api.delete(`/plano/caracteristica/deletar/${dados.id_plano_caracteristica}`)
            const { message } = response.data;
            NovaMensagem({ content: message, type: "success" })

            AlterarListaCaracteristica(listaAtual => listaAtual.filter(item => item.id_plano_caracteristica !== dados.id_plano_caracteristica))

        } catch (error) { 
            return NovaMensagem({ content: error })
        }
    }

    const buscarCaracteristicas = useCallback(async() => {
        StatusBuscaCaracteristica(true);
        try {
            const response = await api.get(`/plano/caracteristica/lista/${dadosIniciais.id_plano}`)
            const { content } = response.data;
            AlterarListaCaracteristica(content);
        } catch (error) {
            return NovaMensagem({ content: error })
        }
        StatusBuscaCaracteristica(false);
    }, [dadosIniciais])

    useEffect(() => {
        if(dadosIniciais !== null){
            buscarCaracteristicas();
        }
    },[dadosIniciais, buscarCaracteristicas])

    const BoxItemCaracteristicaPlano = ({dados}) =>{
        return(
            <div className='box-item-planos-caracteristicas'>
                <div className='texto'>
                    {dados.caracteristica}
                </div>
                <div className='excluir' onClick={() => excluirCaracteristicas(dados)}>
                    <img src={IconExcluir} alt="Excluir"/>
                </div>
            </div>
        )
    }

    if(!abrir){
        return <></>
    }

    return(
        <div className='modal-geral'>
            <div className='controle'>
                <form ref={formularioModal}>
                <section className='sessao-padrao'>
                    <div className='titulo'>
                        {
                            dadosIniciais === null ? 
                            <h1>Criando um novo Plano</h1>:
                            <h1>Alterando Plano</h1>
                        }
                    </div>
                    <div className='conteudo'>
                        <InputForm 
                            name='nome_plano'
                            required={true}
                            label="Nome do plano"
                            modo='claro'
                            defaultValue={dadosIniciais === null ? "" : dadosIniciais.nome_plano}
                        />

                        <InputForm 
                            name='valor'
                            required={true}
                            label="Valor do plano"
                            modo='claro'
                            defaultValue={dadosIniciais === null ? "" : dadosIniciais.valor}
                        />
                        
                    </div>
                </section>

                <section className='sessao-padrao'>
                    <div className='titulo'>
                        <h1>Características do plano</h1>
                    </div>
                    <div className='conteudo'>
                        <div className='ladoalado input-caracteristicas-planos'>
                            <InputForm 
                                name='caracteristica'
                                required={true}
                                label="Adicionar características"
                                modo='claro'
                            />
                            <div className={`botao ${ salvandoCaracteristica ? 'botaoDesativado' : "" }`} onClick={ () => CriarCaracteristica() }>
                                {
                                    salvandoCaracteristica ? "Salvando..." : "Salvar"
                                }
                            </div>
                        </div>
                    </div>
                    <div className='conteudo lista-caracteristicas-plano'>
                        {
                            buscaCaracteristica ? <h2>Carregando caracteristicas</h2> :
                            !listaCaracteristica.length ? <h2>Plano sem nenhuma caracteristica</h2> :
                            listaCaracteristica.map(item => 
                            <BoxItemCaracteristicaPlano key={item.id_plano_caracteristica} dados={item}/>)
                        }
                    </div>
                </section>

                <div className='botoes-acao-modals'>
                    <div onClick={ () => fecharModal(null) }>Sair sem salvar</div>
                    {
                        dadosIniciais === null ? 
                        <div onClick={ () => CriarRegistro() }>{StatusSalvando ? "Salvando" : "Salvar"}</div>
                        :
                        <div onClick={ () => AlterarRegistro() }>{StatusSalvando ? "Salvando" : "Salvar"}</div>
                    }
                </div>
                </form>
            </div>
        </div>
    )
}