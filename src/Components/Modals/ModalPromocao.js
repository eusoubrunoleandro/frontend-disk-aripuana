import React,{ useCallback, useEffect, useRef, useState } from 'react'

import InputForm from '../Forms/InputForm'
import TextareaForm from '../Forms/textareaForm';
import api from '../../Services/Api'
import IconAdicionarImagem from '../../assets/icon-novo.png'
import IconExcluirImagem from '../../assets/icon-x-close.png';

export default function ModalAlteracaoPromocao({
    dadosIniciais = null,
    fecharModal = () => {}, 
    novaMensagemModal = () => {}
}){
    const [ dadosModal, alterarDadosModal ] = useState(null)
    const [ dataMinimaFinal, StatusDataMinimaFinal ] = useState(null)
    const [ StatusSalvando, AlterarStatusSalvando ] = useState(false);
    const [ StatusSalvandoImagem, AlterarStatusSalvandoImagem ] = useState(false);
    const [ listaImagensPromocao, alterarListaImagensPromocao ] = useState([]);
    const imagem_promocao_ref = useRef();

    const buscarImagensPromocao = useCallback(async () => {
        try {
            const response = await api.get(`/promocao/listar-imagem/${dadosModal.id_promocao}`)
            const { content } = response.data;
            alterarListaImagensPromocao(content);
        } catch (error) {
            novaMensagemModal({ content: error })
        }
    }, [dadosModal, novaMensagemModal])

    useEffect(() => {
        alterarDadosModal(dadosIniciais)
    }, [dadosIniciais])


    useEffect(() => {      
        if(dadosModal !== null){
            buscarImagensPromocao()
        }

    }, [dadosModal, buscarImagensPromocao])

    async function CriarRegistro(e){

        if(StatusSalvando){
            return novaMensagemModal({ content: "Estamos salvando, aguarde!" })
        }

        AlterarStatusSalvando(true)

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

            const response = await api.post(`/minhas-promocao/inserir`, { nome_promocao, descricao_promocao, inicio_promocao, fim_promocao })
            const { content } = response.data;

            novaMensagemModal({ content: "Promoção criada!", type: "success" })
            alterarDadosModal(content)
            fecharModal({novoRegistro: true, conteudo: content})

        } catch (error) { 
            return novaMensagemModal({ content: error })
        }
        AlterarStatusSalvando(false)
    }

    function SalvarFormulario(e){
        e.preventDefault();

        if(dadosIniciais !== null){

        }
        else{
            CriarRegistro(e);
        }
    }

    const AddImagemPromocao = async () => {
        AlterarStatusSalvandoImagem(true)
        try {
            const dadosImagem = imagem_promocao_ref.current.files[0]

            const file = new FormData();
            file.append('imagem_promocao', dadosImagem)

            const response = await api.post(`/promocao/adicionar-imagem/${dadosModal.id_promocao}`, file)
            const { content } = response.data;
            alterarListaImagensPromocao(item => {
                item.push(content)
                return item
            })
        } catch (error) { novaMensagemModal({ content: error }) }
        AlterarStatusSalvandoImagem(false)
    }

    const ExcluirImagem = async (id_imagem_promocao) => {
        const confirmar = window.confirm('Deseja excluir essa imagem?');

        if(!confirmar){
            return '';
        }
        try {
            const response = await api.delete(`/promocao/excluir-imagem/${id_imagem_promocao}`)
            const { message } = response.data;
            novaMensagemModal({ content: message, type:"success" })
        } catch (error) {
            novaMensagemModal({content: error})
        }
    }

    const AdicionarCapa = async (id_imagem_promocao) => {
        try {
            const response = await api.put(`/promocao/adicionar-capa/${dadosModal.id_promocao}`, { imagem_capa_promocao: id_imagem_promocao })
            const { message } = response.data;
            novaMensagemModal({ content: message, type:"success" })
            alterarDadosModal(dadosAntigos => Object.assign(dadosAntigos, { imagem_capa_promocao: id_imagem_promocao }))
        } catch (error) {
            novaMensagemModal({content: error})
        }
    }

    const RemoverCapa = async () => {
        try {
            const response = await api.put(`/promocao/adicionar-capa/${dadosModal.id_promocao}`, { imagem_capa_promocao: null })
            const { message } = response.data;
            novaMensagemModal({ content: message, type:"success" })
            alterarDadosModal(dadosAntigos => Object.assign(dadosAntigos, { imagem_capa_promocao: null }))
        } catch (error) {
            novaMensagemModal({content: error})
        }
    }

    const Previews = ({ dadosImagem }) => {
        return(
            <div className='box-add-imagem-promocao'>
                    {
                        dadosModal.imagem_capa_promocao !== dadosImagem.id_imagem_promocao ? 
                        <div className='adicionar-capa' title='Adicionar esta imagem como capa desta promoção' onClick={() => AdicionarCapa(dadosImagem.id_imagem_promocao)}>Usar como capa</div>
                            : 
                        <div className='adicionar-capa' title='Remover esta imagem como capa desta promoção' onClick={() => RemoverCapa()}>Capa</div>
                    }
                <div className='botao-excluir' title='Excluir imagem' onClick={() => ExcluirImagem(dadosImagem.id_imagem_promocao)}> <img src={IconExcluirImagem} alt="Excluir imagem"/> </div>
                <div className='preview-promocao'>
                    <img src={dadosImagem.url_imagem} alt={`Imagem da promoção`}/>
                </div>
            </div>
        )
    }

    return(
        <div className='modal-geral'>
        <div className='controle'>
            <form onSubmit={fields => SalvarFormulario(fields)}>
                <section className='sessao-padrao'>
                    <div className='titulo'>
                        <h1>Título e descrição da promoção</h1>
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

                {
                    dadosModal === null ?
                    
                    <section className='sessao-padrao'>
                        <div className='titulo'>
                            <h1>Para adicionar imagens, você precisa salvar!</h1>
                        </div>
                    </section>

                    :

                    <section className='sessao-padrao'>
                        <div className='titulo'>
                            <h1>Imagens da promoção | Total de {listaImagensPromocao.length} imagens adicionadas</h1>
                            <div className='btn-adicionar-imagem'>
                                {
                                    StatusSalvandoImagem ? 
                                    <div className='box-aguardando-salvar'> <div/><div/><div/></div> :
                                    <label>
                                        <img src={IconAdicionarImagem} alt="Adicionar imagem"/>
                                        <input type="file" ref={imagem_promocao_ref} name="imagem_promocao" style={{ display: 'none' }} onChange={item => AddImagemPromocao(item)}/>
                                    </label>
                                }
                            </div>
                        </div>
                        <div className='conteudo box-control-promocao'>
                            {
                                !listaImagensPromocao.length ? <h1>Nenhuma imagem encontrada!</h1> : 
                                listaImagensPromocao.map(item => <Previews key={ item.id_imagem_promocao } dadosImagem={ item }/>)
                            }
                        </div>
                    </section>
                }

                <div className='botoes-acao-modals'>
                    <div onClick={ () => fecharModal(null) }>Sair sem salvar</div>
                    <button type="submit">{ StatusSalvando ? "Salvando" : "Salvar" }</button>
                </div>
                </form>
            </div>
        </div>
    )
}