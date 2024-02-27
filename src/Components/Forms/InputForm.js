import React, { useEffect, useRef, useState, useCallback } from 'react'

export default function Input({
    name,
    label = null, 
    required, 
    defaultValue = "", 
    onChange = () => {},
    modo = 'dark',
    type = 'text',
    ...rest }) {

  const [ fillField, handleFillField ] = useState("");
  const [ showSenhaCampo, StatusShowSenha ] = useState(false);

  const inputRef = useRef(null)

   const valordoCampo = useCallback(() => {
        const fieldComplete = {};
        fieldComplete[name] = inputRef.current.value;

        onChange(fieldComplete)
    }, [onChange, name ])

  function StateFieldCurrent(){
    if(inputRef.current.value === ""){
      handleFillField("")
    }
  }

  function onField(){
    handleFillField("fill-fields")
    if(inputRef.current !== null) inputRef.current.focus()
  }

  function mostrarSenha(){
    if(showSenhaCampo){
      inputRef.current.type = "password";
    }else{
      inputRef.current.type = "text";
    }

    StatusShowSenha(prop => !prop)
  }

  useEffect(() => {

    if(defaultValue !== ""){
      handleFillField("fill-fields")
    }

    if(type === 'date'){
      handleFillField("fill-fields")
    }

   }, [ defaultValue, type ])

  const ButtonShowSenha = () => {
    return <div className={`${modo} showSenha ${showSenhaCampo ? "showSenhaOn" : ""}`} onClick={() => mostrarSenha()} title="Mostrar senha"></div>
  }

  return (
    <div className={`containner-fields ${modo}`} onClick={() => onField()}>
      {
        label === null ? <></> : 
        <span className={fillField}>{label}{required ? (<p>*</p>) : ''}</span>
      }        
        {type === "password" ? <ButtonShowSenha/> : ""}
        <input
            ref={inputRef}
            name={ name }
            type={ type }
            required={required}
            defaultValue={ defaultValue }
            onChange={() => valordoCampo()}
            onFocus={() => onField()}
            onBlur={() => StateFieldCurrent()}
            {...rest}
        />
    </div>
  )
}