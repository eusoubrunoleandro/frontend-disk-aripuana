import React, { useCallback, useEffect, useState, useRef, useContext } from 'react';
import { useSearchParams } from 'react-router-dom'

import Header from '../../Components/Header'
import Api from '../../Services/Api';
import Footer from '../../Components/Footer';
import Messagers from '../../Components/Messagers'

import ImagemPadrãoPerfil from '../../assets/icon-usuario.png'
import InputForm from '../../Components/Forms/InputForm'
import TextareaForm from '../../Components/Forms/textareaForm'
import SelectCategoria from '../../Components/Forms/SelectCategoria';
import ApiCEP from '../../Services/ApiCep';
import { AuthContext } from '../../context/AuthContext';
import ImagemPerfil from '../../Components/ImagemPerfil';
import InputTelefones from '../../Components/Forms/InputTelefones';
import VerificarAcesso from '../../Components/VerificarAcesso';

export default function Pesquisa(){
    const [ meusDados, AlterarMeusDados ] = useState(null);
    const [ SeCarregandoDados, StatusCarregamentoDados ] = useState(true);
    const [ carregandoImagensVitrine, StatusCarregandoImagensVitrine ] = useState(true);
    const [ listaImagensVitrine, AlterarListaImagensVitrine ] = useState([]);
    const [ StatusSalvandoTelefones, MudarStatusSalvandoTelefones ] = useState(false);
    const [ StatusSalvandoDadosInicio, MudarStatusSalvandoDadosInicio ] = useState(false);
    const [ StatusSalvandoLinks, MudarStatusSalvandoLinks ] = useState(false);
    const [ StatusSalvandoEndereco, MudarStatusSalvandoEndereco ] = useState(false);
    const [ StatusSalvandoSobre, MudarStatusSalvandoSobre ] = useState(false);
    const [ parametrosSearch ] = useSearchParams();
    const { AlterarInformacoesLocais, dadosSessao: { dadosSessaoAtual } } = useContext(AuthContext)
    
    const [dadosCep, AlterarDadosCep] = useState(null);
    const [ imagePerfilPreview, AlterarImagePerfilPreview ] = useState(null);
    const [ message, NewMessage ] = useState(null);
    const RefimagemPerfi = useRef();

    const buscarMeusDados = useCallback(() => {
        (async () => {
            StatusCarregamentoDados(true)
            try{
                const response = await Api.get(`/negocio/meu-perfil`);
                const { content } = response.data;
                AlterarMeusDados(content[0])
                
                AlterarDadosCep({
                    cidade: content[0].cidade,
                    uf: content[0].uf,
                    pais: content[0].pais
                })

                AlterarImagePerfilPreview(content[0].image_perfil)
            } catch(error){
                NewMessage({ content: error })
            }
            StatusCarregamentoDados(false)
        })()
    }, [])

    const mostrarVitrine = useCallback(() => {
        (async () => {
            StatusCarregandoImagensVitrine(true)
            try{
                const response = await Api.get(`/vitrine/mostrar/meu-perfil`);
                const { content } = response.data;
                AlterarListaImagensVitrine(content)

            } catch(error){
                NewMessage({ content: error })
            }
            StatusCarregandoImagensVitrine(false)
        })()
    }, [])

    useEffect(() => {
        buscarMeusDados()
        mostrarVitrine()
    },[buscarMeusDados, mostrarVitrine])

    useEffect(() => {
        const errorParametros = parametrosSearch.get('error')
        if(errorParametros === "sem-permissao"){
            return NewMessage({ content: "Sem permissão para acessar a área do administrador!" })
        }

    }, [parametrosSearch])


    async function SalvarDadosInicio(event){
        event.preventDefault();

        MudarStatusSalvandoDadosInicio(true);

        try {
            const formulario = new FormData(event.target);
            const nome_negocio = formulario.get('nome_negocio')
            const categoria = formulario.get('categoria')
            const email_acesso = formulario.get('email_acesso')

            // Validando
            if(nome_negocio === ''){ return NewMessage({ content: "Nome do negócio não pode ser vazio!" })}
            if(categoria === ''){ return NewMessage({ content: "A categoria não pode ser vazio!" })}
            if(email_acesso === ''){ return NewMessage({ content: "O e-mail de acesso não pode ser vazio!" })}

            const dadosEnvioFormulario = { };
            if(nome_negocio !== ""){ dadosEnvioFormulario["nome_negocio"] = nome_negocio }
            if(categoria !== ""){ dadosEnvioFormulario["categoria"] = categoria }
            if(email_acesso !== ""){ dadosEnvioFormulario["email_acesso"] = email_acesso }

            const response = await Api.post('/alterar/meu-perfil/basico', dadosEnvioFormulario )
            const { message } = response.data;

            const formularioImagem = new FormData(event.target);
            const responseImagem = await Api.post('/alterar/meu-perfil/imagem_perfil', formularioImagem)
            const { url_image } = responseImagem.data;

            NewMessage({ content: message, type:"success" })

            AlterarInformacoesLocais({ image_perfil: url_image })
            window.location.reload();

        } catch (error) { NewMessage({ content: error }) }

        MudarStatusSalvandoDadosInicio(false);
    }

    async function SalvarDadosTelefones(event){
        event.preventDefault();

        MudarStatusSalvandoTelefones(true)
        try {
            const formulario = new FormData(event.target);

            const trocarValorWhatsapp = (whatsapp) => {
                return whatsapp === "on" ? "s" : "n"
            }

            const telefone_1 = [ formulario.get('telefone_1'), trocarValorWhatsapp(formulario.get("whatsapp_1")) ]
            const telefone_2 = [ formulario.get('telefone_2'), trocarValorWhatsapp(formulario.get("whatsapp_2")) ]
            const telefone_3 = [ formulario.get('telefone_3'), trocarValorWhatsapp(formulario.get("whatsapp_3")) ]
            const telefone_4 = [ formulario.get('telefone_4'), trocarValorWhatsapp(formulario.get("whatsapp_4")) ]

            const dadosFormulario = { telefone_1, telefone_2, telefone_3, telefone_4 }

            if(dadosFormulario.telefone_1[0] === ""){
                dadosFormulario['telefone_1'] = []
            }

            if(dadosFormulario.telefone_2[0] === ""){
                dadosFormulario['telefone_2'] = []
            }
            if(dadosFormulario.telefone_3[0] === ""){
                dadosFormulario['telefone_3'] = []
            }
            if(dadosFormulario.telefone_4[0] === ""){
                dadosFormulario['telefone_4'] = []
            }

            const response = await Api.put('/alterar/meu-perfil/telefones', dadosFormulario )
            const { message } = response.data;
            NewMessage({ content: message, type:"success" })

        } catch (error) { NewMessage({ content: error }) }

        MudarStatusSalvandoTelefones(false)
    }

    async function _SalvarLinks(event){
        event.preventDefault();

        MudarStatusSalvandoLinks(true);

        try {
            const formulario = new FormData(event.target);
            
            const link_instagram = formulario.get('link_instagram')
            const link_facebook = formulario.get('link_facebook')
            const link_site = formulario.get('link_site')
            const email_comercial = formulario.get('email_comercial')

            const response = await Api.put('/alterar/meu-perfil/links', { 
                link_facebook, 
                link_instagram, 
                link_site, 
                email_comercial 
            })             
            const { message } = response.data;
            NewMessage({ content: message, type:"success" })


        } catch (error) { NewMessage({ content: error }) }

        MudarStatusSalvandoLinks(false);
    }


    async function _SalvarEndereco(event){
        event.preventDefault();

        MudarStatusSalvandoEndereco(true);

        try {
            const formulario = new FormData(event.target);
            
            const cep = formulario.get('cep')
            const endereco = formulario.get('endereco')

            const dadosEndereco = {
                endereco,
                cep,
                cidade: dadosCep.cidade,
                uf: dadosCep.uf,
                pais: dadosCep.pais
            }

            const response = await Api.put('/alterar/meu-perfil/endereco', dadosEndereco )             
            const { message } = response.data;
            NewMessage({ content: message, type:"success" })

        } catch (error) { NewMessage({ content: error }) }

        MudarStatusSalvandoEndereco(false);
    }

    async function buscaDadosCep(cep){

        try {
            if(cep==="") return NewMessage({content:"Campo CEP é obrigatório. Preencha por favor!"})

            const response = await ApiCEP.get(`/${cep}/json/`)
            const { data : dados_resposta } = response;

            AlterarDadosCep({
                cidade: dados_resposta.localidade,
                uf: dados_resposta.uf,
                pais: "Brasil"
            })            
        } catch (error) { NewMessage({ content: error }) }    
    }

    function AlterandoValorInputCep(campo){
        const { cep } = campo
        if(cep.length === 8){
            buscaDadosCep(cep)
            return NewMessage({ content: "Buscando dados do CEP. Aguarde!", type:"await" })
        }
    }

    async function _SalvarSobre(event){
        event.preventDefault();

        MudarStatusSalvandoSobre(true);

        try {
            const formulario = new FormData(event.target);
            const descricao_negocio = formulario.get('descricao_negocio')

            const response = await Api.put('/alterar/meu-perfil/sobre', { descricao_negocio } )             
            const { message } = response.data;
            NewMessage({ content: message, type:"success" })

        } catch (error) { NewMessage({ content: error }) }

        MudarStatusSalvandoSobre(false);
    }

    function _alterarImagePerfil(){
        const image_perfil = RefimagemPerfi.current.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            AlterarImagePerfilPreview(reader.result);
        }        

        if(image_perfil) reader.readAsDataURL(image_perfil)
        else AlterarImagePerfilPreview(null);
    }

    return(
        <div className='box-area-cliente'>
            <Messagers message={message}/>
            <Header title='Meus dados | Cliente - Disk Aripuanã'/>
            <div className='controle area-cliente'>
                <div className='titulos-paginas'>
                    Você está em <span>Cliente / Meus dados</span>
                </div>

                <div className="box-conteudo">
                    {
                        SeCarregandoDados ? 
                        <section className='sessao-padrao'>
                            <h1>Carregando dados...</h1>
                        </section> :
                        <>
                        <section className='sessao-padrao'>
                            <form onSubmit={event => SalvarDadosInicio(event)}>
                                <div className='titulo'>
                                    <h1>Dados iniciais</h1>
                                    <div className='botoes-acao'>
                                        {
                                            StatusSalvandoDadosInicio ? <div id="indicador-salvando">Salvando...</div> : 
                                            <button type="submit">Salvar</button>
                                        }
                                    </div>
                                </div>
                                <div className='conteudo'>
                                    <div className='ladoalado'>
                                        <div className='imagem-perfil'>
                                            <label>
                                            <div>
                                                <img src={ imagePerfilPreview || ImagemPadrãoPerfil } alt="Imagem de perfil"/>
                                            </div>
                                            <h2>Clique e altere sua imagem</h2>
                                            <input 
                                                ref={RefimagemPerfi}
                                                type="file" 
                                                name="image_perfil"
                                                onChange={() => _alterarImagePerfil()}
                                            />
                                            </label>
                                        </div>
                                        <div id="primeiroscampos">
                                            <InputForm
                                                name='nome_negocio'
                                                required={true}
                                                label="Nome do seu negócio"
                                                modo='claro'
                                                defaultValue={ meusDados.nome_negocio }
                                                autoFocus
                                            />

                                            <SelectCategoria
                                                name='categoria'
                                                required={true}
                                                modo='claro'
                                                newMessage={message => NewMessage(message) }
                                                defaultValue={ `${meusDados.id_categoria} - ${ meusDados.nome_categoria }` }
                                            />

                                            <InputForm
                                                name='email_acesso'
                                                required={true}
                                                label="E-mail de acesso"
                                                modo='claro'
                                                defaultValue={ meusDados.email_acesso }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </section>

                        <section className='sessao-padrao'>
                            <form onSubmit={ SalvarDadosTelefones }>
                                <div className='titulo'>
                                    <h1>Telefones</h1>
                                    <div className='botoes-acao'>
                                        {
                                            StatusSalvandoTelefones ? <div id="indicador-salvando">Salvando...</div> : 
                                            <button type="submit">Salvar</button>
                                        }
                                    </div>
                                </div>
                                <div className='conteudo'>

                                    <div className='ladoalado'>
                                        <InputTelefones
                                            name={1}
                                            label="Telefone"
                                            modo='claro'
                                            defaultValue={ meusDados.telefone_1 === null ? "" : meusDados.telefone_1}
                                        />

                                        <VerificarAcesso nivel={2}>
                                            <InputTelefones
                                                name={2}
                                                label="Telefone"
                                                modo='claro'
                                                disabled={dadosSessaoAtual.tipo_acesso > 1 ? "" : "disabled"}
                                                defaultValue={ meusDados.telefone_1 === null ? "" : meusDados.telefone_2}
                                            />
                                        </VerificarAcesso>
                                    </div>

                                    <VerificarAcesso nivel={2}>
                                    <div className='ladoalado'>
                                        <InputTelefones
                                            name={3}
                                            label="Telefone"
                                            modo='claro'
                                            defaultValue={ meusDados.telefone_1 === null ? "" : meusDados.telefone_3}
                                            disabled={dadosSessaoAtual.tipo_acesso > 1 ? "" : "disabled"}
                                        />
                                        
                                        <InputTelefones
                                            name={4}
                                            label="Telefone"
                                            modo='claro'
                                            defaultValue={ meusDados.telefone_1 === null ? "" : meusDados.telefone_4}
                                            disabled={dadosSessaoAtual.tipo_acesso > 1 ? "" : "disabled"}
                                        />
                                    </div>
                                    </VerificarAcesso>
                                </div>
                            </form>
                        </section>

                        <VerificarAcesso nivel={2}>
                            <section className='sessao-padrao'>
                                <form onSubmit={ _SalvarLinks }>
                                    <div className='titulo'>
                                        <h1>Outras formas de contato</h1>
                                        <div className='botoes-acao'>
                                            {
                                                StatusSalvandoLinks ? <div id="indicador-salvando">Salvando...</div> : 
                                                <button type="submit">Salvar</button>
                                            }
                                        </div>
                                    </div>
                                    <div className='conteudo'>
                                        <div className='ladoalado'>
                                            <InputForm
                                                name='link_instagram'
                                                label="Link do Instagram"
                                                modo='claro'
                                                defaultValue={ meusDados.link_instagram }
                                                disabled={dadosSessaoAtual.tipo_acesso > 1 ? "" : "disabled"}
                                            />

                                            <InputForm
                                                name='link_facebook'
                                                label="Link do Facebook"
                                                modo='claro'
                                                defaultValue={ meusDados.link_facebook }
                                                disabled={dadosSessaoAtual.tipo_acesso > 1 ? "" : "disabled"}
                                            />
                                        </div>
                                        <div className='ladoalado'>

                                            <InputForm
                                                name='link_site'
                                                label="Link do site"
                                                modo='claro'
                                                defaultValue={ meusDados.link_site }
                                                disabled={dadosSessaoAtual.tipo_acesso > 1 ? "" : "disabled"}
                                            />

                                            <InputForm
                                                name='email_comercial'
                                                label="E-mail comercial"
                                                modo='claro'
                                                defaultValue={ meusDados.email_comercial }
                                                disabled={dadosSessaoAtual.tipo_acesso > 1 ? "" : "disabled"}
                                                type="mail"
                                            />
                                        </div>

                                    </div>
                                </form>
                            </section>
                        </VerificarAcesso>

                        <VerificarAcesso nivel={2}>
                            <section className='sessao-padrao'>
                                <form onSubmit={ _SalvarEndereco }>
                                    <div className='titulo'>
                                        <h1>Endereço</h1>
                                        <div className='botoes-acao'>
                                            {
                                                StatusSalvandoEndereco ? <div id="indicador-salvando">Salvando...</div> : 
                                                <button type="submit">Salvar</button>
                                            }
                                        </div>
                                    </div>
                                    <div className='conteudo'>

                                        <InputForm
                                            name='endereco'
                                            required={false}
                                            label="Endereço"
                                            modo='claro'
                                            defaultValue={ meusDados.endereco }
                                            disabled={dadosSessaoAtual.tipo_acesso > 1 ? "" : "disabled"}
                                        />

                                        <InputForm
                                            name='cep'
                                            required={true}
                                            label="CEP"
                                            modo='claro'
                                            defaultValue={ meusDados.cep }
                                            onChange={ dados => AlterandoValorInputCep(dados) }
                                        />

                                        <div className='cidade-formulario'>
                                            <span>Dados do CEP acima:</span>
                                            Cidade de { dadosCep.cidade } - { dadosCep.uf } | { dadosCep.pais }
                                        </div>                               

                                    </div>
                                </form>
                            </section>
                        </VerificarAcesso>

                        <section className='sessao-padrao'>
                            <form onSubmit={ _SalvarSobre }>
                                <div className='titulo'>
                                    <h1>Conte mais sobre você</h1>
                                    <div className='botoes-acao'>
                                        {
                                            StatusSalvandoSobre ? <div id="indicador-salvando">Salvando...</div> : 
                                            <button type="submit">Salvar</button>
                                        }
                                    </div>
                                </div>
                                <div className='conteudo'>
                                    <TextareaForm
                                        name='descricao_negocio'
                                        required={false}
                                        label="Descrição do negócio"
                                        modo='claro'
                                        maxLength='500'
                                        defaultValue={ meusDados.descricao_negocio }
                                        disabled={dadosSessaoAtual.tipo_acesso > 1 ? "" : "disabled"}
                                    />
                                </div>
                            </form>
                        </section>

                        <VerificarAcesso nivel={2}>
                            <section className='sessao-padrao'>
                                    <div className='titulo'>
                                        <h1>Minha vitrine | Imagens sobre o meu negócio</h1>
                                    </div>
                                    {
                                        carregandoImagensVitrine ? <h3>Buscando imagens da vitrine</h3> :
                                        <div className='conteudo'>
                                            <div className='ladoalado'>
                                                <ImagemPerfil sequencia={1} NewMessage={content => NewMessage(content)} dadosImagem={listaImagensVitrine}/>
                                                <ImagemPerfil sequencia={2} NewMessage={content => NewMessage(content)} dadosImagem={listaImagensVitrine}/>
                                            </div>
                                            <div className='ladoalado'>
                                                <ImagemPerfil sequencia={3} NewMessage={content => NewMessage(content)} dadosImagem={listaImagensVitrine}/>
                                                <ImagemPerfil sequencia={4} NewMessage={content => NewMessage(content)} dadosImagem={listaImagensVitrine}/>
                                            </div>
                                            <ImagemPerfil sequencia={5} destaque={true} NewMessage={content => NewMessage(content)} dadosImagem={listaImagensVitrine}/>
                                        </div>
                                    }
                            </section>
                        </VerificarAcesso>
                        </>
                    }
                </div>
            </div>
            <Footer/>
        </div>
    )
}