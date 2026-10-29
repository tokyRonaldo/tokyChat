import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import 'moment/locale/fr';
import { Modal, Button, Form } from 'react-bootstrap';

function Sidebar({
    setDataMessage,
    setListDiscussion,
    listDiscussion,
    setNewChat,
    setActiveConversation,
    activeConversation
}) {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem('token');

    const [show, setShow] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [listConversationSearch, setListConversationSearch] = useState([]);
    const [delMsgId, setDelMsgId] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Fermer la fenêtre de confirmation
    const handleClose = () => {
        setShow(false);
        setDelMsgId(null);
    };

    // Ouvrir la fenêtre de confirmation
    const handleShow = (id) => {
        setDelMsgId(id);
        setShow(true);
    };

    // Fermer la fenêtre de recherche
    const handleCloseSearch = () => {
        setShowSearch(false);
        setListConversationSearch([]);
        setErrorMessage('');
    };

    // Ouvrir la fenêtre de recherche
    const handleShowSearch = () => {
        setShowSearch(true);
        setErrorMessage('');
    };

    // Récupérer la liste des conversations
    const conversation = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/api/chat/list-chat/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const data = await response.json();

            setListDiscussion(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(
                'Erreur lors du chargement des conversations :',
                error
            );
        }
    }, [apiUrl, token, setListDiscussion]);

    // Regrouper les conversations par date
    const groupMessagesByDate = (messages) => {
        const now = moment.utc().startOf('day');

        const grouped = {
            "Aujourd'hui": [],
            'Hier': [],
            'Il y a 7 jours': [],
            'Ce mois-ci': [],
            'Plus ancien': []
        };

        if (!Array.isArray(messages)) {
            return grouped;
        }

        messages.forEach((msg) => {
            const msgDate = msg.createdAt
                ? moment.utc(msg.createdAt).startOf('day')
                : null;

            if (!msgDate || !msgDate.isValid()) {
                grouped['Plus ancien'].push(msg);
            } else if (msgDate.isSame(now, 'day')) {
                grouped["Aujourd'hui"].push(msg);
            } else if (
                msgDate.isSame(now.clone().subtract(1, 'day'), 'day')
            ) {
                grouped['Hier'].push(msg);
            } else if (
                msgDate.isBetween(
                    now.clone().subtract(7, 'days'),
                    now.clone().subtract(2, 'days'),
                    'day',
                    '[]'
                )
            ) {
                grouped['Il y a 7 jours'].push(msg);
            } else if (
                msgDate.isSameOrAfter(now.clone().startOf('month')) &&
                msgDate.isBefore(now.clone().subtract(7, 'days'), 'day')
            ) {
                grouped['Ce mois-ci'].push(msg);
            } else {
                grouped['Plus ancien'].push(msg);
            }
        });

        return grouped;
    };

    // Charger les messages d'une conversation
    const listMessage = async (id) => {
        try {
            const response = await fetch(
                `${apiUrl}/api/chat/list-message/${id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const data = await response.json();

            setDataMessage(data);
        } catch (error) {
            console.error(
                'Erreur lors du chargement des messages :',
                error
            );
        }
    };

    // Supprimer une conversation
    const deleteChat = async (id) => {
        if (!id) {
            return;
        }

        try {
            const response = await fetch(
                `${apiUrl}/api/chat/delete-chat/${id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const data = await response.json();

            setListDiscussion(Array.isArray(data) ? data : []);

            // Désélectionner la conversation supprimée
            if (activeConversation === id) {
                setActiveConversation(null);
                setDataMessage([]);
            }

            handleClose();
        } catch (error) {
            console.error(
                'Erreur lors de la suppression de la conversation :',
                error
            );
        }
    };

    // Rechercher des conversations
    const searchAction = async (txt) => {
        const searchText = txt.trim();

        if (!searchText) {
            setListConversationSearch([]);
            setErrorMessage('');
            return;
        }

        try {
            setSearchLoading(true);
            setErrorMessage('');

            const response = await axios.get(
                `${apiUrl}/api/chat/search/${encodeURIComponent(searchText)}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setListConversationSearch(
                Array.isArray(response.data) ? response.data : []
            );
        } catch (error) {
            console.error(
                'Erreur lors de la recherche :',
                error
            );

            setListConversationSearch([]);
            setErrorMessage('Impossible de rechercher les conversations.');
        } finally {
            setSearchLoading(false);
        }
    };

    // Charger les conversations au montage du composant
    useEffect(() => {
        conversation();
    }, [conversation]);

    // Préparer les conversations regroupées par date
    const groupedMessages = groupMessagesByDate(listDiscussion);

    return (
        <div className="sidebar">
            {/* En-tête */}
            <div className="title">
                <p className="titleApp">Mini-chat</p>
            </div>

            {/* Boutons d'action */}
            <div className="header">
                <button
                    type="button"
                    className="btn btn-primary new-chat-btn"
                    onClick={() => setNewChat(true)}
                >
                    <FontAwesomeIcon icon="plus" size="lg" />
                    <span> New chat </span>
                </button>

                <span className="font-search">
                    <FontAwesomeIcon
                        icon="search"
                        size="lg"
                        style={{
                            opacity: 0.7,
                            cursor: 'pointer'
                        }}
                        color="white"
                        onClick={handleShowSearch}
                    />
                </span>
            </div>

            <hr />

            {/* Liste des conversations */}
            <div className="convers">
                <p className="convers-p">Your conversation</p>
            </div>

            <hr />

            <div className="list-conversation">
                {Object.entries(groupedMessages).map(
                    ([group, messages], index, array) => (
                        messages.length > 0 && (
                            <div
                                className="block-conversation"
                                key={group}
                            >
                                <div className="date-from">
                                    <p className="date-from-p">
                                        {group}
                                    </p>
                                </div>

                                {messages.map((msg) => (
                                    <div
                                        className="div-conversation"
                                        key={msg._id}
                                    >
                                        <p
                                            className={`conversation ${
                                                activeConversation === msg._id
                                                    ? 'active'
                                                    : ''
                                            }`}
                                            style={{ marginBottom: '8px' }}
                                            onClick={() => {
                                                listMessage(msg._id);
                                                setNewChat(false);
                                                setActiveConversation(msg._id);
                                            }}
                                        >
                                            {msg.title}
                                        </p>

                                        <p className="delete-conversation">
                                            <FontAwesomeIcon
                                                icon="trash"
                                                size="xs"
                                                style={{
                                                    opacity: 0.7,
                                                    marginBottom: '8px',
                                                    cursor: 'pointer'
                                                }}
                                                color="black"
                                                onClick={() => handleShow(msg._id)}
                                            />
                                        </p>
                                    </div>
                                ))}

                                {index !== array.length - 1 && (
                                    <hr className="date-from-hr-bottom" />
                                )}
                            </div>
                        )
                    )
                )}
            </div>

            {/* Modal de confirmation de suppression */}
            <Modal
                show={show}
                onHide={handleClose}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Êtes-vous sûr de vouloir supprimer cette conversation ?
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                    >
                        Annuler
                    </Button>

                    <Button
                        variant="danger"
                        onClick={() => deleteChat(delMsgId)}
                        disabled={!delMsgId}
                    >
                        Oui
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de recherche */}
            <Modal
                show={showSearch}
                onHide={handleCloseSearch}
                centered
                className="modal-search"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Search</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <Form.Group
                            className="mb-3"
                            controlId="searchConversation"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Rechercher une conversation..."
                                autoFocus
                                autoComplete="off"
                                className="search-input"
                                onChange={(e) => searchAction(e.target.value)}
                            />
                        </Form.Group>
                    </Form>

                    <div className="list-search mt-4 px-3">
                        {searchLoading && (
                            <p>Recherche en cours...</p>
                        )}

                        {errorMessage && (
                            <p className="text-danger">
                                {errorMessage}
                            </p>
                        )}

                        {!searchLoading &&
                            !errorMessage &&
                            listConversationSearch.length === 0 && (
                                <p>Aucune conversation trouvée.</p>
                            )}

                        {listConversationSearch.map((conv) => (
                            <p
                                key={conv._id}
                                className="convers-search-p"
                                style={{
                                    cursor: 'pointer',
                                    padding: '7px',
                                    marginBottom: 0
                                }}
                                onClick={() => {
                                    listMessage(conv._id);
                                    setNewChat(false);
                                    setActiveConversation(conv._id);
                                    handleCloseSearch();
                                }}
                            >
                                {conv.title}
                            </p>
                        ))}
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={handleCloseSearch}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Sidebar;