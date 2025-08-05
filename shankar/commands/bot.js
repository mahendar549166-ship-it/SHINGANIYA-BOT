module.exports.config = {
  name: "bot",
  version: "0.0.1",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Bot ke baare mein jankari dekho",
  commandCategory: "Box Chat",
  usages: "",
  cooldowns: 0
};

// Total chat data ka path
const totalPath = __dirname + '/data/totalChat.json';
const _24hours = 86400000;
const fs = require("fs-extra");

// Bytes ko readable format mein convert karne ka function
function handleByte(byte) {
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let i = 0, usage = parseInt(byte, 10) || 0;

  while (usage >= 1024 && ++i) {
    usage = usage / 1024;
  }

  return (usage.toFixed(usage < 10 && i > 0 ? 1 : 0) + ' ' + units[i]);
}

// System info aur ping check karne ka function
function handleOS(ping) {
  var os = require("os");
  var cpus = os.cpus();
  var speed, chips;
  for (var i of cpus) chips = i.model, speed = i.speed;
  if (cpus == undefined) return;
  else return msg = 
    `📌 Ping: ${Date.now() - ping}ms.\n\n`;
}

// Bot load hone par data file check aur create karo
module.exports.onLoad = function() {
  const { writeFileSync, existsSync } = require('fs-extra');
  const { resolve } = require("path");
  const path = resolve(__dirname, 'data', 'dataAdbox.json');
  if (!existsSync(path)) {
    const obj = {
      adminbox: {}
    };
    writeFileSync(path, JSON.stringify(obj, null, 4));
  } else {
    const data = require(path);
    if (!data.hasOwnProperty('adminbox')) data.adminbox = {};
    writeFileSync(path, JSON.stringify(data, null, 4));
  }
}

// Bot ka main run function
module.exports.run = async function({ api, args, event, Users, handleReply, permssion }) {
  const moment = require("moment-timezone");
  const gio = moment.tz("Asia/Kolkata").format("HH");
  var phut = moment.tz("Asia/Kolkata").format("mm");
  var giay = moment.tz("Asia/Kolkata").format("ss");
  const axios = require("axios");
  const fs = require('fs-extra');
  const request = require('request');
  const picture = (await axios.get(`https://i.imgur.com/88DM7Fv.gif`, { responseType: "stream" })).data;
  const { threadID, messageID, senderID } = event;

  return api.sendMessage({
    body: `==== [ 𝗕𝗢𝗧 𝗞𝗔 𝗔𝗗𝗠𝗜𝗡 ] ====\n
𝟭. 𝗔𝗱𝗺𝗶𝗻 𝗸𝗶 𝗷𝗮𝗻𝗸𝗮𝗿𝗶 𝗱𝗲𝗸𝗵𝗼 💳\n
𝟮. 𝗕𝗼𝘁 𝗸𝗶 𝗷𝗮𝗻𝗸𝗮𝗿𝗶 𝗱𝗲𝗸𝗵𝗼 👾\n
𝟯. 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝘀𝗲 𝗹𝗼𝗴𝗼𝘂𝘁 🖥\n
𝟰. 𝗖𝗼𝗻𝗳𝗶𝗴 𝗿𝗲𝗹𝗼𝗮𝗱 𝗸𝗮𝗿𝗼 ♻️\n
𝟱. 𝗕𝗼𝘁 𝗿𝗲𝘀𝘁𝗮𝗿𝘁 𝗸𝗮𝗿𝗼 🎀\n
━━━━━━━━━━━━━━━━━━\n
==== [ 𝗤𝗨𝗔𝗡 𝗧𝗥𝗜 𝗞𝗔𝗥𝗬𝗔𝗞𝗔𝗥𝗧𝗔 ] ====\n
𝟲. 𝗥𝗮𝗻𝗸𝘂𝗽 𝗻𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻 𝗼𝗻/𝗼𝗳𝗳 💌\n
𝟳. 𝗤𝗧𝗩 𝗼𝗻𝗹𝘆 𝗺𝗼𝗱𝗲 𝗼𝗻/𝗼𝗳𝗳 🎐\n
𝟴. 𝗔𝗻𝘁𝗶-𝗷𝗼𝗶𝗻 𝗺𝗼𝗱𝗲 𝗼𝗻/𝗼𝗳𝗳 🚫\n
𝟵. 𝗕𝗼𝘅 𝗰𝗵𝗼𝗿𝗶 𝗰𝗵𝗲𝘁𝗮𝘃𝗮𝗻𝗶 𝗼𝗻/𝗼𝗳𝗳 🔰\n
𝟭𝟬. 𝗔𝗻𝘁𝗶-𝗼𝘂𝘁 𝗺𝗼𝗱�_e 𝗼𝗻/𝗼𝗳𝗳 🛡\n
==== [ 𝗦𝗔𝗗𝗔𝗦𝗬𝗔 ] ====\n
━━━━━━━━━━━━━━━━━━\n
𝟭𝟭. 𝗕𝗼𝘁 𝗸𝗲 𝗮𝗱𝗺𝗶𝗻 𝗸𝗶 𝘀𝘂𝗰𝗵𝗶 𝗱𝗲𝗸𝗵𝗼 🤖\n
𝟭𝟮. 𝗕𝗼𝘅 𝗸𝗲 𝗾𝘂𝗮𝗻 𝘁𝗿𝗶 𝗸𝗶 𝘀𝘂𝗰𝗵𝗶 𝗱𝗲𝗸𝗵𝗼 📌\n
𝟭𝟯. 𝗕𝗼𝘅 𝗸𝗶 𝗷𝗮𝗻𝗸𝗮𝗿�_i 𝗱𝗲𝗸𝗵𝗼 📱\n
---------------------------\n
💟 𝗔𝗽𝗻𝗮 𝗽𝗮𝘀𝗮𝗻𝗱 𝗸𝗮 𝗻𝘂𝗺𝗯𝗲𝗿 𝗰𝗵𝘂𝗻𝗼 𝘁𝗮𝗮𝗸𝗶 𝗯𝗼𝘁 𝘂𝘀𝗸𝗶 𝗷𝗮𝗻𝗸𝗮𝗿𝗶 𝗱𝗶𝗸𝗵𝗮𝘆𝗲`,
    attachment: picture
  }, threadID, (error, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      ú: event.senderID,
      type: "choosee",
    });
  }, event.messageID);
}

// Reply handler
module.exports.handleReply = async function({ args, event, Users, Threads, api, handleReply, permssion }) {
  const { threadID, messageID, senderID } = event;

  switch (handleReply.type) {
    case "choosee": {
      switch (event.body) {
        case "2": {
          const moment = require("moment-timezone");
          const gio = moment.tz("Asia/Kolkata").format("HH");
          var phut = moment.tz("Asia/Kolkata").format("mm");
          var giay = moment.tz("Asia/Kolkata").format("ss");
          const namebot = config.BOTNAME;
          const PREFIX = config.PREFIX;
          const admin = config.ADMINBOT;
          const ndh = config.NDH;
          const { commands } = global.client;
          const threadSetting = (await Threads.getData(String(event.threadID))).data || {};
          const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
          var ping = Date.now();

          var threadInfo = await api.getThreadInfo(event.threadID);
          var time = process.uptime(),
              hours = Math.floor(time / (60 * 60)),
              minutes = Math.floor((time % (60 * 60)) / 60),
              seconds = Math.floor(time % 60);
          var severInfo = handleOS(ping);
          var msg = `⏰ 𝐀𝐛𝐡𝐢 𝐤𝐚 𝐬𝐚𝐦𝐚𝐲: ${gio} 𝐠𝐡𝐚𝐧𝐭𝐞 ${phut} 𝐦𝐢𝐧𝐮𝐭 ${giay} 𝐬𝐞𝐜𝐨𝐧𝐝\n👾 𝗕𝗼𝘁 𝗸𝗮 𝗻𝗮𝗮𝗺: ${namebot}\n⏱ 𝐁𝐨𝐭 𝐨𝐧𝐥𝐢𝐧𝐞 𝐡𝐚𝐢: ${hours < 10 ? (hours > 0 ? " 0" + hours + " 𝐠𝐡𝐚𝐧𝐭𝐞" : "") : (hours > 0 ? " " + hours + " 𝐠𝐡𝐚𝐧𝐭𝐞" : "")} ${minutes < 10 ? (minutes > 0 ? " 0" + minutes + " 𝐦𝐢𝐧𝐮𝐭" : "") : (minutes > 0 ? " " + minutes + " 𝐦𝐢𝐧𝐮𝐭" : "")}${seconds < 10 ? (seconds > 0 ? " 0" + seconds + " 𝐬𝐞𝐜𝐨𝐧𝐝." : "") : (seconds > 0 ? " " + seconds + " 𝐬𝐞𝐜𝐨𝐧𝐝." : "")}\n----------------------------\n` +
            `👨‍👨‍👧‍👦 𝐊𝐮𝐥 𝐆𝐫𝐨𝐮𝐩: ${global.data.allThreadID.length} 𝐠𝐫𝐨𝐮𝐩.\n👥 𝐊𝐮𝐥 𝐔𝐬𝐞𝐫𝐬: ${global.data.allUserID.length} 𝐥𝐨𝐠.\n👑 𝐁𝐨𝐭 𝐤𝐞 𝐀𝐝𝐦𝐢𝐧: ${admin.length}.\n👤 𝐁𝐨𝐭 𝐤𝐞 𝐒𝐚𝐡𝐚𝐲𝐚𝐤: ${ndh.length}.\n` +
            `📝 𝐊𝐮𝐥 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬: ${commands.size}\n----------------------------\n` +
            `🖥 𝐒𝐲𝐬𝐭𝐞𝐦 𝐏𝐫𝐞𝐟𝐢𝐱: ${PREFIX}\n📲 𝐁𝐨𝐱 𝐏𝐫𝐞𝐟𝐢𝐱: ${prefix}\n${severInfo ? severInfo : `📌 𝐏𝐢𝐧𝐠: ${Date.now() - ping}ms.\n\n`}`;
          return api.sendMessage(msg, event.threadID);
        } break;

        case "1": {
          const moment = require("moment-timezone");
          const request = require("request");
          var timeNow = moment.tz("Asia/Kolkata").format("HH:mm:ss");
          if (!fs.existsSync(totalPath)) fs.writeFileSync(totalPath, JSON.stringify({}));
          let totalChat = JSON.parse(fs.readFileSync(totalPath));
          let threadInfo = await api.getThreadInfo(event.threadID);
          let timeByMS = Date.now();

          var memLength = threadInfo.participantIDs.length;
          let threadMem = threadInfo.participantIDs.length;
          var nameMen = [];
          var gendernam = [];
          var gendernu = [];
          var nope = [];
          for (let z in threadInfo.userInfo) {
            var gioitinhone = threadInfo.userInfo[z].gender;
            var nName = threadInfo.userInfo[z].name;
            if (gioitinhone == "MALE") {
              gendernam.push(z + gioitinhone);
            } else if (gioitinhone == "FEMALE") {
              gendernu.push(gioitinhone);
            } else {
              nope.push(nName);
            }
          }
          var nam = gendernam.length;
          var nu = gendernu.length;
          let qtv = threadInfo.adminIDs.length;
          let sl = threadInfo.messageCount;
          let u = threadInfo.nicknames;
          let icon = threadInfo.emoji;

          let threadName = threadInfo.threadName;
          let id = threadInfo.threadID;
          let sex = threadInfo.approvalMode;
          var pd = sex == false ? '𝐛𝐚𝐧𝐝' : sex == true ? '𝐤𝐡𝐮𝐥𝐚' : 'Kh';

          if (!totalChat[event.threadID]) {
            totalChat[event.threadID] = {
              time: timeByMS,
              count: sl,
              ytd: 0
            };
            fs.writeFileSync(totalPath, JSON.stringify(totalChat, null, 2));
          }

          let mdtt = "𝗔𝗯𝗵𝗶 𝗸𝗼𝗶 𝗷𝗮𝗻𝗸𝗮𝗿𝗶 𝗻𝗮𝗵𝗶";
          let preCount = totalChat[event.threadID].count || 0;
          let ytd = totalChat[event.threadID].ytd || 0;
          let hnay = (ytd != 0) ? (sl - preCount) : "𝗔𝗯𝗵𝗶 𝗸𝗼𝗶 𝗷𝗮𝗻𝗸𝗮𝗿𝗶 𝗻𝗮𝗵𝗶";
          let hqua = (ytd != 0) ? ytd : "𝗔𝗯𝗵𝗶 𝗸𝗼𝗶 𝗷𝗮𝗻𝗸𝗮𝗿𝗶 𝗻𝗮𝗵𝗶";
          if (timeByMS - totalChat[event.threadID].time > _24hours) {
            if (timeByMS - totalChat[event.threadID].time > (_24hours * 2)) {
              totalChat[event.threadID].count = sl;
              totalChat[event.threadID].time = timeByMS - _24hours;
              totalChat[event.threadID].ytd = sl - preCount;
              fs.writeFileSync(totalPath, JSON.stringify(totalChat, null, 2));
            }
            getHour = Math.ceil((timeByMS - totalChat[event.threadID].time - _24hours) / 3600000);
            if (ytd == 0) mdtt = 100;
            else mdtt = ((((hnay) / ((hqua / 24) * getHour))) * 100).toFixed(0);
            mdtt += "%";
          }
          api.unsendMessage(handleReply.messageID);
          var callback = () =>
            api.sendMessage({
              body: `ㅤㅤ🌸 𝐁𝐎𝐓 𝐊𝐀 𝐀𝐃𝐌𝐈𝐍 🌸\n
👀 𝐍𝐚𝐚𝐦: 
❎ 𝐔𝐦𝐚𝐫: 
👤 𝐋𝐢𝐧𝐠: 
💫 𝐇𝐞𝐢𝐠𝐡𝐭 𝐚𝐮𝐫 𝐖𝐞𝐢𝐠𝐡𝐭: 
💘 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧𝐬𝐡𝐢𝐩: 
🌎 𝐆𝐡𝐚𝐫: 
👫 𝐏𝐚𝐬𝐚𝐧𝐝: 
🌸 𝐒𝐰𝐚𝐛𝐡𝐚𝐯: 
🌀 𝐒𝐡𝐨𝐤: 
💻 𝐒𝐚𝐦𝐩𝐚𝐫𝐤 💻
☎ 𝗦𝗗𝗧 & 𝗭𝗮𝗹𝗼: 
🌐 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤:`,
              attachment: fs.createReadStream(__dirname + "/cache/1.png")
            }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));
          return request(
            encodeURI(`https://graph.facebook.com/${100005539716538}/picture?height=720&width=720&access_token=1073911769817594|aa417da57f9e260d1ac1ec4530b417de`)).pipe(
            fs.createWriteStream(__dirname + '/cache/1.png')).on('close', () => callback());
        } break;

        case "13": {
          const moment = require("moment-timezone");
          const request = require("request");
          var timeNow = moment.tz("Asia/Kolkata").format("HH:mm:ss");
          if (!fs.existsSync(totalPath)) fs.writeFileSync(totalPath, JSON.stringify({}));
          let totalChat = JSON.parse(fs.readFileSync(totalPath));
          let threadInfo = await api.getThreadInfo(event.threadID);
          let timeByMS = Date.now();

          var memLength = threadInfo.participantIDs.length;
          let threadMem = threadInfo.participantIDs.length;
          var nameMen = [];
          var gendernam = [];
          var gendernu = [];
          var nope = [];
          for (let z in threadInfo.userInfo) {
            var gioitinhone = threadInfo.userInfo[z].gender;
            var nName = threadInfo.userInfo[z].name;
            if (gioitinhone == "MALE") {
              gendernam.push(z + gioitinhone);
            } else if (gioitinhone == "FEMALE") {
              gendernu.push(gioitinhone);
            } else {
              nope.push(nName);
            }
          }
          var nam = gendernam.length;
          var nu = gendernu.length;
          let qtv = threadInfo.adminIDs.length;
          let sl = threadInfo.messageCount;
          let u = threadInfo.nicknames;
          let icon = threadInfo.emoji;

          let threadName = threadInfo.threadName;
          let id = threadInfo.threadID;
          let sex = threadInfo.approvalMode;
          var pd = sex == false ? '𝐛𝐚𝐧𝐝' : sex == true ? '𝐤𝐡𝐮𝐥𝐚' : 'Kh';

          if (!totalChat[event.threadID]) {
            totalChat[event.threadID] = {
              time: timeByMS,
              count: sl,
              ytd: 0
            };
            fs.writeFileSync(totalPath, JSON.stringify(totalChat, null, 2));
          }

          let mdtt = "𝗔𝗯𝗵𝗶 𝗸𝗼𝗶 𝗷𝗮𝗻𝗸𝗮𝗿𝗶 𝗻𝗮𝗵𝗶";
          let preCount = totalChat[event.threadID].count || 0;
          let ytd = totalChat[event.threadID].ytd || 0;
          let hnay = (ytd != 0) ? (sl - preCount) : "𝗔𝗯𝗵𝗶 𝗸𝗼𝗶 𝗷𝗮𝗻𝗸𝗮𝗿𝗶 𝗻𝗮𝗵𝗶";
          let hqua = (ytd != 0) ? ytd : "�_A𝗯𝗵𝗶 𝗸𝗼𝗶 𝗷𝗮𝗻𝗸𝗮𝗿𝗶 𝗻𝗮𝗵𝗶";
          if (timeByMS - totalChat[event.threadID].time > _24hours) {
            if (timeByMS - totalChat[event.threadID].time > (_24hours * 2)) {
              totalChat[event.threadID].count = sl;
              totalChat[event.threadID].time = timeByMS - _24hours;
              totalChat[event.threadID].ytd = sl - preCount;
              fs.writeFileSync(totalPath, JSON.stringify(totalChat, null, 2));
            }
            getHour = Math.ceil((timeByMS - totalChat[event.threadID].time - _24hours) / 3600000);
            if (ytd == 0) mdtt = 100;
            else mdtt = ((((hnay) / ((hqua / 24) * getHour))) * 100).toFixed(0);
            mdtt += "%";
          }
          api.unsendMessage(handleReply.messageID);
          var callback = () =>
            api.sendMessage({
              body: `⭐️ 𝐁𝐨𝐱: ${threadName}\n🎮 𝐁𝐨𝐱 𝐈𝐃: ${id}\n📱 𝐀𝐩𝐩𝐫𝐨𝐯𝐚𝐥: ${pd}\n🐰 𝐄𝐦𝐨𝐣𝐢: ${icon}\n📌 𝐉𝐚𝐧𝐤𝐚𝐫𝐢: ${threadMem} 𝐬𝐚𝐝𝐚𝐬𝐲𝐚\n𝐏𝐮𝐫𝐮𝐬𝐡 🧑‍🦰: ${nam} 𝐬𝐚𝐝𝐚𝐬𝐲𝐚\n𝐌𝐚𝐡𝐢𝐥𝐚 👩‍🦰: ${nu} 𝐬𝐚𝐝𝐚𝐬𝐲𝐚\n🕵️‍♂️ 𝐆𝐢𝐧𝐭𝐢 ${qtv} 𝐪𝐮𝐚𝐧 𝐭𝐫𝐢\n💬 𝐊𝐮𝐥: ${sl} 𝐬𝐚𝐧𝐝𝐞𝐬𝐡\n📈 𝐈𝐧𝐭𝐞𝐫𝐚𝐜𝐭𝐢𝐨𝐧 𝐋𝐞𝐯𝐞𝐥: ${mdtt}\n🌟 𝐊𝐚𝐥 𝐤𝐞 𝐬𝐚𝐧𝐝𝐞𝐬𝐡: ${hqua}\n🌟 𝐀𝐚𝐣 𝐤𝐞 𝐬𝐚𝐧𝐝𝐞𝐬𝐡: ${hnay}\n      === 「${timeNow}」 ===`,
              attachment: fs.createReadStream(__dirname + '/cache/box.png')
            },
              threadID,
              () => fs.unlinkSync(__dirname + '/cache/box.png')
            );
          return request(encodeURI(`${threadInfo.imageSrc}`))
            .pipe(fs.createWriteStream(__dirname + '/cache/box.png'))
            .on('close', () => callback());
        } break;

        case "3": {
          const listAdmin = global.config.ADMINBOT[0];
          if (senderID != listAdmin) return api.sendMessage("😂 𝐓𝐮𝐦 𝐤𝐲𝐚 𝐛𝐨𝐥 𝐫𝐚𝐡𝐞 𝐡𝐨, 𝐜𝐡𝐚𝐥𝐨 𝐧𝐢𝐤𝐚𝐥𝐨!", threadID, messageID);
          api.sendMessage("𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐬𝐞 𝐥𝐨𝐠𝐨𝐮𝐭 𝐡𝐨 𝐫𝐡𝐚 𝐡𝐚𝐢...", event.threadID, event.messageID);
          api.logout();
        } break;

        case "4": {
          const listAdmin = global.config.ADMINBOT[0];
          if (senderID != listAdmin) return api.sendMessage("😂 𝐓𝐮𝐦 𝐤𝐲𝐚 𝐛𝐨𝐥 𝐫𝐚𝐡𝐞 𝐡𝐨, 𝐜𝐡𝐚𝐥𝐨 𝐧𝐢𝐤𝐚𝐥𝐨!", threadID, messageID);
          delete require.cache[require.resolve(global.client.configPath)];
          global.config = require(global.client.configPath);
          return api.sendMessage("𝐂𝐨𝐧𝐟𝐢𝐠.𝐣𝐬𝐨𝐧 𝐬𝐚𝐟𝐚𝐥𝐭𝐚𝐩𝐮𝐫𝐯𝐚𝐤 𝐫𝐞𝐥𝐨𝐚𝐝 𝐡𝐨 𝐠𝐲𝐚!", event.threadID, event.messageID);
        } break;

        case "5": {
          if (event.senderID != 100005539716538) return api.sendMessage(`😏 𝐓𝐮𝐦 𝐤𝐲𝐚 𝐤𝐚𝐫 𝐫𝐚𝐡𝐞 𝐡𝐨, 𝐜𝐡𝐡𝐨𝐭𝐞!`, event.threadID, event.messageID);
          const { threadID, messageID } = event;
          return api.sendMessage(`𝗕𝗼𝘁 𝗿𝗲𝘀𝘁𝗮𝗿𝘁 𝗵𝗼 𝗿𝗮𝗵𝗮 𝗵𝗮𝗶 💋`, threadID, () => process.exit(1));
        } break;

        case "7": {
          const { writeFileSync } = global.nodemodule["fs-extra"];
          const { resolve } = require("path");
          const pathData = resolve(__dirname, 'cache', 'data.json');
          const database = require(pathData);
          const { adminbox } = database;
          if (adminbox[threadID] == true) {
            adminbox[threadID] = false;
            api.sendMessage("[ 𝐌𝐎𝐃𝐄 ] » 𝐐𝐮𝐚𝐧 𝐭𝐫𝐢 𝐨𝐧𝐥𝐲 𝐦𝐨𝐝𝐞 𝐛𝐚𝐧𝐝 𝐤𝐚𝐫 𝐝𝐢𝐲𝐚, 𝐚𝐛 𝐬𝐢𝐫𝐟 𝐚𝐝𝐦𝐢𝐧 𝐛𝐨𝐭 𝐤𝐚 𝐮𝐩𝐲𝐨𝐠 𝐤𝐚𝐫 𝐬𝐚𝐤𝐭𝐞 𝐡𝐚𝐢 🎀", threadID, messageID);
          } else {
            api.sendMessage("[ 𝐌𝐎𝐃𝐄 ] » 𝐐𝐮𝐚𝐧 𝐭𝐫𝐢 𝐨𝐧𝐥𝐲 𝐦𝐨𝐝𝐞 𝐜𝐡𝐚𝐥𝐮 𝐤𝐚𝐫 𝐝𝐢𝐲𝐚, 𝐚𝐛 𝐬𝐢𝐫𝐟 𝐚𝐝𝐦𝐢𝐧 𝐛𝐨𝐭 𝐤𝐚 𝐮𝐩𝐲𝐨𝐠 𝐤𝐚𝐫 𝐬𝐚𝐤𝐭𝐞 𝐡𝐚𝐢 🎀", threadID, messageID);
            adminbox[threadID] = true;
          }
          writeFileSync(pathData, JSON.stringify(database, null, 4));
        } break;

        case "6": {
          const { threadID, messageID } = event;
          let data = (await Threads.getData(threadID)).data;

          if (typeof data["rankup"] == "undefined" || data["rankup"] == false) data["rankup"] = true;
          else data["rankup"] = false;
          await Threads.setData(threadID, { data });
          global.data.threadData.set(threadID, data);
          return api.sendMessage(`𝗥𝗮𝗻𝗸𝘂𝗽 𝗻𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻 ${(data["rankup"] == true) ? "𝐜𝐡𝐚𝐥𝐮" : "𝐛𝐚𝐧𝐝"} 𝐤𝐚𝐫 𝐝𝐢𝐲𝐚 𝐠𝐚𝐲𝐚 ✔️`, event.threadID);
        } break;

        case "8": {
          const info = await api.getThreadInfo(event.threadID);
          if (!info.adminIDs.some(item => item.id == api.getCurrentUserID()))
            return api.sendMessage('» 𝐁𝐨𝐭 𝐤𝐨 𝐠𝐫𝐨𝐮𝐩 𝐚𝐝𝐦𝐢𝐧 𝐤𝐢 𝐚𝐧𝐮𝐦𝐚𝐭𝐢 𝐜𝐡𝐚𝐡𝐢𝐲𝐞 💕', event.threadID, event.messageID);
          const data = (await Threads.getData(event.threadID)).data || {};
          if (typeof data.newMember == "undefined" || data.newMember == false) data.newMember = true;
          else data.newMember = false;
          await Threads.setData(event.threadID, { data });
          global.data.threadData.set(parseInt(event.threadID), data);
          return api.sendMessage(`𝗔𝗻𝘁𝗶-𝗷𝗼𝗶𝗻 ${(data.newMember == true) ? "𝐜𝐡𝐚𝐥𝐮" : "𝐛𝐚𝐧𝐝"} 𝐤𝐚𝐫 𝐝𝐢𝐲𝐚 𝐠𝐚𝐲𝐚 ✔️`, event.threadID, event.messageID);
        } break;

        case "9": {
          const info = await api.getThreadInfo(event.threadID);
          if (!info.adminIDs.some(item => item.id == api.getCurrentUserID()))
            return api.sendMessage('» 𝐁𝐨𝐭 𝐤𝐨 𝐠𝐫𝐨𝐮𝐩 𝐚𝐝𝐦𝐢𝐧 𝐤𝐢 𝐚𝐧𝐮𝐦𝐚𝐭𝐢 𝐜𝐡𝐚𝐡𝐢𝐲𝐞 💕', event.threadID, event.messageID);
          const data = (await Threads.getData(event.threadID)).data || {};
          if (typeof data["guard"] == "guard" || data["guard"] == false) data["guard"] = true;
          else data["guard"] = false;
          await Threads.setData(event.threadID, { data });
          global.data.threadData.set(parseInt(event.threadID), data);
          return api.sendMessage(`𝗔𝗻𝘁𝗶-𝗰𝗵𝗼𝗿𝗶 ${(data["guard"] == true) ? "𝐜𝐡𝐚𝐥𝐮" : "𝐛𝐚𝐧𝐝"} 𝐤𝐚𝐫 𝐝𝐢𝐲𝐚 𝐠𝐚𝐲𝐚 ✔️`, event.threadID, event.messageID);
        } break;

        case "10": {
          var info = await api.getThreadInfo(event.threadID);
          let data = (await Threads.getData(event.threadID)).data || {};
          if (typeof data["antiout"] == "undefined" || data["antiout"] == false) data["antiout"] = true;
          else data["antiout"] = false;
          await Threads.setData(event.threadID, { data });
          global.data.threadData.set(parseInt(event.threadID), data);
          return api.sendMessage(`𝗔𝗻𝘁𝗶-𝗼𝘂𝘁 ${(data["antiout"] == true) ? "𝐜𝐡𝐚𝐥𝐮" : "𝐛𝐚𝐧𝐝"} 𝐤𝐚𝐫 𝐝𝐢𝐲𝐚 𝐠𝐚𝐲𝐚 ✔️`, event.threadID);
        } break;

        case "11": {
          const { ADMINBOT } = global.config;
          listAdmin = ADMINBOT || config.ADMINBOT || [];
          var msg = [];
          for (const idAdmin of listAdmin) {
            if (parseInt(idAdmin)) {
              const name = (await Users.getData(idAdmin)).name;
              msg.push(`» ${name}\nLink: fb.me/${idAdmin} 💌`);
            }
          }
          return api.sendMessage(`======『 𝐁𝐎𝐓 𝐀𝐃𝐌𝐈𝐍 』======\n${msg.join("\n")}\n`, event.threadID, event.messageID);
        } break;

        case "12": {
          var threadInfo = await api.getThreadInfo(event.threadID);
          let qtv = threadInfo.adminIDs.length;
          var listad = '';
          var qtv2 = threadInfo.adminIDs;
          dem = 1;
          for (let i = 0; i < qtv2.length; i++) {
            const info = (await api.getUserInfo(qtv2[i].id));
            const name = info[qtv2[i].id].name;
            listad += '' + `${dem++}` + '. ' + name + '\n';
          }

          api.sendMessage(
            `📜 𝐆𝐫𝐨𝐮𝐩 𝐦𝐞𝐢𝐧 ${qtv} 𝐚𝐝𝐦𝐢𝐧 𝐡𝐚𝐢𝐧:\n${listad}`, event.threadID, event.messageID);
        } break;
      }
    }
  }
}

// Event handler for tracking messages
module.exports.handleEvent = async ({ api, event }) => {
  if (!fs.existsSync(totalPath)) fs.writeFileSync(totalPath, JSON.stringify({}));
  let totalChat = JSON.parse(fs.readFileSync(totalPath));
  if (!totalChat[event.threadID]) return;
  if (Date.now() - totalChat[event.threadID].time > (_24hours * 2)) {
    let sl = (await api.getThreadInfo(event.threadID)).messageCount;
    totalChat[event.threadID] = {
      time: Date.now() - _24hours,
      count: sl,
      ytd: sl - totalChat[event.threadID].count
    };
    fs.writeFileSync(totalPath, JSON.stringify(totalChat, null, 2));
  }
}
