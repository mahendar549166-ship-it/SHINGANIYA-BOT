module.exports.config = {
  name: "setmoney",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "User ki jankari ko adjust kare",
  commandCategory: "Admin",
  usages: "[add/set/clean/reset] [Rupaye] [User ko tag kare]",
  cooldowns: 5
};

module.exports.run = async function({ event, api, Currencies, args }) {
  const { threadID, messageID, senderID } = event;
  const { throwError } = global.utils;
  const mentionID = Object.keys(event.mentions);
  const money = String(args[1]);

  var message = [];
  var error = [];
  try {
    switch (args[0]) {
      case "add": {
        if (mentionID.length != 0) {
          for (singleID of mentionID) {
            if (!money || isNaN(money)) return api.sendMessage('❎ Rupaye ek number hona chahiye', threadID, messageID);
            try {
              await Currencies.increaseMoney(singleID, money);
              message.push(singleID);
            } catch (e) { error.push(e);
              console.log(e) };
          }
          return api.sendMessage(`✅ ${formatNumber(money)} rupaye ${message.length} logon ke liye jod diye`, threadID, function() { if (error.length != 0) return api.sendMessage(`❎ ${error.length} logon ke liye rupaye nahi jod sake`, threadID) }, messageID);
        } else {
          if (!money || isNaN(money)) return api.sendMessage('❎ Rupaye ek number hona chahiye', threadID, messageID);
          try {
            var uid = event.senderID;
            if (event.type == "message_reply") {
              uid = event.messageReply.senderID
            } else if (args.length === 3) {
              uid = args[2]
            }
            console.log(args)
            await Currencies.increaseMoney(uid, String(money));
            message.push(uid);
          } catch (e) { error.push(e) };
          return api.sendMessage(`✅ ${formatNumber(money)} rupaye ${uid !== senderID ? '1 vyakti' : 'apne aap'} ke liye jod diye`, threadID, function() { if (error.length != 0) return api.sendMessage(`❎ ${uid !== senderID ? '1 vyakti' : 'apne aap'} ke liye rupaye nahi jod sake`, threadID) }, messageID);
        }
      }
      case 'all':
      {
        const allUserID = event.participantIDs;
        const mon = money
        console.log(allUserID)
        for (const singleUser of allUserID) {
          await Currencies.increaseMoney(singleUser, String(mon));
        }
        api.sendMessage(`✅ Sabhi sadasyon ke liye ${args[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} safalta se set kiya`, event.threadID)
      }
      break;
      case "set": {
        if (mentionID.length != 0) {
          for (singleID of mentionID) {
            if (!money || isNaN(money)) return throwError(this.config.name, threadID, messageID);
            try {
              await Currencies.setData(singleID, { money });
              message.push(singleID);
            } catch (e) { error.push(e) };
          }
          return api.sendMessage(`✅ ${formatNumber(money)} rupaye ${message.length} logon ke liye safalta se set kiye`, threadID, function() { if (error.length != 0) return api.sendMessage(`❎ ${error.length} logon ke liye rupaye set nahi kar sake`, threadID) }, messageID);
        } else {
          if (!money || isNaN(money)) return throwError(this.config.name, threadID, messageID);
          try {
            var uid = event.senderID;
            if (event.type == "message_reply") {
              uid = event.messageReply.senderID
            }
            await Currencies.setData(uid, { money });
            message.push(uid);
          } catch (e) { error.push(e) };
          return api.sendMessage(`✅ ${formatNumber(money)} rupaye ${uid !== senderID ? '1 vyakti' : 'apne aap'} ke liye safalta se set kiye`, threadID, function() { if (error.length != 0) return api.sendMessage(`❎ ${uid !== senderID ? '1 vyakti' : 'apne aap'} ke liye rupaye set nahi kar sake`, threadID) }, messageID);
        }
      }

      case "clean": {
        if (args[1] === 'all') {
          const data = event.participantIDs;
          for (const userID of data) {
            const datas = (await Currencies.getData(userID)).data
            if (datas !== undefined) {
              datas.money = '0'
              await Currencies.setData(userID, datas);
            }
          }
          return api.sendMessage("✅ Group ke sabhi rupaye safalta se hata diye", event.threadID);
        }
        if (mentionID.length != 0) {
          for (singleID of mentionID) {
            try {
              await Currencies.setData(singleID, { money: 0 });
              message.push(singleID);
            } catch (e) { error.push(e) };
          }
          return api.sendMessage(`✅ ${message.length} logon ke sabhi rupaye safalta se hata diye`, threadID, function() { if (error.length != 0) return api.sendMessage(`❎ ${error.length} logon ke sabhi rupaye nahi hata sake`, threadID) }, messageID);
        } else {
          try {
            var uid = event.senderID;
            if (event.type == "message_reply") {
              uid = event.messageReply.senderID
            }
            await Currencies.setData(uid, { money: 0 });
            message.push(uid);
          } catch (e) { error.push(e) };
          return api.sendMessage(`✅ ${uid !== senderID ? '1 vyakti' : 'apne aap'} ke rupaye safalta se hata diye`, threadID, function() { if (error.length != 0) return api.sendMessage(`❎ ${uid !== senderID ? '1 vyakti' : 'apne aap'} ke rupaye nahi hata sake`, threadID) }, messageID);
        }
      }

      case "reset": {
        const allUserData = await Currencies.getAll(['userID']);
        for (const userData of allUserData) {
            const userID = userData.userID;
            try {
                await Currencies.setData(userID, { money: 0 });
                message.push(userID);
            } catch (e) { error.push(e) };
        }
        return api.sendMessage(`✅ ${message.length} logon ka rupaye data safalta se hata diya`, threadID, function () { if (error.length != 0) return api.sendMessage(`❎ ${error.length} logon ka rupaye data nahi hata sake`, threadID) }, messageID);
        for (singleID of mentionID) {
            try {
                await Currencies.setData(singleID, { money: 0 });
                message.push(singleID);
            } catch (e) { error.push(e) };
        }
        return api.sendMessage(`✅ ${message.length} logon ka rupaye data safalta se hata diya`, threadID, function () { if (error.length != 0) return api.sendMessage(`❎ ${error.length} logon ka rupaye data nahi hata sake`, threadID) }, messageID);
}

      default: {
        return global.utils.throwError(this.config.name, threadID, messageID);
      }
    }
  } catch (e) {
    console.log(e)
  }
}

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
