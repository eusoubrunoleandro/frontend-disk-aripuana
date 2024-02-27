import React, { useState, useCallback, useEffect } from 'react';

import HeaderAdmin from '../../Components/HeaderAdmin'
import Api from '../../Services/Api';
import Messagers from '../../Components/Messagers'
import { LoadLine } from '../../Components/WhileLoad'

export default function AdminRelatorios(){
    const [ StatusMensagem, NovaMensagem ] = useState(null);
    
    const [ relatorioNegocio, alterarRelatorioNegocio ] = useState(null);
    const [ relatorioLocalidade, alterarRelatorioLocalidade ] = useState([]);

    const [ StatusCarregandoNegocios, AlterarStatusCarregandoNegocios ] = useState(true);
    const [ StatusCarregandoLocalidade, AlterarStatusCarregandoLocalidade ] = useState(true);

    const buscaListaDados = useCallback(() => {
        (async () => {
            AlterarStatusCarregandoNegocios(true)
            try{
                const response = await Api.get(`/administrador/relatorio/negocio`);
                const { content } = response.data;
                alterarRelatorioNegocio(content)
            } catch(error){
                NovaMensagem({ content: error })
            }
            AlterarStatusCarregandoNegocios(false)
        })()
    }, [])

    const buscaRelatorioLocalidade = useCallback(() => {
        (async () => {
            AlterarStatusCarregandoLocalidade(true)
            try{
                const response = await Api.get(`/administrador/relatorio/localidade`);
                const { content } = response.data;
                alterarRelatorioLocalidade(content)
            } catch(error){
                NovaMensagem({ content: error })
            }
            AlterarStatusCarregandoLocalidade(false)
        })()
    }, [])

    useEffect(() => {
        buscaListaDados();
        buscaRelatorioLocalidade(0)
    }, [buscaListaDados, buscaRelatorioLocalidade])

    return(
        <>
        <div className='box-area-admin'>
            <Messagers message={StatusMensagem}/>
            <HeaderAdmin 
                title='Relatórios | Administração Disk Aripuanã'
                mostrarBotaoNovo={false}
                clear={true}
            />
            <div className='area-admin'>
                <div className="box-conteudo">
                    <section className='sessao-padrao'>
                        <div className='titulo'>
                            <h1>Relatórios</h1>
                        </div>
                        <div className='box-relatorio'>
                            <div className='item-relatorio'>
                                <div>Total de negocios cadastrados</div>
                                {StatusCarregandoNegocios ? <LoadLine/> : <h3>{relatorioNegocio.total_negocios}</h3>}
                            </div>

                            <div className='item-relatorio'>
                                <div>Total de contas verificadas</div>
                                {StatusCarregandoNegocios ? <LoadLine/> : <h3>{relatorioNegocio.total_negocios_verificados}</h3>}
                                {StatusCarregandoNegocios ? <LoadLine/> : relatorioNegocio.total_negocios - relatorioNegocio.total_negocios_verificados > 0 ? <span className='negativo'>{`Falta ${relatorioNegocio.total_negocios - relatorioNegocio.total_negocios_verificados} contas`}</span> : <></>}
                            </div>

                            <div className='item-relatorio'>
                                <div>Total de contas premium</div>
                                {StatusCarregandoNegocios ? <LoadLine/> : <h3>{relatorioNegocio.total_negocios_premium}</h3>}
                                {StatusCarregandoNegocios ? <LoadLine/> : relatorioNegocio.total_negocios - relatorioNegocio.total_negocios_premium > 0 ? <span className='negativo'>{`Falta ${relatorioNegocio.total_negocios - relatorioNegocio.total_negocios_premium} contas`}</span> : <></>}
                            </div>

                            <div className='item-relatorio'>
                                <div>Total de contas bloqueadas</div>
                                {StatusCarregandoNegocios ? <LoadLine/> : <h3>{relatorioNegocio.total_negocios_bloqueados}</h3>}
                            </div>

                            <div className='item-relatorio'>
                                <div>Total de negocios na nexa</div>
                                {StatusCarregandoNegocios ? <LoadLine/> : <h3>{relatorioNegocio.total_negocios_empreendedor}</h3>}
                            </div>
                        </div>
                        <div className='box-relatorio'>
                            <div className='item-relatorio item-relatorio-cidades'>
                                <div>Cidades</div>
                                <ul>
                                    {
                                        StatusCarregandoLocalidade ? <LoadLine/> : 
                                        relatorioLocalidade.cidades.map(item => <li key={item.cidades}>{item.cidades}</li>)
                                    }
                                </ul>
                            </div>
                            <div className='item-relatorio item-relatorio-cidades'>
                                <div>Estados</div>
                                <ul>
                                    {
                                        StatusCarregandoLocalidade ? <LoadLine/> : 
                                        relatorioLocalidade.estados.map(item => <li key={item.estados}>{item.estados}</li>)
                                    }
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
        </>
    )
}