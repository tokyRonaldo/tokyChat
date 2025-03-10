const express = require('express');
const Chat = require('../models/chatModel')
const User = require('../models/userModel')
const { MongoClient, ObjectId } = require('mongodb');
const mongoose =require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { GoogleGenerativeAI } = require("@google/generative-ai");
const chatModel = require('../models/chatModel');

const genAI = new GoogleGenerativeAI("AIzaSyBkv3srfbhClEiLbiMcqEPYQjql_yPiIaE");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getChat = async (req , res) => {
    const listChat = await Chat.find().sort({createdAt: -1});
    console.log('etooooooooooooooooo')
    console.log(listChat)
    return res.status(200).json(listChat);
}

const getMessage = async (req , res) => {
    let id = req.params.id;
    console.log(id)
    console.log(req.params);
    const listChat = await Chat.find({'_id' : id});
    return res.status(200).json(listChat);
}

const newChat = async (req , res) => {
    const params = req.body
    const prompt = params.message;
    console.log(req.user._id);
    const test = async () => {
        const result = await model.generateContent(prompt);
        return result.response.candidates[0].content.parts[0].text;
    }
        
    const responseText = await test();
    //res.json(responseText);
    const msg= {
        "title": prompt,
        "messages": [
          {
            "parentId": null,
            "type": "question",
            "message": prompt,
            //"timestamp": "2025-01-20T10:00:00Z"
          },
          {
            "parentId": null,
            "type": "reponse",
            "message": responseText,
            //"timestamp": "2025-01-20T10:00:05Z"
          }
        ],
        user_id :req.user._id
      
    }


    //const test = await Test.insertMany(req.body);
   // const test = await Test.create({title});
   //const newChat = new Chat(params);

   //await newChat.save();
   // Exemple de traitement des messages d'un nouveau chat
    async function processAndSaveChat(chatParams) {
        try {
            console.log('lkdjfkdjfjkjhkljkj2');
            console.log(req.user._id);
        
            const newChat = new Chat(chatParams);

            // Parcourir les messages pour associer questions et réponses
            let questions = null;
            newChat.messages.forEach((message, index) => {
                if (message.type === 'question') {
                    // Stocker les questions par leur ID (auto-généré par Mongoose)
                    questions = message._id; // Stocke l'index du tableau
                } else if (message.type === 'reponse') {
                    // Associer l'ID de la question au parentId de la réponse
                    const questionId = questions // Récupère le premier ID de question non associé
                    if (questionId) {
                        message.parentId = questionId; // Associe le parentId
                        delete questions[questionId]; // Supprime la question traitée
                    }
                }
            });

            // Sauvegarder le chat mis à jour
            await newChat.save();
            const listChat = await Chat.find().sort({createdAt: -1});
            //const updatedChat = await Chat.find({ '_id': newChat._id }); // Récupère la version mise à jour
            return res.status(201).json(listChat);
    
            console.log('Chat sauvegardé avec succès :', newChat);
            //res.status(201).json(newChat);
        } catch (error) {
            console.error('Erreur lors du traitement et de la sauvegarde du chat :', error);
            return res.status(500).json({ error: 'Erreur lors du traitement et de la sauvegarde du chat' });
        }
    }

    processAndSaveChat(msg);
    
    /* //find
    const test= await Chat.find({'messages.parentId' : '67923daf06f4c082028593ff'}); 

    db.documents.find({}, { name: 1, _id: 0 })
    return res.status(201).json(test) */
}

const newMessage = async(req,res) => {
    const params = req.body
    const chatId = req.params.id
    console.log(params);
    const prompt = params.message;
    const test = async () => {
        console.log('ato ah ee')
        const result = await model.generateContent(prompt);
        return result.response.candidates[0].content.parts[0].text;
    }
        
    //const result = await model.generateContent({ prompt });
    //res.send(result || "No response text found");
    const responseText = await test();
    //res.json(responseText);
    const msg= {
        //"title": "Session avancée",
        "messages": [
          {
            "parentId": null,
            "type": "question",
            "message": prompt,
            "timestamp": "2025-01-20T10:00:00Z"
          },
          {
            "parentId": null,
            "type": "reponse",
            "message": responseText,
            "timestamp": "2025-01-20T10:00:05Z"
          }
        ],
        user_id :req.user._id
      
    }

    try{

        const chat = await Chat.findById(chatId);

        // Ajouter les nouveaux messages au tableau `messages`
        const newMessages = msg.messages || []; // Assurez-vous que les messages sont passés dans le body
        console.log(newMessages);
        let lastQuestionId = null;


        newMessages.forEach((message) => {
            if (message.type === 'question') {
                // Enregistrer l'ID de la question
                console.log(message)
                const question = { ...message };
                console.log(question)
                chat.messages.push(question);
                lastQuestionId = chat.messages[chat.messages.length - 1]._id; // Récupérer l'ID généré
                console.log('Nouvel ID de la question :', lastQuestionId);
            // ID généré automatiquement
            } else if (message.type === 'reponse') {
                // Associer à la dernière question
                if (lastQuestionId) {
                    const response = { ...message, parentId: lastQuestionId };
                    chat.messages.push(response);
                } else {
                    console.warn("Impossible d'associer une réponse à une question inexistante.");
                }
            }
        });

        await chat.save();

        const updatedChat = await Chat.find({ '_id': chat._id }); // Récupère la version mise à jour
        return res.status(201).json(updatedChat);
        //res.status(201).json(chat);
    }catch(error){
        return res.status(500).json({
            'msg' : error.message
        })
    }
  

}

const editMessage = async(req,res) => {
    const params = req.body
    const chatId = req.params.id
    const msgId = req.params.msg_id
    console.log(params);
    const prompt = params.message;
    const test = async () => {
        console.log('ato ah ee')
        const result = await model.generateContent(prompt);
        return result.response.candidates[0].content.parts[0].text;
    }
        
    //const result = await model.generateContent({ prompt });
    //res.send(result || "No response text found");
    const responseText = await test();
    //res.json(responseText);
    let msgQuestion = prompt;
    let msgResponse = responseText;
    /*const msg= {
        //"title": "Session avancée",
        "messages": [
          {
            "parentId": null,
            "type": "question",
            "message": prompt,
            "timestamp": "2025-01-20T10:00:00Z"
          },
          {
            "parentId": null,
            "type": "reponse",
            "message": responseText,
            "timestamp": "2025-01-20T10:00:05Z"
          }
        ],
        user_id :req.user._id
      
    }
    */

    try{

        const chat = await Chat.findById(chatId);

        // 🔹 Mettre à jour le message parent
        const parentUpdate = await Chat.updateOne(
            { _id: chatId, "messages._id": msgId }, 
            { $set: { "messages.$.message": msgQuestion } }
        );

        if (parentUpdate.modifiedCount > 0) {
            console.log('Message parent mis à jour.');
        } else {
            console.log('Aucune mise à jour du message parent.');
        }

        // 🔹 Mettre à jour les messages enfants (ceux avec parentId = messageId)
        const childrenUpdate = await Chat.updateMany(
            { _id: chatId, "messages.parentId": msgId }, 
            { $set: { "messages.$[elem].message": msgResponse } },
            { arrayFilters: [{ "elem.parentId": msgId }] } // Filtrer dans le tableau `messages`
        );

        if (childrenUpdate.modifiedCount > 0) {
            console.log('Messages enfants mis à jour.');
        } else {
            console.log('Aucune mise à jour des messages enfants.');
        }


        const updatedChat = await Chat.find({ '_id': chat._id }); // Récupère la version mise à jour
        return res.status(201).json(updatedChat);
        //res.status(201).json(chat);
    }catch(error){
        return res.status(500).json({
            'msg' : error.message
        })
    }
  

}


const deleteMessage = async (req , res) => {
    let id = req.params.id;
    const updatedChat = await Chat.findOneAndUpdate(
        {
            "messages._id": id // Filtre pour trouver le chat contenant le message
        },
        {
            $pull: {
                messages: {
                    $or: [
                        { _id: id },
                        { parentId: id }
                    ]
                }
            }
        }
    );
    return res.status(200).json(updatedChat);
}

const deleteChat = async (req , res) => {
    let id = req.params.id;
    await Chat.deleteOne({'_id' : id});

    const listChat = await Chat.find().sort({createdAt: -1});
    return res.status(200).json(listChat);
}

const register= async(req,res)=> {
    const params = req.body;

    try{

        //let password = await bcryp.hash(params.email,12)
        let user = await User.findOne({email : params.email});
        if(user){
           return res.status('401').json({
                msg:"existe deja"
            })
        }
        

        let hashPassword = await bcrypt.hash(params.password,12);
        const newUser = await User.create({
            'email' : params.email,
            'password' : hashPassword,
            'username' : params.username,
        });

        const token = await jwt.sign({'_id' : newUser._id},'secretKey123')

        return res.status(201).json({
            msg : "enregistrer avec succes",
            token
        })

    }catch(error){
        return res.status(500).json({
            'msg' : error.message
        })
        //next(error);
    }
}

    const login= async(req,res)=> {
        console.log('test');
    const params = req.body;
    const {email , password} = params;
console.log(params);
    try{

        //let password = await bcryp.hash(params.email,12)
        let user = await User.findOne({email});
        if(!user){
            return res.status('400').json({
                msg:"mauvaise identifiant"
            })
        }
        
        //const isValidPassword = user.passord == password ? true : false;
        const isValidPassword = await bcrypt.compare(password, user.password);

        const token = await jwt.sign({'_id' : user._id},'secretKey123')

        return res.status(201).json({
            msg : "login avec succes",
            token,
            user : {
                _id : user._id,
                username : user.username,
                email : user.email,
            }
        })

    }catch(error){
        return res.status(500).json({
            'msg' : error.message
        })

    }

}

const searchOnChat= async (req,res) =>{
    const msg = req.params.value;
    console.log(msg);
    console.log("messagedfffffffffffffffffff");
    const result = await chatModel.find({
        $or:[
            {title:{$regex : msg,$options : 'i'}},
            {"messages.message":{$regex : msg,$options : 'i'}}
        ]
    })
    console.log(result);
    return res.status(201).json(result)
}

module.exports = {
    getChat ,
    getMessage,
    newChat,
    newMessage,
    editMessage,
    deleteMessage,
    deleteChat,
    searchOnChat,
    login,
    register,
}