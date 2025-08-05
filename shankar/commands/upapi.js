const fs = require('fs');
const path = require('path');
const moment = require("moment-timezone");
let tip;
let validLinks;
let dataPath;
let reactionStatus = null;

module.exports.config = {
    name: "upapi",
    version: "1.2.9",
    hasPermission: 3,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Data ko src API mein publish karein",
    commandCategory: "Admin",
    usages: "[]",
    usePrefix: false,
    cooldowns: 5
};

function validURL(str) {
    const pattern = new RegExp('^(https?|ftp):\\/\\/' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$', 'i');
    return pattern.test(str);
}

function isValidFileType(link) {
    const allowedExtensions = ['.mp4', '.mp3', '.jpeg', '.png', '.gif', '.jpg', '.m4a', '.mpga'];
    const ext = path.extname(link);
    return allowedExtensions.includes(ext.toLowerCase());
}

module.exports.run = async ({ api, event, args }) => {
    try {
        const Tm = moment().tz('Asia/Kolkata').format('HH:mm:ss || DD/MM/YYYY');
        const projectHome = path.resolve('./');
        const srcapi = path.join(projectHome, 'data_dongdev/datajson');

        if (args.length < 2) {
            return api.sendMessage(`${module.exports.config.name} + filename + link`, event.threadID, event.messageID);
        }

        tip = args[0];
        dataPath = path.join(srcapi, `${tip}.json`);
        if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, '[]', 'utf-8');

        const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        const links = args.slice(1);
        validLinks = links.filter(link => validURL(link.trim()) && isValidFileType(link.trim()) && !data.includes(link.trim()));

        if (validLinks.length === 0) {
            return api.sendMessage(`⚠️ System mein jodne ke liye koi valid link nahi hai.`, event.threadID, event.messageID);
        }

        api.sendMessage(`[ SRC API MEIN DATA PUBLISH ]\n───────────────\n☑️ Check safalta se pura hua\n📝 ${validLinks.length} valid link hain jo ${tip}.json mein jode jayenge\n\n📌 Kya aap API mein publish karna chahte hain?\n───────────────\n👉 Link API mein publish karne ke liye "😆" reaction dein\n👉 Action cancel karne ke liye "👍" reaction dein\n───────────────\n⏰ Samay: ${Tm}`, event.threadID).then(async (info) => {
            global.client.handleReaction.push({
                name: module.exports.config.name,
                messageID: info.messageID,
                author: event.senderID,
            });
            reactionStatus = info.messageID;
        }).catch((err) => {
            api.sendMessage(`❎ Message bhejne mein error: ${JSON.stringify(err)}`, event.senderID);
        });
    } catch (error) {
        console.log(error);
        api.sendMessage(`❎ Command execute karne mein error: ${error}`, event.threadID);
    }
};

module.exports.handleReaction = async ({ event, api }) => {
    try {
        const Tm = moment().tz('Asia/Kolkata').format('HH:mm:ss || DD/MM/YYYY');
        const { threadID, reaction } = event;

        if (reactionStatus && event.messageID === reactionStatus) {
            if (reaction === '😆' && dataPath) {
                const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
                Array.prototype.push.apply(data, validLinks);
                fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

                api.unsendMessage(event.messageID);
                api.sendMessage(`[ SRC API MEIN DATA PUBLISH ]\n───────────────\n🔐 Parinaam: Safalta ☑️\n📎 ${validLinks.length} link ${tip}.json file mein publish kar diye gaye\n───────────────\n⏰ Samay: ${Tm}`, threadID);
            } else if (reaction === '👍') {
                api.unsendMessage(event.messageID);
                api.sendMessage(`[ SRC API MEIN DATA PUBLISH ]\n───────────────\n🔐 Link publish cancel kar diya gaya ☑️\n⏰ Samay: ${Tm}`, threadID);
            }
            reactionStatus = null;
        }
    } catch (error) {
        console.error(error);
        const errorMessage = `[ SRC API MEIN DATA PUBLISH ]\n───────────────\n🔐 Parinaam: Asafal ❎\n⚠️ Error: ${error.message}`;
        api.sendMessage(errorMessage, event.threadID);
    }
};
