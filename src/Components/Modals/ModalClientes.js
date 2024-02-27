import React,{ useCallback, useEffect, useRef, useState } from 'react'
import api from '../../Services/Api';
import ApiCEP from '../../Services/ApiCep';
import ImagemPadrãoPerfil from '../../assets/icon-usuario.png'
import InputForm from '../Forms/InputForm'
import TextareaForm from '../Forms/textareaForm';
import SelectCategoria from '../../Components/Forms/SelectCategoria';
import Select from '../../Components/Forms/SelectForm';
import InputTelefones from "../../Components/Forms/InputTelefones"

export default function ModalClientes({ 
    dadosIniciais, 
    abrir = false, 
    fecharModal = () => {}, 
    novaMensagemModal = () => {} 
}){
    const [ StatusMensagem, NovaMensagem ] = useState(null)
    const [ StatusSalvando, AlterarStatusSalvando ] = useState(false);
    const [ imagePerfilPreview, AlterarImagePerfilPreview ] = useState(null);
    const [dadosCep, AlterarDadosCep] = useState(null);
    const [listPlanos, AlterarListaPLanos] = useState([]);
    const [ atualizandoPlanos, AlterarStatusPlanos ] = useState(true)
    const formularioModal = useRef();

    useEffect(() => {
        novaMensagemModal(StatusMensagem)
    }, [ StatusMensagem, novaMensagemModal ])

    useEffect(() => {
        if(dadosIniciais !== null){
            AlterarDadosCep({
                cidade: dadosIniciais.cidade,
                uf: dadosIniciais.uf,
                pais: "Brasil"
            })
        }
    }, [dadosIniciais])

    const buscaPlanos = useCallback(async () => {
        AlterarStatusPlanos(true)
        try {
            const response = await api.get('/plano/busca')
            const { content } = response.data
            
            const PlanosTratados = content.map(item => {
                return{
                    valueId: `${item.id_plano} | ${item.nome_plano}`,
                    valor: `${item.id_plano} | ${item.nome_plano}`
                }
            })

            AlterarListaPLanos(PlanosTratados);
        } catch (error) { return NovaMensagem({ content: error }) }
        AlterarStatusPlanos(false)
    }, [])

    useEffect(() => {
        buscaPlanos();
    }, [buscaPlanos])

    const trocarValorWhatsapp = (whatsapp) => {
        return whatsapp === "on" ? "s" : "n"
    }

    async function AlterarRegistro(){

        if(StatusSalvando){
            return NovaMensagem({ content: "Estamos salvando, aguarde!" })
        }

        AlterarStatusSalvando(true)
        const formulario = new FormData(formularioModal.current);
            
        const nome_negocio = formulario.get('nome_negocio')
        const categoria = formulario.get('categoria')
        const email_acesso = formulario.get('email_acesso')
        const telefone_1 = [formulario.get('telefone_1'), trocarValorWhatsapp(formulario.get('whatsapp_1'))]
        const telefone_2 = [formulario.get('telefone_2'), trocarValorWhatsapp(formulario.get('whatsapp_2'))]
        const telefone_3 = [formulario.get('telefone_3'), trocarValorWhatsapp(formulario.get('whatsapp_3'))]
        const telefone_4 = [formulario.get('telefone_4'), trocarValorWhatsapp(formulario.get('whatsapp_4'))]
        const link_instagram = formulario.get('link_instagram')
        const link_facebook = formulario.get('link_facebook')
        const link_site = formulario.get('link_site')
        const email_comercial = formulario.get('email_comercial')
        const endereco = formulario.get('endereco')
        const cep = formulario.get('cep')
        const descricao_negocio = formulario.get('descricao_negocio')
        const plano_negocio = formulario.get('plano_negocio')
        const modo_premium = formulario.get('modo_premium')

        const dadosEnvio = {};

        dadosEnvio['nome_negocio'] = nome_negocio
        dadosEnvio['categoria'] = categoria
        dadosEnvio['email_acesso'] = email_acesso
        dadosEnvio['telefone_1'] = telefone_1
        dadosEnvio['telefone_2'] = telefone_2
        dadosEnvio['telefone_3'] = telefone_3
        dadosEnvio['telefone_4'] = telefone_4
        dadosEnvio['link_instagram'] = link_instagram
        dadosEnvio['link_facebook'] = link_facebook
        dadosEnvio['link_site'] = link_site
        dadosEnvio['email_comercial'] = email_comercial
        dadosEnvio['endereco'] = endereco         
        dadosEnvio['descricao_negocio'] = descricao_negocio
        dadosEnvio['cep'] = cep
        dadosEnvio['cidade'] = dadosCep.cidade
        dadosEnvio['uf'] = dadosCep.uf
        dadosEnvio['modo_premium'] = modo_premium === "normal" ? false : true;

        const id_plano_escolhido = plano_negocio.substring(0, plano_negocio.indexOf(' | '));
        if(id_plano_escolhido !== dadosIniciais.id_plano){
            dadosEnvio['plano_negocio'] = plano_negocio
        }

        try {
            const response = await api.put(`/administrador/negocio/alterar/${dadosIniciais.id_negocio}`, dadosEnvio)
            const { message } = response.data;

            NovaMensagem({ content: message, type: "success" })
            fecharModal({novoRegistro: false, conteudo: Object.assign(dadosIniciais, dadosEnvio)})

        } catch (error) { 
            NovaMensagem({ content: error }) 
        }
        AlterarStatusSalvando(false)
    }

    async function CriarRegistro(){

        if(StatusSalvando){
            return NovaMensagem({ content: "Estamos salvando, aguarde!" })
        }

        AlterarStatusSalvando(true)

        try {
            const formulario = new FormData(formularioModal.current);
            const nome_negocio = formulario.get('nome_negocio')
            const categoria = formulario.get('categoria')
            const email_acesso = formulario.get('email_acesso')
            const telefone_1 = formulario.get('telefone_1')
            const whatsapp_1 = trocarValorWhatsapp(formulario.get('whatsapp_1'))
            const telefone_2 = formulario.get('telefone_2')
            const whatsapp_2 = trocarValorWhatsapp(formulario.get('whatsapp_2'))
            const telefone_3 = formulario.get('telefone_3')
            const whatsapp_3 = trocarValorWhatsapp(formulario.get('whatsapp_3'))
            const telefone_4 = formulario.get('telefone_4')
            const whatsapp_4 = trocarValorWhatsapp(formulario.get('whatsapp_4'))
            const link_instagram = formulario.get('link_instagram')
            const link_facebook = formulario.get('link_facebook')
            const link_site = formulario.get('link_site')
            const email_comercial = formulario.get('email_comercial')
            const endereco = formulario.get('endereco')
            const cep = formulario.get('cep')
            const descricao_negocio = formulario.get('descricao_negocio')
            const plano_negocio = formulario.get('plano_negocio')
            const modo_premium = formulario.get('modo_premium')

            const dadosFormulario = {
                nome_negocio,
                email_acesso,
                modo_premium : modo_premium === "normal" ? false : true,
                
                telefone_1: [telefone_1, whatsapp_1],
                telefone_2: [telefone_2, whatsapp_2],
                telefone_3: [telefone_3, whatsapp_3],
                telefone_4: [telefone_4, whatsapp_4],
                
                link_instagram,
                link_facebook,
                link_site,
                email_comercial,
                endereco,
                cep,
                cidade: dadosCep.cidade,
                uf: dadosCep.uf,
                pais: 'brasil',
                descricao_negocio,

                plano_negocio,

                categoria,
            }


            // if(nome_categoria === "") { return NovaMensagem({ content: "Nome da categoria não pode ser vazio!" }) }
            // if(descricao_categoria === "") { return NovaMensagem({ content: "Descrição da categoria não pode ser vazio!" }) }

            const response = await api.post(`/administrador/negocio/inserir`, dadosFormulario)
            const { content } = response.data;

            NovaMensagem({ content: "Conta criada!", type: "success" })
            fecharModal({novoRegistro: true, conteudo: Object.assign(dadosFormulario, content)})

        } catch (error) {  return NovaMensagem({ content: error }) }

        AlterarStatusSalvando(false)
    }

    function _alterarImagePerfil(){

        const formulario = new FormData(formularioModal.current);
        const image_perfil = formulario.get('image_perfil');

        const reader = new FileReader();
        reader.onloadend = () => {
            AlterarImagePerfilPreview(reader.result);
        }

        if(image_perfil !== "") reader.readAsDataURL(image_perfil)
        else AlterarImagePerfilPreview(null);
    }

    async function buscaDadosCep(cep){

        try {
            if(cep==="") return NovaMensagem({content:"Campo CEP é obrigatório. Preencha por favor!"})

            const response = await ApiCEP.get(`/${cep}/json/`)
            const { data : dados_resposta } = response;

            AlterarDadosCep({
                cidade: dados_resposta.localidade,
                uf: dados_resposta.uf,
                pais: "Brasil"
            })            
        } catch (error) { NovaMensagem({ content: error }) }    
    }

    function AlterandoValorInputCep(campo){
        const { cep } = campo
        if(cep.length === 8){
            buscaDadosCep(cep)
            return NovaMensagem({ content: "Buscando dados do CEP. Aguarde!", type:"await" })
        }
    }

    if(!abrir){
        return <></>
    }

    return(
        <>
        <div className='modal-geral adm'>
            <div className='controle'>
                <form ref={formularioModal}>
                    <section className='sessao-padrao'>
                            <div className='titulo'>
                                <h1>{ dadosIniciais === null ? "Cadastrando uma nova conta" : "Alterando dados dessa conta" }</h1>
                            </div>
                            <div className='conteudo'>
                                <div className='imagem-perfil'>
                                    <div>
                                        <img src={ imagePerfilPreview || ImagemPadrãoPerfil } alt="Imagem de perfil"/>
                                    </div>
                                    <h2>Clique e altere sua imagem</h2>
                                    <input 
                                        type="file" 
                                        name="image_perfil"
                                        onChange={() => _alterarImagePerfil()}
                                    />
                                </div>
                                <InputForm
                                    name='nome_negocio'
                                    required={true}
                                    label="Nome do seu negócio"
                                    modo='claro'
                                    defaultValue={ dadosIniciais === null ? "" : dadosIniciais.nome_negocio }
                                />

                                <SelectCategoria
                                    name='categoria'
                                    modo='claro'
                                    newMessage={message => NovaMensagem(message) }
                                    defaultValue={ dadosIniciais === null ? "" :  `${dadosIniciais.id_categoria} - ${ dadosIniciais.nome_categoria }` }
                                />

                                <InputForm
                                    name='email_acesso'
                                    required={true}
                                    label="E-mail de acesso"
                                    modo='claro'
                                    defaultValue={  dadosIniciais === null ? "" : dadosIniciais.email_acesso }
                                />
                            </div>
                    </section>

                    <section className='sessao-padrao'>
                            <div className='titulo'>
                                <h1>Telefones</h1>
                            </div>
                            <div className='conteudo'>
                                <div className='ladoalado'>
                                    <InputTelefones
                                        name={1}
                                        label="Telefone"
                                        modo='claro'
                                        defaultValue={ dadosIniciais === null ? "" : dadosIniciais.telefone_1}
                                    />

                                    <InputTelefones
                                        name={2}
                                        label="Telefone"
                                        modo='claro'
                                        defaultValue={ dadosIniciais === null ? "" : dadosIniciais.telefone_2}
                                    />
                                </div>

                                <div className='ladoalado'>
                                    <InputTelefones
                                        name={3}
                                        label="Telefone"
                                        modo='claro'
                                        defaultValue={ dadosIniciais === null ? "" : dadosIniciais.telefone_3}
                                    />

                                    <InputTelefones
                                        name={4}
                                        label="Telefone"
                                        modo='claro'
                                        defaultValue={ dadosIniciais === null ? "" : dadosIniciais.telefone_4}
                                    />
                                </div>
                            </div>
                    </section>

                    <section className='sessao-padrao'>
                            <div className='titulo'>
                                <h1>Outras formas de contato</h1>
                            </div>
                            <div className='conteudo'>
                                <div className='ladoalado'>
                                    <InputForm
                                        name='link_instagram'
                                        label="Link do Instagram"
                                        modo='claro'
                                        defaultValue={ dadosIniciais === null ? "" : dadosIniciais.link_instagram }
                                    />

                                    <InputForm
                                        name='link_facebook'
                                        label="Link do Facebook"
                                        modo='claro'
                                        defaultValue={ dadosIniciais === null ? "" : dadosIniciais.link_facebook }
                                    />
                                </div>
                                <div className='ladoalado'>

                                    <InputForm
                                        name='link_site'
                                        label="Link do site"
                                        modo='claro'
                                        defaultValue={ dadosIniciais === null ? "" : dadosIniciais.link_site }
                                    />

                                    <InputForm
                                        name='email_comercial'
                                        label="E-mail comercial"
                                        modo='claro'
                                        defaultValue={ dadosIniciais === null ? "" : dadosIniciais.email_comercial }
                                        type="mail"
                                    />
                                </div>
                            </div>
                    </section>

                    <section className='sessao-padrao'>
                            <div className='titulo'>
                                <h1>Endereço</h1>
                            </div>
                            <div className='conteudo'>

                                <InputForm
                                    name='endereco'
                                    required={false}
                                    label="Endereço"
                                    modo='claro'
                                    defaultValue={ dadosIniciais === null ? "" : dadosIniciais.endereco }
                                />

                                <InputForm
                                    name='cep'
                                    required={true}
                                    label="CEP"
                                    modo='claro'
                                    defaultValue={ dadosIniciais === null ? "" : dadosIniciais.cep }
                                    onChange={ dados => AlterandoValorInputCep(dados) }
                                />

                                {
                                    dadosCep === null ? <></> :
                                    <div className='cidade-formulario'>
                                        <span>Dados do CEP acima:</span>
                                        Cidade de { dadosCep.cidade } - { dadosCep.uf } | { dadosCep.pais }
                                    </div>   
                                }                            

                            </div>
                    </section>

                    <section className='sessao-padrao'>
                            <div className='titulo'>
                                <h1>Conte mais sobre você</h1>
                            </div>
                            <div className='conteudo'>
                                <TextareaForm
                                    name='descricao_negocio'
                                    required={false}
                                    label="Descrição do negócio"
                                    modo='claro'
                                    maxLength='500'
                                    defaultValue={ dadosIniciais === null ? "" : dadosIniciais.descricao_negocio }
                                />
                            </div>
                    </section>

                    <section className='sessao-padrao'>
                        <div className='titulo'>
                            <h1>Plano que o cliente usa</h1>
                        </div>
                        <div className='conteudo'>
                            {
                                atualizandoPlanos ? <h1>Atualizando planos</h1> :
                                <Select 
                                    name="plano_negocio"
                                    modo='claro'
                                    defaultValue={ dadosIniciais === null ? "" : `${dadosIniciais.id_plano} | ${dadosIniciais.nome_plano}` }
                                    options={ listPlanos }
                                />
                            }
                            <Select 
                                name="modo_premium"
                                modo='claro'
                                defaultValue={ dadosIniciais === null ? "" : dadosIniciais.modo_premium }
                                options={ [ 
                                    {
                                        valueId: "normal",
                                        valor: "Visualização normal"
                                    },
                                    {
                                        valueId: "premium",
                                        valor: "Visualização premium"
                                    }
                                 ] }
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
        <div className='overlay' onClick={() => fecharModal(null)}/>
        </>
    )
}