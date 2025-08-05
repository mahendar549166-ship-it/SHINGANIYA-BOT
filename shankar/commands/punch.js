const request = require("request");
const fs = require("fs");
const axios = require("axios");

module.exports.config = {
    name: "punch",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Tag kiye gaye dost ko mukka maro",
    commandCategory: "Khel",
    usages: "[tag]",
    cooldowns: 5,
};

module.exports.run = async ({ api, event, Threads, global }) => {
    var link = [    
        "https://i.imgur.com/RfOn1ww.gif"
    ];
    var mention = Object.keys(event.mentions);
    let tag = event.mentions[mention].replace("@", "");
    if (!mention) return api.sendMessage("Kripya 1 vyakti ko tag karen", event.threadID, event.messageID);
    var callback = () => api.sendMessage({
        body: `${tag}` + ` Aapko itni jor se mukka mara ki aapki maafi bhi kaam na aayi 🎀`,
        mentions: [{ tag: tag, id: Object.keys(event.mentions)[0] }],
        attachment: fs.createReadStream(__dirname + "/cache/punch.gif")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/punch.gif"));  
    return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname + "/cache/punch.gif")).on("close", () => callback());
}
