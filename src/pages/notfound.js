import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../Components/Header'
import Footer from '../Components/Footer'

export default function NotFound(){
    const navigate = useNavigate();

    function Pesquisar(content){
        const { pesquisar } = content
        if(pesquisar !== ''){
            navigate(`/pesquisa?search=${pesquisar}`, { replace: true })
        }
    }
    return(
        <>
        <Header title='Página não encontrada - Disk Aripuanã' onPesquisa={content => Pesquisar(content)}/>
        <div className='notfound'>
            <h1>Infelizmente esse endereço não existe!</h1>
            <p>Você pode encontrar mais conteúdos em nosso site.</p>
            <span onClick={() => navigate('/', { replace: true })}>Volte para a página inicial e veja mais conteúdos</span>
        </div>
        <Footer/>
        </>
    )
}