module.exports.config = {
  name: "box",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Group ke settings",
  commandCategory: "Box Chat",
  usages: "< id/name/setnamebox/emoji/me setqtv/setqtv/image/info/new/taobinhchon/setname/setnameall/rdcolor >",
  cooldowns: 1,
  dependencies: {
    "request": "",
    "fs-extra": "path"
  }
};

// Bot load hone par GIF download aur folder setup
module.exports.onLoad = () => {
  const fs = require("fs-extra");
  const request = require("request");
  const dirMaterial = __dirname + `/noprefix/`;
  if (!fs.existsSync(dirMaterial + "noprefix")) fs.mkdirSync(dirMaterial, { recursive: true });
  if (!fs.existsSync(dirMaterial + "MQx7j9E.gif")) request("https://i.imgur.com/MQx7j9E.gif").pipe(fs.createWriteStream(dirMaterial + "MQx7j9E.gif"));
}

// Total chat data ka path
const totalPath = __dirname + '/data/totalChat.json';
const _24hours = 86400000;
const fs = require("fs-extra");

// Group ke messages track karne ka event handler
module.exports.handleEvent = async ({
  api,
  event,
  args
}) => {
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

// Main run function
module.exports.run = async ({
  api,
  event,
  args,
  Threads,
  Users,
  utils
}) => {
  var fullTime = global.client.getTime("fullTime");
  const request = require("request");
  const { resolve } = require("path");
  const moment = require("moment-timezone");
  var timeNow = moment.tz("Asia/Kolkata").format("DD/MM/YYYY || HH:mm:ss");

  // Default menu jab koi argument nahi diya jata
  if (args.length == 0) return api.sendMessage({
    body: `===『 𝗚𝗥𝗢𝗨𝗣 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦 』===\n━━━━━━━━━━━━━━━━━━\n
[🌟] 𝗯𝗼𝘅 𝗶𝗱 => 𝗚𝗿𝗼𝘂𝗽 𝗸𝗮 𝗜𝗗 𝗹𝗲\n
[🎁] 𝗯𝗼𝘅 𝗻𝗮𝗺𝗲 => 𝗚𝗿𝗼𝘂𝗽 𝗸𝗮 𝗻𝗮𝗮𝗺 𝗹𝗲\n
[🐥] 𝗯𝗼𝘅 𝘀𝗲𝘁𝗻𝗮𝗺𝗲𝗯𝗼𝘅 < 𝗻𝗮𝗮𝗺 > => 𝗚𝗿𝗼𝘂𝗽 𝗸𝗮 𝗻𝗮𝗮𝗺 𝗯𝗮𝗱𝗹𝗼\n
[💞] 𝗯𝗼𝘅 𝗶𝗻𝗳𝗼 => 𝗚𝗿𝗼𝘂𝗽 𝗸𝗶 𝗷𝗮𝗻𝗸𝗮𝗿𝗶 𝗱𝗲𝗸𝗵𝗼\n
[💌] 𝗯𝗼𝘅 𝗺𝗲 𝘀𝗲𝘁𝗾𝘁𝘃 => 𝗕𝗼𝘁 𝗮𝗽𝗸𝗼 𝗴𝗿𝗼𝘂𝗽 𝗸𝗮 𝗮𝗱𝗺𝗶𝗻 𝗯𝗮𝗻𝗮𝘆𝗲𝗴𝗮\n
[🔰] 𝗯𝗼𝘅 𝘀𝗲𝘁𝗾𝘁𝘃 < 𝘁𝗮𝗴 > => 𝗧𝗮𝗴 𝗸𝗶𝘆𝗲 𝗵𝘂𝗲 𝗸𝗼 𝗴𝗿𝗼𝘂𝗽 𝗮𝗱𝗺𝗶𝗻 𝗯𝗮𝗻𝗮𝗼\n
[😻] 𝗯𝗼𝘅 𝗲𝗺𝗼𝗷𝗶 < 𝗶𝗰𝗼𝗻 > => 𝗚𝗿𝗼𝘂𝗽 𝗸𝗮 𝗲𝗺𝗼𝗷𝗶 𝗯𝗮𝗱𝗹𝗼\n
──────────────────\n
[🌹] 𝗯𝗼𝘅 𝗶𝗺𝗮𝗴𝗲 < 𝗿𝗲𝗽𝗹𝘆 𝗸𝗮𝗿𝗸𝗲 𝗳𝗼𝘁𝗼 > => 𝗚𝗿𝗼𝘂𝗽 𝗸𝗶 𝗽𝗿𝗼𝗳𝗶𝗹𝗲 𝗽𝗶𝗰𝘁𝘂𝗿𝗲 𝗯𝗮𝗱𝗹𝗼\n
[👥] 𝗯𝗼𝘅 𝗻𝗲𝘄 < 𝘁𝗮𝗴 > => 𝗡𝗮𝘆𝗮 𝗴𝗿𝗼𝘂𝗽 𝗯𝗮𝗻𝗮𝗼 𝘁𝗮𝗴 𝗸𝗶𝘆𝗲 𝗵𝘂𝗲 𝗹𝗼𝗴𝗼 𝗸𝗲 𝘀𝗮𝘁𝗵\n
[🎀] 𝗯𝗼𝘅 𝘁𝗮𝗼𝗯𝗶𝗻𝗵𝗰𝗵𝗼𝗻 => 𝗚𝗿𝗼𝘂𝗽 𝗺𝗲𝗶𝗻 𝗽𝗼𝗹𝗹 𝗯𝗮𝗻𝗮𝗼\n
──────────────────\n
[⚜️] 𝗯𝗼𝘅 𝘀𝗲𝘁𝗻𝗮𝗺𝗲 < 𝘁𝗮𝗴/𝗿𝗲𝗽𝗹𝘆 > < 𝗻𝗶𝗰𝗸𝗻𝗮𝗺𝗲 > => 𝗘𝗸 𝘀𝗮𝗱𝗮𝘀𝘆𝗮 𝗸𝗮 𝗻𝗶𝗰𝗸𝗻𝗮𝗺𝗲 𝗯𝗮𝗱𝗹𝗼\n
[🎶] 𝗯𝗼𝘅 𝘀𝗲𝘁𝗻𝗮𝗺𝗲𝗮𝗹𝗹 < 𝗻𝗶𝗰𝗸𝗻𝗮𝗺𝗲 > => 𝗦𝗮𝗯𝗸𝗲 𝗻𝗶𝗰𝗸𝗻𝗮𝗺𝗲 𝗲𝗸 𝗷𝗮𝗶𝘀𝗲 𝗯𝗮𝗱𝗹𝗼\n
[🎊] 𝗯𝗼𝘅 𝗿𝗱𝗰𝗼𝗹𝗼𝗿 => 𝗚�_r𝗼𝘂𝗽 𝗸𝗮 𝘁𝗵𝗲𝗺𝗲 𝗰𝗼𝗹𝗼𝗿 𝗿𝗮𝗻𝗱𝗼𝗺𝗹𝘆 𝗯𝗮𝗱𝗹𝗼\n
──────────────────\n[ ${timeNow} ]`,
    attachment: fs.createReadStream(__dirname + `/noprefix/MQx7j9E.gif`)
  }, event.threadID, event.messageID);

  var id = [event.senderID] || [];
  var main = event.body;
  var groupTitle = main.slice(main.indexOf("|") + 2);

  // New group create karo
  if (args[0] == "new") {
    for (var i = 0; i < Object.keys(event.mentions).length; i++)
      id.push(Object.keys(event.mentions)[i]);
    api.createNewGroup(id, groupTitle, () => {
      api.sendMessage(`𝗡𝗮𝘆𝗮 𝗴𝗿𝗼𝘂𝗽 ${groupTitle} 𝗯𝗮𝗻 𝗴𝗮𝘆𝗮`, event.threadID);
    });
  }

  // Group ID return karo
  if (args[0] == "id") {
    return api.sendMessage(`${event.threadID}`, event.threadID, event.messageID);
  }

  // Group ka naam return karo
  if (args[0] == "name") {
    var nameThread = global.data.threadInfo.get(event.threadID).threadName || ((await Threads.getData(event.threadID)).threadInfo).threadName;
    return api.sendMessage(nameThread, event.threadID, event.messageID);
  }

  // Group ka naam badlo
  if (args[0] == "setnamebox") {
    var content = args.join(" ");
    var c = content.slice(7, 99) || event.messageReply.body;
    api.setTitle(`${c} `, event.threadID);
  }

  // Group ka emoji badlo
  if (args[0] == "emoji") {
    const name = args[1] || event.messageReply.body;
    api.changeThreadEmoji(name, event.threadID);
  }

  // Apne aap ko admin banao
  if (args[0] == "me") {
    if (args[1] == "setqtv") {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const find = threadInfo.adminIDs.find(el => el.id == api.getCurrentUserID());
      if (!find) api.sendMessage("𝗕𝗼𝘁 𝗸𝗼 𝗴𝗿𝗼𝘂𝗽 𝗮𝗱𝗺𝗶𝗻 𝗸𝗶 𝗮𝗻𝘂𝗺𝗮𝘁𝗶 𝗰𝗵𝗮𝗵𝗶𝘆𝗲", event.threadID, event.messageID);
      else if (!global.config.SUPERADMIN.includes(event.senderID)) api.sendMessage("𝗦𝗨𝗣𝗘𝗥 𝗔𝗗𝗠𝗜𝗡 𝗸𝗶 𝗮𝗻𝘂𝗺𝗮𝘁𝗶 𝗰𝗵𝗮𝗵𝗶𝘆𝗲", event.threadID, event.messageID);
      else api.changeAdminStatus(event.threadID, event.senderID, true);
    }
  }

  // Kisi aur ko admin banao ya hatao
  if (args[0] == "setqtv") {
    if (args.join().indexOf('@') !== -1) {
      namee = Object.keys(event.mentions);
    } else namee = args[1];
    if (event.messageReply) {
      namee = event.messageReply.senderID;
    }

    const threadInfo = await api.getThreadInfo(event.threadID);
    const findd = threadInfo.adminIDs.find(el => el.id == namee);
    const find = threadInfo.adminIDs.find(el => el.id == api.getCurrentUserID());
    const finddd = threadInfo.adminIDs.find(el => el.id == event.senderID);

    if (!finddd) return api.sendMessage("𝗔𝗽𝗸𝗼 𝗴𝗿𝗼𝘂𝗽 𝗮𝗱𝗺𝗶𝗻 𝗸𝗶 𝗮𝗻𝘂𝗺𝗮𝘁𝗶 𝗰𝗵𝗮𝗵𝗶𝘆𝗲", event.threadID, event.messageID);
    if (!find) {
      api.sendMessage("𝗕𝗼𝘁 𝗸𝗼 𝗴𝗿𝗼𝘂𝗽 𝗮𝗱𝗺𝗶𝗻 𝗸𝗶 𝗮𝗻𝘂𝗺𝗮𝘁𝗶 𝗰𝗵𝗮𝗵𝗶𝘆𝗲", event.threadID, event.messageID);
    }
    if (!findd) {
      api.changeAdminStatus(event.threadID, namee, true);
    } else api.changeAdminStatus(event.threadID, namee, false);
  }

  // Group ki profile picture badlo
  if (args[0] == "image") {
    if (event.type !== "message_reply") return api.sendMessage("𝗘𝗸 𝗳𝗼𝘁𝗼, 𝘃𝗶𝗱𝗲𝗼 𝘆𝗮 𝗮𝘂𝗱𝗶𝗼 𝗸𝗼 𝗿𝗲𝗽𝗹𝘆 𝗸𝗮𝗿𝗼", event.threadID, event.messageID);
    if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("𝗘𝗸 𝗳𝗼𝘁𝗼, 𝘃𝗶𝗱𝗲𝗼 𝘆𝗮 𝗮𝘂𝗱𝗶𝗼 𝗸𝗼 𝗿𝗲𝗽𝗹𝘆 𝗸𝗮𝗿𝗼", event.threadID, event.messageID);
    if (event.messageReply.attachments.length > 1) return api.sendMessage(`𝗦𝗶𝗿𝗳 𝗲𝗸 𝗵𝗶 𝗳𝗼𝘁𝗼, 𝘃𝗶𝗱𝗲𝗼 𝘆𝗮 𝗮𝘂𝗱𝗶𝗼 𝗿𝗲𝗽𝗹𝘆 𝗸𝗮𝗿𝗼`, event.threadID, event.messageID);
    var callback = () => api.changeGroupImage(fs.createReadStream(__dirname + "/cache/1.png"), event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));
    return request(encodeURI(event.messageReply.attachments[0].url)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', () => callback());
  }

  // Group ki jankari dikhao
  if (args[0] == "info") {
    const moment = require("moment-timezone");
    var timeNow = moment.tz("Asia/Kolkata").format("HH:mm:ss");
    if (!fs.existsSync(totalPath)) fs.writeFileSync(totalPath, JSON.stringify({}));
    let totalChat = JSON.parse(fs.readFileSync(totalPath));
    let threadInfo = await api.getThreadInfo(event.threadID);
    let timeByMS = Date.now();
    const threadSetting = (await Threads.getData(String(event.threadID))).data || {};
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
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
    var kxd = nope.length;
    let qtv = threadInfo.adminIDs.length;
    let sl = threadInfo.messageCount;
    let u = threadInfo.nicknames;
    let color = threadInfo.color;
    let icon = threadInfo.emoji;

    let threadName = threadInfo.threadName;
    let id = threadInfo.threadID;
    let sex = threadInfo.approvalMode;
    var pd = sex == false ? '𝗕𝗮𝗻𝗱' : sex == true ? '𝗖𝗵𝗮𝗹𝘂' : '\n';

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
    var listad_msg = '';
    var adminIDs = threadInfo.adminIDs;
    for (let get of adminIDs) {
      const infoUsers = await Users.getInfo(get.id);
      listad_msg += `• ${infoUsers.name}\n`;
    }

    var callback = () =>
      api.sendMessage({
        body: `===「 𝗚𝗥𝗢𝗨𝗣 �_K𝗜 𝗝𝗔𝗡𝗞𝗔𝗥𝗜 」===\n────────────\n
🌟 𝗚𝗿𝗼𝘂𝗽 𝗸𝗮 𝗻𝗮𝗮𝗺: ${threadName}\n
🔰 𝗜𝗗: ${id}\n
🧩 𝗔𝗽𝗽𝗿𝗼𝘃𝗮𝗹: ${pd}\n
😻 𝗘𝗺𝗼𝗷𝗶: ${icon ? icon : '�_K𝗼𝗶 𝗻𝗮𝗵𝗶'}\n
🎁 𝗧𝗵𝗲𝗺𝗲 𝗰𝗼𝗹𝗼𝗿: ${color}\n
🎊 𝗦𝘆𝘀𝘁𝗲𝗺 𝗣𝗿𝗲𝗳𝗶𝘅: ${global.config.PREFIX}\n
🥀 𝗚𝗿𝗼𝘂𝗽 𝗣𝗿𝗲𝗳𝗶𝘅: ${prefix}\n
────────────\n
👥 �_K𝘂𝗹 𝘀𝗮𝗱𝗮𝘀𝘆𝗮: ${threadMem}\n
🧑 𝗣𝘂𝗿𝘂𝘀𝗵: ${nam}\n
👧 𝗠𝗮𝗵𝗶𝗹𝗮: ${nu}\n
🚫 𝗕𝗶𝗻𝗮 𝗽𝗮𝗵𝗰𝗵𝗮𝗻: ${kxd}\n
⚜️ 𝗔𝗱𝗺𝗶𝗻: ${qtv}\n
📚 𝗔𝗱𝗺𝗶𝗻 𝗸𝗶 𝘀𝘂𝗰𝗵𝗶:\n${listad_msg}
────────────\n
💬 �_K𝘂𝗹 𝗺𝗲𝘀𝘀𝗮𝗴𝗲: ${sl}\n
💌 𝗜𝗻𝘁𝗲𝗿𝗮𝗰𝘁𝗶𝗼𝗻 𝗹𝗲𝘃𝗲𝗹: ${mdtt}\n
📦 �_K𝗮𝗹 𝗸𝗲 𝗺𝗲𝘀𝘀𝗮𝗴𝗲: ${hqua}\n
🗃️ 𝗔𝗮𝗷 𝗸𝗲 𝗺𝗲𝘀𝘀𝗮𝗴𝗲: ${hnay}\n
📔 𝗚𝗿𝗼𝘂𝗽 𝗯𝗮𝗻𝗮𝗻𝗲 𝗸𝗮 𝗱𝗶𝗻: ${fullTime}\n`,
        attachment: fs.createReadStream(__dirname + '/cache/1.png')
      },
        event.threadID,
        () => fs.unlinkSync(__dirname + '/cache/1.png'),
        event.messageID
      );
    return request(encodeURI(`${threadInfo.imageSrc}`))
      .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
      .on('close', () => callback());
  }

  // Group mein poll banao
  if (args[0] == "taobinhchon") {
    const { threadID, messageID, senderID } = event;
    let options = args.splice(1).join(" ").split("|");
    let obj = {};
    for (let item of options) obj[item] = false;
    api.sendMessage(`𝗣𝗼𝗹𝗹 𝗯𝗮𝗻 𝗴𝗮𝘆𝗮 ${options.join(",")}\n𝗧𝗶𝘁𝗹𝗲 𝗸𝗲 𝗹𝗶𝘆𝗲 𝗶𝘀 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝗸𝗼 𝗿𝗲𝗽𝗹𝘆 𝗸𝗮𝗿𝗼`, event.threadID, (err, info) => {
      if (err) return console.log(err);
      else {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          obj
        });
      }
    });
  }

  // Ek sadashya ka nickname badlo
  if (args[0] == "setname") {
    if (event.type == "message_reply") {
      const name = args.splice(1).join(" ");
      return api.changeNickname(`${name}`, event.threadID, event.messageReply.senderID);
    } else {
      const name = args.splice(1).join(" ");
      const mention = Object.keys(event.mentions)[0];
      if (!mention) return api.changeNickname(`${name}`, event.threadID, event.senderID);
      if (mention[0]) return api.changeNickname(`${name.replace(event.mentions[mention], "")}`, event.threadID, mention);
    }
  }

  // Group ka theme color randomly badlo
  if (args[0] == "rdcolor") {
    var color = ['196241301102133', '169463077092846', '2442142322678320', '234137870477637', '980963458735625', '175615189761153', '2136751179887052', '2058653964378557', '2129984390566328', '174636906462322', '1928399724138152', '417639218648241', '930060997172551', '164535220883264', '370940413392601', '205488546921017', '809305022860427'];
    api.changeThreadColor(color[Math.floor(Math.random() * color.length)], event.threadID);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Sab sadashya ka nickname ek jaisa badlo
  if (args[0] == "setnameall") {
    var threadInfo = await api.getThreadInfo(event.threadID);
    var idtv = threadInfo.participantIDs;
    console.log(threadInfo);
    const name = args.splice(1).join(" ");
    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    for (let setname of idtv) {
      await delay(3000);
      api.changeNickname(`${name}`, event.threadID, setname);
    }
  }
}

// Poll creation ke liye reply handler
module.exports.handleReply = function ({ api, event, handleReply }) {
  const { threadID, senderID, body } = event;
  if (senderID != handleReply.author) return;
  return api.createPoll(body, event.threadID, handleReply.obj, (err, info) => {
    if (err) return console.log(err);
    else {
      api.sendMessage(`𝗣𝗼𝗹𝗹 ${body} 𝗯𝗮𝗻 𝗴𝗮𝘆𝗮`, threadID);
      api.unsendMessage(handleReply.messageID);
      global.client.handleReply.splice(global.client.handleReply.indexOf(handleReply), 1);
    }
  });
}
