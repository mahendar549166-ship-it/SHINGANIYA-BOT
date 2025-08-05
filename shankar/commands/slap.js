const request = require("request");
const fs = require("fs");
const axios = require("axios");

module.exports.config = {
    name: "slap",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Tag kiye gaye dost ko laat maro",
    commandCategory: "Khel",
    usages: "[tag]",
    cooldowns: 5,
};

module.exports.run = async ({ api, event, Threads, global }) => {
    var link = [    
        "https://i.postimg.cc/65TSxJYD/2ce5a017f6556ff103bce87b273b89b7.gif",
        "https://i.postimg.cc/65SP9jPT/Anime-083428-6224795.gif",
        "https://i.postimg.cc/RFXP2XfS/jXOwoHx.gif",
        "https://i.postimg.cc/jSPMRsNk/tumblr-nyc5ygy2a-Z1uz35lto1-540.gif",
    ];
    var mention = Object.keys(event.mentions);
    let tag = event.mentions[mention].replace("@", "");
    if (!mention) return api.sendMessage("Kripya 1 vyakti ko tag karen", event.threadID, event.messageID);
    var callback = () => api.sendMessage({
        body: `${tag}` + ` Aapko itni jor se laat mari ki aapki maafi bhi kaam na aayi 🎀`,
        mentions: [{ tag: tag, id: Object.keys(event.mentions)[0] }],
        attachment: fs.createReadStream(__dirname + "/cache/kick.gif")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/kick.gif"));  
    return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname + "/cache/kick.gif")).on("close", () => callback());
}
