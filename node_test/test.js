const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyClrn_ZL0FepfK-c_1MclUSdHWM499QHHs");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "merci";
const test = async () => {
    console.log('ato ah ee')
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
}
test()
console.log('ivelany ah ee')