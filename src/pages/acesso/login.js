import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Main.css';
import Header from '../../Components/Header'
import { Form } from '@unform/web'
import Input from '../../Components/Forms/Input'
import Messagers from '../../Components/Messagers';
import Logotipo from '../../assets/logotipo.png'
import api from '../../Services/Api';
import { AuthContext } from '../../context/AuthContext';


export default function Login(){
    const [ message, newMessage ] = useState(null);
    const { Entrar } = useContext(AuthContext);
    const [ StatusSalvando, AlterarStatusSalvando ] = useState(false);

    async function onSubmit(dataForm){
        if(StatusSalvando){
            return newMessage({ content: "Estamos entrando, aguarde!", type: "await" })
        }

        AlterarStatusSalvando(true)
        try {
            const { email_acesso, senha_acesso } = dataForm;
            if(email_acesso==="") return newMessage({content:"Campo usuário é obrigatório"})
            if(senha_acesso==="") return newMessage({content:"Campo senha é obrigatório"})

            const response = await api.post('/acesso/login', dataForm)
            const { data : dados_resposta } = response;
            Entrar(dados_resposta)
        } catch (error) {
            newMessage({ content: error })
        }

        AlterarStatusSalvando(false)
    }

    return(
        <>
        <Header title='Login - Disk Aripuanã' clear={true}/>
        <Messagers message={message}/>
        <div className='control-login'>
            <div className='header'>
                <div className='logotipo'>
                    <img src={Logotipo} alt="Logotipo do Disk Aripuanã"/>
                </div>
                <div className='header-titles'>
                    <h2>Entrar</h2>
                    <span>Faça o login na sua conta e aproveite</span>
                </div>
            </div>
            <div className='content'>
                <Form onSubmit={onSubmit}>
                    <Input name="email_acesso" type="mail" label='E-mail de acesso' required/>
                    <Input name="senha_acesso" type="password" label='Senha' required/>
                    <button type="submit" className={`submit ${StatusSalvando ? "box-await" : ""}`}>{ StatusSalvando ? "Entrando" : "Entrar" }</button>
                </Form>
            </div>
            <div className='buttons-generais'>
                <Link to={'/trocar-senha'}>Esqueci minha senha!</Link>
                <Link className='link-destaque' to={'/cadastrar/1/'}>Cadastrar-me</Link>
                <Link to={'/'}>Voltar a página inicial</Link>
            </div>
        </div>
        </>
    )
}