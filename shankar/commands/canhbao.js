const fs = require("fs-extra");

module.exports.config = {
  name: "canhbao",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Group mein users ko warn aur kick karo",
  commandCategory: "Group",
  usages: "[tarika]",
  cooldowns: 0
};

// Main run function
module.exports.run = async function ({ api, event, args, Users, permssion }) {
  let path = __dirname + "/data/canhbao.json";
  if (!fs.existsSync(__dirname + "/data")) fs.mkdirSync(__dirname + "/data");
  var data = {};
  try {
    data = JSON.parse(fs.readFileSync(path));
  } catch (err) {
    fs.writeFileSync(path, JSON.stringify(data));
  }

  // List command to show warnings
  if (args[0] == "list") {
    let threadID = event.threadID;
    let list = [];
    for (let id in data) {
      if (data[id].threadID == threadID) {
        let name = (await Users.getData(id)).name;
        let warns = data[id].warns;
        let reason = data[id].reason.join(", ");
        let time = data[id].time;
        let info = `👤 ${name} ne ${warns} baar rule toda\n📝 Wajah: ${reason}\n⏰ Samay: ${time}`;
        list.push(info);
      }
    }
    if (list.length == 0) return api.sendMessage("❎ Is group mein kisi ko warn nahi kiya gaya!", event.threadID, event.messageID);
    else {
      let msg = "Group ke warn list:\n\n";
      for (let i = 0; i < list.length; i++) {
        msg += `${i + 1}. ${list[i]}\n\n`;
      }
      return api.sendMessage(msg, event.threadID, event.messageID);
    }
  }
  // Reset command to clear warnings
  else if (args[0] == "reset") {
    if (permssion !== 2 && !global.config.ADMINBOT.includes(event.senderID)) 
      return api.sendMessage("⚠️ Is command ko use karne ke liye aapko admin permission chahiye", event.threadID, event.messageID);
    let threadID = event.threadID;
    if (args[1] == "all") {
      for (let id in data) {
        if (data[id].threadID == threadID) {
          data[id].warns = 0;
          delete data[id];
        }
      }
      fs.writeFileSync(path, JSON.stringify(data));
      return api.sendMessage("✅ Group ke sab members ke warn reset kar diye gaye!", event.threadID, event.messageID);
    } else {
      let mention = Object.keys(event.mentions)[0];
      if (!mention) {
        if (event.type != "message_reply") 
          return api.sendMessage("❎ Warn reset karne ke liye kisi user ko tag ya reply karo", event.threadID, event.messageID);
        else {
          mention = event.messageReply.senderID;
        }
      }
      let name = (await Users.getData(mention)).name;
      if (data[mention]) {
        data[mention].warns = 0;
        delete data[mention];
        fs.writeFileSync(path, JSON.stringify(data));
        return api.sendMessage(`✅ ${name} ke warn reset kar diye gaye`, event.threadID, event.messageID);
      } else {
        return api.sendMessage(`❎ ${name} ko abhi tak koi warn nahi mila!`, event.threadID, event.messageID);
      }
    }
  }
  // Warn command
  else {
    let mention = Object.keys(event.mentions)[0];
    let reason = args.slice(1).join(" ");
    if (!mention) {
      if (event.type != "message_reply") 
        return api.sendMessage("❎ Warn karne ke liye kisi user ko tag ya reply karo", event.threadID, event.messageID);
      else {
        mention = event.messageReply.senderID;
        reason = args.join(" ");
      }
    }
    let name = (await Users.getData(mention)).name;
    if (!data[mention]) data[mention] = { "warns": 0, "reason": [] };
    data[mention].warns++;
    data[mention].threadID = event.threadID;
    data[mention].reason.push(reason || "Koi wajah nahi");
    data[mention].time = `${new Date().toLocaleTimeString()} - ${new Date().toLocaleDateString()}`;
    fs.writeFileSync(path, JSON.stringify(data));
    let maxWarn = 3;
    if (data[mention].warns >= maxWarn) {
      api.removeUserFromGroup(mention, event.threadID);
      api.sendMessage(`✅ ${name} ko group se kick kar diya gaya kyunki woh ${maxWarn} baar warn ho chuka tha`, event.threadID, event.messageID);
      delete data[mention];
      fs.writeFileSync(path, JSON.stringify(data));
    } else {
      api.sendMessage(`⛔ ${name} ko ${data[mention].warns} baar warn kiya gaya, aur ${maxWarn - data[mention].warns} warn baki hain warna group se kick ho jayega!${reason ? `\n📝 Wajah: ${reason}` : ""}`, event.threadID, event.messageID);
    }
  }
};
