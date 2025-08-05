module.exports.config = {
  name: "tile",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Do logon ke beech jodne ka anupat dekhein",
  commandCategory: "Khel",
  usages: "[tag]",
  cooldowns: 20,
  dependencies: {
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async function({ api, args, Users, event }) {
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];
  var mention = Object.keys(event.mentions)[0];
  if (!mention) return api.sendMessage("Jodne ka anupat dekhne ke liye 1 vyakti ko tag karna zaroori hai", event.threadID);
  var name = (await Users.getData(mention)).name;
  var namee = (await Users.getData(event.senderID)).name;
  var tle = Math.floor(Math.random() * 101);

  var arraytag = [];
  arraytag.push({ id: mention, tag: name });
  arraytag.push({ id: event.senderID, tag: namee });
  var mentions = Object.keys(event.mentions);

  let Avatar = (await axios.get(`https://graph.facebook.com/${mentions}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(__dirname + "/cache/avt.png", Buffer.from(Avatar, "utf-8"));
  let Avatar2 = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(Avatar2, "utf-8"));

  var imglove = [];
  imglove.push(fs.createReadStream(__dirname + "/cache/avt2.png"));
  imglove.push(fs.createReadStream(__dirname + "/cache/avt.png"));
  var msg = {
    body: `⚡️${namee} aur ${name} ke beech jodne ka anupat ${tle}% hai 🥰\n🚫Shakti punarjanan ho raha hai: 20 second`,
    mentions: arraytag,
    attachment: imglove
  };
  return api.sendMessage(msg, event.threadID, event.messageID);
};
