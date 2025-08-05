this.config = {
  name: "help",
  version: "1.1.1",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Command ki list aur jankari dekhein",
  commandCategory: "Samuh",
  usages: "[command naam/sabhi]",
  cooldowns: 0
};

this.languages = {
  "vi": {},
  "en": {}
};

this.run = async function ({ api, event, args }) {
  const {
    threadID: tid,
    messageID: mid,
    senderID: sid
  } = event;
  const axios = global.nodemodule['axios'];
  var type = !args[0] ? "" : args[0].toLowerCase();
  var msg = "";
  const cmds = global.client.commands;
  const TIDdata = global.data.threadData.get(tid) || {};
  const moment = require("moment-timezone");
  var thu = moment.tz('Asia/Kolkata').format('dddd');
  if (thu == 'Sunday') thu = 'Ravivar';
  if (thu == 'Monday') thu = 'Somvar';
  if (thu == 'Tuesday') thu = 'Mangalvar';
  if (thu == 'Wednesday') thu = 'Budhvar';
  if (thu == 'Thursday') thu = 'Guruvar';
  if (thu == 'Friday') thu = 'Shukravar';
  if (thu == 'Saturday') thu = 'Shanivar';
  const time = moment.tz("Asia/Kolkata").format("HH:mm:s | DD/MM/YYYY");
  const hours = moment.tz("Asia/Kolkata").format("HH");
  const admin = config.ADMINBOT;
  const NameBot = config.BOTNAME;
  const version = config.version;
  var prefix = TIDdata.PREFIX || global.config.PREFIX;

  if (type == "sabhi") {
    const commandsList = Array.from(cmds.values()).map((cmd, index) => {
      return `${index + 1}. ${cmd.config.name}\n📝 Vivran: ${cmd.config.description}\n\n`;
    }).join('');
    return api.sendMessage(commandsList, tid, mid);
  }

  if (type) {
    const command = Array.from(cmds.values()).find(cmd => cmd.config.name.toLowerCase() === type);
    if (!command) {
      const stringSimilarity = require('string-similarity');
      const commandName = args.shift().toLowerCase() || "";
      const commandValues = cmds['keys']();
      const checker = stringSimilarity.findBestMatch(commandName, commandValues);
      if (checker.bestMatch.rating >= 0.5) command = client.commands.get(checker.bestMatch.target);
      msg = `⚠️ Command '${type}' system mein nahi mila.\n📌 Sabse nazdeeki command '${checker.bestMatch.target}' mila`;
      return api.sendMessage(msg, tid, mid);
    }
    const cmd = command.config;
    msg = `[ COMMAND KA ISTEMAAL ]\n\n📜 Command Naam: ${cmd.name}\n🕹️ Version: ${cmd.version}\n🔑 Adhikaar: ${TextPr(cmd.hasPermssion)}\n📝 Vivran: ${cmd.description}\n🏘️ Category: ${cmd.commandCategory}\n📌 Istemaal: ${cmd.usages}\n⏳ Cooldown: ${cmd.cooldowns} second`;
    return api.sendMessage(msg, tid, mid);
  } else {
    const commandsArray = Array.from(cmds.values()).map(cmd => cmd.config);
    const array = [];
    commandsArray.forEach(cmd => {
      const { commandCategory, name: nameModule } = cmd;
      const find = array.find(i => i.cmdCategory == commandCategory);
      if (!find) {
        array.push({
          cmdCategory: commandCategory,
          nameModule: [nameModule]
        });
      } else {
        find.nameModule.push(nameModule);
      }
    });
    array.sort(S("nameModule"));
    array.forEach(cmd => {
      if (cmd.cmdCategory.toUpperCase() === 'ADMIN' && !global.config.ADMINBOT.includes(sid)) return;
      msg += `[ ${cmd.cmdCategory.toUpperCase()} ]\n📝 Kul commands: ${cmd.nameModule.length} commands\n${cmd.nameModule.join(", ")}\n\n`;
    });
    msg += `📝 Kul commands: ${cmds.size} commands\n👤 Admin bot ki sankhya: ${admin.length}\n👾 Bot ka naam: ${NameBot}\n🕹️ Version: ${version}\n⏰ Aaj hai: ${thu}\n⏱️ Samay: ${time}\n${prefix}help + command naam se vivran dekhein\n${prefix}help + sabhi se sabhi commands dekhein`;
    return api.sendMessage(msg, tid, mid);
  }
};

function S(k) {
  return function (a, b) {
    let i = 0;
    if (a[k].length > b[k].length) {
      i = 1;
    } else if (a[k].length < b[k].length) {
      i = -1;
    }
    return i * -1;
  };
}

function TextPr(permission) {
  p = permission;
  return p == 0 ? "Sadasya" : p == 1 ? "Prashasak" : p == 2 ? "Admin Bot" : "Poorn Adhikaar";
}
