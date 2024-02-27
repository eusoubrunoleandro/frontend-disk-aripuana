import React, { useState, useEffect } from 'react'

export default function ImagemPromocao({ dadosImagem = null, indicador, StatusImagem = () => {} }){
    const [ preview, alterarPreview ] = useState(null);

    useEffect(() => {
        alterarPreview(dadosImagem)
    }, [dadosImagem])

    const AddImagemPromocao = (imagem) => {
        const reader = new FileReader();
        reader.onload = () => {
            StatusImagem(indicador)
            const dadosNovaImagem = { url_imagem: reader.result }
            return alterarPreview(dadosNovaImagem)
        }
        reader.readAsDataURL(imagem.target.files[0])
    }
    return(
        <div className='box-add-imagem-promocao'>
            <label>
                <div className='preview-promocao'>
                    {
                        preview === null ? 
                        <div>
                            <h3>Adicionar imagem</h3>
                            <span>Proporção de 1x1 (1080p x 1080p)</span>
                        </div> :
                        <img src={preview.url_imagem} alt={`Imagem da promoção`}/>
                    }                    
                </div>
                <input
                    name={`imagem${indicador}`}
                    type="file"
                    onChange={item => AddImagemPromocao( item )}
                />
            </label>
        </div>
    )
}