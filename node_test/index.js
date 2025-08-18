/*const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3001;

const genAI = new GoogleGenerativeAI("AIzaSyBkv3srfbhClEiLbiMcqEPYQjql_yPiIaE");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


// Endpoint principal
app.get("/", async (req, res) => {
    //const prompt = "Explain how AI works";
    const prompt = "merci";
    const test = async () => {
        console.log('ato ah ee')
        const result = await model.generateContent(prompt);
        return result.response.candidates[0].content.parts[0].text;
    }
        
    //const result = await model.generateContent({ prompt });
    //res.send(result || "No response text found");
    const responseText = await test();
        res.send(responseText);

    
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
  //test()
});
*/
/*
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3001;
const prompt = "merci";

// Initialiser l'API Google Generative AI avec la clé API
const genAI = new GoogleGenerativeAI({
  apiKey: "AIzaSyBkv3srfbhClEiLbiMcqEPYQjql_yPiIaE",
});

// Définir le modèle
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Fonction pour générer le contenu
const test = async () => {
  try {
    console.log("Génération du contenu...");

    // Utilisation d'un format plus standard pour l'API
    const result = await model.generateContent(prompt);
    console.log('result')

    // Retourner le texte généré, en vérifiant si la réponse est disponible
    return result.responses && result.responses[0]?.text ? result.responses[0].text : "Pas de texte disponible";
  } catch (error) {
    console.error("Erreur lors de la génération du contenu :", error.message);
    return "Erreur lors de la génération du contenu";
  }
};

// Endpoint principal
app.get("/", async (req, res) => {
  const responseText = await test(); // Attendre la réponse de la génération
  res.send(responseText); // Envoyer la réponse textuelle
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
*/


const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db')
const testRoutes = require('./routes/testRoute');
const chatRoutes = require('./routes/chatRoute');
const app = express();
const jwt = require('jsonwebtoken')
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyBkv3srfbhClEiLbiMcqEPYQjql_yPiIaE");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

dotenv.config();
connectDB();


app.use(cors({
  origin: process.env.FRONT_URL, // URL de ton application React
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json());

app.use('/api/test',testRoutes);
app.use('/api/chat',chatRoutes);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});