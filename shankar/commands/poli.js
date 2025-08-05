module.exports.config = {
  name: "poli",
  version: "1.0.",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Pollination se image banayein",
  commandCategory: "Tool",
  usages: "query",
  cooldowns: 2,
};

module.exports.run = async ({ api, event, args, Users }) => {
  let timeStart = Date.now();
  const axios = require('axios');
  const fs = require('fs-extra');
  const name = await Users.getNameUser(event.senderID);
  const timeNow = moment.tz("Asia/Kolkata").format("HH:mm:ss - DD/MM/YYYY");
  let { threadID, messageID } = event;
  let query = args.join(" ");
  if (!query) return api.sendMessage("Text ya query daal do", threadID, messageID);
  let path = __dirname + `/cache/poli.png`;
  const poli = (await axios.get(`https://image.pollinations.ai/prompt/${query}`, {
    responseType: "arraybuffer",
  })).data;
  fs.writeFileSync(path, Buffer.from(poli, "utf-8"));
  api.sendMessage({
    body: `AI ne ${name} ke liye ${query} ki tasveer banayi\n⏰ Samay: ${timeNow}\n⏳ Process hone mein: ${Math.floor((Date.now() - timeStart) / 1000)} second\n📌 Tasveer 1 ghante baad delete ho jayegi!`,
    attachment: fs.createReadStream(path)
  }, threadID, () => fs.unlinkSync(path), messageID);
};
