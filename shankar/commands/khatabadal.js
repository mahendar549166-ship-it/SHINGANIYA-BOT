module.exports.config = {
    name: "khatabadal", // Komand ka naam
    version: "1.0.0",
    hasPermssion: 3,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Bot ka khata tezi se badlen", // Change bot account quickly
    commandCategory: "Prashasak", // Admin
    usages: "system",
    cooldowns: 0,
    images: [],
};

// REQUIRED MODULES
const {
    exec
} = require('child_process');
const eval = require('eval')
const path = require('path');
const fs = require('fs')

// KHATA BADALNE WALA FUNCTION
module.exports.run = async function({
    api,
    event,
    args
}) {
    const {
        configPath
    } = global.client;
    const config = require(configPath);
    try {
        // APPSTATEPATH KO TOGGLE KAREN
        if (config.APPSTATEPATH === 'fbstate.json') {
            config.APPSTATEPATH = 'appstate.json';
        } else {
            config.APPSTATEPATH = 'fbstate.json';
        }

        // CONFIG FILE MEIN UPDATE KAREN
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');

        // USER KO MESSAGE BHEJEN AUR BOT KO RESTART KAREN
        return api.sendMessage("📌 Khata badalne ka aadesh prapt hua ☑️\n🔄 Doosre khate mein login ho raha hai...\n⏳ Bot kuch seconds baad restart hoga", event.threadID, () => eval("module.exports = process.exit(1)", true), event.messageID);
    } catch (e) {
        console.log(e)
    }
};
