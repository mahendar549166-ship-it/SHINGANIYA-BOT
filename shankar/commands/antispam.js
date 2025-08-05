class UserSpamBlocker {
    constructor() {
        this.userSpamData = {};
    }

    canSend(userId, dataThread) {
        if (!this.userSpamData[userId]) {
            this.userSpamData[userId] = {
                messageCount: 1,
                lastMessageTime: Date.now(),
                interval: dataThread.time * 1000, 
                threshold: dataThread.count, 
            };
            return true;
        }
        const userData = this.userSpamData[userId];
        const currentTime = Date.now();
        if (currentTime - userData.lastMessageTime > userData.interval || !userData.interval) {
            userData.lastMessageTime = currentTime;
            userData.messageCount = 1;
            return true;
        }

        if (userData.messageCount < userData.threshold) {
            userData.messageCount++;
            return true;
        }

        delete this.userSpamData[userId];
        return false;
    }
}

const userSpamBlocker = new UserSpamBlocker();

module.exports.config = {
    name: "antispam",
    version: "1.1.2",
    hasPermssion: 1,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Spam messages ko rokna",
    commandCategory: "Group Chat",
    usages: "[]",
    cooldowns: 0,
};

const fs = require("fs-extra");
const path = __dirname + "/data/antispam.json";

module.exports.onLoad = () => {
    if (!fs.existsSync(path) || fs.statSync(path).isDirectory()) {
        fs.writeFileSync(path, JSON.stringify([], null, 4));
    }
};

module.exports.handleEvent = async function({ api, event, args, Users }) {
    const userId = event.senderID;
    const threadID = event.threadID;
    try {
        if (userId === api.getCurrentUserID()) return;
        const data = require("./data/antispam.json");
        const findThread = data.find(item => item.threadID == threadID);
        if (findThread) {
            if (findThread.status) {
                if (!userSpamBlocker.canSend(userId, findThread)) {
                    const name = (await Users.getData(userId)).name;
                    api.sendMessage(`Spam karne ke kaaran ${name} ko group se nikala gaya`, event.threadID);
                    await api.removeUserFromGroup(userId, event.threadID);
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
};

module.exports.run = async function({ api, event, args }) {
    try {
        const data = require("./data/antispam.json");
        const findThread = data.find(item => item.threadID == event.threadID);
        if (args[0] === "on") {
            if (!findThread) return api.sendMessage(`Data nahi hai`, event.threadID, event.messageID);
            findThread.status = true;
            fs.writeFileSync(path, JSON.stringify(data, null, 2));
            return api.sendMessage("Chalu", event.threadID);
        }
        if (args[0] === "off") {
            if (!findThread) return api.sendMessage(`Data nahi hai`, event.threadID, event.messageID);
            findThread.status = false;
            fs.writeFileSync(path, JSON.stringify(data, null, 2));
            return api.sendMessage("Band", event.threadID);
        }
        var body = args.join(" ").split('|').map(value => value.trim());
        const [ count, time ] = body;
        const author = event.senderID;
        if (isNaN(count) || isNaN(time)) return api.sendMessage("Galat format", event.threadID);
        if (!findThread) {
            data.push({
                threadID: event.threadID,
                status: false,
                count: parseInt(count),
                time: parseInt(time)
            });
            fs.writeFileSync(path, JSON.stringify(data, null, 4));
            return api.sendMessage(`✅ Ho gaya, chalu karne ke liye ${global.config.PREFIX + "" + this.config.name} on likhein`, event.threadID);
        } else {
            return api.sendMessage(`Badlav confirm karne ke liye '❤️' thok dein`, event.threadID, (err, info) => {
                global.client.handleReaction.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author,
                    data: {
                        status: findThread.status,
                        count: parseInt(count),
                        time: parseInt(time)
                    }
                });
            });
        }
    } catch (e) {
        console.log(e);
        return api.sendMessage("Error", event.threadID);
    }
};

module.exports.handleReaction = async function({ api, event, handleReaction, Currencies }) {
    const { threadID, messageID, userID } = event;
    const { data, author } = handleReaction;
    api.unsendMessage(handleReaction.messageID);
    try {
        if (userID !== author) return;
        if (event.reaction === "❤") {
            const datas = require("./data/antispam.json");
            const findThread = datas.find(item => item.threadID == threadID);
            findThread.status = data.status;
            findThread.count = data.count;
            findThread.time = data.time;
            fs.writeFileSync(path, JSON.stringify(datas, null, 2));
            return api.sendMessage(`Ho gaya`, event.threadID);
        }
    } catch (e) {
        console.log(e);
        return api.sendMessage("Error", threadID);
    }
};
