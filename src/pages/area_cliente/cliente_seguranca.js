import React, { useState, useRef, useContext } from 'react';

import Header from '../../Components/Header'
import Api from '../../Services/Api';
import Footer from '../../Components/Footer';
import Messagers from '../../Components/Messagers'
import InputForm from '../../Components/Forms/InputForm'
import { AuthContext } from '../../context/AuthContext';

export default function Pesquisa(){
    const [ message, StatusMessage ] = useState(null);
    const [ senhaParaExcluirConta, StatussenhaParaExcluirConta ] = useState(null)
    const { Sair } = useContext(AuthContext)

    const formSenhas = useRef();

    function Pesquisar (texto){
    }

    const salvarSenhas = async (event) => {
        event.preventDefault()

        const dadosFormulario = new FormData(formSenhas.current)
        const senha1 = dadosFormulario.get('senha1')
        const senha2 = dadosFormulario.get('senha2')

        if(senha1 === "" || senha2 === ""){
            return StatusMessage({ content: "Preencha os dois campos com a nova senha!" })
        }

        if(senha1 !== senha2){
            return StatusMessage({ content: "As senhas não são iguais!" })
        }

        try {
            const response = await Api.put('/negocio/alterar-senha', { senha_nova: senha1 })
            const { message } = response.data;
            StatusMessage({ content: message, type: "success" })

        } catch (error) {
            StatusMessage({ content: error })
        }
    }

    const excluirConta = async () => {
        if(senhaParaExcluirConta === null){
            return StatusMessage({ content: "Digite sua senha para poder excluir sua conta!" })
        }

        try {
            const response = await Api.post('/negocio/excluir-conta', { senha: senhaParaExcluirConta })
            const { message } = response.data;

            StatusMessage({ content: message, type: 'success' })
            setTimeout(() => {
                Sair();
            }, 3000);
        } catch (error) {
            StatusMessage({ content: error.response !== undefined ? error.response.data.message : error.message })
        }
    }

    return(
        <div className='box-area-cliente'>
            <Messagers message={message}/>
            <Header onPesquisa={content => Pesquisar(content)} title='Minha segurança | Cliente - Disk Aripuanã'/>
            <div className='controle area-cliente'>
                <div className='titulos-paginas'>
                    Você está em <span>Cliente / Minha segurança</span>
                </div>

                <div className="box-conteudo">
                    <section className='sessao-padrao'>
                        <form ref={formSenhas}>
                            <div className='titulo'>
                                <h1>Trocar a senha da minha conta</h1>
                                <div className='botoes-acao'>
                                    <button onClick={salvarSenhas}>Salvar</button>
                                </div>
                            </div>
                            <div className='conteudo'>
                                <div className='ladoalado'>
                                    <InputForm
                                        name='senha1'
                                        required={true}
                                        label="Nova senha"
                                        modo='claro'
                                        type="password"
                                    />

                                    <InputForm
                                        name='senha2'
                                        required={true}
                                        label="Repita a nova senha"
                                        modo='claro'
                                        type="password"
                                    />
                                </div>
                            </div>
                        </form>
                    </section>
                    <section className='sessao-padrao'>
                        <div className='titulo'>
                            <h1>Excluir a conta</h1>
                        </div>
                        <div className='conteudo'>
                            <InputForm
                                name='senha_para_excluir'
                                required={true}
                                label="Digite sua senha"
                                modo='claro'
                                type="password"
                                onChange={senha => StatussenhaParaExcluirConta(senha.senha_para_excluir)}
                            />
                            <h5 style={{color: 'red'}}>Tenha cuidado, pois essa ação não tem como reverter!</h5>
                            <button className='botao botao-vermelho' onClick={() => excluirConta()}>Excluir conta</button>
                        </div>
                    </section>
                </div>
            </div>
            <Footer/>
        </div>
    )
}