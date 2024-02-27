import React,{ useEffect, useState } from 'react'

import InputForm from '../Forms/InputForm'
import TextareaForm from '../Forms/textareaForm';
import api from '../../Services/Api'
import ImagemPromocao from '../ImagemPromocao';

export default function ModalImagensPromocao({
    dadosIniciais, 
    abrir = false, 
    fecharModal = () => {}, 
    novaMensagemModal = () => {} 
}){
    const [ dadosModal, alterarDadosModal ] = useState({})
    const [ dataMinimaFinal, StatusDataMinimaFinal ] = useState(null)
    // const [ StatusSalvando, AlterarStatusSalvando ] = useState(false);

    useEffect(() => {
        alterarDadosModal(dadosIniciais)      

    }, [dadosIniciais])

    async function CriarRegistro(e){

        // if(StatusSalvando){
        //     return novaMensagemModal({ content: "Estamos salvando, aguarde!" })
        // }

        try {
            const formulario = new FormData(e.target);
            const nome_promocao = formulario.get('nome_promocao')
            const descricao_promocao = formulario.get('descricao_promocao')
            const inicio_promocao = formulario.get('inicio_promocao')
            const fim_promocao = formulario.get('fim_promocao')

            if(nome_promocao === "") { return novaMensagemModal({ content: "Nome da promoção não pode ser vazio!" }) }
            if(descricao_promocao === "") { return novaMensagemModal({ content: "Descrição da promoção não pode ser vazio!" }) }
            if(inicio_promocao === "") { return novaMensagemModal({ content: "A data de início da promoção não pode ser vazio!" }) }
            if(fim_promocao === "") { return novaMensagemModal({ content: "A data de finalização da promoção não pode ser vazio!" }) }

            const response = await api.post(`/`, formulario)
            const { content } = response.data;

            novaMensagemModal({ content: "Promoção criada!", type: "success" })
            fecharModal({novoRegistro: true, conteudo: content})

        } catch (error) { 
            return novaMensagemModal({ content: error }) }
    }

    function SalvarFormulario(e){
        e.preventDefault();
        CriarRegistro(e);
    }


    if(!abrir){
        return <></>
    }

    return(
        <div className='modal-geral'>
        <div className='controle'>
            <form onSubmit={SalvarFormulario}>
                <section className='sessao-padrao'>
                    <div className='titulo'>
                        <h1>Título e descrição</h1>
                    </div>
                    <div className='conteudo'>
                        <InputForm 
                            name='nome_promocao'
                            required={true}
                            label="Nome da promoção"
                            modo='claro'
                            defaultValue={dadosModal === null ? "" : dadosModal.nome_promocao}
                        />

                        <TextareaForm
                            name='descricao_promocao'
                            required={true}
                            label="Descrição da promoção"
                            modo='claro'
                            defaultValue={dadosModal === null ? "" : dadosModal.descricao_promocao}
                        />
                    </div>
                </section>

                <section className='sessao-padrao'>
                    <div className='titulo'>
                        <h1>Início e término da promoção</h1>
                    </div>
                    <div className='conteudo'>
                        <div className='ladoalado'>
                            <InputForm
                                name='inicio_promocao'
                                label='Início da promoção'
                                required={true}
                                modo='claro'
                                type="date"
                                defaultValue={dadosModal === null ? "" : dadosModal.inicio_promocao}
                                onChange={ conteudo => StatusDataMinimaFinal(conteudo.inicio_promocao) }
                            />

                            <InputForm
                                name='fim_promocao'
                                label='Fim da promoção'
                                required={true}
                                modo='claro'
                                type='date'
                                defaultValue={dadosModal === null ? "" : dadosModal.fim_promocao}
                                min={ dataMinimaFinal }
                            />
                        </div>
                    </div>
                </section>

                <section className='sessao-padrao'>
                    <div className='titulo'>
                        <h1>Imagens da promoção</h1>
                    </div>
                    <div className='conteudo box-control-promocao'>
                        <ImagemPromocao  indicador={1} dadosImagem={dadosIniciais === null ? null : dadosIniciais.imagem_promocao[0]}/>
                        <ImagemPromocao  indicador={2} dadosImagem={dadosIniciais === null ? null : dadosIniciais.imagem_promocao[1]}/>
                        <ImagemPromocao  indicador={3} dadosImagem={dadosIniciais === null ? null : dadosIniciais.imagem_promocao[2]}/>
                        <ImagemPromocao  indicador={4} dadosImagem={dadosIniciais === null ? null : dadosIniciais.imagem_promocao[3]}/>
                        <ImagemPromocao  indicador={5} dadosImagem={dadosIniciais === null ? null : dadosIniciais.imagem_promocao[4]}/>
                        <ImagemPromocao  indicador={6} dadosImagem={dadosIniciais === null ? null : dadosIniciais.imagem_promocao[5]}/>
                        <ImagemPromocao  indicador={7} dadosImagem={dadosIniciais === null ? null : dadosIniciais.imagem_promocao[6]}/>
                        <ImagemPromocao  indicador={8} dadosImagem={dadosIniciais === null ? null : dadosIniciais.imagem_promocao[7]}/>
                        <ImagemPromocao  indicador={9} dadosImagem={dadosIniciais === null ? null : dadosIniciais.imagem_promocao[8]}/>
                        <ImagemPromocao  indicador={10} dadosImagem={dadosIniciais === null ? null : dadosIniciais.imagem_promocao[9]}/>
                    </div>
                </section>
                <div className='botoes-acao-modals'>
                    <div onClick={ () => fecharModal(null) }>Sair sem salvar</div>
                    <button type="submit">Salvar</button>
                </div>
                </form>
            </div>
        </div>
    )
}