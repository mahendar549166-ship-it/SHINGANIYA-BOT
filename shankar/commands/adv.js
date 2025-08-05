const axios = require('axios');
const fs = require('fs');
const { join } = require("path");

module.exports.config = {
    name: "adv",
    version: "1.0.0",
    hasPermssion: 3,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Har prakar ke raw link par code lagoo karein",
    commandCategory: "Admin",
    usages: "[reply ya text]",
    cooldowns: 0,
    images: [],
    dependencies: {
        "cheerio": "",
        "request": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
    const { senderID, threadID, messageID, messageReply, type } = event;
    let name = args[0];
    let text;

    if (type === "message_reply") {
        text = messageReply.body;
    }

    if (!text && !name) return api.sendMessage('❎ Code lagoo karne ke liye link reply karein ya file ka naam likhein taaki code pastebin par upload ho sake!', threadID, messageID);

    if (!text && name) {
        fs.readFile(
            `${__dirname}/../../shankar/events/${args[0]}.js`,
            "utf-8",
            async (err, data) => {
                if (err) return api.sendMessage(`❎ ${args[0]} command maujood nahi hai`, threadID, messageID);

                const response = await axios.post("https://api.mocky.io/api/mock", {
                    "status": 200,
                    "content": data,
                    "content_type": "application/json",
                    "charset": "UTF-8",
                    "secret": "PhamMinhDong",
                    "expiration": "never"
                });
                const link = response.data.link;
                return api.sendMessage(link, threadID, messageID);
            }
        );
        return;
    }

    const urlR = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const url = text.match(urlR);

    if (url) {
        axios.get(url[0]).then(i => {
            const data = i.data;
            fs.writeFile(
                `${__dirname}/../../shankar/events/${args[0]}.js`,
                data,
                "utf-8",
                function (err) {
                    if (err) return api.sendMessage(`⚠️ ${args[0]}.js mein code lagoo karne mein error aaya`, threadID, messageID);
                    api.sendMessage(`✅ ${args[0]}.js mein code safalta se lagoo kar diya gaya`, threadID, messageID);
                }
            );
        });
    }
};
