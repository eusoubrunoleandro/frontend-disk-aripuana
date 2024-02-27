import React, { useEffect, useState } from 'react'
import IconWhatsapp from '../../assets/icon-whatsapp.png'
import IconWhatsappAtivado from '../../assets/icon-whatsapp-ativado.png'

export default function Input({
    name,
    label = null, 
    required,
    defaultValue = [], 
    onChange = () => {},
    modo = 'dark',
    type = 'text',
    ...rest }) {

  const [ whatsapp, StatusWhatsapp ] = useState(false);

  useEffect(() => {
    if(defaultValue !== null ){
      if(defaultValue.length){
        const _whatsapp = defaultValue[1] === "s" ? true : false
        StatusWhatsapp(_whatsapp)
      }
    }
  }, [defaultValue])

  return (
    <div className={`containner-fields containner-fields-checkbox ${modo}`}>

      <label title={ `${whatsapp ? "Desativar whatsapp?" : "Ativar Whatsapp?"}` } className='labelWhatsapp'>
        <img src={`${whatsapp ? IconWhatsappAtivado : IconWhatsapp}`} alt="Ativar Whatsapp" className={`${whatsapp ? "AtivarWhatsapp" : ""}`}/>
        <input
            name={ `whatsapp_${name}` }
            type="checkbox"
            checked={whatsapp}
            onChange={() => StatusWhatsapp(StatusAnterior => !StatusAnterior)}            
        />
      </label>

      <input
        name={ `telefone_${name}` }
        type="text"
        placeholder='(xx) xxxxx-xxxx'
        defaultValue={ defaultValue === null ? "" : defaultValue[0] }
        required={ required }
        title="Adicione o número do seu telefone ou whatsapp"
        maxLength={15}
        {...rest}
      />
    </div>
  )
}