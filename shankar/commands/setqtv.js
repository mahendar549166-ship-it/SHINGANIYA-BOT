module.exports.config = {
    name: "setqtv",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Group ke admin set kare",
    commandCategory: "Group",
    usages: "[test]",
    cooldowns: 5
};

module.exports.run = async function ({ event, api, Currencies, args, Users, Threads }) {
    let dataThread = (await Threads.getData(event.threadID)).threadInfo;
    if (args.length == 0) return api.sendMessage(`===== [ 𝗤𝗧𝗩𝗦𝗘𝗧 ] =====\n──────────────────\n/qtvset add @tag ya reply → Sadasya ko group ka admin banaye\n/qtvset remove @tag ya reply → Kisi aur ke admin adhikar hataaye`, event.threadID, event.messageID);
    if (!dataThread.adminIDs.some(item => item.id == api.getCurrentUserID()) && !dataThread.adminIDs.some(item => item.id == event.senderID)) return api.sendMessage('Tumhe koi adhikar nahi hai, chalo yaha se 😏', event.threadID, event.messageID);
    if (args[0] == 'add') {
        if (event.type == "message_reply") {
            var uid1 = event.senderID;
            var uid = event.messageReply.senderID;
            api.sendMessage('Is sandesh par "❤" reaction karein tasdeek ke liye', event.threadID, (error, info) => {
                global.client.handleReaction.push({
                    name: this.config.name,
                    type: 'add',
                    messageID: info.messageID,
                    author: uid1,
                    userID: uid
                });
                event.messageID;
            });
        } else if (args.join().indexOf('@') !== -1) {
            var uid = Object.keys(event.mentions)[0];
            var uid1 = event.senderID;
            api.sendMessage('Is sandesh par "❤" reaction karein tasdeek ke liye', event.threadID, (error, info) => {
                global.client.handleReaction.push({
                    name: this.config.name,
                    type: 'add',
                    messageID: info.messageID,
                    author: uid1,
                    userID: uid
                });
                event.messageID;
            });
        } else {
            var uid1 = event.senderID;
            api.sendMessage('Is sandesh par "❤" reaction karein tasdeek ke liye', event.threadID, (error, info) => {
                global.client.handleReaction.push({
                    name: this.config.name,
                    type: 'add',
                    messageID: info.messageID,
                    author: uid1,
                    userID: uid1
                });
                event.messageID;
            });
        }
    }
    if (args[0] == 'remove') {
        if (event.type == "message_reply") {
            var uid1 = event.senderID;
            var uid = event.messageReply.senderID;
            api.sendMessage('Is sandesh par "❤" reaction karein tasdeek ke liye', event.threadID, (error, info) => {
                global.client.handleReaction.push({
                    name: this.config.name,
                    type: 'remove',
                    messageID: info.messageID,
                    author: uid1,
                    userID: uid
                });
                event.messageID;
            });
        } else if (args.join().indexOf('@') !== -1) {
            var uid = Object.keys(event.mentions)[0];
            var uid1 = event.senderID;
            api.sendMessage('Is sandesh par "❤" reaction karein tasdeek ke liye', event.threadID, (error, info) => {
                global.client.handleReaction.push({
                    name: this.config.name,
                    type: 'remove',
                    messageID: info.messageID,
                    author: uid1,
                    userID: uid
                });
                event.messageID;
            });
        }
    }
};

module.exports.handleReaction = async function ({ event, api, handleReaction, Currencies, Users }) {
    console.log(handleReaction);
    if (event.userID != handleReaction.author) return;
    if (event.reaction != "❤") return;
    if (handleReaction.type == 'add') {
        var name = (await Users.getData(handleReaction.userID)).name;
        api.changeAdminStatus(event.threadID, handleReaction.userID, true, editAdminsCallback);
        function editAdminsCallback(err) {
            if (err) return api.sendMessage("📌 Bot ke paas admin banane ka paryapt adhikar nahi hai!", event.threadID, event.messageID);
            return api.sendMessage(`Sadasya ${name} ko group ka admin bana diya gaya`, event.threadID, event.messageID);
        }
    }
    if (handleReaction.type == 'remove') {
        var name = (await Users.getData(handleReaction.userID)).name;
        api.changeAdminStatus(event.threadID, handleReaction.userID, false, editAdminsCallback);
        function editAdminsCallback(err) {
            if (err) return api.sendMessage("📌 Bot ke paas admin hatane ka paryapt adhikar nahi hai!", event.threadID, event.messageID);
            return api.sendMessage(`${name} ka admin adhikar safalta se hata diya gaya.`, event.threadID, event.messageID);
        }
    }
};
