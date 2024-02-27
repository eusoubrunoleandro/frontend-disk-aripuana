import React, { useEffect, useRef, useState, useCallback } from 'react'

export default function Textarea({
    name,
    label = null, 
    required, 
    defaultValue = "", 
    onChange = () => {},
    modo = 'dark',
    ...rest }) {

  const [ fillField, handleFillField ] = useState("");

  const textareaRef = useRef(null)

   const valordoCampo = useCallback(() => {
        const fieldComplete = {};
        fieldComplete[name] = textareaRef.current.value;

        onChange(fieldComplete)
    }, [onChange, name ])

  function StateFieldCurrent(){
    if(textareaRef.current.value === ""){
      handleFillField("")
    }
  }

  function onField(){
    handleFillField("fill-fields")
  }

  useEffect(() => {

    if(defaultValue !== ""){
      onField();
    }

   }, [ defaultValue ])

  return (
    <div className={`containner-fields containner-fields-textarea ${modo}`} onClick={() => onField()}>
        <span className={fillField}>{label}{required ? (<p>*</p>) : ''}</span>
        <textarea
            ref={textareaRef}
            name={ name }
            required={required}
            defaultValue={ defaultValue }
            onChange={() => valordoCampo()}
            onFocus={() => onField()}
            onBlur={() => StateFieldCurrent()}
            {...rest}
        ></textarea>
    </div>
  )
}