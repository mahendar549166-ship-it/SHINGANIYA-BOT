const fs = require('fs');
const path = require('path');
const { simi } = require('./../../includes/controllers/sim.js');

module.exports.config = {
    naam: 'sim',
    version: '1.1.3',
    anumati: 1,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    vivaran: 'Simi chat ke saath baat karo, on/off kar sakte ho',
    commandCategory: 'Admin',
    upyog: '[on/off]',
    cooldowns: 2,
};

const dataFilePath = path.resolve(__dirname, 'data/bot.json');

function dataLoadKaro() {
    if (!fs.existsSync(dataFilePath)) return {};
    try {
        return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    } catch (e) {
        console.error('Data load karne mein error:', e);
        return {};
    }
}

function dataSaveKaro(data) {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
        console.error('Data save karne mein error:', e);
    }
}

module.exports.run = async function({ api, event, args }) {
    const threadID = event.threadID;
    const data = dataLoadKaro();

    if (args[0] === 'on') {
        data[threadID] = true;
        dataSaveKaro(data);
        return api.sendMessage('Is group mein bot ke saath baat karne ka feature on kar diya gaya hai!', threadID);
    } else if (args[0] === 'off') {
        data[threadID] = false;
        dataSaveKaro(data);
        return api.sendMessage('Is group mein bot ke saath baat karne ka feature off kar diya gaya hai!', threadID);
    } else {
        return api.sendMessage('Kripya [on/off] ka upyog karein feature ko on ya off karne ke liye.', threadID);
    }
};

module.exports.handleEvent = async function({ api, event }) {
    const threadID = event.threadID;
    const sandesh = event.body?.toLowerCase();

    const data = dataLoadKaro();
    if (!data[threadID]) return;

    const keywords = ['Pie', 'Bot', 'bot kahan hai', 'bot off', 'bot oye', 'bot shandaar',
        'sabko interaction ke liye bula bot', 'namaste bot', 'hello bot', 'pie', 'Pie', 'alvida bot'];
    const jawab = [
        'mujhe bulaya kya hai 💓', 'suno main yahan hoon', 'kya baat hai main yahan hoon',
        'main yahan', 'mujhe bulaya kya baat hai', '💞 main sun rahi hoon', 'main hoon yahan'
    ];

    if (!sandesh || !keywords.includes(sandesh)) return;

    const randomJawab = jawab[Math.floor(Math.random() * jawab.length)];
    api.sendMessage(
        { body: randomJawab },
        threadID,
        (err, data) => {
            if (err) return console.error(err);
            global.client.handleReply.push({ naam: this.config.naam, messageID: data.messageID });
        },
        event.messageID
    );
};

module.exports.handleReply = async function({ handleReply: $, api, event }) {
    const threadID = event.threadID;
    const data = dataLoadKaro();

    if (!data[threadID]) return;

    try {
        const jawab = await simi('pooch', event.body);
        if (jawab.error || !jawab.uttar) {
            return api.sendMessage('Bot ko jawab dene mein samasya hui. Kripya baad mein koshish karein!', threadID, event.messageID);
        }
        api.sendMessage(
            { body: jawab.uttar },
            threadID,
            (err, data) => {
                if (err) return console.error(err);
                global.client.handleReply.push({ naam: this.config.naam, messageID: data.messageID });
            },
            event.messageID
        );
    } catch (error) {
        console.error(error);
        api.sendMessage('Prakriya ke dauraan error hua.', threadID, event.messageID);
    }
};
