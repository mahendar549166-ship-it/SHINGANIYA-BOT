module.exports.config = {
  name: "callad",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Bot ke error ya suggestion admin ko bhejo",
  commandCategory: "Utility",
  usages: "[error ya suggestion]",
  cooldowns: 5,
  images: [],
};

// Reply handler for admin communication
module.exports.handleReply = async function ({ api, args, event, handleReply, Users }) {
  try {
    var name = (await Users.getData(event.senderID)).name;
    var s = [];
    var l = [];
    const fs = require('fs-extra');
    const { join } = require('path');
    const axios = require('axios');
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length || 20;
    
    // Attachments handle karo
    if (event.attachments.length != 0) {
      for (var p of event.attachments) {
        var result = '';
        for (var i = 0; i < charactersLength; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
        if (p.type == 'photo') {
          var e = 'jpg';
        }
        if (p.type == 'video') {
          var e = 'mp4';
        }
        if (p.type == 'audio') {
          var e = 'mp3';
        }
        if (p.type == 'animated_image') {
          var e = 'gif';
        }
        var o = join(__dirname, 'cache', `${result}.${e}`);
        let m = (await axios.get(encodeURI(p.url), { responseType: "arraybuffer" })).data;
        fs.writeFileSync(o, Buffer.from(m, "utf-8"));
        s.push(o);
        l.push(fs.createReadStream(o));
      }
    }

    switch (handleReply.type) {
      case "reply": {
        var idad = global.config.ADMINBOT && global.config.NDH;
        if (s.length == 0) {
          for (let ad of idad) {
            api.sendMessage({
              body: `[📲] - ${name} se jawab:\n[💬] - Message: ${(event.body) || "sirf file hai, koi message nahi"}`, mentions: [{
                id: event.senderID,
                tag: name
              }]
            }, ad, (e, data) => global.client.handleReply.push({
              name: this.config.name,
              messageID: data.messageID,
              messID: event.messageID,
              author: event.senderID,
              id: event.threadID,
              type: "calladmin"
            }));
          }
        } else {
          for (let ad of idad) {
            api.sendMessage({
              body: `[📲] - ${name} se jawab:\n[💬] - Message: ${(event.body) || "sirf file hai, koi message nahi"}`, attachment: l, mentions: [{
                id: event.senderID,
                tag: name
              }]
            }, ad, (e, data) => global.client.handleReply.push({
              name: this.config.name,
              messageID: data.messageID,
              messID: event.messageID,
              author: event.senderID,
              id: event.threadID,
              type: "calladmin"
            }));
            for (var b of s) {
              fs.unlinkSync(b);
            }
          }
        }
        break;
      }
      case "calladmin": {
        if (s.length == 0) {
          api.sendMessage({ 
            body: `[📌] - Admin ${name} ka jawab aapke liye:\n\n[💬] - Message: ${(event.body) || "sirf file hai, koi message nahi"}\n[💌] - Admin ke bheje files\n\n» Is message ko reply karke admin ko report bhej sakte ho`, 
            mentions: [{ tag: name, id: event.senderID }] 
          }, handleReply.id, (e, data) => global.client.handleReply.push({
            name: this.config.name,
            author: event.senderID,
            messageID: data.messageID,
            type: "reply"
          }), handleReply.messID);
        } else {
          api.sendMessage({ 
            body: `[📌] - Admin ${name} ka jawab aapke liye:\n\n[💬] - Message: ${(event.body) || "sirf file hai, koi message nahi"}\n[💌] - Admin ke bheje files\n\n» Is message ko reply karke admin ko report bhej sakte ho`, 
            attachment: l, mentions: [{ tag: name, id: event.senderID }] 
          }, handleReply.id, (e, data) => global.client.handleReply.push({
            name: this.config.name,
            author: event.senderID,
            messageID: data.messageID,
            type: "reply"
          }), handleReply.messID);
          for (var b of s) {
            fs.unlinkSync(b);
          }
        }
        break;
      }
    }
  }
  catch (ex) {
    console.log(ex);
  }
};

// Main run function
module.exports.run = async function ({ api, event, Threads, args, Users }) {
  try {
    var s = [];
    var l = [];
    const fs = require('fs-extra');
    const { join } = require('path');
    const axios = require('axios');
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length || 20;

    // Reply ke attachments handle karo
    if (event.messageReply) {
      if (event.messageReply.attachments.length != 0) {
        for (var p of event.messageReply.attachments) {
          var result = '';
          for (var i = 0; i < charactersLength; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
          if (p.type == 'photo') {
            var e = 'jpg';
          }
          if (p.type == 'video') {
            var e = 'mp4';
          }
          if (p.type == 'audio') {
            var e = 'mp3';
          }
          if (p.type == 'animated_image') {
            var e = 'gif';
          }
          var o = join(__dirname, 'cache', `${result}.${e}`);
          let m = (await axios.get(encodeURI(p.url), { responseType: "arraybuffer" })).data;
          fs.writeFileSync(o, Buffer.from(m, "utf-8"));
          s.push(o);
          l.push(fs.createReadStream(o));
        }
      }
    }

    if (!args[0] && event.messageReply.attachments.length == 0)
      return api.sendMessage(`📋 Report ke liye kuch content daalo`, event.threadID, event.messageID);

    var name = (await Users.getData(event.senderID)).name;
    var idbox = event.threadID;

    var datathread = (await Threads.getData(event.threadID)).threadInfo;
    var namethread = datathread.threadName;
    var uid = event.senderID;

    const moment = require("moment-timezone");
    var gio = moment.tz("Asia/Kolkata").format("HH:mm:ss D/MM/YYYY");
    var sondh = global.config.NDH.length;
    var soad = global.config.ADMINBOT.length;

    api.sendMessage(`[👾] - ${soad} admin aur ${sondh} supporters ko message bhej diya gaya\n[⏰] - Samay: ${gio}`, event.threadID, () => {
      var idad = global.config.ADMINBOT && global.config.NDH;
      if (s.length == 0) {
        for (let ad of idad) {
          api.sendMessage({ 
            body: `📱=== [ ADMIN KO BULAO ] ===📱\n──────────────────\n👤 Report from: ${name}\n🔎 UID: ${uid}\n👨‍👩‍👧‍👧 Group: ${namethread}\n🔰 TID: ${idbox}\n💬 Message: ${args.join(" ")}\n⏰ Samay: ${gio}`, 
            mentions: [{ id: event.senderID, tag: name }]
          }, ad, (error, info) => global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            messID: event.messageID,
            id: idbox,
            type: "calladmin"
          }));
        }
      } else {
        for (let ad of idad) {
          api.sendMessage({
            body: `📱=== [ ADMIN KO BULAO ] ===📱\n──────────────────\n👤 Report from: ${name}\n🔎 UID: ${uid}\n👨‍👩‍👧‍👧 Group: ${namethread}\n🔰 TID: ${idbox}\n\n💬 Message: ${(args.join(" ")) || "sirf file hai, koi report nahi ❤️"}\n⏰ Samay: ${gio}\n📌 File ke saath`, 
            attachment: l, mentions: [{ id: event.senderID, tag: name }]
          }, ad, (error, info) => global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            messID: event.messageID,
            id: idbox,
            type: "calladmin"
          }));
        }
        for (var b of s) {
          fs.unlinkSync(b);
        }
      }
    }, event.messageID);
  }
  catch (ex) {
    console.log(ex);
  }
};
