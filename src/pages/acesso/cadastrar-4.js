import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Main.css';
import Header from '../../Components/Header'
import Messagers from '../../Components/Messagers';
import Logotipo from '../../assets/logotipo.png'
import Api from '../../Services/Api';
import SelectForm from '../../Components/Forms/SelectCategoria'
import { CadastroContext } from '../../context/CadastroContext'

export default function Cadastrar1(){
    const [ message, newMessage ] = useState(null);
    const [ opcaoSelecionada, AlterarOpcaoSelecionada ] = useState(null);
    const { dadosCadastro, AlterarCadastro } = useContext(CadastroContext)
    const [ salvando, StatusSalvando ] = useState(false);


    async function onSubmit(){

        if(salvando){ return newMessage({ content: "Estamos salvando os dados ainda! Aguarde", type: "await" }) }

        StatusSalvando(true)

        newMessage({ content: "Criando a conta! Aguarde...", type: "await" })
        
        try {
            
            if(opcaoSelecionada === null || opcaoSelecionada === 0 ) { return newMessage({content:"Selecione opção de categorias!"}) }

            const response = await Api.post('/acesso/cadastrar', Object.assign(dadosCadastro, { categoria: opcaoSelecionada }))
            const { message } = response.data;
            newMessage({ content: message, type: "success" })

            AlterarCadastro(Object.assign(dadosCadastro, opcaoSelecionada))
            
        } catch (error) {
            newMessage({ content: error })
        }

        StatusSalvando(false)
    }

    return(
        <>
        <Header title='Cadastrar - etapa 4 | Disk Aripuanã' clear={true}/>
        <Messagers message={message}/>
        <div className='control-login'>
            <div className='header'>
                <div className='logotipo'>
                    <img src={Logotipo} alt="Logotipo do Disk Aripuanã"/>
                </div>
                <div className='header-titles'>
                    <h2>Cadastrar</h2>
                    <span>Facilite as pessoas te encontrar!</span>
                </div>
                <div className='indicador-sessao'>
                    <span>4</span> de 4
                </div>
            </div>
            <div className='content select-cadastrar'>
                <SelectForm
                    name='categoria'
                    onChange={ content => AlterarOpcaoSelecionada(content) }
                    newMessage={ message => newMessage(message) }
                />
            </div>
            
            <button className='submit' onClick={() => onSubmit()}>
                {
                    salvando ? "Criando conta..." : "Finalizar Cadastro"
                }
            </button>

            <div className='buttons-generais'>
                <Link to={'/cadastrar/3/'}>Anterior</Link>
            </div>
        </div>
        </>
    )
}