const express = require('express');
const router = express.Router();
const Chat = require('../models/chatModel')
const AuthMiddleware = require('../middleware/authMiddleware')
const { MongoClient, ObjectId } = require('mongodb');
const {
    getChat ,
    getMessage,
    newChat,
    newMessage,
    editMessage,
    deleteMessage,
    deleteChat,
    searchOnChat,
    login,
    register
} = require('../controller/chatController')

router.post('/login', login)

router.post('/register', register)

router.post('/new-chat',AuthMiddleware, newChat)

router.post('/new-message/:id',AuthMiddleware, newMessage)

router.post('/edit/:id/:msg_id',AuthMiddleware, editMessage)

router.get('/list-chat',AuthMiddleware ,getChat)

router.get('/list-message/:id',AuthMiddleware ,getMessage)

router.get('/delete-message/:id',AuthMiddleware ,deleteMessage)

router.get('/delete-chat/:id',AuthMiddleware, deleteChat)

router.get('/search/:value',AuthMiddleware, searchOnChat)


module.exports = router;