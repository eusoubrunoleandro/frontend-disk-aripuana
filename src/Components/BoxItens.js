import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import IconInsta from '../assets/icon-instagram.png';
import IconFace from '../assets/icon-facebook.png';
import IconSite from '../assets/icon-site.png';
import IconWhatsapp from '../assets/icon-whatsapp.png'

export default function ClientItens ({ data, OnPesquisaCategoria = () => {} }) {

    const transformarTelefone = (telefone) => {
        const tel_dd = telefone.substring(0, 2)
        

        if(telefone.length === 11){
            const tel_adicional = telefone.substring(2,3)
            const tel_quatroprimeiros = telefone.substring(3,7)
            const tel_quatroultimos = telefone.substring(7,11)
            return `(${tel_dd}) ${tel_adicional} ${tel_quatroprimeiros}-${tel_quatroultimos}`
        }

        const tel_quatroprimeiros = telefone.substring(2,6)
        const tel_quatroultimos = telefone.substring(6,10)
        
        return `(${tel_dd}) ${tel_quatroprimeiros}-${tel_quatroultimos}`
    }

    const SeWhatsapp = ({ telefone }) => {

        const numero_telefone = telefone[0]
        const whatsapp = telefone[1]

        let linkApi = `https://api.whatsapp.com/send/?phone=55${numero_telefone}&text&type=phone_number&app_absent=1`;
        
        if(whatsapp === "s") {
            return (
            <a href={linkApi} target="_blank" rel='noreferrer' title='Abri com o whatsapp' id="icon-whatsapp">
                <img src={IconWhatsapp} alt="Whatsapp"/>
                { transformarTelefone(numero_telefone) }
            </a>)
        }
    
        return <a href={`tel:${numero_telefone}`} target="_blank" rel='noreferrer' title="Ligar">{ transformarTelefone(numero_telefone) }</a>
    }


    const Premium = ({ data, pesquisaCategoria = () => {} }) => {
        const Navigate = useNavigate();
        return (
            <div className='result-client item'>
                <div className='logo' onClick={() => Navigate(`/perfil/${data.id_negocio}/${data.nome_negocio}`)}>
                    <img src={data.image_perfil} alt=''/>
                </div>
                <div className='data-client'>
                    <h3><Link to={`/perfil/${data.id_negocio}/${data.nome_negocio}`}>{ data.nome_negocio }</Link></h3>
                    <h4 onClick={() => pesquisaCategoria(data.id_categoria)}>{ data.nome_categoria }</h4>
                    <SeWhatsapp telefone={data.telefone_1}/>
                    <div className='links'>
                        {
                            data.link_site === "" ? <></> :
                            <div>
                                <a href={data.link_site} target="_blank" rel="noreferrer">
                                    <img src={IconSite} alt={`Ícone do site`} title={`Site de ${data.nome_negocio}`}/>
                                </a>
                            </div>
                        }
    
                        {
                            data.link_instagram === "" ? <></> :
                            <div>
                                <a href={data.link_instagram} target="_blank" rel="noreferrer">
                                    <img src={IconInsta} alt={`Ícone do instagram`} title={`Instagram de ${data.nome_negocio}`}/>
                                </a>
                            </div>
                        }
    
                        {
                            data.link_facebook === "" ? <></> :
                            <div>
                                <a href={data.link_facebook} target="_blank" rel="noreferrer">
                                    <img src={IconFace} alt={`Ícone do facebook`} title={`Facebook de ${data.nome_negocio}`}/>
                                </a>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
    
    const PacotePadrao = ({ data, pesquisaCategoria = () => {}  }) => {
        return (
            <div className='result-client-default item'>
                <div className='data-client'>
                    <h3>{ data.nome_negocio }</h3>
                    <h4 onClick={() => pesquisaCategoria(data.id_categoria)} title={`Pesquisar mais na categoria de ${data.nome_categoria}`}>{ data.nome_categoria }</h4>
                    <SeWhatsapp telefone={data.telefone_1}/>
                </div>
            </div>
        )
    }


    // render
    if(data.modo_premium) { return <Premium data={data} pesquisaCategoria={ content => OnPesquisaCategoria(content)}/> }
    return <PacotePadrao data={data} pesquisaCategoria={ content => OnPesquisaCategoria(content)}/>
}