module.exports.config = {
  name: "kicktag",
  version: "1.1.0",
  hasPermssion: 1,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "@sabko tag karne par user ko svachalit roop se nikalein (prashasak ko chhodkar)",
  commandCategory: "Prashasak",
  usages: "antitagall on/off",
  cooldowns: 5
};

const fs = require("fs");
const path = __dirname + "/data/antitagall.json";

let data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};

module.exports.handleEvent = async function ({ event, api }) {
  const { threadID, senderID, mentions, messageID } = event;
  if (!data[threadID]) return;

  const mentionAll = Object.keys(mentions || {}).some(uid => mentions[uid] === '@sabko' || mentions[uid].includes('sabko'));
  if (!mentionAll) return;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const botID = api.getCurrentUserID();

    // Agar bhejne wala prashasak ya bot hai, toh kick nahi karna
    if (threadInfo.adminIDs.some(e => e.id == senderID)) return;

    // Agar bot prashasak nahi hai, toh kick nahi kar sakta
    if (!threadInfo.adminIDs.some(e => e.id == botID)) {
      return api.sendMessage("User ko kick karne ke liye bot ko prashasak adhikar chahiye.", threadID, messageID);
    }

    await api.removeUserFromGroup(senderID, threadID);
  } catch (err) {
    console.error(err);
    return api.sendMessage("User ko kick nahi kar saka. Shayad woh prashasak hai ya bot ke paas adhikar nahi hai.", threadID, messageID);
  }
};

module.exports.run = function ({ event, api, args }) {
  const { threadID, messageID } = event;

  if (!args[0]) {
    return api.sendMessage(`Vartaman anti-tagall ki sthiti hai: ${data[threadID] ? "CHALU" : "BAND"}`, threadID, messageID);
  }

  if (args[0].toLowerCase() === "on") {
    data[threadID] = true;
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return api.sendMessage("@sabko tag karne par kick mode chalu kar diya gaya (prashasak ko chhodkar).", threadID, messageID);
  }

  if (args[0].toLowerCase() === "off") {
    delete data[threadID];
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return api.sendMessage("@sabko tag karne par kick mode band kar diya gaya.", threadID, messageID);
  }

  return api.sendMessage("Istemaal karein: antitagall on/off", threadID, messageID);
};
