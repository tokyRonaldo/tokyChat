const express = require('express');
const router = express.Router();
const Test = require('../models/testModel')
const Chat = require('../models/chatModel')
const { MongoClient, ObjectId } = require('mongodb');

router.post('/', async(req,res)=> {
    console.log(req.body);
    const params = req.body;
    console.log(params);
    //const test = await Test.insertMany(req.body);
   // const test = await Test.create({title});
   //const newChat = new Chat(params);

   //await newChat.save();
   // Exemple de traitement des messages d'un nouveau chat
    async function processAndSaveChat(chatParams) {
        try {
            const newChat = new Chat(chatParams);

            // Parcourir les messages pour associer questions et réponses
            let questions = null;
            newChat.messages.forEach((message, index) => {
                if (message.type === 'question') {
                    // Stocker les questions par leur ID (auto-généré par Mongoose)
                    console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmm')
                    console.log(message._id)
                    questions = message._id; // Stocke l'index du tableau
                } else if (message.type === 'reponse') {
                    // Associer l'ID de la question au parentId de la réponse
                    console.log(questions);
                    const questionId = questions // Récupère le premier ID de question non associé
                    if (questionId) {
                        message.parentId = questionId; // Associe le parentId
                        delete questions[questionId]; // Supprime la question traitée
                    }
                }
            });

            // Sauvegarder le chat mis à jour
            await newChat.save();
            console.log('Chat sauvegardé avec succès :', newChat);
            res.status(201).json(newChat);
        } catch (error) {
            console.error('Erreur lors du traitement et de la sauvegarde du chat :', error);
            res.status(500).json({ error: 'Erreur lors du traitement et de la sauvegarde du chat' });
        }
    }

    processAndSaveChat(params);
    
    /* //find
    const test= await Chat.find({'messages.parentId' : '67923daf06f4c082028593ff'}); 
    return res.status(201).json(test) */

})

router.get('/', async(req,res)=> {
    const tests = await Test.find();
    res.status(200).json(tests);
})

router.put('/:id', async(req,res)=> {
    const {title,completed} = req.body;
    const test= await Test.update(req.params.id , {title,completed} , {new:true})
    res.status(200).json(test);
})

router.delete('/:id', async(req,res)=>{
    await Test.findByIdAndDelete(req.params.id)
    res.status(200).json({message:'tache supprimer avec succes'});
})

module.exports = router;