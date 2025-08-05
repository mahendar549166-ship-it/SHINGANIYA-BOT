module.exports.config = {
    name: "pending",
    version: "1.0.6",
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    hasPermssion: 3,
    description: "Bot ke pending messages ka management karen",
    commandCategory: "Admin",
    usages: "[u] [t] [a]",
    cooldowns: 5
};

module.exports.handleReply = async function ({ api, event, handleReply, getText }) {
    const axios = require("axios");
    const fs = require('fs-extra');
    const request = require('request');
    if (String(event.senderID) !== String(handleReply.author)) return;
    const { body, threadID, messageID } = event;
    var count = 0;

    if (isNaN(body) && (body.indexOf("c") == 0 || body.indexOf("cancel") == 0)) {
        const index = body.slice(1).split(/\s+/);
        for (const singleIndex of index) {
            if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > handleReply.pending.length) 
                return api.sendMessage(`→ ${singleIndex} Ek sahi number nahi hai`, threadID, messageID);
        }
        return api.sendMessage(`[ PENDING ] - Safalta se reject kar diya`, threadID, messageID);
    } else {
        const index = body.split(/\s+/);
        const fs = require("fs");
        for (const singleIndex of index) {
            if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > handleReply.pending.length) 
                return api.sendMessage(`→ ${singleIndex} Ek sahi number nahi hai`, threadID, messageID);
            api.unsendMessage(handleReply.messageID);
            api.changeNickname(`『 ${global.config.PREFIX} 』 ⪼ ${(!global.config.BOTNAME) ? "𝙱𝙾𝚃 𝙳𝚘𝚗𝚐𝙳𝚎𝚟👾" : global.config.BOTNAME}`, 
                handleReply.pending[singleIndex - 1].threadID, api.getCurrentUserID());
            api.sendMessage("", event.threadID, () => 
                api.sendMessage(`❯ Bot Admin: ${global.config.FACEBOOK_ADMIN}`, handleReply.pending[singleIndex - 1].threadID));
            count += 1;
        }
        return api.sendMessage(`[ PENDING ] - Safalta se approve kar diya`, threadID, messageID);
    }
};

module.exports.run = async function ({ api, event, args, permission, handleReply }) {
    if (!args.length) {
        return api.sendMessage(
            "❯ Pending user: Users ke pending queue\n" +
            "❯ Pending thread: Groups ke pending queue\n" +
            "❯ Pending all: Sabhi pending boxes", 
            event.threadID, event.messageID
        );
    }
    const content = args.slice(1);
    switch (args[0]) {
        case "user":
        case "u":
        case "-u":
        case "User": {
            const { threadID, messageID } = event;
            const commandName = this.config.name;
            var msg = "", index = 1;

            try {
                var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
                var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
            } catch (e) {
                return api.sendMessage("[ PENDING ] - Pending list nahi mil saki", threadID, messageID);
            }

            const list = [...spam, ...pending].filter(group => group.isGroup == false);

            for (const single of list) msg += `${index++}. ${single.name}\n${single.threadID}\n`;

            if (list.length) {
                return api.sendMessage(
                    `→ Total users pending: ${list.length} users\n${msg}\nReply with index to approve`, 
                    threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: commandName,
                            messageID: info.messageID,
                            author: event.senderID,
                            pending: list
                        });
                    }, messageID
                );
            } else {
                return api.sendMessage("[ PENDING ] - Koi user pending queue mein nahi hai", threadID, messageID);
            }
        }
        case "thread":
        case "-t":
        case "t":
        case "Thread": {
            const { threadID, messageID } = event;
            const commandName = this.config.name;
            var msg = "", index = 1;

            try {
                var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
                var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
            } catch (e) {
                return api.sendMessage("[ PENDING ] - Pending list nahi mil saki", threadID, messageID);
            }

            const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);

            for (const single of list) msg += `${index++}. ${single.name}\n${single.threadID}\n`;

            if (list.length) {
                return api.sendMessage(
                    `→ Total groups pending: ${list.length} groups\n${msg}\nReply with index to approve`, 
                    threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: commandName,
                            messageID: info.messageID,
                            author: event.senderID,
                            pending: list
                        });
                    }, messageID
                );
            } else {
                return api.sendMessage("[ PENDING ] - Koi group pending queue mein nahi hai", threadID, messageID);
            }
        }
        case "all":
        case "a":
        case "-a":
        case "al": {
            const { threadID, messageID } = event;
            const commandName = this.config.name;
            var msg = "", index = 1;

            try {
                var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
                var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
            } catch (e) {
                return api.sendMessage("[ PENDING ] - Pending list nahi mil saki", threadID, messageID);
            }

            const listThread = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);
            const listUser = [...spam, ...pending].filter(group => !group.isGroup);
            const list = [...spam, ...pending].filter(group => group.isSubscribed);

            for (const single of list) msg += `${index++}. ${single.name}\n${single.threadID}\n`;

            if (list.length) {
                return api.sendMessage(
                    `→ Total User & Thread pending: ${list.length} User & Thread\n${msg}\nReply with index to approve`, 
                    threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: commandName,
                            messageID: info.messageID,
                            author: event.senderID,
                            pending: list
                        });
                    }, messageID
                );
            } else {
                return api.sendMessage("[ PENDING ] - Koi User ya Thread pending queue mein nahi hai", threadID, messageID);
            }
        }
    }
};
