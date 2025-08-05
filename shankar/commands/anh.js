const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
    config: {
        name: "anh",
        version: "1.0.3",
        hasPermssion: 0,
        credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
        description: "Aapki maang ke anusaar photo/video dekhein!",
        usages: "reply 1/2/3",
        commandCategory: "Users",
        cooldowns: 5,
        images: [],
        dependencies: {
            axios: ""
        }
    },
    run: async function({ event, api, args }) {
        if (!args[0]) 
            return api.sendMessage(`[ Bot ka Photo & Video Khoj ]\n────────────────\n|› 1. Ladki ki photo\n|› 2. Ladke ki photo\n|› 3. Anime photo\n|› 4. Cosplay photo\n|› 5. Anime video\n|› 6. Ladki ka video\n|› 7. Cosplay video\n|› 8. Meme photo\n|› 9. Muscle photo\n|› 10. Ladke ka video\n|› 11. Chill video\n|› 12. Prakriti ka drishya\n────────────────\n|› 📌 Dekhne ke liye STT ke saath reply karein\n|› 💵 Har photo/video dekhne ki fees 200$ hai`, event.threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "create"
                });
            }, event.messageID);
    },
    handleReply: async function({ api, event, client, handleReply, Currencies, Users }) {
        api.unsendMessage(handleReply.messageID);
        await new Promise(resolve => setTimeout(resolve, 1000));
        let name = await Users.getNameUser(event.senderID);
        const $ = 200;
        const money = (await Currencies.getData(event.senderID)).money;
        if (money < $) 
            return api.sendMessage(`❎ ${name} ke paas dekhne ke liye ${$}$ chahiye`, event.threadID, event.messageID);
    
        Currencies.decreaseMoney(event.senderID, $);
        const { p, link } = linkanh(event);
    
        if (handleReply.type === "create") {
            try {
                const res = await p.get(link, { responseType: "stream" });
                const message = {
                    body: `✅ ${name} se ${$}$ kaat liye gaye`,
                    attachment: res.data,
                    mentions: [{
                        tag: name,
                        id: event.senderID
                    }]
                };
                api.sendMessage(message, event.threadID, event.messageID);
            } catch (error) {
                console.error("Photo bhejne mein error:", error);
                return api.sendMessage("❎ Process karne mein error aaya", event.threadID, event.messageID);
            }
        }
    }
};

function linkanh(event) {
    const filepath = path.join(__dirname, "../../roasted", "datajson");
    let h;
    switch (event.body) {
        case "1":
            h = path.join(filepath, "gai.json");
            break;
        case "2":
            h = path.join(filepath, "trai.json");
            break;
        case "3":
            h = path.join(filepath, "anime.json");
            break;
        case "4":
            h = path.join(filepath, "cosplay.json");
            break;
        case "5":
            h = path.join(filepath, "vdanime.json");
            break;
        case "6":
            h = path.join(filepath, "vdgai.json");
            break;
        case "7":
            h = path.join(filepath, "vdcos.json");
            break;
        case "8":
            h = path.join(filepath, "meme.json");
            break;
        case "9":
            h = path.join(filepath, "mui.json");
            break;
        case "10":
            h = path.join(filepath, "vdtrai.json");
            break;
        case "11":
            h = path.join(filepath, "vdchill.json");
            break;
        case "12":
            h = path.join(filepath, "phongcanh.json");
            break;
        default:
    }
    
    const links = JSON.parse(fs.readFileSync(h));
    const randomIndex = Math.floor(Math.random() * links.length);
    const link = links[randomIndex];
    return { p: axios, link };
}
