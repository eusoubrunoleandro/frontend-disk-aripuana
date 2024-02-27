import React,{ useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
import api from '../Services/Api';

export default function BoxItemPlano ({ dadosPlano, _NovaMensagem = () => {} }){
    const [ caracteristicas, AlterarCaracteristicas ] = useState([]);
    const [ mensagem, NovaMensagem ] = useState(null);

    useEffect(() => {
        _NovaMensagem(mensagem)
    }, [_NovaMensagem, mensagem])

    const buscarCaracteristicas = useCallback( async () => {
        try {
            const response = await api.get(`/plano/caracteristica/lista/${dadosPlano.id_plano}`)
            const { content } = response.data;
            AlterarCaracteristicas(content);
        } catch (error) {
            NovaMensagem({ content: error })
        }
    }, [dadosPlano])

    useEffect(() => {
        buscarCaracteristicas();
    }, [buscarCaracteristicas])

    const ItensPlanos = ({dados}) => {
        return(
            <li>
                {dados.caracteristica}
            </li>
        )
    }

    const textoWhatsapp = () => {
        const texto = `Olá Henrique😊\nEntrei no site do Disk Aripuanã e me interessei no plano ${dadosPlano.nome_plano} e gostaria de saber mais detalhes sobre ele!\n\nPoderia me passar mais detalhes?`
        return window.encodeURIComponent(texto)
    }

    
    return(
        <div className='item-plano'>
            <div className='header-plano'>
                <h1>{dadosPlano.nome_plano}</h1>
            </div>
            <div className='lista-caracteristicas'>
                {
                    caracteristicas.map(item => <ItensPlanos dados={item}/>)
                }
            </div>
            <div className='valor-plano'>
                <span>R$</span>
                <h3>{dadosPlano.valor}</h3>
                <span>,00</span>
            </div>
            <div className='link-contratar'>
                {/* <Link to={`/contratar-planos?nplano=${dadosPlano.nome_plano}&iplano=${dadosPlano.id_plano}`}>Contratar plano</Link> */}
                <a href={`https://api.whatsapp.com/send/?phone=5566981251691&text=${textoWhatsapp()}&type=phone_number&app_absent=1`} target="_blank" rel="noreferrer">Contratar plano</a>
            </div>
        </div>
    )
}