import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'
import { CadastroContext } from '../../context/CadastroContext'

export default function NotFound(){
    const navigate = useNavigate();
    const { dadosCadastro } = useContext(CadastroContext)

    function Pesquisar(content){
        const { pesquisar } = content
        if(pesquisar !== ''){
            navigate(`/pesquisa?search=${pesquisar}`, { replace: true })
        }
    }
    return(
        <>
        <Header title='Cadastro finalizado | Disk Aripuanã' onPesquisa={content => Pesquisar(content)}/>
        <div className='notfound'>
            <h1>Cadastro realizado com sucesso!</h1>
            <p>Obrigado <em>{ dadosCadastro.nome_negocio }</em> por se cadastrar em nosso site!<br/>Você receberá um e-mail para confirmar sua conta.</p>
            <span onClick={() => navigate('/', { replace: true })}>Página inicial</span>
        </div>
        <Footer/>
        </>
    )
}