import React,{ useState } from 'react'


export default function PromocaoAreaCliente({
    dadosPromocao : promocao,
    excluirRegistro = () => {},
    editarRegistro = () => {},
    publicarPromocao = () => {}
}){

    const [StatusAcao, AlterarStatusAcao] = useState(false);

    const formatData = (data) => {
        const dataRaiz = new Date(data)
        const abaixoDeDez = (numero) => {
            return numero < 10 ? `0${numero}` : numero
        }
        const novaData = `${abaixoDeDez(dataRaiz.getDate())}/${abaixoDeDez(dataRaiz.getMonth())}/${dataRaiz.getFullYear()}`
        return novaData
    }

    return(
        <>
        
        <section className='sessao-padrao-item sessao-promocao'>

            <div className='conteudo-promocao'>

                <div className='conteudo item60 imagem-capa-promocao' title='Imagem de capa'>
                    {
                        promocao.url_imagem === null ? "" : 
                        <img src={ promocao.url_imagem } alt="Imagem de capa"/>
                    }
                </div>

                <div className='conteudo item60'>
                    { promocao.nome_promocao }
                </div>

                <div className='conteudo item30'>
                    De { formatData(promocao.inicio_promocao) } até { formatData(promocao.fim_promocao) }
                </div>

                <div className='conteudo item30'>
                    { promocao.publicar ? "Ativo" : "Não publicado" }
                </div>

            </div>

            <div className='acao-registro'>
                <div className='botao-indicador' onClick={() => AlterarStatusAcao(Status => !Status)}>
                    <div/>
                    <div/>
                    <div/>
                </div>
                {
                    !StatusAcao ? <></> : 
                    <>
                    <div className='botoes'>
                        <div onClick={ () => editarRegistro() }>Ver/Editar</div>
                        <div onClick={ () => publicarPromocao() }>{ promocao.publicar ? "Retirar do ar" : "Publicar" }</div>
                        <div onClick={ () => excluirRegistro() }>Excluir</div>
                    </div>
                    <div className='overlay' onClick={() => AlterarStatusAcao(false)}/>
                    </>
                }
            </div>
        </section>
        </>
    )
}