import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from "moment";
import "moment/locale/fr"; // Importer la locale française

import { Modal, Button, Form } from "react-bootstrap";

function Sidebar({setDataMessage ,setListDiscussion,listDiscussion, setNewChat,setActiveConversation ,activeConversation}){
     //const apiUrl = import.meta.env.VITE_API_URL;
     const apiUrl = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");
    const [isDelete,setIsDelete] = useState(false);
    const [show, setShow] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [msgToSearch, setMsgtoSearch] = useState(null);
    const [listConversationSearch, setListConversationSearch] = useState([]);

    const [delMsgId,setDelMsgId]=useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseSearch = () => {
        setShowSearch(false);
        setListConversationSearch([])
    }
    const handleShowSearch = () => setShowSearch(true);

    const conversation = async () => {
        console.log('conversation')
        let response = await fetch(apiUrl+'/api/chat/list-chat/' , {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Ajout du token dans les headers
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`); // Gérer les erreurs HTTP
        }

        const data = await response.json(); // Récupérer les données JSON
        setListDiscussion(data)
        console.log(data);
    }


    const groupMessagesByDate = (messages) => {
        // const now = moment().startOf("day"); // Définir maintenant à 00:00 pour éviter les erreurs
        const now = moment().utc().startOf("day"); // Forcer UTC et 00:00
        const grouped = {
            "Aujourd'hui": [],
            "Hier": [],
            "Il y a 7 jours": [],
            "Ce mois-ci": [],
            "Plus ancien": []
        };
    
        messages.forEach((msg) => {
            const msgDate = msg.createdAt ? moment(msg.createdAt).utc().startOf("day") : null; // Convertir en UTC et comparer sans l'heure
            //const msgDate = moment(msg.createdAt).startOf("day"); // Comparer uniquement la date
            if (msgDate && msgDate.isSame(now, "day")) {
                grouped["Aujourd'hui"].push(msg);
            } else if (msgDate && msgDate.isSame(now.clone().subtract(1, "day"), "day")) {
                grouped["Hier"].push(msg);
            } else if (msgDate && msgDate.isBetween(now.clone().subtract(7, "days"), now.clone().subtract(2, "days"), "day", "[]")) {
                grouped["Il y a 7 jours"].push(msg);
            } else if (msgDate && msgDate.isSameOrAfter(now.clone().startOf("month")) && msgDate.isBefore(now.clone().subtract(7, "days"), "day")) {
                grouped["Ce mois-ci"].push(msg);
            } else {
                grouped["Plus ancien"].push(msg);
            }
        });
    
        return grouped;
    };

        
    const listMessage= async(id)=>{
        const resp = await fetch(`${apiUrl}/api/chat/list-message/${id}` , {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Ajout du token dans les headers
            }
        })
        if (!resp.ok){
            throw new Error(`Erreur HTTP: ${resp.status}`); // Gérer les erreurs HTTP
        }
        const data= await resp.json()
        console.log('++++++++++++++++++++++++++++++++++++++++');
        console.log(data);
        setDataMessage(data)
    }

    const deleteChat = async (id) =>{
        const response = await fetch(`${apiUrl}/api/chat/delete-chat/${id}`
            , {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Ajout du token dans les headers
                }
            }
        )

        if (!response.ok){
            return new Error(`Erreur HTTP: ${response.status}`)
        }
        const data = await response.json();
        setListDiscussion(data)
        handleClose();

    }

    const searchAction = async (txt)=>{
        console.log('atooooo')
        try{
            const response = await axios.get(`${apiUrl}/api/chat/search/${txt}`,{
                headers :{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Ajout du token
                }
            })
            console.log(response.data);
            setListConversationSearch(response.data)
        }catch(e){
            console.log("erreur");
            throw new Error('erreur:'+e)
        }
    }

    useEffect(() => {
        conversation();
    }, [apiUrl, token]); 
    const groupedMessages = groupMessagesByDate(listDiscussion);



    return(
    <div className='sidebar'>
        <div className='title'>
            <p className='titleApp' >Mini-chat </p>
        </div>
        <div className='header'>
            <button className='btn btn-primary new-chat-btn' onClick={()=>setNewChat(true)}><FontAwesomeIcon icon="plus" size="lg"/> <span> New chat </span></button>
                <span className='font-search'><FontAwesomeIcon icon="search" size="lg" style={{ opacity: 0.7,cursor:'pointer' }} color='white' onClick={handleShowSearch} /> </span>
        </div>
        <hr />    
        <div className='convers'>
            <p className='convers-p'>Your conversation</p>
        </div>
        <hr />

        <div className='list-conversation'>


        {/*object.entries na for .. in no ampiasaina rah iparcour objet en js*/}
        {Object.entries(groupedMessages).map(([group, messages], index, array) => (
            messages.length > 0 && (
                        <div className='block-conversation' key={group}>
                            
                            <div className='date-from'>
                                <p className='date-from-p'>{group}</p>
                            </div>

                            {messages.map((msg) => (
                                <div className='div-conversation' key={msg._id}>
                                    <p className={`conversation ${activeConversation === msg._id ? 'active' : ''}`} 
                                    onClick={() => {
                                        listMessage(msg._id);
                                        setNewChat(false);
                                        setActiveConversation(msg._id);
                                    }}  style={{marginBottom:'8px'}}>
                                        {msg.title}
                                    </p>
                                    <p className='delete-conversation'><FontAwesomeIcon icon="trash" size="xs" style={{ opacity: 0.7 ,marginBottom: '8px'}} color='black' onClick={() =>{
                                        console.log('test');
                                        handleShow();
                                        setDelMsgId(msg._id)
                                        }}/>  
                                    </p>

                                </div>

                            ))}
                            {index != array.length - 1 && 
                                <hr className='date-from-hr-bottom' />
                            }
                        </div>
                    ))
                )
            }

            
        </div>
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Êtes-vous sûr de vouloir supprimer cette conversation ?          
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Annuler
                </Button>
                <Button variant="danger" onClick={() =>{ deleteChat(delMsgId)}}>
                    Oui
                </Button>
            </Modal.Footer>
        </Modal>


        <Modal  show={showSearch} onHide={handleCloseSearch} centered className='modal-search'>
        <Modal.Header closeButton>
          <Modal.Title>Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Control
                type="text"
                placeholder=""
                autoFocus
                onKeyUp={(e)=>{
                    setMsgtoSearch(e.target.value);
                    searchAction(e.target.value)
                }}
                className='search-input'
                autoComplete='off'
              />
            </Form.Group>
          </Form>
          <div className='list-search mt-4 px-3'>
                {listConversationSearch && listConversationSearch.map((conv)=>(
                    <p key={conv._id} className='convers-search-p' style={{cursor:'pointer',padding:'7px',marginBottom:0}}
                        onClick={() => {
                            listMessage(conv._id);
                                setNewChat(false);
                                setActiveConversation(conv._id);
                                handleCloseSearch()
                            }}>
                            {conv.title}
                    </p>
                ))}
            </div>         

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSearch}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>



    </div>
    )
}

export default Sidebar;