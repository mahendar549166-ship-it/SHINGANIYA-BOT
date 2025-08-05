const imgur = require("imgur");
const fs = require("fs");
const { downloadFile } = require("../../utils/index");

module.exports.config = {
  name: "imgur",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Imgur par upload karein",
  commandCategory: "Upyogita",
  usages: "[jawab dein]",
  cooldowns: 5,
  usePrefix: false
};

module.exports.run = async ({ api, event, Users, Threads }) => {
  const { threadID, type, messageReply, messageID } = event;
  const moment = require("moment-timezone");
  const timeNow = moment.tz("Asia/Kolkata").format("DD/MM/YYYY || HH:mm:ss");
  const fs = require("fs");
  const ClientID = "771631e18e73452";

  if (type !== "message_reply" || messageReply.attachments.length == 0) {
    return api.sendMessage("Aapko kisi video ya tasveer ka jawab dena hoga", threadID, messageID);
  }

  imgur.setClientId(ClientID);
  const attachmentSend = [];

  async function getAttachments(attachments) {
    let startFile = 0;
    for (const data of attachments) {
      const ext = data.type == "photo" ? "jpg" :
        data.type == "video" ? "mp4" :
        data.type == "audio" ? "m4a" :
        data.type == "animated_image" ? "gif" : "txt";
      const pathSave = __dirname + `/cache/${startFile}.${ext}`;
      ++startFile;
      const url = data.url;
      await downloadFile(url, pathSave);
      attachmentSend.push(pathSave);
    }
  }

  await getAttachments(messageReply.attachments);
  let msg = "", Succes = 0, Error = [];
  for (const getImage of attachmentSend) {
    try {
      const getLink = await imgur.uploadFile(getImage);
      msg += `${++Succes}/ ${getLink.link}\n`;
      fs.unlinkSync(getImage);
    } catch {
      Error.push(getImage);
      fs.unlinkSync(getImage);
    }
  }

  return api.sendMessage(`☑ Safalta: ${Succes}\n❎ Asafalta: ${Error.length}\n\n${msg}`, event.threadID, event.messageID);
};
