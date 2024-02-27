import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Main.css';
import Header from '../../Components/Header'
import { Form } from '@unform/web'
import Input from '../../Components/Forms/Input'
import Messagers from '../../Components/Messagers';
import Logotipo from '../../assets/logotipo.png'
import { CadastroContext } from '../../context/CadastroContext'


export default function Cadastrar1(){
    const [ message, newMessage ] = useState(null);
    const { dadosCadastro, AlterarCadastro } = useContext(CadastroContext)

    function onSubmit(dataForm){
        const { email_acesso, senha_acesso } = dataForm;
        if(email_acesso==="") return newMessage({content:"Campo usuário é obrigatório"})
        if(senha_acesso==="") return newMessage({content:"Campo senha é obrigatório"})

        AlterarCadastro(Object.assign(dadosCadastro, dataForm), '/cadastrar/4/')
    }

    return(
        <>
        <Header title='Cadastrar - etapa 3 | Disk Aripuanã' clear={true}/>
        <Messagers message={message}/>
        <div className='control-login'>
            <div className='header'>
                <div className='logotipo'>
                    <img src={Logotipo} alt="Logotipo do Disk Aripuanã"/>
                </div>
                <div className='header-titles'>
                    <h2>Cadastrar</h2>
                    <span>Dados importante para seu acesso!</span>
                </div>
                <div className='indicador-sessao'>
                    <span>3</span> de 4
                </div>
            </div>
            <div className='content'>
                <Form onSubmit={onSubmit} initialData={{ email_acesso: dadosCadastro.email_acesso, senha_acesso: dadosCadastro.senha_acesso }}>
                    <Input name="email_acesso" type="text" label='E-mail de acesso' required/>
                    <Input name="senha_acesso" type="password" label='Senha de acesso' required/>
                    <button type="submit" className='submit'>Próximo</button>
                </Form>
            </div>
            <div className='buttons-generais'>
            <Link to={'/cadastrar/2/'}>Anterior</Link>
            </div>
        </div>
        </>
    )
}