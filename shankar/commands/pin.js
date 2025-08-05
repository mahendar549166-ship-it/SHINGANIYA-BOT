const axios = require("axios");

let streamURL = (url, ext = 'jpg') => require('axios').get(url, {
  responseType: 'stream',
}).then(res => (res.data.path = `tmp.${ext}`, res.data)).catch(e => null);

const PINTEREST_REGEX = /(https:\/\/(www.)?(pinterest.com|pin.it)[^ \n]*)/g;

const downloadImages = async (url, api, event) => {
  try {
    const match = PINTEREST_REGEX.exec(url);
    if (!match) {
      api.sendMessage("❎ Pinterest post ka URL galat hai", event.threadID, event.messageID);
      return;
    }

    const res = await axios.get(`https://api.imgbb.com/1/upload?key=588779c93c7187148b4fa9b7e9815da9&image=${match[0]}`);
    api.sendMessage({ 
      body: "[ PINTEREST - DOWNLOAD ]\n──────────────────\n\n📎 URL: " + res.data.data.image.url, 
      attachment: await streamURL(res.data.data.image.url, 'jpg')
    }, event.threadID);
  } catch (error) {
    api.sendMessage("❎ Photo download karte waqt error aaya", event.threadID, event.messageID);
  }
};

const searchPinterest = async (query, api, event) => {
  try {
    const [keyword, limitStr] = query.split('-').map(str => str.trim());
    
    if (!keyword) {
      return api.sendMessage('⚠️ Khoj ke liye keyword daal do 🔎', event.threadID, event.messageID);
    }

    const limit = !isNaN(limitStr) ? parseInt(limitStr) : null;

    if (limit && (limit <= 0 || limit > 50)) {
      return api.sendMessage('⚠️ Aap maximum 50 photos tak khoj sakte hain', event.threadID, event.messageID);
    }

    const pinter = require('./../../lib/pinter.js');
    pinter(keyword).then(async (data) => {
      const results = data.data.slice(0, limit);
      const imagePromises = Array.from({ length: limit }, async (_, i) => {
        const a = results[i];
        try {
          const stream = (await axios.get(a, { responseType: "stream" })).data;
          return stream;
        } catch (error) {
          return null;
        }
      });

      const image = await Promise.all(imagePromises);

      api.sendMessage({
        body: `[ PINTEREST - SEARCH ]\n─────────────────\n\n📝 Keyword: ${keyword} ke liye ${results.length} results mile 🌸\n` + 
              (limit && limit > results.length ? `❎ ${limit - results.length} photos load karne mein error` : ""),
        attachment: image.filter(img => img !== null)
      }, event.threadID, event.messageID);
    }).catch(e => {
      api.sendMessage("❎ Pinterest par khoj karte waqt error aaya", event.threadID, event.messageID);
    });
  } catch (error) {
    api.sendMessage("❎ Pinterest par khoj karte waqt error aaya", event.threadID, event.messageID);
  }
};

module.exports.config = {
  name: "pinterest",
  version: "2.0.0",
  hasPermission: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Pinterest se video ya photo khoj aur download karen",
  commandCategory: "Utility",
  usages: "pinterest down {url} | pinterest search {keyword}",
  cooldowns: 5,
  usePrefix: false,
  images: [
    "https://i.imgur.com/ukt4Qmr.jpeg",
    "https://i.imgur.com/yTdSIzp.jpeg"
  ],
};

module.exports.run = async function ({ api, event, args }) {
  const p = global.config.PREFIX;

  switch (args[0]) {
    case "dl":
    case "down":
      await downloadImages(args[1], api, event);
      break;

    case "s":
    case "search":
      await searchPinterest(args.slice(1).join(" "), api, event);
      break;

    default:
      const helpMessage = `[ PINTEREST ]\n──────────────────\n\n📝 Aap yeh use kar sakte hain:\n→⁠ pinterest search/s: keyword - photo ki sankhya\n→⁠ pinterest down/dl + link: photo/video download karen`;
      const attachment = (await axios.get(`https://i.imgur.com/blbLKG3.jpeg`, { responseType: "stream" })).data;
      api.sendMessage({ body: helpMessage, attachment }, event.threadID, event.messageID);
      break;
  }
};
