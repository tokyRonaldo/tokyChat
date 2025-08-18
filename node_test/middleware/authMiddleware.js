const jwt = require('jsonwebtoken');
const User = require('../models/userModel')

const authMiddleware = async (req , res ,next) =>{
    const token = req.header("Authorization");
    console.log(token);
    console.log('dkjfsjfjfmsdjfmjdfjdmjfmj');
    if (!token) {
        return res.status(401).json({ message: "Accès refusé, aucun token fourni" });
    }

    try{
        const decoded = await jwt.verify(token.replace("Bearer ", ""), "secretKey123", { expiresIn: "7d" });
        console.log("Token décodé :", decoded);
        const user =  await User.findById(decoded._id).select('-password');
        
        if(!user){
            return res.status(404).json({ message: 'Utilisateur introuvable' });        
        }
        req.user = user;
        next();
    }catch(err){
        return res.status(403).json({message : "Token invalide ou expiré"});   
    }
}

module.exports = authMiddleware;