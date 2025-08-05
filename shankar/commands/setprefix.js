module.exports.config = {
    name: "setprefix",
    version: "1.0.1",
    hasPermssion: 1,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Group ka prefix dobara set kare",
    commandCategory: "Group Chat",
    usages: "[prefix/reset]",
    cooldowns: 0
};

module.exports.handleReaction = async function({ api, event, Threads, handleReaction }) {
    try {
        if (event.userID != handleReaction.author) return;
        const { threadID, messageID } = event;
        var data = (await Threads.getData(String(threadID))).data || {};
        const prefix = handleReaction.PREFIX;
        data["PREFIX"] = prefix;
        await Threads.setData(threadID, { data });
        await global.data.threadData.set(String(threadID), data);
        api.unsendMessage(handleReaction.messageID);

        api.changeNickname(`『 ${prefix} 』 ⪼ ${global.config.BOTNAME}`, event.threadID, event.senderID);
        return api.sendMessage(`☑️ Group ka prefix badal kar: ${prefix} kar diya gaya`, threadID, messageID);

    } catch (e) {
        return console.log(e);
    }
};

module.exports.run = async ({ api, event, args, Threads }) => {
    if (typeof args[0] === "undefined") return api.sendMessage(`⚠️ Group ka prefix badalne ke liye naya prefix daale`, event.threadID, event.messageID);
    const prefix = args[0].trim();
    if (!prefix) return api.sendMessage(`⚠️ Group ka prefix badalne ke liye naya prefix daale`, event.threadID, event.messageID);
    if (prefix === "reset") {
        var data = (await Threads.getData(event.threadID)).data || {};
        data["PREFIX"] = global.config.PREFIX;
        await Threads.setData(event.threadID, { data });
        await global.data.threadData.set(String(event.threadID), data);
        var uid = api.getCurrentUserID();
        api.changeNickname(`『 ${global.config.PREFIX} 』 ⪼ ${global.config.BOTNAME}`, event.threadID, uid);
        return api.sendMessage(`☑️ Prefix ko default mein reset kiya gaya: ${global.config.PREFIX}`, event.threadID, event.messageID);
    } else {
        api.sendMessage(`📝 Aap naya prefix set karne ki request kar rahe hain: ${prefix}\n👉 Is sandesh par reaction karein tasdeek ke liye`, event.threadID, (error, info) => {
            global.client.handleReaction.push({
                name: "prefixset",
                messageID: info.messageID,
                author: event.senderID,
                PREFIX: prefix
            });
        });
    }
};
