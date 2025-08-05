const request = require("request");
const fs = require("fs");
const axios = require("axios");

module.exports.config = {
  name: "thappad",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Tag kiye hue dost ko thappad maro",
  commandCategory: "Khel",
  usages: "[tag]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, Threads, global }) => {
  var link = [
    "https://i.imgur.com/01vdqea.gif"
  ];
  var mention = Object.keys(event.mentions);
  let tag = event.mentions[mention].replace("@", "");
  if (!mention) return api.sendMessage("Kripya 1 vyakti ko tag karein", event.threadID, event.messageID);
  var callback = () => api.sendMessage({
    body: `${tag}` + ` Ab thappad se daro nahi, main maar deta hoon KKK 🎀`,
    mentions: [{ tag: tag, id: Object.keys(event.mentions)[0] }],
    attachment: fs.createReadStream(__dirname + "/cache/spair.gif")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/spair.gif"));
  return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname + "/cache/spair.gif")).on("close", () => callback());
};
