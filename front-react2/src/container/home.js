import React, { useState,useEffect } from 'react';
import Sidebar from './sidebar';
import { useNavigate } from 'react-router-dom';
import '../assets/myCss.css'
import NewDiscussion from './newDiscussion';
import ListMessage from './listMessage';

function Home(){
    const [isOpen, setIsOpen] = useState(false);
    const [dataMessage, setDataMessage] = useState([]);
    const [listDiscussion,setListDiscussion] = useState([])
    const [newChat, setNewChat] = useState(true);
    const [activeConversation, setActiveConversation] = useState();
    const navigate=useNavigate();


    const togglePopup = () => {
      setIsOpen(!isOpen);
    };

    const logout = async ()=>{
        localStorage.removeItem("token");
        navigate('/login');
    }

    useEffect(() => {
        console.log("Nouvelle valeur de dataMessage :", dataMessage);
    }, [dataMessage]);

    return (
        <div className="tokyContainer" style={{backgroundColor : '#FFFFFF !important' }}>
            <div className="contenu">
                    <Sidebar setNewChat={setNewChat} setDataMessage={setDataMessage} setListDiscussion={setListDiscussion} listDiscussion={listDiscussion} setActiveConversation={setActiveConversation} activeConversation={activeConversation}/>
                    <div className="content">
                        <div className='about'  >
                            <div className='about-div' onClick={togglePopup} style={{cursor : 'pointer'}}>
                                <span className='email-span'>TR</span>
                            </div>
                        {isOpen && (
                            <div className="popup">
                            <button onClick={() => logout()}>Logout</button>
                            </div>
                        )}
                        </div>

                        {newChat ?
                            <NewDiscussion setDataMessage={setDataMessage} setListDiscussion={setListDiscussion} setNewChat={setNewChat} setActiveConversation ={setActiveConversation} activeConversation={activeConversation} /> :
                        <ListMessage dataMessage={dataMessage} setDataMessage={setDataMessage}  />
                        }
                        {/**/}


                    </div>
            </div>
        </div>
    )
}

export default Home;