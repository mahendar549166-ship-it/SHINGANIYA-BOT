module.exports.config = {
  name: "console",
  version: "1.1.0",
  hasPermssion: 3,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Make console more beautiful + anti-spam/lag console mod",
  commandCategory: "Admin",
  usages: "console",
  cooldowns: 30
};

const chalk = require("chalk");
var job = ["00FF00", "1E90FF", "8FBC8F", "00CED1", "7FFF00"];
var rst = job[Math.floor(Math.random() * job.length)];
var donq = job[Math.floor(Math.random() * job.length)];
var isConsoleDisabled = false,
  num = 0,
  max = 15,
  timeStamp = 0;

function disableConsole(cooldowns) {
  console.log(chalk.hex("#" + rst)(`    ══╦═══════════════════════════════╦══
      ║       ANTI LAG CONSOLE        ║
╔═════╩═══════════════════════════════╩═════╗
║  Anti-Lag Console Mode Activated for 30s   ║
╚═══════════════════════════════════════════╝`));
  isConsoleDisabled = true;
  setTimeout(function () {
    isConsoleDisabled = false;
    console.log(chalk.hex("#" + donq)(`    ══╦═══════════════════════════════╦══
      ║       ANTI LAG CONSOLE        ║
╔═════╩═══════════════════════════════╩═════╗
║      Anti-Lag Console Mode Deactivated     ║
╚═══════════════════════════════════════════╝`));
  }, cooldowns * 1000);
}

module.exports.handleEvent = async function ({
  api,
  args,
  Users,
  event
}) {
  let {
    messageID,
    threadID,
    senderID,
    mentions,
    isGroup
  } = event;
  try {
    const dateNow = Date.now();
    if (isConsoleDisabled) {
      return;
    }
    const l = require("chalk");
    const moment = require("moment-timezone");
    var n = moment.tz("Asia/Kolkata").format("HH:mm:ss DD/MM/YYYY");
    const cc = process.uptime(),
      anh = Math.floor(cc / (60 * 60)),
      la = Math.floor((cc % (60 * 60)) / 60),
      rst = Math.floor(cc % 60);
    var job = ["FF9900", "FFFF33", "33FFFF", "FF99FF", "FF3366", "FFFF66", "FF00FF", "66FF99", "00CCFF", "FF0099", "FF0066", "7900FF", "93FFD8", "CFFFDC", "FF5B00", "3B44F6", "A6D1E6", "7F5283", "A66CFF", "F05454", "FCF8E8", "94B49F", "47B5FF", "B8FFF9", "42C2FF", "FF7396"];
    var random = job[Math.floor(Math.random() * job.length)]
    var random1 = job[Math.floor(Math.random() * job.length)]
    var random2 = job[Math.floor(Math.random() * job.length)]
    var random3 = job[Math.floor(Math.random() * job.length)]
    var random4 = job[Math.floor(Math.random() * job.length)]
    var random5 = job[Math.floor(Math.random() * job.length)]
    var random6 = job[Math.floor(Math.random() * job.length)]
    var random7 = job[Math.floor(Math.random() * job.length)]
    var random8 = job[Math.floor(Math.random() * job.length)]
    const o = global.data.threadData.get(event.threadID) || {};
    if (typeof o.console !== "undefined" && o.console == true) {
      return;
    }
    if (event.senderID == global.data.botID) {
      return;
    }
    num++
    const threadInfo = isGroup ? await api.getThreadInfo(event.threadID) : null;
    const groupName = isGroup ? threadInfo.threadName || "No name" : null;
    const userName = await Users.getNameUser(event.senderID);
    const content = event.body || "Image, video or special characters";
    const hasAttachment = event.attachments && event.attachments.length > 0;
    if (isGroup) {
      console.log(chalk.hex("#" + random5)(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`) + `\n` + chalk.hex("#" + random)(`┣[🌸]➤ Group name: `) + chalk.hex("#" + random8)(`${groupName}`) + `\n` + chalk.hex("#" + random5)(`┣[🔰]➤ Group ID: `) + chalk.hex("#" + random8)(`${event.threadID}`) + `\n` + chalk.hex("#" + random6)(`┣[👤]➤ User name: `) + chalk.hex("#" + random6)(`${userName}`) + `\n` + chalk.hex("#" + random1)(`┣[🌐]➤ User ID: `) + chalk.hex("#" + random7)(`${event.senderID}`) + `\n` + chalk.hex("#" + random2)(`┣[💬]➤ Content: `) + chalk.hex("#" + random8)(`${content}`));
      if (hasAttachment) {
        const attachmentType = event.attachments[0].type;
        const attachmentTypesMap = {
          "sticker": "Sticker",
          "animated_image": "Gif",
          "video": "Video",
          "photo": "Photo",
          "audio": "Audio"
        };
        console.log(chalk.hex("#" + random3)(`┣[📎]➤ Attachment: `) + chalk.hex("#" + random)(`${attachmentTypesMap[attachmentType] || "Unknown"}`));
      }
      console.log(chalk.hex("#" + random3)(`┣[⏰]➤ Time: `) + chalk.hex("#" + random2)(`${n}`) + `\n` + chalk.hex("#" + random7)(`┣[⏳]➤ Bot uptime: `) + chalk.hex("#" + random)(`${anh} hours `) + chalk.hex("#" + random1)(`${la} minutes `) + chalk.hex("#" + random)(`${rst} seconds`) + `\n` + chalk.hex("#" + random4)(`┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`) + `\n` + chalk.hex("#" + random8)(`==== [ 𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑 ] ====`));
    } else {
      console.log(chalk.hex("#" + random5)(`Received private message:`));
      console.log(chalk.hex("#" + random2)(`From: `) + chalk.hex("#" + random6)(`${userName} (ID: ${senderID})`));
      console.log(chalk.hex("#" + random3)(`Content: `) + chalk.hex("#" + random5)(`${content}`));
      if (hasAttachment) {
        const attachmentType = event.attachments[0].type;
        const attachmentTypesMap = {
          "sticker": "Sticker",
          "animated_image": "Gif",
          "video": "Video",
          "photo": "Photo",
          "audio": "Audio"
        };
        console.log(chalk.hex("#" + random3)(`┣[📎]➤ Attachment: `) + chalk.hex("#" + random6)(`${attachmentTypesMap[attachmentType] || "None"}`));
      }
      console.log(chalk.hex("#" + random7)(`Time: `) + chalk.hex("#" + random1)(`${n}`));
    }
    timeStamp = dateNow;
    if (Date.now() - timeStamp > 1000) num = 0
    if (Date.now() - timeStamp < 1000) {
      if (num >= max) {
        num = 0
        disableConsole(this.config.cooldowns);
      }
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports.run = async function ({
  api: a,
  args: b,
  Users: c,
  event: d,
  Threads: e,
  utils: f,
  client: g
}) {};
