import React, { useCallback, useContext } from "react";
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function VerificarAcesso ({ children, nivel = 1 }){
    const { dadosSessao: { dadosSessaoAtual } } = useContext(AuthContext);
    const navigate = useNavigate();

    const irParaPlanos = useCallback(() => {
        if(window.confirm('Vamos mudar de plano?\n\nO recurso que você esta tentando acessar requer um plano mais completo! Vamos conhecer todos os nossos planos? Clique em ok!')){
            navigate('/planos');
        }
    }, [navigate])

    if(dadosSessaoAtual.tipo_acesso < nivel) {
        return (
            <div className="bloqueador" onClick={() => irParaPlanos(true)}>
                {children}
            </div>
        )
    }
    return children
}