import React from 'react';
import '../css/Main.css'
import '../css/Load.css'

const LoadLine = ({ size = 'small', width = '100%'}) => {

    return(
        <div className={`animation-load load-title-${size}`} title="Carregando elemento" style={{ width }}></div>
    )
}

const LoadImage = () => {

    return(
        <div className={`animation-load image-apresentacao-perfil`}></div>
    )
}

const LoadCard = (quantidade = 5) => {
    if(quantidade !== 5){
        return <div className={`result-client animation-load load-card`}/>
    }
    
    return(
        <>
        <div className={`result-client animation-load load-card`}/>
        <div className={`result-client animation-load load-card`}/>
        <div className={`result-client animation-load load-card`}/>
        <div className={`result-client animation-load load-card`}/>
        </>
    )
}

const LoadLogotipo = () => {

    return(
        <div className={`animation-load load-logotipo`}></div>
    )
}

const LoadPromocoes = () => {

    return(
        <div className='box-promocoes load-promocoes'>
            <div className='animation-load imagem-promocao'></div>
            <div className='animation-load load-title-large'></div>
            <div className='animation-load load-title-small'></div>
        </div>
    )
}


export { LoadImage, LoadLine, LoadLogotipo, LoadCard, LoadPromocoes }