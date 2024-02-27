import React,{ useEffect, useState} from 'react';

export default function Select({
    onChange = () => {}, 
    name, 
    defaultValue, 
    options, 
    modo = 'dark', 
    mostrarOpcaoEscolher = false,
    ...rest
}){

    const [ opcaoEscolhida, AlterarOpcao ] = useState(0);

    useEffect(() => {
        AlterarOpcao(defaultValue)
    }, [defaultValue])
    
    const mudandoValor = (dadosInput) => {
        const newObjectContent = {};
        newObjectContent[name] = dadosInput
        onChange(newObjectContent);

        AlterarOpcao(dadosInput)
    }

    return(
        <div className={`containner-fields ${modo}`}>
            <select
                value={ opcaoEscolhida }
                name={name}
                onChange={content => mudandoValor(content.target.value)}
                {...rest}
            >
                {
                    !mostrarOpcaoEscolher ? <></> : 
                    <option value={0} disabled>Escolher</option>
                }
                {options.map((option, index) => (
                    <option key={index} value={option.valueId || option.valor}>{option.valor}</option>
                ))}
            </select>
        </div>
    )
}