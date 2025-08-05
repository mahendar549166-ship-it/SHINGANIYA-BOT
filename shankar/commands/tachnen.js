module.exports.config = {
  name: 'tachnen',
  version: '1.1.1',
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: 'Photo ka background hatayein',
  commandCategory: 'Upyogita',
  usages: 'Image ya image URL ka jawab dein',
  cooldowns: 2,
  dependencies: {
    'form-data': '',
    'image-downloader': ''
  }
};

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');
const { image } = require('image-downloader');

module.exports.run = async function({
  api, event, args
}) {
  try {
    var tpk = `🖼️=== [ BACKGROUND HATAO ] ===🖼️
━━━━━━━━━━━━━━━
➜ Aapke photo ka background safalata se hatayein`;
    if (event.type !== "message_reply") return api.sendMessage("Aapko ek photo ka jawab dena hoga", event.threadID, event.messageID);
    if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("Aapko ek photo ka jawab dena hoga", event.threadID, event.messageID);
    if (event.messageReply.attachments[0].type != "photo") return api.sendMessage("Yeh photo nahi hai", event.threadID, event.messageID);

    const content = (event.type == "message_reply") ? event.messageReply.attachments[0].url : args.join(" ");
    const KeyApi = ["t4Jf1ju4zEpiWbKWXxoSANn4", "CTWSe4CZ5AjNQgR8nvXKMZBd", "PtwV35qUq557yQ7ZNX1vUXED", "wGXThT64dV6qz3C6AhHuKAHV", "82odzR95h1nRp97Qy7bSRV5M", "4F1jQ7ZkPbkQ6wEQryokqTmo", "4F1jQ7ZkPbkQ6wEQryokqTmo", "sBssYDZ8qZZ4NraJhq7ySySR", "NuZtiQ53S2F5CnaiYy4faMek", "f8fujcR1G43C1RmaT4ZSXpwW"];
    const inputPath = path.resolve(__dirname, 'cache', `photo.png`);
    await image({
      url: content,
      dest: inputPath
    });
    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));
    axios({
      method: 'post',
      url: 'https://api.remove.bg/v1.0/removebg',
      data: formData,
      responseType: 'arraybuffer',
      headers: {
        ...formData.getHeaders(),
        'X-Api-Key': KeyApi[Math.floor(Math.random() * KeyApi.length)],
      },
      encoding: null
    })
      .then((response) => {
        if (response.status != 200) return console.error('Galti:', response.status, response.statusText);
        fs.writeFileSync(inputPath, response.data);
        return api.sendMessage({ attachment: fs.createReadStream(inputPath) }, event.threadID, () => fs.unlinkSync(inputPath));
      })
      .catch((error) => {
        return console.error('Anurodh asafal:', error);
      });
  } catch (e) {
    console.log(e);
    return api.sendMessage(`Kuch bhi nahi mila`, event.threadID, event.messageID);
  }
};
