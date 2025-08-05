module.exports.config = {
    name: "adduser",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Link ya UID ke jariye group mein user jodna",
    commandCategory: "Upyogita",
    usages: "[args]",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Threads, Users }) {
    const { threadID, messageID } = event;
    const axios = require('axios');
    const link = args.join(" ");
    if (!args[0]) return api.sendMessage('Group mein jodne ke liye user ka link ya ID daalein!', threadID, messageID);
    var { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);
    if (link.indexOf(".com/") !== -1) {
        const res = await api.getUID(args[0] || event.messageReply.body);
        var uidUser = res;
        api.addUserToGroup(uidUser, threadID, (err) => {
            if (participantIDs.includes(uidUser)) return api.sendMessage(`Sadasya pehle se group mein maujood hai`, threadID, messageID);
            if (err) return api.sendMessage(`Sadasya ko group mein jodne mein asamarth`, threadID, messageID);
            else if (approvalMode && !adminIDs.some(item => item.id == api.getCurrentUserID())) return api.sendMessage(`User ko sweekriti list mein jod diya gaya`, threadID, messageID);
            else return api.sendMessage(`Sadasya ko group mein safalta se jod diya gaya`, threadID, messageID);
        });
    } else {
        var uidUser = args[0];
        api.addUserToGroup(uidUser, threadID, (err) => {
            if (participantIDs.includes(uidUser)) return api.sendMessage(`Sadasya pehle se group mein maujood hai`, threadID, messageID);
            if (err) return api.sendMessage(`Sadasya ko group mein jodne mein asamarth`, threadID, messageID);
            else if (approvalMode && !adminIDs.some(item => item.id == api.getCurrentUserID())) return api.sendMessage(`User ko sweekriti list mein jod diya gaya`, threadID, messageID);
            else return api.sendMessage(`Sadasya ko group mein safalta se jod diya gaya`, threadID, messageID);
        });
    }
};
