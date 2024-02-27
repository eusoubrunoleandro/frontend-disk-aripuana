import { useState, useCallback, useEffect } from 'react';
import Api from '../../Services/Api';

export default function SelectCategoria({ 
    defaultValue = 0, 
    onChange = () => {}, 
    newMessage = () => {}, 
    modo = 'dark', 
    ...rest
}){

    const [ listaCategorias, AlterarListaCategorias ] = useState([])
    const [ carregando, StatusCarregamento ] = useState(true);
    const [ OpcaoSelecionada, AlterarOpcaoSeleciona ] = useState(0);
    const [ StatusMensagens, NovaMensagem ] = useState(null);

    
    const _buscaDeCategorias = useCallback(() => {
        (async () => {
            StatusCarregamento(true)
            try{
                const response = await Api.get('/categoria/busca');
                const { content } = response.data;

                if(!content.length){
                    return NovaMensagem({ content: "Nenhuma categoria encontrada!", type: "success" })
                }

                AlterarListaCategorias(content)

            } catch(error){
                return NovaMensagem({ content: error.message })
            }
            StatusCarregamento(false);
        })()
    }, [ ])

    useEffect(() => {
       _buscaDeCategorias()
    },[_buscaDeCategorias])

    useEffect(() => {
        newMessage(StatusMensagens)
    }, [StatusMensagens, newMessage])

    useEffect(() => {
        AlterarOpcaoSeleciona(defaultValue)
    },[defaultValue])

    function handleValue(valor){
        onChange(valor)
        AlterarOpcaoSeleciona(valor)
    }

    const ItemOption = ({ item }) => {
        const optionFinal = `${item.id_categoria} - ${item.nome_categoria}`
        return(
            <option value={optionFinal}>
                { optionFinal }
            </option>
        )
    }

    return(
        <div className={`containner-fields ${modo}`}>
            <select value={ OpcaoSelecionada } {...rest} onChange={(event) => handleValue(event.target.value)}>
                <option value={0}>{ carregando ? "Carregando lista..." : "Escolha uma categoria" }</option>
                {
                    carregando ? <></> : 
                    listaCategorias.map(item => 
                    <ItemOption key={ `${item.id_categoria} - ${item.nome_categoria}` } item={item} />)
                }
            </select>
        </div>
    )
}