module.exports.config = {
  name: 'thuebot',
  version: '1.3.7',
  hasPermssion: 3,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: 'Bot kiraye par lein',
  commandCategory: 'Admin',
  usages: '[]',
  cooldowns: 5,
  usePrefix: false,
};

let fs = require('fs');
if (!fs.existsSync(__dirname + '/data'))
  fs.mkdirSync(__dirname + '/data');
let path = __dirname + '/data/thuebot.json';
let data = [];
let save = () => fs.writeFileSync(path, JSON.stringify(data));
if (!fs.existsSync(path)) save();
else data = require(path);
let form_mm_dd_yyyy = (input = '', split = input.split('/')) => `${split[1]}/${split[0]}/${split[2]}`;
let invalid_date = date => /^Invalid Date$/.test(new Date(date));

exports.run = function (o) {
  let send = (msg, callback) => o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
  // if (!["100068096370437"].includes(o.event.senderID)) return send(`⚠️ Sirf mukhya admin hi iska istemal kar sakta hai!`);

  switch (o.args[0]) {
    case 'add': {
      if (!o.args[1]) return send(`⚠️ Bot kiraye par lene wale ko data mein jodne ke liye:\n - thuebot add + samapti tarikh\n - thuebot add + kiraye wale ka ID + samapti tarikh\n - thuebot add samooh ID + kiraye wale ka ID + samapti tarikh\n⚠️ Dhyan dein: tarikh ka format DD/MM/YYYY hona chahiye`);
      let userId = o.event.senderID;
      if (o.event.type === "message_reply") {
        userId = o.event.messageReply.senderID;
      } else if (Object.keys(o.event.mentions).length > 0) {
        userId = Object.keys(o.event.mentions)[0];
      }
      let t_id = o.event.threadID;
      let id = userId;
      let time_start = (require('moment-timezone')).tz('Asia/Kolkata').format('DD/MM/YYYY');
      let time_end = o.args[1];
      if (o.args.length === 4 && !isNaN(o.args[1]) && !isNaN(o.args[2]) && o.args[3].match(/\d{1,2}\/\d{1,2}\/\d{4}/)) {
        t_id = o.args[1];
        id = o.args[2];
        time_start = (require('moment-timezone')).tz('Asia/Kolkata').format('DD/MM/YYYY');
        time_end = o.args[3];
      } else if (o.args.length === 3 && !isNaN(o.args[1]) && o.args[2].match(/\d{1,2}\/\d{1,2}\/\d{4}/)) {
        t_id = o.event.threadID;
        id = o.args[1];
        time_start = (require('moment-timezone')).tz('Asia/Kolkata').format('DD/MM/YYYY');
        time_end = o.args[2];
      }
      if (isNaN(id) || isNaN(t_id)) return send(`⚠️ ID manjoor nahi hai!`);
      if (invalid_date(form_mm_dd_yyyy(time_start)) || invalid_date(form_mm_dd_yyyy(time_end))) return send(`⚠️ Samay manjoor nahi hai!`);
      data.push({
        t_id,
        id,
        time_start,
        time_end,
      });
      send(`☑️ Bot kiraye par lene wale ko suchi mein jod diya gaya!`);
      break;
    }
    case 'list': {
      send(`┏━━━━━━━━━━━━━━━━━━━┓\n┣➤ [ BOT KIRAYE KI SUCHI ]\n┗━━━━━━━━━━━━━━━━━━━┛\n${data.map(($, i) => `┏━━━━━━━━━━━━━━━━━━━┓\n┣➤ ${i + 1}. 👤 Kiraye wala: ${global.data.userName.get($.id)}\n┣➤ 📝 Sthiti: ${new Date(form_mm_dd_yyyy($.time_end)).getTime() >= Date.now() + 25200000 ? 'Abhi Samapt Nahi ✅' : 'Samapt Ho Chuka ❎'}\n┣➤ 🔰 Samooh: ${(global.data.threadInfo.get($.t_id) || {}).threadName}`).join('\n┗━━━━━━━━━━━━━━━━━━━┛\n')}\n┗━━━━━━━━━━━━━━━━━━━┛\n┏━━━━━━━━━━━━━━━━━━━┓\n┣➤ STT ka jawab dein vivaran dekhne ke liye\n┣➤ del STT ka jawab dein hatane ke liye\n┣➤ out STT ka jawab dein samooh chhodne ke liye\n┣➤ giahan STT + samapti samay ka jawab dein\n┗━━━━━━━━━━━━━━━━━━━┛`, (err, res) => (res.name = exports.config.name,
        res.event = o.event, res.data = data,
        global.client.handleReply.push(res)));
      break;
    }
    default:
      send(`Istemaal karein: ${global.config.PREFIX}thuebot add → Samooh ko bot kiraye ki suchi mein jodne ke liye\nIstemaal karein: ${global.config.PREFIX}thuebot list → Bot kiraye ki suchi dekhne ke liye\n𝗛𝗗𝗦𝗗 → ${global.config.PREFIX}thuebot jaruri command.`);
  }
  save();
};

exports.handleReply = async function (o) {
  let _ = o.handleReply;
  let send = (msg, callback) => o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
  if (o.event.senderID != _.event.senderID)
    return;
  if (isFinite(o.event.args[0])) {
    let info = data[o.event.args[0] - 1];
    if (!info) return send(`❎ STT maujood nahi hai!`);
    return send(`[ BOT KIRAYE WALE KI JANKARI ]\n────────────────────\n👤 Kiraye wala: ${global.data.userName.get(info.id)}\n🌐 Facebook Link: https://www.facebook.com/profile.php?id=${info.id}\n👥 Samooh: ${(global.data.threadInfo.get(info.t_id) || {}).threadName}\n🔰 TID: ${info.t_id}\n────────────────────\n📆 Kiraye ki tarikh: ${info.time_start}\n──────\n⏳ Samapti tarikh: ${info.time_end}\n────────────────────\n⏰ ${(() => {
      let time_diff = new Date(form_mm_dd_yyyy(info.time_end)).getTime() - (Date.now() + 25200000);
      let days = (time_diff / (1000 * 60 * 60 * 24)) << 0;
      let hour = ((time_diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) << 0;
      if (time_diff <= 0) {
        return "Kiraye ka samay samapt ho chuka 🔐";
      } else {
        return `Baki ${days} din ${hour} ghante mein kiraya samapt hoga`;
      }
    })()}`);
  } else if (o.event.args[0].toLowerCase() == 'del') {
    o.event.args.slice(1).sort((a, b) => b - a).forEach($ => data.splice($ - 1, 1));
    send(`☑️ Safalata se hata diya gaya!`);
  } else if (o.event.args[0].toLowerCase() == 'giahan') {
    let STT = o.event.args[1];
    let time_start = (require('moment-timezone')).tz('Asia/Kolkata').format('DD/MM/YYYY');
    let time_end = o.event.args[2];
    if (invalid_date(form_mm_dd_yyyy(time_start)) || invalid_date(form_mm_dd_yyyy(time_end))) return send(`❎ Samay manjoor nahi hai!`);
    if (!data[STT - 1]) return send(`❎ STT maujood nahi hai`);
    let $ = data[STT - 1];
    $.time_start = time_start;
    $.time_end = time_end;
    send(`☑️ Samooh ka kiraya safalata se badhaya gaya!`);
  } else if (o.event.args[0].toLowerCase() == 'out') {
    for (let i of o.event.args.slice(1)) await o.api.removeUserFromGroup(o.api.getCurrentUserID(), data[i - 1].t_id);
    send(`⚠️ Anurodh ke anusaar samooh chhod diya gaya`);
  }
  save();
};
