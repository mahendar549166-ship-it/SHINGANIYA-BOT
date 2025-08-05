const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
  name: "prefix",
  version: "2.0.0",
  hasPermission: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Bot ka prefix dekhein",
  commandCategory: "System",
  usages: "[]",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, body } = event;
  const { PREFIX } = global.config;
  const gio = moment.tz("Asia/Kolkata").format("HH:mm:ss || DD/MM/YYYY");

  let threadSetting = global.data.threadData.get(threadID) || {};
  let prefix = threadSetting.PREFIX || PREFIX;

  if (
    body.toLowerCase() === "prefix" ||
    body.toLowerCase() === "bot ka prefix kya hai" ||
    body.toLowerCase() === "prefix bhool gaya" ||
    body.toLowerCase() === "kaise use karu"
  ) {
    api.sendMessage(
      `==== [ BOT PREFIX ] ====\n────────────────────\n✏️ Group ka prefix: ${prefix}\n📎 System ka prefix: ${global.config.PREFIX}\n📝 Total commands: ${
        client.commands.size
      }\n👥 Total bot users: ${
        global.data.allUserID.length
      }\n🏘️ Total groups: ${global.data.allThreadID.length}\n────────────────────\n⏰ Samay: ${gio}`,
      event.threadID,
      event.messageID
    );
  }
};

module.exports.run = async function () {};
