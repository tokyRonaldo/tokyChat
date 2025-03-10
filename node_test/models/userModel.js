const mongoose =require('mongoose');

const usersChatSchema= mongoose.Schema({
    email: { type: String }, // ID du parent pour une relation hiérarchique
    password: { type: String}, // Type de message
    username: { type: String}, // Contenu du message
})


module.exports = mongoose.model('usersChat', usersChatSchema);