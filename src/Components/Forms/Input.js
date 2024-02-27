import React, { useEffect, useRef, useState } from 'react'
import { useField } from '@unform/core'

export default function Input({ name,label = "Preencha esse campo", required, ...rest }) {

  const [ fillField, handleFillField ] = useState("");
  const [ showSenhaCampo, StatusShowSenha ] = useState(false);

  const inputRef = useRef(null)
  const { fieldName, defaultValue, registerField } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: ref => {
        return ref.current.value
      },
      setValue: (ref, value) => {
        ref.current.value = value
      },

      clearValue: ref => {
        ref.current.value = ''
      },
    })

  }, [fieldName, registerField])

  useEffect(() => { 
    if(inputRef.current.value !== ""){
      onField();
    }
   }, [])

  function StateFieldCurrent(){
    if(inputRef.current.value === ""){
      handleFillField("")
    }
  }

  function onField(){
    handleFillField("fill-fields")
    inputRef.current.focus();
  }

  function handleTypeField(){
    if(showSenhaCampo){
      inputRef.current.type = "password";
    }else{
      inputRef.current.type = "text";
    }

    StatusShowSenha(prop => !prop)
  }

  const ButtonShowSenha = () => {
    return <div className={showSenhaCampo ? "showSenha showSenhaOn" : "showSenha"} onClick={() => handleTypeField()} title="Mostrar senha"></div>
  }

  return (
    <div className='containner-fields' onClick={() => onField()}>
      <span className={fillField}>{label}{required ? (<p>*</p>) : ''}</span>
        {rest.type === "password" ? <ButtonShowSenha/> : ""}
      <input ref={inputRef} defaultValue={defaultValue} {...rest} required={required} onFocus={() => onField()} onBlur={() => StateFieldCurrent()}/>
    </div>
  )
}