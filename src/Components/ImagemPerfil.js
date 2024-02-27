import React, { useState, useEffect, useRef } from 'react'
import api from '../Services/Api';
import IconExcluir from '../assets/icon-x-close.png'

export default function ImagemPerfil({ dadosImagem = null, sequencia, destaque = false, NewMessage = () => {}}){
    const [ preview, alterarPreview ] = useState(null);
    const [ salvando, statusSalvando ] = useState(false);
    const formularioRef = useRef();

    useEffect(() => {
        const imagemBanco = dadosImagem.filter(item => {
            const sequenciaBancoDeDados = parseInt(item.sequencia);
            return sequenciaBancoDeDados === sequencia
        })

        if(imagemBanco.length){
            alterarPreview(imagemBanco[0])
        }
        else{ alterarPreview(null) }
    }, [dadosImagem, sequencia])

    const AddImagemPromocao = () => {
        const file = formularioRef.current[0].files[0]
        const reader = new FileReader();
        reader.onload = () => {
            const dadosNovaImagem = { url_arquivo: reader.result }
            _addVitrine(file)
            return alterarPreview(dadosNovaImagem)
        }
        reader.readAsDataURL(file)
    }

    async function _addVitrine(imagem){
        statusSalvando(true)
        try {
            const formulario = new FormData();
            formulario.append('imagem_vitrine', imagem)
            formulario.append('destaque', destaque)
            formulario.append('sequencia', sequencia)

            const response = await api.post('/vitrine/adicionar/meu-perfil', formulario )             
            const { content } = response.data;
            alterarPreview(content)
            NewMessage({ content: "Imagem adicionada", type:"success" })

        } catch (error) { NewMessage({ content: error }) }
        statusSalvando(false)
    }

    const LoadImagem = () => {
        return(
            <div className='salvando-vitrine'>Salvando imagem...</div>
        )
    }

    async function _removeVitrine(){
        try {
            const response = await api.delete(`/vitrine/delete/meu-perfil/${preview.id_vitrine}`)             
            const { message } = response.data;
            alterarPreview(null)
            NewMessage({ content: message, type:"success" })

        } catch (error) { NewMessage({ content: error }) }
    }

    return(
        <div className={`box-add-imagem-promocao ${destaque ? 'imagem-destaque-promocao' : ''}`}>
            
            {
                preview === null ? <></> :
                <div className='botao-excluir' title="Excluir imagem" onClick={() => _removeVitrine()}><img src={IconExcluir} alt='x'/></div>
            }
            
            <label>
                <div className='preview-promocao'>
                    {
                        preview === null ? 
                        <div className='controler-vitrine'>
                            <h3>{ destaque ? "Adicione uma imagem de destaque" : "Adicione uma imagem" }</h3>
                            <span>Proporção de 16:9 (1280p x 720p)</span>
                        </div> :
                        <div className='controler-vitrine'>
                            {
                                salvando ?
                                <LoadImagem/> : <></>
                            }
                            <img src={preview.url_arquivo} alt={`Imagem não carregou!`}/>
                        </div>
                    }                    
                </div>
                <form ref={formularioRef}>
                    <input
                        name={sequencia}
                        type="file"
                        onChange={() => AddImagemPromocao()}
                    />
                </form>
            </label>
        </div>
    )
}