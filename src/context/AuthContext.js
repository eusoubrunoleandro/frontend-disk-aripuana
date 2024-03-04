import React, { useState, useEffect, createContext, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Api from '../Services/Api';
import LogoTipo from '../assets/logotipo.png'

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [carregando, MudancaStatusCarregando] = useState(true);
    const [dadosSessao, StatusDados] = useState({
        Autenticado: false,
        dadosSessaoAtual: {}
    });
    const location = useLocation();

    useEffect(() => {
        const dataMain = localStorage.getItem('dados');
        if(dataMain){
            const { Autenticado, dadosSessaoAtual } = JSON.parse(dataMain);
            Api.defaults.headers.auth = dadosSessaoAtual.token_acesso;

            StatusDados({
                Autenticado,
                dadosSessaoAtual
            })
        }

        MudancaStatusCarregando(false);
    }, [])

    const Entrar = (data, redirectPage = '/cliente/meusdados') => {
        const { token_acesso } = data;
        Api.defaults.headers.auth = token_acesso;

        const dadosUsuarioSessao = { Autenticado: true, dadosSessaoAtual: data }
        StatusDados(dadosUsuarioSessao)
        localStorage.setItem('dados', JSON.stringify(dadosUsuarioSessao));

        const from = location.state || redirectPage;
        navigate(from);
    }

    function Sair(){
        Api.defaults.headers.auth = null;

        StatusDados({ Autenticado: false, dadosSessaoAtual: {} })

        localStorage.removeItem('dados');

        navigate('/');
    }

    function Vencido(){
        Api.defaults.headers.auth = null;
        StatusDados({ Autenticado: false, dadosSessaoAtual: {} })
        localStorage.removeItem('dados');
        const from = location.state || '/';
        navigate(from);
    }

    const AlterarInformacoesLocais = useCallback((newData) => {
        const dataMain = localStorage.getItem('dados');
        const { dadosSessaoAtual } = JSON.parse(dataMain);

        const dataHandledUser = Object.assign(dadosSessaoAtual, dadosSessao.dadosSessaoAtual, newData);
        
        const dadosUsuarioSessao = { Autenticado: true, dadosSessaoAtual: dataHandledUser }
        StatusDados(dadosUsuarioSessao)
        localStorage.setItem('dados', JSON.stringify(dadosUsuarioSessao));

    }, [ dadosSessao.dadosSessaoAtual ])

    if(carregando)
    return <div id="carregando-pagina">
        <img src={LogoTipo} alt="Logotipo do Disk Aripuanã"/>
        <div>
            <h1>Carregando...</h1>
            <h2>Aguarde!</h2>
        </div>
    </div>

    return(
        <AuthContext.Provider value={{ dadosSessao, Entrar, Sair, AlterarInformacoesLocais, Vencido }}>
            { children }
        </AuthContext.Provider>
    )
    
}

export { AuthContext, AuthProvider };