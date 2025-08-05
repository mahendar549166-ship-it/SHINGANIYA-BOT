module.exports.config = {
  name: "text",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Photo se text nikalein",
  commandCategory: "Upyogita",
  usages: "[Script]",
  cooldowns: 0
};

module.exports.run = async function({ api, event, args, Threads, Users, Currencies, models }) {
  const moment = require("moment-timezone");
  const tpk = moment.tz("Asia/Kolkata").format("DD/MM/YYYY || HH:mm:ss");
  const fs = global.nodemodule["fs-extra"];
  var tesseract = require('node-tesseract');
  var language = args[0];
  let { messageReply, threadID } = event;
  if (event.type !== "message_reply") return api.sendMessage("❌ Aapko ek photo ka jawab dena hoga", event.threadID, event.messageID);
  if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("❌ Aapko ek photo ka jawab dena hoga", event.threadID, event.messageID);
  else {
    var shortLink = await global.nodemodule["tinyurl"].shorten(messageReply.attachments[0].url);
    
    tesseract.recognize(
      shortLink,
      language,
      { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
      console.log(text);
      api.sendMessage(`📗== [ PHOTO SE TEXT ] ==📗

⏰ Samay: ${tpk}
👍 Photo se text safalata se nikala gaya
🌸 Text: ${text}`, event.threadID);
    });
  }
};
