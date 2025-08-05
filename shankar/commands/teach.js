module.exports.config = {
  name: "teach",
  version: "2.9.4",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Bot ko sikhayein (sim command ke liye)",
  commandCategory: "Upyogita",
  usages: "hello => goodbye",
  cooldowns: 5,
  images: [],
  dependencies: {
    "axios": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  const axios = require("axios");
  const sim = require('./../../lib/sim.js');
  var tip = args.join(" ").split(' => ');
  if (tip.length < 2 || !tip[0] || !tip[1]) {
    return api.sendMessage("Kripya puri jankari daalein (udaaharan: hello => goodbye)", event.threadID, event.messageID);
  }
  try {
    const type = 'teach';
    const data = {
      ask: tip[0],
      ans: tip[1]
    };

    const res = sim.simi(type, data);
    
    if (res.data.success === false) return api.sendMessage(`${res.error}`, event.threadID, event.messageID);
    return api.sendMessage(`🔰 Sthiti: ${res.msg}\n\n✏️ Sawaal: ${res.data.ask}\n📝 Jawab: ${res.data.ans}`, event.threadID, event.messageID);
  } catch (error) {
    return api.sendMessage("Anurodh bhejne mein galti hui.", event.threadID, event.messageID);
  }
};
