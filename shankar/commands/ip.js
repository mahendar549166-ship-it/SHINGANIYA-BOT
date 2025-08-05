module.exports.config = {
  name: "ip",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Apne ya kisi aur ke IP ki jankari dekhein",
  commandCategory: "Upyogita",
  usages: "",
  cooldowns: 5,
  dependencies: "",
};

module.exports.run = async function ({ api, args, event, __GLOBAL }) {
  const timeStart = Date.now();

  const axios = require("axios");
  if (!args[0]) {
    api.sendMessage("Kripaya woh IP daalein jiski janch karni hai", event.threadID, event.messageID);
  } else {
    var infoip = (await axios.get(`http://ip-api.com/json/${args.join(' ')}?fields=66846719`)).data;
    if (infoip.status == 'fail') {
      api.sendMessage(`Ek error hua hai: ${infoip.message}`, event.threadID, event.messageID);
    } else {
      api.sendMessage({
        body: `
[ IP KI JANCH ]
────────────────
🗺️ Mahadweep: ${infoip.continent}
🏳️ Desh: ${infoip.country}
🎊 Desh ka Code: ${infoip.countryCode}
🕋 Kshetra: ${infoip.region}
⛱️ Rajya/Kshetra Naam: ${infoip.regionName}
🏙️ Sheher: ${infoip.city}
🛣️ Jila: ${infoip.district}
📮 Pin Code: ${infoip.zip}
🧭 Akshansh: ${infoip.lat}
🧭 Deshantar: ${infoip.lon}
⏱️ Samay Kshetra: ${infoip.timezone}
👨‍✈️ Sangathan ka Naam: ${infoip.org}
💵 Mudra: ${infoip.currency}
`,
        location: {
          latitude: infoip.lat,
          longitude: infoip.lon,
          current: true
        }
      }, event.threadID, event.messageID);
    }
  }
};
