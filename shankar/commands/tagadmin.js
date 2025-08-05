const fs = require('fs');
const moment = require('moment-timezone');

module.exports.config = {
  name: "tagadmin",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Tag karein!!",
  commandCategory: "Pranali",
  usages: "[sandesh]",
  images: [],
  cooldowns: 5
};

module.exports.handleReply = async function ({ api, event, handleReply, Users, Threads, args }) {
  const { threadID, messageID, body } = event;
  switch (handleReply.type) {
    case "tagadmin": {
      let name = await Users.getNameUser(handleReply.author);
      api.sendMessage(`[ ADMIN PRATIKRIYA ]\n──────────────────\n|› 👤 Admin: ${name || "Facebook upyogkarta"}\n|› 🌐 Link Fb: https://www.facebook.com/profile.php?id=${event.senderID}\n|› 💬 Sandesh: ${body}\n|› ⏰ Samay: ${moment().tz("Asia/Kolkata").format("DD/MM/YYYY-HH:mm:ss")}\n──────────────────\n📌 Admin ke sandesh ka jawab dein`, handleReply.threadID, (err, info) => {
        if (err) console.log(err);
        else {
          global.client.handleReply.push({
            name: this.config.name,
            type: "reply",
            messageID: info.messageID,
            messID: messageID,
            threadID
          });
        }
      }, handleReply.messID);
      break;
    }
    case "reply": {
      let name = await Users.getNameUser(event.senderID);
      api.sendMessage(`[ UPYOGKARTA PRATIKRIYA ]\n──────────────────\n|› 👤 Naam: ${name || "Facebook upyogkarta"}\n|› 👨‍👩‍👧‍👦 Samooh: ${(await Threads.getInfo(threadID)).threadName || "Unknown"}\n|› 💬 Sandesh: ${body}\n⏰ Samay: ${moment().tz("Asia/Kolkata").format("DD/MM/YYYY -HH:mm:ss")}\n──────────────────\n📌 Tag karne wale ke sandesh ka jawab dein`, handleReply.threadID, (err, info) => {
        if (err) console.log(err);
        else {
          global.client.handleReply.push({
            name: this.config.name,
            type: "tagadmin",
            messageID: info.messageID,
            messID: messageID,
            threadID
          });
        }
      }, handleReply.messID);
      break;
    }
  }
};

module.exports.handleEvent = async ({ api, event, Users, Threads, args }) => {
  const { threadID, messageID, body, mentions, senderID } = event;
  let path = __dirname + "/data/tagadmin.json";
  if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");
  let data = JSON.parse(fs.readFileSync(path));
  if (!data[threadID]) data[threadID] = true;
  if (!mentions || !data[threadID]) return;
  let mentionsKey = Object.keys(mentions);
  let allAdmin = global.config.ADMINBOT + global.config.NDH;
  for (let each of mentionsKey) {
    if (each == api.getCurrentUserID()) continue;
    if (allAdmin.includes(each)) {
      let userName = await Users.getNameUser(senderID);
      let threadName = (await Threads.getInfo(threadID)).threadName;
      api.sendMessage(`[ TAG ADMIN ]\n──────────────────\n|› 👤 Tag karne wala: ${userName}\n|› 👨‍👩‍👧‍👦 Samooh: ${threadName || "Unknown"}\n|› 💬 Sandesh: ${body}\n|› ⏰ Samay: ${moment().tz("Asia/Kolkata").format("DD/MM/YYYY -HH:mm:ss")}\n──────────────────\n📌 Tag karne wale ke sandesh ka jawab dein`, each, (err, info) => {
        if (err) console.log(err);
        else {
          global.client.handleReply.push({
            name: this.config.name,
            type: "tagadmin",
            messageID: info.messageID,
            messID: messageID,
            author: each,
            threadID
          });
        }
      });
    }
  }
  fs.writeFileSync(path, JSON.stringify(data, null, 4));
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID } = event;
  let path = __dirname + "/data/tagadmin.json";
  if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");
  let data = JSON.parse(fs.readFileSync(path));
  if (!data[threadID]) data[threadID] = true;
  if (args[0] == "off") data[threadID] = false;
  else if (args[0] == "on") data[threadID] = true;
  else return api.sendMessage(`⚠️ Kripya on ya off chunein`, event.threadID, event.messageID);
  fs.writeFileSync(path, JSON.stringify(data, null, 4));
  return api.sendMessage(`☑️ Tag Admin ko ${data[threadID] ? "chalu" : "band"} kiya gaya`, event.threadID, event.messageID);
};
