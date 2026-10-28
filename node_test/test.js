const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });


const prompt = "merci";
const test = async () => {
    console.log('ato ah ee')
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
}
test()
console.log('ivelany ah ee')