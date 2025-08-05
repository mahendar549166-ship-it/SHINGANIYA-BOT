module.exports.config = {
  name: "thread",
  version: "1.0.5",
  hasPermssion: 2,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Samooh ko ban ya unban karein",
  commandCategory: "Admin",
  usages: "[unban/ban/search] [ID ya text] | [-b/-ub/-bc/-ubc/-s/-l/-i]",
  cooldowns: 5,
  dependencies: {
    "moment-timezone": ""
  }
};

module.exports.languages = {
  "vi": {
    "reason": "Karan",
    "at": "par",
    "allCommand": "sabhi commands",
    "commandList": "commands",
    "banSuccess": "[ Ban Samooh ] ID %1 wale samooh ke liye ban anurodh safal",
    "unbanSuccess": "[ Unban Samooh ] ID %1 wale samooh ke liye unban anurodh safal",
    "banCommandSuccess": "[ BanCommand Samooh ] ID %1 wale samooh ke liye command ban anurodh safal",
    "unbanCommandSuccess": "[ UnbanCommand Samooh ] ID %2 wale samooh ke liye %1 ka unban safal",
    "errorReponse": "%1 ID %2 wale samooh ke liye aapka anurodh pura nahi ho saka",
    "IDNotFound": "%1 Aapka diya hua ID database mein nahi hai",
    "existBan": "[ Ban Samooh ] ID %1 pehle se ban hai %2 %3",
    "notExistBan": "[ Unban Samooh ] Aapka diya hua ID bot ke istemal se ban nahi hai",
    "missingCommandInput": "%1 Ban karne wala command khali nahi hona chahiye!",
    "notExistBanCommand": "[ UnbanCommand Samooh ] Aapka diya hua samooh ID pehle se command ban nahi hai",

    "returnBan": "[ Ban Samooh ] Aap samooh ban karne ka anurodh kar rahe hain:\n- Ban karne wala samooh ID: %1%2\n\n❮ Is sandesh par reaction karke satyapan karein ❯",
    "returnUnban": "[ Unban Samooh ] Aap samooh unban karne ka anurodh kar rahe hain:\n- Unban karne wala samooh ID: %1\n\n❮ Is sandesh par reaction karke satyapan karein ❯",
    "returnBanCommand": "[ BanCommand Samooh ] Aap samooh ke liye command ban karne ka anurodh kar rahe hain:\n- Ban karne wala samooh ID: %1\n- Ban karne wale commands: %2\n\n❮ Is sandesh par reaction karke satyapan karein ❯",
    "returnUnbanCommand": "[ UnbanCommand Samooh ] Aap samooh ke liye command unban karne ka anurodh kar rahe hain:\n- Unban karne wala samooh ID: %1\n- Unban karne wale commands: %2\n\n❮ Is sandesh par reaction karke satyapan karein ❯",
  
    "returnResult": "Yeh aapke khoj ke anusaar parinaam hain: \n",
    "returnNull": "Aapki khoj ke aadhar par koi parinaam nahi mila!",
    "returnList": "[ Samooh Suchi ]\nVartaman mein %1 samooh ban hain, niche %2 samooh hain\n\n%3",
    "returnInfo": "[ Samooh Jankari ] Yeh aapke khoje hue samooh ki kuch jankari hai:\n- Samooh ka ID: %1\n- Ban hai?: %2 %3 %4\n- Command ban hai?: %5"
  },
  "en": {
    "reason": "Reason",
    "at": "At",
    "allCommand": "All commands",
    "commandList": "Commands",
    "banSuccess": "[ Ban Thread ] Banned thread has ID %1",
    "unbanSuccess": "[ Unban Thread ] Unbanned thread has ID %1",
    "banCommandSuccess": "[ banCommand Thread ] Banned command with thread has ID %1",
    "unbanCommandSuccess": "[ unbanCommand Thread ] Unbanned %1 with thread has ID %2",
    "errorReponse": "%1 Can't do what you request with thread has ID %2",
    "IDNotFound": "%1 ID you import doesn't exist in database",
    "existBan": "[ Ban Thread ] ID %1 has been banned before %2 %3",
    "notExistBan": "[ Unban Thread ] ID you import hasn't been banned before bot",
    "missingCommandInput": "%1 You have to import the command you want to ban!",
    "notExistBanCommand": "[ UnbanCommand Thread ] The thread ID you import hasn't been banned before",

    "returnBan": "[ Ban Thread ] You are requesting to ban thread:\n- Thread ID: %1%2\n\n❮ Reaction this message to complete ❯",
    "returnUnban": "[ Unban Thread ] You are requesting to unban thread:\n- Thread ID: %1\n\n❮ Reaction this message to complete ❯",
    "returnBanCommand": "[ banCommand Thread ] You are requesting to ban command with thread:\n - Thread ID: %1\n- Commands: %2\n\n❮ Reaction this message to complete ❯",
    "returnUnbanCommand": "[ unbanCommand Thread ] You are requesting to unban command with thread:\n - Thread ID: %1\n- Commands: %2\n\n❮ Reaction this message to complete ❯",
  
    "returnResult": "This is your result: \n",
    "returnNull": "There is no result with your input!",
    "returnList": "[ Thread List ]\There are %1 banned thread, here are %2\n\n%3",
    "returnInfo": "[ Info Thread ] Here are some information about your thread which you want to search:\n- Thread ID: %1n- Banned?: %2 %3 %4\n- Command banned?: %5"
  }
};

module.exports.handleReaction = async ({ event, api, Threads, handleReaction, getText }) => {
  if (parseInt(event.userID) !== parseInt(handleReaction.author)) return;
  const moment = require("moment-timezone");
  const { threadID } = event;
  const { messageID, type, targetID, reason, commandNeedBan } = handleReaction;
  
  const time = moment.tz("Asia/Kolkata").format("HH:mm:ss DD/MM/YYYY");
  global.client.handleReaction.splice(global.client.handleReaction.findIndex(item => item.messageID == messageID), 1);

  switch (type) {
    case "ban": {
      try {
        let data = (await Threads.getData(targetID)).data || {};
        data.banned = true;
        data.reason = reason || null;
        data.dateAdded = time;
        await Threads.setData(targetID, { data });
        global.data.threadBanned.set(targetID, { reason: data.reason, dateAdded: data.dateAdded });
        return api.sendMessage(getText("banSuccess", targetID), threadID, () => {
          return api.unsendMessage(messageID);
        });
      } catch { return api.sendMessage(getText("errorReponse", "[ Ban Samooh ]", targetID), threadID) };
    }

    case "unban": {
      try {
        let data = (await Threads.getData(targetID)).data || {};
        data.banned = false;
        data.reason = null;
        data.dateAdded = null;
        await Threads.setData(targetID, { data });
        global.data.threadBanned.delete(targetID);
        return api.sendMessage(getText("unbanSuccess", targetID), threadID, () => {
          return api.unsendMessage(messageID);
        });
      } catch { return api.sendMessage(getText("errorReponse", "[ Unban Samooh ]", targetID), threadID) };
    }

    case "banCommand": {
      try {  
        let data = (await Threads.getData(targetID)).data || {};
        data.commandBanned = [...data.commandBanned || [], ...commandNeedBan];
        await Threads.setData(targetID, { data });
        global.data.commandBanned.set(targetID, data.commandBanned);
        return api.sendMessage(getText("banCommandSuccess", targetID), threadID, () => {
          return api.unsendMessage(messageID);
        });
      } catch (e) { return api.sendMessage(getText("errorReponse", "[ BanCommand Samooh ]", targetID), threadID) };
    }
    
    case "unbanCommand": {
      try {
        let data = (await Threads.getData(targetID)).data || {};
        data.commandBanned = [...data.commandBanned.filter(item => !commandNeedBan.includes(item))];
        await Threads.setData(targetID, { data });
        global.data.commandBanned.set(targetID, data.commandBanned);
        if (data.commandBanned.length == 0) global.data.commandBanned.delete(targetID);
        return api.sendMessage(getText("unbanCommandSuccess", ((data.commandBanned.length == 0) ? getText("allCommand") : `${getText("commandList")}: ${commandNeedBan.join(", ")}`), targetID), threadID, () => {
          return api.unsendMessage(messageID);
        });
      } catch (e) { return api.sendMessage(getText("errorReponse", "[ UnbanCommand Samooh ]", targetID), threadID) };
    }
    default:
      break;
  }
};

module.exports.run = async ({ event, api, args, Threads, getText }) => { 
  const { threadID, messageID } = event;
  var targetID = String(args[1]);
  var reason = (args.slice(2, args.length)).join(" ") || null;

  if (isNaN(targetID)) {
    targetID = String(event.threadID);
    reason = (args.slice(1, args.length)).join(" ") || null;
  }

  switch (args[0]) {
    case "ban":
    case "-b": {
      if (!global.data.allThreadID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ Ban Samooh ]"), threadID, messageID);
      if (global.data.threadBanned.has(targetID)) {
        const { reason, dateAdded } = global.data.threadBanned.get(targetID) || {};
        return api.sendMessage(getText("existBan", targetID, ((reason) ? `${getText("reason")}: "${reason}"` : ""), ((dateAdded) ? `${getText("at")}: ${dateAdded}` : "")), threadID, messageID);
      }
      return api.sendMessage(getText("returnBan", targetID, ((reason) ? `\n- ${getText("reason")}: ${reason}` : "")), threadID, (error, info) => {
        global.client.handleReaction.push({
          type: "ban",
          targetID,
          reason,
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
        });
      }, messageID);
    }

    case "unban":
    case "-ub": {
      if (!global.data.allThreadID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ Unban Samooh ]"), threadID, messageID);
      if (!global.data.threadBanned.has(targetID)) return api.sendMessage(getText("notExistBan"), threadID, messageID);
      return api.sendMessage(getText("returnUnban", targetID), threadID, (error, info) => {
        global.client.handleReaction.push({
          type: "unban",
          targetID,
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
        });
      }, messageID);
    }

    case "banCommand":
    case "-bc": {
      if (!global.data.allThreadID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ BanCommand Samooh ]"), threadID, messageID);
      if (reason == null || reason.length == 0) return api.sendMessage(getText("missingCommandInput", '[ BanCommand Samooh ]'), threadID, messageID);
      if (reason == "all") {
        var allCommandName = [];
        const commandValues = global.client.commands.keys();
        for (const cmd of commandValues) allCommandName.push(cmd);
        reason = allCommandName.join(" ");
      }
      const commandNeedBan = reason.split(" ");
      return api.sendMessage(getText("returnBanCommand", targetID, ((commandNeedBan.length == global.client.commands.size) ? getText("allCommand") : commandNeedBan.join(", "))), threadID, (error, info) => {
        global.client.handleReaction.push({
          type: "banCommand",
          targetID,
          commandNeedBan,
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
        });
      }, messageID);
    }

    case "unbanCommand":
    case "-ubc": {
      if (!global.data.allThreadID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ UnbanCommand Samooh ]"), threadID, messageID);
      if (!global.data.commandBanned.has(targetID)) return api.sendMessage(getText("notExistBanCommand"), threadID, messageID);
      if (reason == null || reason.length == 0) return api.sendMessage(getText("missingCommandInput", "[ UnbanCommand Samooh ]"), threadID, messageID);
      if (reason == "all") {
        reason = (global.data.commandBanned.get(targetID)).join(" ");
      }
      const commandNeedBan = reason.split(" ");
      return api.sendMessage(getText("returnUnbanCommand", targetID, ((commandNeedBan.length == global.data.commandBanned.get(targetID).length) ? "sabhi commands" : commandNeedBan.join(", "))), threadID, (error, info) => {
        global.client.handleReaction.push({
          type: "unbanCommand",
          targetID,
          commandNeedBan,
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
        });
      }, messageID);
    }

    case "search":
    case "-s": {
      const contentJoin = reason || "";
      const getThreads = (await Threads.getAll(['threadID', 'threadInfo'])).filter(item => !!item.threadInfo);
      var matchThreads = [], a = '', b = 0;
      getThreads.forEach(i => {
        if ((i.threadInfo.threadName || "").toLowerCase().includes(contentJoin.toLowerCase())) {
          matchThreads.push({
            name: i.threadInfo.threadName,
            id: i.threadID
          });
        }
      });
      matchThreads.forEach(i => a += `\n${b += 1}. ${i.name} - ${i.id}`);
      (matchThreads.length > 0) ? api.sendMessage(getText("returnResult", a), threadID) : api.sendMessage(getText("returnNull"), threadID, messageID);
      break;
    }

    case "list":
    case "-l": {
      var listBan = [], i = 0;
      const threadData = global.data.threadBanned.keys();
      for (; ;) {
        if (i > global.data.threadBanned.size) break;
        let idThread = String(threadData.next().value);
        if (typeof idThread == "undefined") {
          const nameThread = (await Threads.getData(idThread)).threadInfo.threadName || "unknown";
          listBan.push(`${i+=1}/ ${idThread} - ${nameThread}`);
        }
        if (i == global.data.threadBanned.size || i == (parseInt(reason) || 10)) break;
      }
      return api.sendMessage(getText("returnList", (global.data.threadBanned.size || 0), listBan.length, listBan.join("\n")), threadID, messageID);
    }

    case "info":
    case "-i": {
      if (!global.data.allThreadID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ Samooh Jankari ]"), threadID, messageID);
      if (global.data.commandBanned.has(targetID)) { var commandBanned = global.data.commandBanned.get(targetID) || [] };
      if (global.data.threadBanned.has(targetID)) { var { reason, dateAdded } = global.data.threadBanned.get(targetID) || {} };
      return api.sendMessage(getText("returnInfo", targetID, ((!dateAdded) ? "HAAN" : "NAHI"), ((reason) ? `${getText("reason")}: "${reason}"` : ""), ((dateAdded) ? `${getText("at")}: ${dateAdded}` : ""), ((commandBanned) ? `HAAN: ${commandBanned.join(", ")}` : "NAHI")), threadID, messageID);
    }
  }
};
