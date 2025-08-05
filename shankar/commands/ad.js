module.exports.config = {
  name: "ad",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Admin bot ki jankari",
  commandCategory: "Jankari",
  usages: "Prefix",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, Threads }) => {
  const axios = require("axios");
  const link = [
    "https://i.imgur.com/6XJH52B.mp4"
  ]; // Video ya image ka link yaha daalein
  const img = (await axios.get(link[Math.floor(Math.random() * link.length)], { responseType: "stream" })).data;
  // Axios ke jariye image ya video ka data get karna

  return api.sendMessage({
    body: `=====𝗔𝗗𝗠𝗜𝗡=====
[😊] 𝑵𝒂𝒂𝒎: 
[💻]𝑺𝒂𝒎𝒑𝒂𝒓𝒌💻
[☎] 𝑺𝑫𝑻 & 𝑾𝒉𝒂𝒕𝒔𝒂𝒑𝒑: 
[🌐] 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌: 𝐡𝐭𝐭𝐩𝐬://𝐰𝐰𝐰.𝐟𝐚𝐜𝐞𝐛𝐨𝐨𝐤.𝐜𝐨𝐦/
[✉️] 𝑬𝒎𝒂𝒊𝒍:
------------
✔𝑫𝒐𝒏𝒂𝒕𝒆:
[💳] 𝐌𝐛𝐁𝐚𝐧𝐤: 
[💳] 𝐌𝐨𝐌𝐨: 
---- ----`,
    attachment: img // Upar define kiya gaya link yaha point karega
  }, event.threadID, async (err, info) => {
    await new Promise(resolve => setTimeout(resolve, 30 * 1000));
    return api.unsendMessage(info.messageID);
  }, event.messageID);
};
