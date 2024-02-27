import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Main.css';
import Header from '../../Components/Header'
import { Form } from '@unform/web'
import Input from '../../Components/Forms/Input'
import Messagers from '../../Components/Messagers';
import Logotipo from '../../assets/logotipo.png'
import api from '../../Services/Api';
import { LoadLine } from '../../Components/WhileLoad'
import { CadastroContext } from '../../context/CadastroContext'

export default function Cadastrar1(){
    const [ message, newMessage ] = useState(null);
    const [ dadosCep, AlterarCep ] = useState(null);
    const [ carregamento, alterarCarregamento ] = useState(false);    
    const { dadosCadastro, AlterarCadastro } = useContext(CadastroContext)

    async function onSubmit(dataForm){
        alterarCarregamento(true)
        try {
            const { cep } = dataForm;
            if(cep==="") return newMessage({content:"Campo cep é obrigatório"})

            const response = await api.get(`https://viacep.com.br/ws/${cep}/json/`)
            const { data : dados_resposta } = response;

            AlterarCep({
                cidade: dados_resposta.localidade,
                cep: dados_resposta.cep,
                uf: dados_resposta.uf,
                pais: "brasil"
            })
            
        } catch (error) {
            newMessage({ content: error })
        }
        alterarCarregamento(false)
    }

    function ProximaEtapa(){
        AlterarCadastro(Object.assign(dadosCadastro, dadosCep), '/cadastrar/3/')
    }

    return(
        <>
        <Header title='Cadastrar - etapa 2 | Disk Aripuanã' clear={true}/>
        <Messagers message={message}/>
        <div className='control-login'>
            <div className='header'>
                <div className='logotipo'>
                    <img src={Logotipo} alt="Logotipo do Disk Aripuanã"/>
                </div>
                <div className='header-titles'>
                    <h2>Cadastrar</h2>
                    <span>Alcance negocios locais!</span>
                </div>
                <div className='indicador-sessao'>
                    <span>2</span> de 4
                </div>
            </div>
            <div className='content'>
                <Form onSubmit={onSubmit} initialData={{ cep: dadosCadastro.cep }}>
                    <Input name="cep" type="text" label='Digite o seu CEP' required/>
                    {
                        carregamento ? <LoadLine/> :
                        dadosCep === null ? <></> :
                        <div className='mostrarCEP'>
                            <h3>Dados que esse CEP possui:</h3>
                            <div>CEP <span>{ dadosCep.cep }</span></div>
                            <div>Cidade de <span>{ dadosCep.cidade } - { dadosCep.uf }</span></div>
                        </div>
                    }                    
                    {
                        dadosCep === null ?
                        <button type="submit" className='submit'>Verificar CEP</button>   
                        : 
                        <button className='submit' onClick={() => ProximaEtapa()}>Próxima etapa</button>
                    }
                </Form>
            </div>
            <div className='buttons-generais'>
                <Link to={'/cadastrar/1/'}>Anterior</Link>
            </div>
        </div>
        </>
    )
}