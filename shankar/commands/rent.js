const moment = require('moment-timezone');
const TIMEZONE = 'Asia/Kolkata';
module.exports.config = {
   name: 'rent',
   version: '1.3.7',
   hasPermssion: 3,
   credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
   description: 'Bot ko rent par lena',
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
   if (!["61567780432797"].includes(o.event.senderID)) return send(`⚠️ Sirf main Admin hi iska istemal kar sakta hai!`);

   switch (o.args[0]) {
      case 'add': {
         let userId = o.event.senderID;
         let threadId = o.event.threadID;
         let daysToAdd = 30; // Default 30 din
     
         // Check karna agar din ka parameter diya gaya ho (jaise: rent add 15 for 15 din)
         if (!isNaN(o.args[1]) && Number(o.args[1]) > 0) {
             daysToAdd = Number(o.args[1]);
         }
     
         let time_start = moment.tz('Asia/Kolkata').format('DD/MM/YYYY');
         let time_end = moment.tz('Asia/Kolkata').add(daysToAdd, 'days').format('DD/MM/YYYY');
     
         // ID valid hai ya nahi check karna
         if (isNaN(userId) || isNaN(threadId)) return send(`⚠️ ID Valid nahi hai!`);
     
         // Bot rent ki list mein add karna
         data.push({ t_id: threadId, id: userId, time_start, time_end });
         save();
     
         send(`✅ Bot rent ki list mein add kar diya gaya!\n👤 Rent karne wala: ${global.data.userName.get(userId)}\n📅 Shuruaat ki tareekh: ${time_start}\n📆 Samapt hone ki tareekh: ${time_end} (⏳ ${daysToAdd} din)`);
         break;
     }     
      function formatDate(dateString) {
         let [day, month, year] = dateString.split('/');
         return `${month}/${day}/${year}`;
     }     
      case 'list':
    if (data.length === 0) {
        send('❎ Koi group bot rent par nahi hai!');
        break;
    }
    
    let listMessage = `📌 Bot rent ki list\n───────────────\n`;
    
    data.forEach((item, index) => {
        let isActive = new Date(formatDate(item.time_end)).getTime() >= Date.now() ? '🟢 Abhi valid hai' : '🔴 Samay khatam';
        let groupName = global.data.threadInfo.get(item.t_id)?.threadName || "Pata nahi";
        
        listMessage += `🔹 ${index + 1}. ${global.data.userName.get(item.id) || "Pata nahi"}\n`;
        listMessage += `   🏠 Group: ${groupName}\n`;
        listMessage += `   ⚙️ Status: ${isActive}\n`;
        listMessage += `   🗓 Shuruaat ki tareekh: ${item.time_start}\n`;
        listMessage += `   ⏳ Samapt hone ki tareekh: ${item.time_end}\n`;
        listMessage += `   🌐 Facebook: (https://www.facebook.com/profile.php?id=${item.id})\n`;
        listMessage += `───────────────\n`;
    });

    listMessage += `📢 Reply [ del | out | giahan ] + stt se koi action karein.\n`;
    listMessage += `───────────────\n\n`;
    listMessage += `👤 Admin: ${global.config.ADMIN_NAME}`;
    
    send(listMessage, (err, res) => {
        res.name = exports.config.name;
        res.event = o.event;
        res.data = data;
        global.client.handleReply.push({ ...res, type: 'list' });
    });
    break;
    
    case 'info':
      const rentInfo = data.find(entry => entry.t_id === o.event.threadID); 
      if (!rentInfo) {
          send(`❎ Is group ke liye bot rent ka koi data nahi hai`); 
      } else {
          send(`[ Bot Rent ki Jankari ]\n\n👤 Rent karne wala: ${global.data.userName.get(rentInfo.id)}\n🔗 Facebook link: https://www.facebook.com/profile.php?id=${rentInfo.id}\n🗓️ Shuruaat ki tareekh: ${rentInfo.time_start}\n⌛ Samapt hone ki tareekh: ${rentInfo.time_end}\n\n⩺ Abhi ${Math.floor((new Date(formatDate(rentInfo.time_end)).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} din ${Math.floor((new Date(formatDate(rentInfo.time_end)).getTime() - Date.now()) / (1000 * 60 * 60) % 24)} ghante baki hain`);
      } 
      break;

      default:
         send({
            body: `[ ISTEMAL KA TARIKA ]\n───────────────\n\n⩺ rent add: Group ko list mein add karein \n⩺ rent info: Group ke bot rent ki jankari dekhein\n⩺ rent list: Rent ki list dekhein\n\n───────────────\n👤 Admin: ${global.config.ADMIN_NAME}`,
            attachment: global.vdanime.splice(0, 1)  
         });
         break;
   }
};
exports.handleReply = async function (o) {
   let _ = o.handleReply;
   let send = (msg, callback) => o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
   if (o.event.senderID != _.event.senderID)
      return;
   if (isFinite(o.event.args[0])) {
      let info = data[o.event.args[0] - 1];
      if (!info) return send(`❎ STT maujood nahi hai!`);
      return send(`[ BOT RENT KARNE WALE KI JANKARI ]\n───────────────\n👤 Rent karne wala: ${global.data.userName.get(info.id)}\n🌐 Facebook Link: https://www.facebook.com/profile.php?id=${info.id}\n👥 Group: ${(global.data.threadInfo.get(info.t_id) || {}).threadName}\n🔰 TID: ${info.t_id}\n────────────────────\n📆 Shuruaat ki tareekh: ${info.time_start}\n───────────────\n⏳ Samapt hone ki tareekh: ${info.time_end}\n───────────────\n⏰ ${(() => {
 let time_diff = new Date(form_mm_dd_yyyy(info.time_end)).getTime() - (Date.now() + 25200000);
 let days = (time_diff / (1000 * 60 * 60 * 24)) << 0;
 let hour = ((time_diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) << 0;
 if (time_diff <= 0) {
 return "Rent ka samay khatam ho chuka hai 🔐";
 } else {
   return `Abhi ${days} din ${hour} ghante baki hain rent khatam hone mein`;
 }
})()}`);
   } else if (o.event.args[0].toLowerCase() == 'del') {
      let deletedIds = [];
      o.event.args.slice(1).sort((a, b) => b - a).forEach(index => {
          if (data[index - 1]) {
              deletedIds.push(`🗑️ ${index}. ${global.data.userName.get(data[index - 1].id) || 'Pata nahi'}`);
              data.splice(index - 1, 1);
          }
      });
  
      if (deletedIds.length === 0) return send(`⚠️ Koi valid STT nahi mila delete karne ke liye!`);
  
      send(`✅ Niche diye gaye mukhyon ko safalta se hata diya gaya:\n\n${deletedIds.join('\n')}\n\n📝 Kul hataaye gaye mukhyon ki sankhya: ${deletedIds.length}`);
      save();  
   } else if (o.event.args[0].toLowerCase() == 'giahan') {
      let STT = o.event.args[1];
      let time_start = (require('moment-timezone')).tz('Asia/Kolkata').format('DD/MM/YYYY');
      let time_end = o.event.args[2];
      if (invalid_date(form_mm_dd_yyyy(time_start)) || invalid_date(form_mm_dd_yyyy(time_end))) return send(`❎ Samay valid nahi hai!`);
      if (!data[STT - 1]) return send(`❎ STT maujood nahi hai`);
      let $ = data[STT - 1];
      $.time_start = time_start;
      $.time_end = time_end;
      send(`☑️ Group ka samay safalta se badhaya gaya!`);
   } else if (o.event.args[0].toLowerCase() == 'out') {
      for (let i of o.event.args.slice(1)) await o.api.removeUserFromGroup(o.api.getCurrentUserID(), data[i - 1].t_id);
      send(`⚠️ Mang ke anusaar group se nikal gaya`);
   };
   save();
};
