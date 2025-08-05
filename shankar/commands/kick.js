module.exports.config = {
  name: "kick",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Tag ya reply karke kisi vyakti ko samuh se hataayein",
  commandCategory: "Prashasak",
  usages: "[tag/reply/all]",
  cooldowns: 0
};

module.exports.run = async function ({
  args,
  api,
  event,
  Threads
}) {
  var {
    participantIDs
  } = (await Threads.getData(event.threadID)).threadInfo;
  const botID = api.getCurrentUserID();
  try {
    if (args.join().indexOf('@') !== -1) {
      var mention = Object.keys(event.mentions);
      for (let o in mention) {
        setTimeout(() => {
          return api.removeUserFromGroup(mention[o], event.threadID, async function (err) {
            if (err) return api.sendMessage("Kick karne ke liye bot ko prashasak adhikar chahiye", event.threadID, event.messageID);
            return;
          });
        }, 1000);
      }
    } else {
      if (event.type == "message_reply") {
        uid = event.messageReply.senderID;
        return api.removeUserFromGroup(event.messageReply.senderID, event.threadID, async function (err) {
          if (err) return api.sendMessage("Kick karne ke liye bot ko prashasak adhikar chahiye", event.threadID, event.messageID);
          return;
        });
      } else {
        if (!args[0]) return api.sendMessage(`Kripaya us vyakti ko tag ya reply karein jisko kick karna hai`, event.threadID, event.messageID);
        else {
          if (args[0] == "all") {
            const listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
            //let adminBot = global.config.ADMINBOT;
            //let idAD = '100015647791389';
            //for (var id of mention) {
            //  if (id == api.getCurrentUserID()) return api.sendMessage("Tum kya chahte ho? :/", threadID, messageID);
            //  if (id == idAD) return api.sendMessage(`Jaante ho Hoàng Đỗ Gia Nguyên kaun hai? Láo lol hain kya? Boss usko thappad maar do`, threadID, messageID);
            //  if (threadInfo.adminIDs.some(item => item.id == id)) return api.sendMessage("Prashasak ko samuh se nahi hata sakte.", threadID, messageID);
            //  if (adminBot.includes(id)) return api.sendMessage("Bot ke prashasak ko samuh se nahi hata sakte", threadID, messageID);
            for (let idUser in listUserID) {
              setTimeout(() => {
                return api.removeUserFromGroup(idUser, event.threadID);
              }, 1000);
            }
          }
        }
      }
    }
  } catch {
    return api.sendMessage('Kuch galat hua hai', event.threadID, event.messageID);
  }
};
