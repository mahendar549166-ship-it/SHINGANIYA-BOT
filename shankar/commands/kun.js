module.exports.config = {
  name: "kun",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Kun doodh ki tasveer banayein",
  commandCategory: "Upyogita",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Currencies, Users }) {
  if (this.config.credits !== 'shankar') return api.sendMessage('Maine kaha tha credits mat badlo, phir bhi nahi sune, credits wapas sahi karo warna yeh kaam nahi karega!', event.threadID, event.messageID);
  const moment = require("moment-timezone");
  const axios = require('axios').default;
  var list_id = [];
  const push = [];
  push.push(Date.now());
  var gio = moment.tz("Asia/Kolkata").format("HH:mm:ss || D/MM/YYYY");

  const [
    username,
    gender
  ] = args.join(" ").trim().split(" | ");

  if (!username || username.length > 13) return api.sendMessage(`Kripaya naam 13 aksharon se chhota daalein`, event.threadID, event.messageID);
  if (!gender || gender < 0 || gender > 1) return api.sendMessage(`Ling chunein (0 ladki, 1 ladka)`, event.threadID, event.messageID);

  api.sendMessage(`User ${(await Users.getData(event.senderID)).name} ke liye tasveer banayi ja rahi hai`, event.threadID, (err, info) => setTimeout(() => { api.unsendMessage(info.messageID) }, 5000));

  const { data } = await axios.get(`https://9bce-1-53-248-94.ngrok-free.app/kun?username=${encodeURIComponent(username)}&gender=${encodeURIComponent(gender)}`, { responseType: 'stream' });

  api.sendMessage({
    body: `Aapki tasveer yeh rahi ${(await Users.getData(event.senderID)).name}\nPrakriya ka samay: ${Math.floor((Date.now() - push[0]) / 1000)} second`,
    mentions: [
      {
        tag: (await Users.getData(event.senderID)).name,
        id: event.senderID,
      },
    ],
    attachment: data
  }, event.threadID, event.messageID);
};
