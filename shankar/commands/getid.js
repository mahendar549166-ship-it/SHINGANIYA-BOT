const axios = require('axios');
const qs = require('qs');

module.exports.config = {
  name: "getid",
  version: "1.0.0",
  hasPermission: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Facebook links se ID nikalta hai",
  commandCategory: "Utility",
  usages: "[Facebook link]",
  cooldowns: 5,
  usePrefix: false
};

module.exports.run = async function({ api, event, args }) {
  try {
    if (args.length === 0) {
      api.sendMessage("❎ Kripya ek Facebook link provide karein", event.threadID, event.messageID);
      return;
    }

    const url = args.join(" ");
    
    // Facebook URL pattern matching
    const regex = /(?:https?:\/\/)?(?:www|m\.)?(?:facebook|fb|m|.me\.facebook)\.(?:com|me|watch)\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-\.]+)(?:\/)?/i;
    const regexResult = url.match(regex);

    if (!regexResult || regexResult.length < 2 || !regexResult[1]) {
      api.sendMessage("❎ Galat link, sirf Facebook links chalegi", event.threadID, event.messageID);
      return;
    }

    const cleanUrl = `https://facebook.com/${regexResult[1]}`;
    
    // API request to get ID
    const options = {
      method: 'POST',
      url: 'https://id.traodoisub.com/api.php',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({
        'link': cleanUrl,
      }),
    };

    const response = await axios(options);

    if (response.data.code === 400) {
      api.sendMessage("❎ Abhi ID nahi nikal paya, baad mein try karein", event.threadID, event.messageID);
    } else {
      api.sendMessage(`✅ ID mil gaya: ${response.data.id}`, event.threadID, event.messageID);
    }
  } catch (error) {
    console.error("Error getting Facebook ID:", error);
    api.sendMessage("❎ Error aaya, kripya baad mein try karein", event.threadID, event.messageID);
  }
};
