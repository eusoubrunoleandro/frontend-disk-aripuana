import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import IconClose from '../assets/icon-x-close.png';
import IconCloseSuccess from '../assets/icon-x-success.png';
import IconCloseAwait from '../assets/icon-x-await.png';

export default function Message({ message, clearMessages = () => {} }){
    const [listMessage, setListMessage] = useState([]);
    const NavigatorHistory = useNavigate();
    const { Vencido } = useContext(AuthContext)

    function removeMessage (idMessage){
        setListMessage(removeListMessage => removeListMessage.filter( list => list.idMessage !== idMessage ))
        clearMessages()
    }
    console.log("Teste", listMessage)

    const IconSelected = ({type}) => {

        if(type === "success") return <img src={IconCloseSuccess} alt="x"/>
        if(type === "await") return <img src={IconCloseAwait} alt="x"/>
        return <img src={IconClose} alt="x"/>
    }

    useEffect(() => {
        if(message !== null){
            const { content, type = "error" } = message;
            let messageContent = content;

            if(content.message !== undefined) messageContent = content.message;
            if(content.response !== undefined) {
                messageContent =  content.response.data.message

                if(messageContent === 'redirect'){
                    return Vencido()
                }
            }

            const idMessage = new Date().getTime();
            const newMessage = {
                idMessage: idMessage,
                message: messageContent === 'Network Error' ? 'Problemas com a conexão com o sistema!' : messageContent ,
                type: type || 'error'
            }

            setTimeout(() => {
                setListMessage(removeListMessage => removeListMessage.filter( list => list.idMessage !== idMessage ))
                clearMessages()
            }, 10000)

            setListMessage(list => [newMessage, ...list])
        }
    }, [message, NavigatorHistory, Vencido, clearMessages]);

    return(
        <>
        {
           !listMessage.length ? <></> : 
           <div className="box-control-message">
               {
                   listMessage.map(({ message, type, idMessage }) => (
                        <div className={`message box-${type}`} key={idMessage}>
                            <div className={`btnfecharmessage ${type}`} onClick={() => removeMessage(idMessage)}>
                                <IconSelected type={type}/>
                            </div>
                            { message }
                        </div>
                    ))
               }
           </div>
        }
        </>
    )
}