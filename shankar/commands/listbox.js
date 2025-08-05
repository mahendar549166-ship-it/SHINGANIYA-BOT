module.exports.config = {
  name: "listbox",
  version: "1.0.0",
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  hasPermssion: 2,
  description: "[Ban/Unban/Remove] Bot ne jin samuhon mein shamil hua hai unki list",
  commandCategory: "Pranali",
  usages: "[page number/all]",
  cooldowns: 5
};

module.exports.handleReply = async function ({ api, event, args, Threads, handleReply }) {
  const { threadID, messageID } = event;
  if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Kolkata").format("HH:MM:ss L");
  var arg = event.body.split(" ");
  switch (handleReply.type) {
    case "reply": {
      if (arg[0] == "ban" || arg[0] == "Ban") {
        var arrnum = event.body.split(" ");
        var msg = "";
        var shankar = "[ MODE ] - Ban Amal Mein «\n";
        var nums = arrnum.map(n => parseInt(n));
        nums.shift();
        for (let num of nums) {
          var idgr = handleReply.groupid[num - 1];
          var groupName = handleReply.groupName[num - 1];

          const data = (await Threads.getData(idgr)).data || {};
          data.banned = true;
          data.dateAdded = time;
          var typef = await Threads.setData(idgr, { data });
          global.data.threadBanned.set(idgr, { dateAdded: data.dateAdded });
          msg += typef + ' ' + groupName + '\nTID: ' + idgr + "\n";
          console.log(shankar, msg);
        }
        api.sendMessage(``, idgr, () =>
          api.sendMessage(`${global.data.botID}`, () =>
            api.sendMessage(`[ MODE ] - Ban Amal Mein «\n(sahi/galat) «\n\n${msg}`, threadID, () =>
              api.unsendMessage(handleReply.messageID))));
        break;
      }

      if (arg[0] == "unban" || arg[0] == "Unban" || arg[0] == "ub" || arg[0] == "Ub") {
        var arrnum = event.body.split(" ");
        var msg = "";
        var shankar = "[ MODE ] - Unban Amal Mein\n";
        var nums = arrnum.map(n => parseInt(n));
        nums.shift();
        for (let num of nums) {
          var idgr = handleReply.groupid[num - 1];
          var groupName = handleReply.groupName[num - 1];

          const data = (await Threads.getData(idgr)).data || {};
          data.banned = false;
          data.dateAdded = null;
          var typef = await Threads.setData(idgr, { data });
          global.data.threadBanned.delete(idgr, 1);
          msg += typef + ' ' + groupName + '\nTID: ' + idgr + "\n";
          console.log(shankar, msg);
        }
        api.sendMessage(``, idgr, () =>
          api.sendMessage(`${global.data.botID}`, () =>
            api.sendMessage(`[ MODE ] - Unban Amal Mein «(sahi/galat)\n\n${msg}`, threadID, () =>
              api.unsendMessage(handleReply.messageID))));
        break;
      }

      if (arg[0] == "out" || arg[0] == "Out") {
        var arrnum = event.body.split(" ");
        var msg = "";
        var shankar = "[ MODE ] - Out Amal Mein\n";
        var nums = arrnum.map(n => parseInt(n));
        nums.shift();
        for (let num of nums) {
          var idgr = handleReply.groupid[num - 1];
          var groupName = handleReply.groupName[num - 1];
          var typef = api.removeUserFromGroup(`${api.getCurrentUserID()}`, idgr);
          msg += typef + ' ' + groupName + '\nTID: ' + idgr + "\n";
          console.log(shankar, msg);
        }
        api.sendMessage(``, idgr, () =>
          api.sendMessage(`${global.data.botID}`, () =>
            api.sendMessage(`[ MODE ] - Out Amal Mein\n(sahi/galat)\n\n${msg}`, threadID, () =>
              api.unsendMessage(handleReply.messageID))));
        break;
      }
    }
  }
};

module.exports.run = async function ({ api, event, args }) {
  const permission = global.config.ADMINBOT;
  if (!permission.includes(event.senderID)) return api.sendMessage("Bahar jao :))", event.threadID, event.messageID);
  switch (args[0]) {
    case "all": {
      var inbox = await api.getThreadList(100, null, ['INBOX']);
      let list = [...inbox].filter(group => group.isSubscribed && group.isGroup);
      var listthread = [];
      var listbox = [];
      for (var groupInfo of list) {
        listthread.push({
          id: groupInfo.threadID,
          name: groupInfo.name || "Naam Nahi Rakha",
          participants: groupInfo.participants.length
        });
      }
      var listbox = listthread.sort((a, b) => {
        if (a.participants > b.participants) return -1;
        if (a.participants < b.participants) return 1;
      });
      var groupid = [];
      var groupName = [];
      var page = 1;
      page = parseInt(args[0]) || 1;
      page < -1 ? page = 1 : "";
      var limit = 100000;
      var msg = "====『 SAMUH KI LIST 』====\n━━━━━━━━━━━━━━━━━━\n\n";
      var numPage = Math.ceil(listbox.length / limit);

      for (var i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
        if (i >= listbox.length) break;
        let group = listbox[i];
        msg += `━━━━━━━━━━━━━━━━━━\n${i + 1}. ${group.name}\n💌 TID: ${group.id}\n👤 Sadasya Sankhya: ${group.participants}\n\n`;
        groupid.push(group.id);
        groupName.push(group.name);
      }
      msg += `\nPage ${page}/${numPage}\n${global.config.PREFIX}listbox + page number/all ka upyog karein\n\n`;

      api.sendMessage(msg + "━━━━━━━━━━━━━━━━━━\n→ Out, Ban, Unban + sankhya ka jawab dein, \n→ Ek se zyada sankhya daal sakte hain, darmiyan mein space dekar, samuh ko Out, Ban, ya Unban karne ke liye 🌹", event.threadID, (e, data) =>
        global.client.handleReply.push({
          name: this.config.name,
          author: event.senderID,
          messageID: data.messageID,
          groupid,
          groupName,
          type: 'reply'
        })
      );
      break;
    }

    default:
      try {
        var inbox = await api.getThreadList(100, null, ['INBOX']);
        let list = [...inbox].filter(group => group.isSubscribed && group.isGroup);
        var listthread = [];
        var listbox = [];
        for (var groupInfo of list) {
          listthread.push({
            id: groupInfo.threadID,
            name: groupInfo.name || "Naam Nahi Rakha",
            messageCount: groupInfo.messageCount,
            participants: groupInfo.participants.length
          });
        }
        var listbox = listthread.sort((a, b) => {
          if (a.participants > b.participants) return -1;
          if (a.participants < b.participants) return 1;
        });
        var groupid = [];
        var groupName = [];
        var page = 1;
        page = parseInt(args[0]) || 1;
        page < -1 ? page = 1 : "";
        var limit = 100;
        var msg = "=====『 SAMUH KI LIST 』=====\n\n";
        var numPage = Math.ceil(listbox.length / limit);

        for (var i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
          if (i >= listbox.length) break;
          let group = listbox[i];
          msg += `━━━━━━━━━━━━━━━━━━\n${i + 1}. ${group.name}\n[🔰] → TID: ${group.id}\n[👤] → Sadasya Sankhya: ${group.participants}\n[💬] → Kul Sandesh: ${group.messageCount}\n`;
          groupid.push(group.id);
          groupName.push(group.name);
        }
        msg += `\n→ Page ${page}/${numPage}\n${global.config.PREFIX}listbox + page number/all ka upyog karein\n`;

        api.sendMessage(msg + "━━━━━━━━━━━━━━━━━━\n→ Out, Ban, Unban + sankhya ka jawab dein, \n→ Ek se zyada sankhya daal sakte hain, darmiyan mein space dekar, samuh ko Out, Ban, ya Unban karne ke liye 🌹", event.threadID, (e, data) =>
          global.client.handleReply.push({
            name: this.config.name,
            author: event.senderID,
            messageID: data.messageID,
            groupid,
            groupName,
            type: 'reply'
          })
        );
      } catch (e) {
        return console.log(e);
      }
  }
};
