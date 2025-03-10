const mongoose =require('mongoose');

const messageSchema= mongoose.Schema({
   // id: { type: Number, required: true }, // Identifiant unique pour le message
    parentId: { type: String, default: null }, // ID du parent pour une relation hiérarchique
    type: { type: String, enum: ['question', 'reponse'], required: true }, // Type de message
    message: { type: String, required: true }, // Contenu du message
    timestamp: { type: Date, required: true, default: Date.now } // Date et heure du message
})

const chatSchema = mongoose.Schema({
    title: {type: String,required : true},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
    messages: [messageSchema]
},
{timestamps : true}
);


module.exports = mongoose.model('chats', chatSchema);