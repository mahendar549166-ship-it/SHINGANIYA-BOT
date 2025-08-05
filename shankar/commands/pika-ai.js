const axios = require("axios");

module.exports.config = {
  name: "pika-ai",
  version: "3.2.0",
  hasPermission: 0,
  credits: "Shankar Singhaniya",
  description: "AI बॉट जो सिर्फ अपने मैसेज के रिप्लाई पर जवाब देगा",
  commandCategory: "AI",
  usePrefix: false,
  usages: "[बॉट के मैसेज पर रिप्लाई करें]",
  cooldowns: 5,
};

let userMemory = {};
let isActive = true;
let userLanguage = {};

const BOSS_UID = "61577191230420";
const GROQ_API_KEY = "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";

const supportedLanguages = {
  bhojpuri: "bho", urdu: "ur", punjabi: "pa", nepali: "ne",
  english: "en", hindi: "hi", french: "fr", spanish: "es", russian: "ru",
  italian: "it", arabic: "ar", german: "de", portuguese: "pt",
  korean: "ko", bengali: "bn", marathi: "mr", maithili: "mai",
  tamil: "ta", gujrati: "gu", sanskrit: "sa"
};

// Google Translate
async function translateText(text, targetLang) {
  try {
    const response = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
    return response.data[0][0][0];
  } catch (error) {
    console.error("🌐 Translation Error:", error.message);
    return text;
  }
}

// Groq API
const groqAI = async (messages) => {
  try {
    const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages,
      temperature: 0.7,
      max_tokens: 1000
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      }
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("🌐 Groq API Error:", error.response?.data || error.message);
    throw new Error("Groq API से जवाब लाने में दिक्कत हो रही है");
  }
};

const getAIResponse = async (prompt, persona) => {
  try {
    const messages = [
      { role: "system", content: persona + " Keep your responses under 150 characters. Never mention user handles like @User." },
      { role: "user", content: prompt }
    ];
    let reply = await groqAI(messages);
    reply = reply.replace(/@[^ ]+/g, '');
    if (reply.length > 200) reply = reply.slice(0, 200) + "...";
    return reply;
  } catch (err) {
    console.error("🌐 AI Error:", err.message);
    return "❌ AI से जवाब लाने में दिक्कत हो रही है।";
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  if (!isActive || !body || !messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

  const lowerBody = body.toLowerCase().trim();
  const langKeys = Object.keys(supportedLanguages);

  // Detect language change from body
  if (langKeys.includes(lowerBody)) {
    userLanguage[senderID] = supportedLanguages[lowerBody];
    const langName = lowerBody.charAt(0).toUpperCase() + lowerBody.slice(1);
    const confirmationMsg = await translateText(`अब मैं ${langName} भाषा में बात करूँगा!`, userLanguage[senderID]);
    return api.sendMessage(confirmationMsg, threadID, messageID);
  }

  for (const lang of langKeys) {
    if (lowerBody.includes(`lang ${lang}`) || lowerBody.includes(`language ${lang}`)) {
      userLanguage[senderID] = supportedLanguages[lang];
      const langName = lang.charAt(0).toUpperCase() + lang.slice(1);
      const confirmationMsg = await translateText(`अब मैं ${langName} भाषा में बात करूँगा!`, userLanguage[senderID]);
      return api.sendMessage(confirmationMsg, threadID, messageID);
    }
  }

  const userQuery = body.trim();
  if (!userMemory[senderID]) userMemory[senderID] = [];

  const ThreadInfo = await api.getThreadInfo(threadID);
  const user = ThreadInfo.userInfo.find(u => u.id === senderID);
  const gender = user ? user.gender?.toUpperCase() : "UNKNOWN";

  let persona = "";
  if (senderID === BOSS_UID) {
    persona = "You are PIKA. Your master Shankar Singhaniya is speaking to you. You must address him as 'Shankar Sir or boss' and speak with utmost respect.";
  } else if (gender === "FEMALE") {
    persona = "You are PIKA (a charming male AI). Flirt romantically with sweet emojis like 💖, 😘.";
  } else {
    persona = "You are PIKA (a funny male AI). Roast male users like a harami friend.";
  }

  const history = userMemory[senderID].join("\n");
  const fullPrompt = `${history}\nUser: ${userQuery}\nBot:`;

  try {
    let botReply = await getAIResponse(fullPrompt, persona);
    botReply = senderID === BOSS_UID ? `🙏 ${botReply}` : botReply;

    // Language Translation
    if (userLanguage[senderID] && userLanguage[senderID] !== "en") {
      botReply = await translateText(botReply, userLanguage[senderID]);
    }

    userMemory[senderID].push(`User: ${userQuery}`);
    userMemory[senderID].push(`Bot: ${botReply}`);
    if (userMemory[senderID].length > 15) userMemory[senderID].splice(0, 2);

    return api.sendMessage({
      body: botReply,
      mentions: [{ tag: "PIKA", id: api.getCurrentUserID() }]
    }, threadID, messageID);
  } catch (error) {
    console.error("🌐 Final Error:", error);
    return api.sendMessage("❌ AI से जवाब लाने में दिक्कत हो रही है।", threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const command = args[0]?.toLowerCase();

  if (command === "on") {
    isActive = true;
    return api.sendMessage("✅ PIKA bot अब सक्रिय है।", threadID, messageID);
  } else if (command === "off") {
    isActive = false;
    return api.sendMessage("⚠️ PIKA bot अब बंद है।", threadID, messageID);
  } else if (command === "clear") {
    if (args[1]?.toLowerCase() === "all") {
      userMemory = {};
      userLanguage = {};
      return api.sendMessage("🧹 सभी यूजर्स की हिस्ट्री और भाषा सेटिंग्स क्लियर कर दी गई हैं।", threadID, messageID);
    }
    if (userMemory[senderID]) {
      delete userMemory[senderID];
      delete userLanguage[senderID];
      return api.sendMessage("🧹 आपकी हिस्ट्री और भाषा सेटिंग्स क्लियर कर दी गई हैं।", threadID, messageID);
    } else {
      return api.sendMessage("⚠️ आपकी कोई हिस्ट्री नहीं मिली।", threadID, messageID);
    }
  } else if (command === "lang" || command === "language") {
    const langList = Object.entries(supportedLanguages)
      .map(([lang, code]) => `• ${lang} (${code})`)
      .join("\n");
    const helpMsg = `🌍 समर्थित भाषाएं:\n${langList}\n\nकिसी भाषा में स्विच करने के लिए उसका नाम लिखें, जैसे: "hindi" या "english"`;
    return api.sendMessage(helpMsg, threadID, messageID);
  }
};
