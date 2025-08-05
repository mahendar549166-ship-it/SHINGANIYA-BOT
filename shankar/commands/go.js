module.exports.config = {
  name: "go",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Bot ke message ko hataaye",
  commandCategory: "Upyogita",
  usages: "unsend",
  cooldowns: 0,
  dependencies: [],
};

// Assumed getText function for translation
const getText = (key) => {
  const text = {
    unsendErr1: "⚠️ Yeh message bot ke dwara bheja gaya nahi hai, isliye ise hata nahi sakta.",
    unsendErr2: "⚠️ Message ko hataane ke liye, kripaya bot ke message ka jawab dein.",
    error: "❎ Message hataane mein error hua, kripaya fir se koshish karein.",
  };
  return text[key] || "";
};

module.exports.run = async function ({ api, event, args, Users }) {
  if (event.messageReply.senderID != api.getCurrentUserID())
    return api.sendMessage(getText('unsendErr1'), event.threadID, event.messageID);
  if (event.type != "message_reply")
    return api.sendMessage(getText('unsendErr2'), event.threadID, event.messageID);
  return api.unsendMessage(event.messageReply.messageID, (err) =>
    err ? api.sendMessage(getText('error'), event.threadID, event.messageID) : ''
  );
};
