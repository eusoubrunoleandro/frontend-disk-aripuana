import { createContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const CadastroContext = createContext();

const CadastroProvider = ( { children } ) =>{
    const [ dadosCadastro, alterardadosCadastro ] = useState({
        nome_negocio:null,
        telefone:null,
        categoria:null,
        nome_categoria:null,
        email_acesso:null,
        senha_acesso:null,
        cep:null,
        cidade:null,
        uf:null,
        pais:null
    });

    const navigate = useNavigate();

    const AlterarCadastro = useCallback((dadosRecebidos, redirect = '/cadastrar/finalizado') => {
        alterardadosCadastro(dadosRecebidos)
        navigate(redirect)
    }, [navigate])

    return (
        <CadastroContext.Provider value={{ dadosCadastro, AlterarCadastro }}>
            { children }
        </CadastroContext.Provider>
    )
}

export { CadastroContext, CadastroProvider }