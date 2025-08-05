const fs = require('fs');

module.exports.config = {
    name: "allfile",
    version: "1.0.0",
    hasPermssion: 3,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Current directory mein files aur folders ki list dikhaayein.",
    usage: "",
    commandCategory: "Admin",
    cooldowns: 5
};

// Directory kholne aur files aur folders ki list bhejne ka function
function openFolder(api, event, path) {
    const { readdirSync, statSync } = fs;
    const read = readdirSync(path);
    let txt = '';
    let count = 0;
    const array = [];

    for (const i of read) {
        const dest = `${path}/${i}`;
        const info = statSync(dest);
        const size = info.isDirectory() ? getFolderSize(dest) : info.size;

        txt += `${++count}. ${info.isFile() ? '📄' : info.isDirectory() ? '📁' : ''} - ${i} (${convertBytes(size)})\n`;
        array.push({
            dest,
            info
        });
    }

    txt += '\n--> Reply karein [Open|Del|View] + STT.';
    api.sendMessage(txt, event.threadID, (err, data) => {
        global.client.handleReply.push({
            name: 'file',
            messageID: data.messageID,
            author: event.senderID,
            data: array
        });
    }, event.messageID);
}

// File size ko readable unit mein convert karne ka function
function convertBytes(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return `${Math.round(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`;
}

// Folder ka size calculate karne ka function
function getFolderSize(path) {
    const stats = fs.statSync(path);
    if (!stats.isDirectory()) {
        return stats.size;
    }
    const items = fs.readdirSync(path);
    let size = 0;
    items.forEach(item => {
        size += getFolderSize(`${path}/${item}`);
    });
    return size;
}

// Reply handle karne ka function
module.exports.handleReply = async function ({ event, api, handleReply, args }) {
    const { threadID: tid, messageID: mid } = event;

    if (!handleReply || !handleReply.data) {
        return; // HandleReply ya data na hone par process rok dein
    }

    switch (handleReply.name) {
        case 'file':
            const arg = args[0]; // Args ka value lein
            const choose = parseInt(arg); // Integer mein convert karein
            api.unsendMessage(handleReply.messageID);

            if (isNaN(choose) || choose <= 0 || choose > handleReply.data.length) {
                return api.sendMessage('⚠️ Amanya chunav kiya gaya.', tid, mid);
            }

            const chosenItem = handleReply.data[choose - 1];
            const dest = chosenItem.dest;
            const info = chosenItem.info;

            if (info.isDirectory()) {
                openFolder(api, event, dest); // Agar folder hai to usko kholein
            } else {
                // File hone par handle karein
                api.sendMessage(`Aapne file chuni: ${dest}`, tid, mid);
            }
            break;

        default:
            break;
    }
};

// Command chalane ka function
module.exports.run = async function({ event, api }) {
    const directoryPath = './'; // Directory path jisko check karna hai
    openFolder(api, event, directoryPath);
};
