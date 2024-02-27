import React,{ useEffect, useRef, useState } from 'react'
import api from '../../Services/Api';

import InputForm from '../Forms/InputForm'
import TextareaForm from '../Forms/textareaForm';

export default function ModalCategoria({ 
    dadosIniciais, 
    abrir = false, 
    fecharModal = () => {}, 
    novaMensagemModal = () => {} 
}){
    const [ StatusMensagem, NovaMensagem ] = useState(null)
    const [ StatusSalvando, AlterarStatusSalvando ] = useState(false);
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
            const nome_categoria = formulario.get('nome_categoria')
            const descricao_categoria = formulario.get('descricao_categoria')

            const dadosEnvio = {};
            if(nome_categoria !== dadosIniciais.nome_categoria){
                dadosEnvio['nome_categoria'] = nome_categoria
            }
            if(descricao_categoria !== dadosIniciais.descricao_categoria){
                dadosEnvio['descricao_categoria'] = descricao_categoria
            }

            if(!Object.keys(dadosEnvio).length){
                NovaMensagem({ content: "Nenhuma alteração!", type: "await" })
                fecharModal(null)
                return '';
            }

            const response = await api.put(`/administrador/categoria/alterar/${dadosIniciais.id_categoria}`, dadosEnvio)
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
            const nome_categoria = formulario.get('nome_categoria')
            const descricao_categoria = formulario.get('descricao_categoria')

            if(nome_categoria === "") { return NovaMensagem({ content: "Nome da categoria não pode ser vazio!" }) }
            if(descricao_categoria === "") { return NovaMensagem({ content: "Descrição da categoria não pode ser vazio!" }) }

            const response = await api.post(`/administrador/categoria/inserir`, { nome_categoria, descricao_categoria })
            const { content } = response.data;

            NovaMensagem({ content: "Categoria criada!", type: "success" })
            fecharModal({novoRegistro: true, conteudo: content})

        } catch (error) { 
            return NovaMensagem({ content: error }) }
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
                        <h1>Alterando categoria</h1>
                    </div>
                    <div className='conteudo'>
                        <InputForm 
                            name='nome_categoria'
                            required={true}
                            label="Nome da categoria"
                            modo='claro'
                            defaultValue={dadosIniciais === null ? "" : dadosIniciais.nome_categoria}
                        />

                        <TextareaForm
                            name='descricao_categoria'
                            required={true}
                            label="Descrição da categoria"
                            modo='claro'
                            defaultValue={dadosIniciais === null ? "" : dadosIniciais.descricao_categoria}
                        />
                        
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