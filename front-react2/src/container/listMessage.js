import React ,{useState,useEffect,useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../assets/myCss.css'

function ListMessage({dataMessage,setDataMessage}) {
    const [msgToSend, setMsgToSend] = useState('');
    const [msgToEdit, setMsgToEdit] = useState();
    const [isEdit , setIsEdit] = useState(null);
    const bottomRef = useRef(null);
    const messageContainerRef = useRef(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    
    const token = localStorage.getItem("token");

       // Attendre que le state soit mis à jour avant de scroller
    setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    /*useEffect(() => {
        window.scrollTo({
          top: 200, // Position verticale en pixels
          behavior: "smooth", // Défilement fluide
        });
      }, [dataMessage]);
    */
  
    const sendMessage = async () => {
        //console.log(msgToSend);

         //e.preventDefault(); // Empêche le rechargement de la page
        if (dataMessage && dataMessage.length > 0) {
            const id = dataMessage[0]._id;

            
            const response = await fetch(`${apiUrl}/api/chat/new-message/${id}`,{
                method : 'post',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Ajout du token dans les headers
                },
                body: JSON.stringify({ message: msgToSend }) // Correction ici
            })

            if (!response.ok){
                throw new Error(`Erreur HTTP : ${response.status}`)
            }
            const data= await response.json()
            await setDataMessage(data);
            setMsgToSend('')
            console.log(dataMessage);
        }
    }

    const editMessage = async (chatId,msgId) =>{
        const apiUrl = import.meta.env.VITE_API_URL;

        const token = localStorage.getItem("token");
        
        const response = await fetch(`${apiUrl}/api/chat/edit/${chatId}/${msgId}`,{
            method : 'post',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Ajout du token dans les headers
            },
            body: JSON.stringify({ message: msgToEdit }) // Correction ici
        })

        if (!response.ok){
            throw new Error(`Erreur HTTP : ${response.status}`)
        }
        const data= await response.json()
        await setDataMessage(data);
        console.log(data);

        setIsEdit(null);

    }

    console.log(dataMessage);
    return(
        <div className='listDiv'>
            <div className="listMessage" ref={messageContainerRef} style={{paddingBottom:'100px'}}>
                        {dataMessage && dataMessage.length > 0 && dataMessage[0].messages.length > 0 && (
                            dataMessage[0].messages.map((msg,index) => (
                                <div key={msg._id}>
                                    {msg.type === 'question' && (
                                        <>
                                            { isEdit == msg._id ? 
                                                <div className='question'>  
                                                    <div className='question-div-edit' style={{border : 'none',backgroundColor: '#E0DEDE'}}>
                                                        <textarea name="" onChange={(e) => {setMsgToEdit(e.target.value)}} id="">{msg.message}</textarea>
                                                        <div className='action-btn d-flex justify-content-end'>
                                                            <button className='btn btn-default me-1' style={{backgroundColor : '#999090ad '}} onClick={()=>{
                                                                setIsEdit(null);
                                                            }}>Annuler</button>
                                                            <button className='btn btn-primary' onClick={()=>{
                                                                editMessage(dataMessage[0]._id,msg._id);
                                                            }}>Envoyer</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            :
                                                <div className='question'>  
                                                    <FontAwesomeIcon icon="edit" size="xs" style={{ opacity: 0.9 ,cursor : 'pointer',fontSize:'16px'}} color='black' onClick={
                                                        ()=>{
                                                            setIsEdit(msg._id);
                                                            setMsgToEdit(msg.message);
                                                            }
                                                        }/>    
                                                    <div className='question-div'>
                                                        <span className='question-text'>{msg.message}</span>
                                                    </div>
                                                </div>
                                                
                                            }
                                        </>
                                        
                                    )}
                                    {msg.type === 'reponse' && (
                                    
                                        <div className='reponse'>  
                                            <div className='reponse-div'>
                                                <span className='reponse-text'>{msg.message}</span>
                                            </div>
                                        </div>
                                    )}
                                     {(index % 2 !== 0 && index != dataMessage[0].messages.length - 1) && (
                                        <hr className='hr-content' />
                                    )}
                                </div>
                            )
                        ))}

                <div ref={bottomRef}></div>
            </div>
            <form onSubmit={(e) => {
                            console.log('submitttt')
                                /*e.preventDefault(); // Empêche le rechargement de la page
                                if (dataMessage && dataMessage.length > 0) {
                                    sendMessage(dataMessage[0]._id);
                                }*/
                                sendMessage();
                            }}>
                            <div className='div-search'>
                                <textarea name="text-search" id="text-search" placeholder='placeholder' value={msgToSend} onChange={(e) => {setMsgToSend(e.target.value)}}></textarea>
                                <div className='div-send' onClick={()=> {console.log('test');sendMessage()}}>
                                    <FontAwesomeIcon icon="paper-plane" size="lg" className='font-send' style={{ opacity: 1 }} color='white' />    
                                </div>

                        </div>
            </form>
        </div>
)
}

export default ListMessage;