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
    const { AlterarCadastro, dadosCadastro } = useContext(CadastroContext) 

    function onSubmit(dataForm){
        const { nome_negocio, telefone } = dataForm
        if(nome_negocio === "") { return newMessage({ content: "Campo nome do negocio é obrigatório e está vazio!" }) }
        if(telefone === "") { return newMessage({ content: "Campo telefone é obrigatório e está vazio!" }) }

        AlterarCadastro(Object.assign(dadosCadastro, dataForm), '/cadastrar/2/')
    }

    return(
        <>
        <Header title='Cadastrar - etapa 1 | Disk Aripuanã' clear={true}/>
        <Messagers message={message}/>
        <div className='control-login'>
            <div className='header'>
                <div className='logotipo'>
                    <img src={Logotipo} alt="Logotipo do Disk Aripuanã"/>
                </div>
                <div className='header-titles'>
                    <h2>Cadastrar</h2>
                    <span>Mostre para o todos o seu negócio!</span>
                </div>
                <div className='indicador-sessao'>
                    <span>1</span> de 4
                </div>
            </div>
            <div className='content'>
                <Form onSubmit={onSubmit} initialData={{ nome_negocio: dadosCadastro.nome_negocio, telefone: dadosCadastro.telefone }}>
                    <Input name="nome_negocio" type="text" label='Nome do negocio' required/>
                    <Input name="telefone" type="text" label='Telefone' required/>
                    <button type="submit" className='submit'>Próximo</button>
                </Form>
            </div>
            <div className='buttons-generais'>
                <Link className='link-destaque' to={'/login'}>Já possuo conta!</Link>
                <Link to={'/'}>Voltar a página inicial</Link>
            </div>
        </div>
        </>
    )
}