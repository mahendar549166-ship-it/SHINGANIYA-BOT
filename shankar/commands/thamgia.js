module.exports.config = {
  name: "thamgia",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Bot ke samooh mein shamil hona",
  commandCategory: "Admin",
  usages: "buh",
  cooldowns: 0,
  images: [],
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.handleReply = async ({ event, api, handleReply }) => {
  const { threadID, messageID, body, senderID } = event;
  const { threadList, author } = handleReply;

  if (senderID !== author) return;

  api.unsendMessage(handleReply.messageID);

  if (!body || !parseInt(body)) return api.sendMessage('❎ Aapka chunav ek number hona chahiye', threadID, messageID);

  const selectedThread = threadList[parseInt(body) - 1];

  if (!selectedThread) return api.sendMessage("❎ Aapka chunav list mein nahi hai", threadID, messageID);

  try {
    const { participantIDs, name, threadID: selectedThreadID } = selectedThread;

    if (participantIDs.includes(senderID)) return api.sendMessage('☑️ Aap is samooh mein pehle se hain', threadID, messageID);

    api.addUserToGroup(senderID, selectedThreadID, (error) => {
      if (error) api.sendMessage(`❎ Galti hui: ${error.errorDescription}`, threadID, messageID);
      else api.sendMessage(`☑️ Bot ne aapko samooh ${name} mein jod diya\n📌 Agar samooh na dikhe to spam ya tin nhắn chờ dekhein`, threadID, messageID);
    });
  } catch (error) {
    api.sendMessage(`❎ Aapko samooh mein jodne mein galti: ${error}`, threadID, messageID);
  }
};

module.exports.run = async function ({ api, event }) {
  const { threadID, senderID, messageID } = event;
  try {
    const allThreads = await api.getThreadList(100, null, ["INBOX"]);
    const groupThreads = allThreads.filter(thread => thread.isGroup);

    if (!groupThreads.length) return api.sendMessage("Koi samooh nahi mila.", threadID);

    let msg = `📝 Sabhi samooh jisme aap shamil ho sakte hain:\n──────────────────\n`;

    await Promise.all(groupThreads.map(async (thread, index) => {
      msg += `${index + 1}. ${thread.name}\n`;
    }));

    msg += `\n📌 Jisme jana hai uske STT ka jawab dein`;

    api.sendMessage(msg, threadID, async (error, info) => {
      if (error) return console.error("Sandesh bhejne mein galti:", error);
      try {
        await global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          threadList: groupThreads
        });
      } catch (err) {
        console.error("handleReply data push karne mein galti:", err);
      }
    }, messageID);
  } catch (err) {
    console.error("Samooh list lene mein galti:", err);
    api.sendMessage("❎ Samooh list lene mein galti hui", threadID, messageID);
  }
};
