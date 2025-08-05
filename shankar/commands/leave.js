module.exports.config = {
  name: "leave",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Samuh se chhodne ki suchna chalu ya band karein",
  commandCategory: "Samuh Chat",
  usages: "[on/off]",
  cooldowns: 2
};

module.exports.languages = {
  "hi": {
    "on": "✅ Chalu",
    "off": "❌ Band",
    "successText": "jab koi sadasya samuh chhode to suchna sandesh bhejein",
  }
};

const fs = require('fs');
const path = __dirname + '/data/dataEvent.json';

exports.onLoad = o => {
  if (!fs.existsSync(path)) fs.writeFileSync(path, '{}', 'utf8');
};

module.exports.run = async function ({ api, event, Threads, getText, args }) {
  if (!args[0] || (args[0] !== 'on' && args[0] !== 'off')) {
    return api.sendMessage('⚠️ Kripaya "on" ya "off" chunein', event.threadID, event.messageID);
  }

  let data = JSON.parse(fs.readFileSync(path, 'utf8'));
  const { threadID, messageID } = event;
  if (!data.leave) data.leave = [];
  let find = data.leave.find(i => i.threadID == threadID);

  if (find) {
    find.status = args[0] === 'on';
  } else {
    find = data.leave.push({
      threadID,
      status: args[0] === 'on'
    });
  }

  fs.writeFileSync(path, JSON.stringify(data, null, 4), 'utf8');
  return api.sendMessage(`${args[0] === 'on' ? getText("on") : getText("off")} ${getText("successText")}`, threadID, messageID);
};
