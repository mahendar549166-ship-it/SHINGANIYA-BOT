const request = require("request");
const fs = require("fs");
const axios = require("axios");

module.exports.config = {
  name: "jhappi",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Dost ko jhappi do",
  commandCategory: "khel",
  usages: "@tag",
  cooldowns: 5,
  dependencies: { "request": "", "fs": "", "axios": "" }
};

module.exports.run = async ({ api, event, args, client, Users, Threads, __GLOBAL, Currencies }) => {
  const request = require('request');
  const fs = require('fs');
  var mention = Object.keys(event.mentions)[0];
  let tag = event.mentions[mention].replace("@", "");
  var link = [
    "https://i.imgur.com/IyjnH5d.gif",
  ];
  var callback = () => api.sendMessage({
    body: `${tag} Ek pyaari si jhappi 💓`,
    mentions: [{
      tag: tag,
      id: Object.keys(event.mentions)[0]
    }],
    attachment: fs.createReadStream(__dirname + "/noprefix/jhappi.gif")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/noprefix/jhappi.gif"));
  return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname + "/noprefix/jhappi.gif")).on("close", () => callback());
};
