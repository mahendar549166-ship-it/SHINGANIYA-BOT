const axios = require("axios");
const request = require("request");

module.exports.config = {
  name: "pika-bot",
  version: "6.4",
  hasPermission: 0,
  credits: "Shankar Singhaniya",
  description: "Ultimate AI Chatbot with Language Auto-Detect & Gender-Based Replies",
  commandCategory: "noprefix",
  usePrefix: false,
  usages: "[ask anything]",
  cooldowns: 2
};

let userMemory = {};
let activeLanguage = {};

const GROQ_API_KEY = "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";
const GEMINI_API_KEY = "AIzaSyBE6Op_8rUlVYJFU17u49tozNJ7ua4dADE";

const surowFileURLs = {
  maleReplies: "https://raw.githubusercontent.com/SHANKAR-BOT/SHANKAR-GOIBOT/main/maleReplies.txt",
  femaleReplies: "https://raw.githubusercontent.com/SHANKAR-BOT/SHANKAR-GOIBOT/main/femaleReplies.txt",
  adminReplies: "https://raw.githubusercontent.com/SHANKAR-BOT/SHANKAR-GOIBOT/main/adminReplies.txt",
  femaleSpecificReplies: "https://raw.githubusercontent.com/SHANKAR-BOT/SHANKAR-GOIBOT/main/femaleSpecificReplies.txt",
  pikaMaleReplies: "https://raw.githubusercontent.com/SHANKAR-BOT/SHANKAR-GOIBOT/main/pikaMaleReplies.txt",
  pikaFemaleReplies: "https://raw.githubusercontent.com/SHANKAR-BOT/SHANKAR-GOIBOT/main/pikaFemaleReplies.txt",
  pikaAdminReplies: "https://raw.githubusercontent.com/SHANKAR-BOT/SHANKAR-GOIBOT/main/pikaAdminReplies.txt",
  pikaSpecialReplies: "https://raw.githubusercontent.com/SHANKAR-BOT/SHANKAR-GOIBOT/main/pikaSpecialReplies.txt"
};

const BOSS_UID = "61577191230420";
const FEMALE_UIDS = ["100045491528421", "100094547994769"];

const supportedLanguages = {
  hindi: "hi", english: "en", bhojpuri: "bho", urdu: "ur", punjabi: "pa",
  nepali: "ne", marathi: "mr", tamil: "ta", gujrati: "gu", french: "fr",
  spanish: "es", russian: "ru", italian: "it", arabic: "ar", german: "de",
  portuguese: "pt", korean: "ko", chinese: "zh-cn", japanese: "ja", thai: "th",
  turkish: "tr", dutch: "nl", indonesian: "id", filipino: "tl", malayalam: "ml",
  kannada: "kn", odia: "or", assamese: "as", bengali: "bn", maithili: "mai"
};

async function translateText(text, targetLang) {
  try {
    const res = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
    return res.data[0].map(x => x[0]).join("");
  } catch {
    return text;
  }
}

const groqAI = async (messages, targetLang = "en") => {
  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages,
        temperature: 0.7,
        max_tokens: 150
      },
      {
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`
        }
      }
    );
    let reply = res.data.choices[0].message.content;
    reply = reply.replace(/@\[.*?\]/g, '');
    if (targetLang !== "en") reply = await translateText(reply, targetLang);
    return reply.length > 200 ? reply.substring(0, 200) + "..." : reply;
  } catch (err) {
    throw new Error("Groq API failed");
  }
};

const geminiAI = async (prompt, targetLang = "en") => {
  try {
    const res = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [{ parts: [{ text: prompt + " (Keep response short and concise)" }] }]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY
        }
      }
    );
    let reply = res.data.candidates?.[0]?.content?.parts?.[0]?.text || "❌ कोई जवाब नहीं मिला।";
    reply = reply.replace(/@\[.*?\]/g, '');
    if (targetLang !== "en") reply = await translateText(reply, targetLang);
    return reply.length > 200 ? reply.substring(0, 200) + "..." : reply;
  } catch {
    return "❌ Gemini API से जवाब लाने में दिक्कत हो रही है।";
  }
};

async function fetchReplies(url, targetLang = "en") {
  try {
    const res = await axios.get(url);
    let replies = res.data.split("\n").filter(x => x.trim()).map(x => x.replace(/@\[.*?\]/g, ''));
    if (targetLang !== "en") {
      const translated = [];
      for (const r of replies) translated.push(await translateText(r, targetLang));
      return translated;
    }
    return replies;
  } catch {
    return ["❌ Replies not loaded."];
  }
}

const getAIResponse = async (prompt, persona, userLang = "en") => {
  const messages = [
    { role: "system", content: persona + " Keep your responses short and concise. Never mention user handles like @[User's Handle]." },
    { role: "user", content: prompt }
  ];
  try {
    return await groqAI(messages, userLang);
  } catch {
    return await geminiAI(`${persona}\n\nKeep response short.\n\n${prompt}`, userLang);
  }
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!body || messageReply) return;

  const lowerBody = body.toLowerCase();
  let userLang = activeLanguage[senderID] || "hi";

  // lang list
  if (lowerBody === "lang list" || lowerBody === "language list") {
    const langList = Object.entries(supportedLanguages)
      .map(([lang, code]) => `• ${lang} (${code})`)
      .join("\n");
    const msg = await translateText(`🌍 Supported Languages:\n${langList}\n\nTo switch language, just type the name of the language in your message.`, userLang);
    return api.sendMessage(msg, threadID, messageID);
  }

  // auto detect language from message
  for (const lang of Object.keys(supportedLanguages)) {
    const langPattern = new RegExp(`\\b${lang}\\b`, "i");
    if (langPattern.test(lowerBody)) {
      const langCode = supportedLanguages[lang];
      activeLanguage[senderID] = langCode;
      userLang = langCode;
      const msg = await translateText(`🌍 अब मैं ${lang} भाषा में बात करूँगा!`, langCode);
      return api.sendMessage(msg, threadID, messageID);
    }
  }

  if (lowerBody.includes("pika") || lowerBody.includes("bot")) {
    const threadInfo = await api.getThreadInfo(threadID);
    const user = threadInfo.userInfo.find(u => u.id === senderID);
    const gender = user?.gender || "UNKNOWN";

    if (!userMemory[senderID]) userMemory[senderID] = [];
    const isQuestion = lowerBody.includes("?") || lowerBody.split(" ").length > 3;

    let persona = "";
    if (senderID === BOSS_UID) {
      persona = "You are PIKA PI. Your master Shankar Singhaniya is speaking to you. You must address him as 'Shankar Sir or boss'.";
    } else if (FEMALE_UIDS.includes(senderID)) {
      persona = "You are PIKA PI (a charming male AI). Flirt romantically 💖😙. Owner is Shankar Singhaniya.";
    } else if (gender === "FEMALE") {
      persona = "You are PIKA PI (handsome male AI). Be romantic with girls. Owner is Shankar Singhaniya.";
    } else {
      persona = "You are PIKA (funny male AI). Roast male users. Owner is Shankar Singhaniya.";
    }

    if (!isQuestion) {
      let replies;
      if (lowerBody.includes("pika")) {
        if (senderID === BOSS_UID) {
          replies = await fetchReplies(surowFileURLs.pikaAdminReplies, userLang);
        } else if (FEMALE_UIDS.includes(senderID)) {
          replies = await fetchReplies(surowFileURLs.pikaSpecialReplies, userLang);
        } else if (gender === "FEMALE") {
          replies = await fetchReplies(surowFileURLs.pikaFemaleReplies, userLang);
        } else {
          replies = await fetchReplies(surowFileURLs.pikaMaleReplies, userLang);
        }
      } else {
        if (senderID === BOSS_UID) {
          replies = await fetchReplies(surowFileURLs.adminReplies, userLang);
        } else if (FEMALE_UIDS.includes(senderID)) {
          replies = await fetchReplies(surowFileURLs.femaleSpecificReplies, userLang);
        } else if (gender === "FEMALE") {
          replies = await fetchReplies(surowFileURLs.femaleReplies, userLang);
        } else {
          replies = await fetchReplies(surowFileURLs.maleReplies, userLang);
        }
      }

      const reply = replies[Math.floor(Math.random() * replies.length)];
      return api.sendMessage(reply, threadID, messageID);
    }

    const history = userMemory[senderID].join("\n");
    const prompt = `${history}\nUser: ${body}\nBot:`;

    const reply = await getAIResponse(prompt, persona, userLang);
    userMemory[senderID].push(`User: ${body}`, `Bot: ${reply}`);
    if (userMemory[senderID].length > 15) userMemory[senderID].splice(0, 2);
    return api.sendMessage(reply, threadID, messageID);
  }
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const userLang = activeLanguage[senderID] || "hi";

  if (args[0]?.toLowerCase() === "clear") {
    delete userMemory[senderID];
    delete activeLanguage[senderID];
    const msg = await translateText("🧹 Your chat history and language settings have been cleared.", userLang);
    return api.sendMessage(msg, threadID, messageID);
  }

  if (args[0]?.toLowerCase() === "lang" || args[0]?.toLowerCase() === "language") {
    if (args[1]?.toLowerCase() === "list") {
      const langList = Object.entries(supportedLanguages).map(([lang, code]) => `• ${lang} (${code})`).join("\n");
      const msg = await translateText(`🌍 Supported Languages:\n${langList}\n\nTo switch language, just type the name of the language in your message.`, userLang);
      return api.sendMessage(msg, threadID, messageID);
    }
  }
};
