import React ,{useState,useEffect} from 'react';
import '../assets/myCss.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function NewDiscussion({setDataMessage,setListDiscussion,setNewChat ,setActiveConversation  ,activeConversation }) {
    const [conversToSend, setConversToSend] = useState();
    const sendNewDiscussion = async () => {
         //e.preventDefault(); // Empêche le rechargement de la page
            //const apiUrl = import.meta.env.VITE_API_URL;
            const apiUrl = process.env.REACT_APP_API_URL;

            const token = localStorage.getItem("token");
            
            const response = await fetch(`${apiUrl}/api/chat/new-chat`,{
                method : 'post',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Ajout du token dans les headers
                },
                body: JSON.stringify({ message: conversToSend }) // Correction ici
            })

            if (!response.ok){
                throw new Error(`Erreur HTTP : ${response.status}`)
            }
            const data= await response.json()
            const dataDataMessage = [data[0]];
            setListDiscussion(data);
            
            setNewChat(false);
            setDataMessage(dataDataMessage);
            setActiveConversation(dataDataMessage[0]._id);

    }

    //useEffect()
    return(
        <div className="newDiscussion">
            <form onSubmit={(e) => {
                    /*e.preventDefault(); // Empêche le rechargement de la page
                    if (dataMessage && dataMessage.length > 0) {
                        sendMessage(dataMessage[0]._id);
                    }*/
                    sendNewDiscussion();
                }}>
                <div style={{textAlign:'center',fontSize:'24px',fontWeight:'bold',marginTop:'100px'}}>Comment puis je vous aider?</div>
                
                <div className='div-search div-search-new-conv'>
                    <textarea name="text-search" id="text-search" placeholder='placeholder' onChange={(e) => {setConversToSend(e.target.value)}}></textarea>
                    <div className='div-send' onClick={sendNewDiscussion}>
                        <FontAwesomeIcon icon="paper-plane" size="lg" className='font-send' style={{ opacity: 1 }} color='white' />    
                    </div>

                </div>
            </form>

        </div>
)
}

export default NewDiscussion;