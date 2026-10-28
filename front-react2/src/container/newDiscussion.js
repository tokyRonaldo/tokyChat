
import React, { useState } from 'react';
import '../assets/myCss.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function NewDiscussion({
    setDataMessage,
    setListDiscussion,
    setNewChat,
    setActiveConversation,
    activeConversation
}) {
    const [conversToSend, setConversToSend] = useState('');
    const [loading, setLoading] = useState(false);

    const sendNewDiscussion = async (e) => {
        // Empêcher le rechargement de la page
        if (e) {
            e.preventDefault();
        }

        // Éviter les envois multiples
        if (loading) return;

        // Vérifier le contenu du message
        const message = conversToSend.trim();

        if (!message) {
            alert('Veuillez saisir un message.');
            return;
        }

        // URL du backend
        const apiUrl = process.env.REACT_APP_API_URL;

        if (!apiUrl) {
            alert(
                "L'URL du serveur est manquante. Vérifiez REACT_APP_API_URL dans votre fichier .env."
            );
            return;
        }

        // Récupérer le token d'authentification
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Votre session a expiré. Veuillez vous reconnecter.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${apiUrl}/api/chat/new-chat`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        message: message
                    })
                }
            );

            // Lire la réponse du backend
            const data = await response.json().catch(() => ({}));

            // Gérer les erreurs HTTP
            if (!response.ok) {
                console.error('Erreur du backend :', response.status, data);

                if (response.status === 503) {
                    throw new Error(
                        "Le service IA est temporairement indisponible. Veuillez réessayer dans quelques instants."
                    );
                }

                if (response.status === 401) {
                    throw new Error(
                        "Votre session a expiré. Veuillez vous reconnecter."
                    );
                }

                if (response.status === 429) {
                    throw new Error(
                        "Trop de requêtes ont été envoyées. Veuillez patienter avant de réessayer."
                    );
                }

                throw new Error(
                    data.msg ||
                    data.error ||
                    `Erreur HTTP : ${response.status}`
                );
            }

            // Vérifier les données reçues
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error(
                    "Le serveur n'a renvoyé aucune discussion."
                );
            }

            // Mettre à jour la liste des discussions
            setListDiscussion(data);

            // Sélectionner la discussion créée
            setDataMessage([data[0]]);
            setActiveConversation(data[0]._id);

            // Fermer l'écran de nouvelle discussion
            setNewChat(false);

            // Réinitialiser le champ de saisie
            setConversToSend('');

        } catch (error) {
            console.error(
                'Erreur lors de la création de la discussion :',
                error
            );

            alert(
                error.message ||
                "Impossible de créer la discussion. Veuillez réessayer."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="newDiscussion">
            <form onSubmit={sendNewDiscussion}>
                <div
                    style={{
                        textAlign: 'center',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        marginTop: '100px'
                    }}
                >
                    Comment puis-je vous aider ?
                </div>

                <div className="div-search div-search-new-conv">
                    <textarea
                        name="text-search"
                        id="text-search"
                        placeholder="Posez votre question..."
                        value={conversToSend}
                        onChange={(e) => setConversToSend(e.target.value)}
                        onKeyDown={(e) => {
                            // Envoyer avec Entrée, nouvelle ligne avec Maj + Entrée
                            if (
                                e.key === 'Enter' &&
                                !e.shiftKey &&
                                !e.nativeEvent.isComposing
                            ) {
                                e.preventDefault();
                                e.currentTarget.form?.requestSubmit();
                            }
                        }}
                        disabled={loading}
                    />

                    <div className="div-send">
                        <button
                            type="submit"
                            aria-label="Envoyer le message"
                            disabled={loading || !conversToSend.trim()}
                            style={{
                                cursor: loading ? 'wait' : 'pointer',
                                opacity: loading ? 0.5 : 1,
                                border: 'none',
                                background: 'transparent'
                            }}
                        >
                            <FontAwesomeIcon
                                icon="paper-plane"
                                size="lg"
                                className="font-send"
                                style={{ opacity: 1 }}
                                color="white"
                            />
                        </button>
                    </div>
                </div>

                {loading && (
                    <p style={{ textAlign: 'center', marginTop: '10px' }}>
                        Génération de la réponse en cours...
                    </p>
                )}
            </form>
        </div>
    );
}

export default NewDiscussion;
