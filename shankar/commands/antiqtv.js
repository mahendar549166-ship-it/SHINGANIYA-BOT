const fs = require("fs");

module.exports.config = {
    name: "antiqtv",
    version: "1.1.2",
    hasPermssion: 1,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Group ke admin chori hone se rokna.",
    commandCategory: "Group Chat",
    usages: "[]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.onLoad = function () {
    let path = __dirname + "/data/antiqtv.json";
    if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");
};

module.exports.run = async function ({ api, event }) {
    const dataAnti = __dirname + '/data/antiqtv.json';
    const info = await api.getThreadInfo(event.threadID);
    if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) 
        return api.sendMessage('❎ Is command ko chalane ke liye bot ko group ka admin hona chahiye', event.threadID, event.messageID);
    let data = JSON.parse(fs.readFileSync(dataAnti)); // Fixed: dataA to data
    const { threadID, messageID } = event;
    if (!data[threadID]) {
        data[threadID] = true;
        api.sendMessage(`☑️ Antiqtv mode safalta se chalu kiya gaya`, threadID, messageID);
    } else {
        data[threadID] = false;
        api.sendMessage(`☑️ Antiqtv mode safalta se band kiya gaya`, threadID, messageID);
    }
    fs.writeFileSync(dataAnti, JSON.stringify(data, null, 4));
};
