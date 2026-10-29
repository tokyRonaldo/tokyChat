import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../assets/myCss.css';

function ListMessage({ dataMessage, setDataMessage }) {
    const [msgToSend, setMsgToSend] = useState('');
    const [msgToEdit, setMsgToEdit] = useState('');
    const [isEdit, setIsEdit] = useState(null);

    const bottomRef = useRef(null);
    const messageContainerRef = useRef(null);

    const apiUrl = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem('token');

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [dataMessage]);

    const sendMessage = async () => {
        if (!msgToSend.trim() || !dataMessage?.length) {
            return;
        }

        const id = dataMessage[0]._id;

        try {
            const response = await fetch(`${apiUrl}/api/chat/new-message/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ message: msgToSend }),
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const data = await response.json();
            setDataMessage(data);
            setMsgToSend('');
        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
        }
    };

    const editMessage = async (chatId, msgId) => {
        try {
            const response = await fetch(
                `${apiUrl}/api/chat/edit/${chatId}/${msgId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ message: msgToEdit }),
                }
            );

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const data = await response.json();
            setDataMessage(data);
            setIsEdit(null);
        } catch (error) {
            console.error('Erreur lors de la modification du message :', error);
        }
    };

    return (
        <div className="listDiv">
            <div
                className="listMessage"
                ref={messageContainerRef}
                style={{ paddingBottom: '100px' }}
            >
                {dataMessage?.length > 0 &&
                    dataMessage[0].messages?.length > 0 &&
                    dataMessage[0].messages.map((msg, index) => (
                        <div key={msg._id}>
                            {msg.type === 'question' && (
                                <div className="question">
                                    {isEdit === msg._id ? (
                                        <div
                                            className="question-div-edit"
                                            style={{
                                                border: 'none',
                                                backgroundColor: '#E0DEDE',
                                            }}
                                        >
                                            <textarea
                                                value={msgToEdit}
                                                onChange={(e) =>
                                                    setMsgToEdit(e.target.value)
                                                }
                                            />

                                            <div className="action-btn d-flex justify-content-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-default me-1"
                                                    style={{
                                                        backgroundColor: '#999090ad',
                                                    }}
                                                    onClick={() => setIsEdit(null)}
                                                >
                                                    Annuler
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() =>
                                                        editMessage(
                                                            dataMessage[0]._id,
                                                            msg._id
                                                        )
                                                    }
                                                >
                                                    Envoyer
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon
                                                icon="edit"
                                                size="xs"
                                                style={{
                                                    opacity: 0.9,
                                                    cursor: 'pointer',
                                                    fontSize: '16px',
                                                }}
                                                color="black"
                                                onClick={() => {
                                                    setIsEdit(msg._id);
                                                    setMsgToEdit(msg.message);
                                                }}
                                            />

                                            <div className="question-div">
                                                <span className="question-text">
                                                    {msg.message}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {msg.type === 'reponse' && (
                                <div className="reponse">
                                    <div className="reponse-div">
                                        <span className="reponse-text">
                                            {msg.message}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {index % 2 !== 0 &&
                                index !== dataMessage[0].messages.length - 1 && (
                                    <hr className="hr-content" />
                                )}
                        </div>
                    ))}

                <div ref={bottomRef} />
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                }}
            >
                <div className="div-search">
                    <textarea
                        name="text-search"
                        id="text-search"
                        placeholder="Écrivez votre message..."
                        value={msgToSend}
                        onChange={(e) => setMsgToSend(e.target.value)}
                    />

                    <button type="submit" className="div-send">
                        <FontAwesomeIcon
                            icon="paper-plane"
                            size="lg"
                            className="font-send"
                            style={{ opacity: 1 }}
                            color="white"
                        />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ListMessage;
