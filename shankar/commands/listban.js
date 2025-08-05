module.exports.config = {
  name: "listban",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Samuh ya user ki ban list dekhein",
  commandCategory: "Prashasak",
  usages: "[thread/user]",
  cooldowns: 5,
  images: [],
};

module.exports.handleReply = async function ({ api, Users, Threads, handleReply, event }) {
  const { threadID, messageID, body, senderID } = event;
  if (parseInt(senderID) !== parseInt(handleReply.author)) return;

  const indicesToUnban = body.split(" ").map(n => parseInt(n) - 1);
  const itemsToUnban = indicesToUnban.map(idx => handleReply.listBanned[idx]).filter(Boolean);

  if (itemsToUnban.length === 0) {
    return api.sendMessage("Unban ke liye koi sahi entry nahi mili. Kripaya sankhya dubara check karein.", threadID);
  }

  for (let item of itemsToUnban) {
    const uidMatch = item.match(/UID: (\d+)/);
    const tidMatch = item.match(/TID: (\d+)/);
    const id = uidMatch ? uidMatch[1] : tidMatch ? tidMatch[1] : null;

    if (!id) continue;

    let data;
    if (handleReply.type === "unbanthread") {
      data = (await Threads.getData(id)).data || {};
      data.banned = 0;
      data.reason = null;
      data.dateAdded = null;
      await Threads.setData(id, { data });
      global.data.threadBanned.delete(id);
    } else {
      data = (await Users.getData(id)).data || {};
      data.banned = 0;
      data.reason = null;
      data.dateAdded = null;
      await Users.setData(id, { data });
      global.data.userBanned.delete(id);
    }
  }

  const messageContent = itemsToUnban.map((item, idx) => `${idx + 1}. ${item}`).join("\n");
  api.sendMessage(`📌 Unban ka amal [sahi/galat]\n──────────────────\n\n${messageContent}`, threadID, () => {
    api.unsendMessage(messageID);
  });
};

module.exports.run = async function ({ event, api, Users, args, Threads }) {
  const { threadID, messageID } = event;
  const queryType = args[0]?.toLowerCase();

  if (["thread", "t", "-t"].includes(queryType)) {
    const threadBanned = Array.from(global.data.threadBanned.keys());
    const listBanned = await Promise.all(threadBanned.map(async (id, idx) => {
      const name = global.data.threadInfo.get(id)?.threadName || "Naam maujud nahi";
      const reason = global.data.threadBanned.get(id)?.reason || "Pata nahi";
      const date = global.data.threadBanned.get(id)?.dateAdded || "Pata nahi";
      return `${idx + 1}. ${name}\n🔰 TID: ${id}\n📋 Karan: ${reason}\n⏰ Ban ka samay: ${date}`;
    }));

    if (listBanned.length === 0) {
      return api.sendMessage("Koi samuh ban nahi hai 😻", threadID, messageID);
    }

    api.sendMessage(
      `=== [ SAMUH BAN LIST ] ===\n──────────────────\n📝 Is samay ${listBanned.length} samuh ban hain\n\n${listBanned.join("\n\n")}\n\n📌 Is sandesh ka jawab dein + sankhya, ek se zyada sankhya daal sakte hain, darmiyan mein space dekar, agar aap samuh unban karna chahte hain`,
      threadID,
      (error, info) => {
        if (error) return console.error(error);
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: 'unbanthread',
          listBanned: listBanned.map(item => item.match(/🔰 TID: (\d+)/)?.[0].trim())
        });
      }
    );
  } else if (["user", "u", "-u"].includes(queryType)) {
    const userBanned = Array.from(global.data.userBanned.keys());
    const listBanned = await Promise.all(userBanned.map(async (id, idx) => {
      const name = global.data.userName.get(id) || await Users.getNameUser(id);
      const reason = global.data.userBanned.get(id)?.reason || "Pata nahi";
      const date = global.data.userBanned.get(id)?.dateAdded || "Pata nahi";
      return `${idx + 1}. ${name}\n🔰 UID: ${id}\n📋 Karan: ${reason}\n⏰ Ban ka samay: ${date}`;
    }));

    if (listBanned.length === 0) {
      return api.sendMessage("Koi user ban nahi hai 😻", threadID, messageID);
    }

    api.sendMessage(
      `=== [ USER BAN LIST ] ===\n──────────────────\n📝 Is samay ${listBanned.length} users ban hain\n\n${listBanned.join("\n\n")}\n\n📌 Is sandesh ka jawab dein + sankhya, ek se zyada sankhya daal sakte hain, darmiyan mein space dekar, agar aap user unban karna chahte hain`,
      threadID,
      (error, info) => {
        if (error) return console.error(error);
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: 'unbanuser',
          listBanned: listBanned.map(item => item.match(/🔰 UID: (\d+)/)?.[0].trim())
        });
      }
    );
  } else {
    global.utils.throwError(this.config.name, threadID, messageID);
  }
};
