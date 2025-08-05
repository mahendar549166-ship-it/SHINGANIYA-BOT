const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "nhantin",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Facebook ID ke zariye kisi user ko message bhejein",
  commandCategory: "Box chat",
  usages: "[userID] [content]\nAap photo reply karke sath mein bhej sakte hain",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const [id, ...contentArgs] = args;
  const content = (contentArgs.length !== 0) ? contentArgs.join(" ") : "Hi chao cau";

  if (!id) {
    return api.sendMessage('Kripya us person ka ID daalein jisko aap bot se message bhejana chahte hain!', threadID, messageID);
  }

  if (event.type == "message_reply" && event.messageReply.attachments.length > 0) {
    const attachmentURL = event.messageReply.attachments[0].url;

    const cachePath = path.join(__dirname, 'cache');
    const fileName = `attachment_${Date.now()}.jpg`;

    const response = await axios.get(attachmentURL, { responseType: 'arraybuffer' });
    fs.writeFileSync(path.join(cachePath, fileName), Buffer.from(response.data));

    api.sendMessage({ attachment: fs.createReadStream(path.join(cachePath, fileName)), body: content }, id);

  } else {
    api.sendMessage(content, id);
  }
}
