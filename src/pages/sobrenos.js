import React, { useCallback, useEffect, useState } from 'react';

import Header from '../Components/Header'
import Api from '../Services/Api';
import Footer from '../Components/Footer';

export default function SobreNos(){
    const [ dataCliente, AlterDataCliente ] = useState([]);

    const getDataClientes = useCallback(() => {
        (async () => {
            try{
                const response = await Api.get;
                const { cliente_premium } = response.data;
                AlterDataCliente(cliente_premium)
            } catch(error){
                console.log(error)
            }
        })()
    }, [])

    useEffect(() => {
       getDataClientes()

    },[getDataClientes])
    console.log(dataCliente)

    return(
        <>
            <Header/>
            <div className='controle pesquisa-controle'>
                <div className='titulos-paginas'>
                    Você está em <span>Sobre nós</span>
                </div>
                <section>
                    O Disk Aripuanã é uma aplicação que visa proporcionar a empreendedores um ambiente onde possam compartilhar seus dados com seus clientes e amigos. 
                    Nosso intuito é alcançar o máximo de pesoas possíveis, para que assim, possamos criar uma grande rede de contatos comerciais entre empreendedores!
                </section>
            </div>
            <Footer/>
        </>
    )
}