import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'

import Header from '../../Components/Header'
import Api from '../../Services/Api';
import Footer from '../../Components/Footer';
import Messagers from '../../Components/Messagers'

export default function ValidacaoDeConta(){
    const [ onLoad, handleLoad ] = useState(true);
    const Parametros = useParams()
    const [ message, StatusMessage ] = useState(null);
    const [ validado, _StatusValidacao ] = useState(false);

    const _validandoConta = useCallback(async (id_negocio, token_acesso) => {

            handleLoad(true)
            StatusMessage({ content: "Não saia dessa página antes do processo terminar!", type: "await" })
            try{
                const response = await Api.get(`/validacao/${id_negocio}/${token_acesso}`);
                const { message } = response.data
                _StatusValidacao(true)
                StatusMessage({ content: message, type: "success" })
            } catch(error){ StatusMessage({ content: error }) }

            handleLoad(false)
    }, [])

    useEffect(() => {
        const { id_negocio, token_acesso } = Parametros;

        if(id_negocio === null || id_negocio === "") return StatusMessage({ content: "Link para validação esta com quebrado!" })
        if(token_acesso === null || token_acesso === "") return StatusMessage({ content: "Link para validação esta com quebrado!" })

        _validandoConta(id_negocio, token_acesso)
    },[_validandoConta, Parametros])

    const ValidandoConta = () => {
        return (
            <div className='box-validacao'>
                <h1>Aguarde! Estamos validando a sua conta...</h1>
            </div>
        )
    }

    const StatusValidacao = () => {

        if(!validado) {
            return (
                <div className='box-validacao'>
                    <h1>Conta não validada!</h1>
                    <h2>Entre em contato conosco através do e-mail diskaripuana@outlook.com</h2>
                </div>
        )}

        return(
            <div className='box-validacao'>
                <h1>Conta validada com sucesso</h1>
                <Link to='/login'>Clique e acesse sua conta</Link>
            </div>
        )

    }

    return(
        <>
            <Messagers message={message}/>
            <Header clear={true} title='Validação de conta | Disk Aripuanã'/>
            <div className='controle'>
                <div className='titulos-paginas'>
                    Você está em <span>Validação de conta</span>
                </div>

                {
                    onLoad ? 
                    <ValidandoConta/> : <StatusValidacao/>
                }
            </div>
            <Footer/>
        </>
    )
}