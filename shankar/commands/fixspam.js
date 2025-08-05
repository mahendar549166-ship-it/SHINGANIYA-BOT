module.exports.config = {
    name: "antispam",
    version: "1.1.0",
    hasPermission: 2,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Automatically bans users who insult the bot",
    commandCategory: "System",
    usages: "",
    cooldowns: 0
};

module.exports.handleReply = async function ({ api, args, Users, event, handleReply }) {
    const { threadID, messageID } = event;
    const { reason } = handleReply;
    const userName = await Users.getNameUser(event.senderID);
    const [action] = event.body.toLowerCase().split(" ");

    switch (handleReply.type) {
        case "reply": {
            // Admin responding to user
            api.sendMessage({
                body: `[ ADMIN RESPONSE ]\n──────────────────\n• User: ${userName}\n• Message: ${event.body}\n📌 Reply to this message to respond to the user`,
                mentions: [{
                    id: event.senderID,
                    tag: userName
                }]
            }, handleReply.author, (error, data) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: data.messageID,
                    originalMessageID: event.messageID,
                    author: event.senderID,
                    threadID: event.threadID,
                    userName: userName,
                    type: "banAction"
                });
            });
            break;
        }

        case "banAction": {
            if (action === "unban") {
                // Unban user
                const userData = (await Users.getData(handleReply.author)).data || {};
                userData.banned = 0;
                userData.reason = null;
                userData.dateAdded = null;
                
                await Users.setData(handleReply.author, { data: userData });
                global.data.userBanned.delete(handleReply.author);
                
                // Notify user and admin
                api.sendMessage(
                    `🔔 Notification from admin: ${userName}\n• User: ${handleReply.userName} has been unbanned\n• You can now use the bot again`, 
                    handleReply.author
                );
                api.sendMessage(
                    `✅ Successfully unbanned: ${handleReply.userName}\n• UID: ${handleReply.author}`, 
                    threadID
                );
            } else {
                // Forward admin's response to banned user
                api.sendMessage({ 
                    body: `[ ADMIN MESSAGE ]\n──────────────────\n• Message: ${event.body}\n📌 Reply to respond to admin`, 
                    mentions: [{ tag: userName, id: event.senderID }] 
                }, handleReply.threadID, (error, data) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        author: event.senderID,
                        messageID: data.messageID,
                        type: "reply"
                    });
                }, handleReply.originalMessageID);
            }
            break;
        }

        case "insultReport": {
            // Handle reports of bot insults
            api.sendMessage({ 
                body: `[ ADMIN NOTIFICATION ]\n──────────────────\n• Message: ${event.body}\n📌 Reply to respond to admin`, 
                mentions: [{ tag: userName, id: event.senderID }] 
            }, handleReply.threadID, (error, data) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    author: event.senderID,
                    messageID: data.messageID,
                    type: "reply"
                });
            }, handleReply.originalMessageID);
            break;
        }
    }
};

module.exports.handleEvent = async ({ event, api, Users, Threads }) => {
    const { threadID, messageID, body, senderID } = event;
    if (senderID === global.data.botID) return;

    const moment = require("moment-timezone");
    const time = moment.tz("Asia/Kolkata").format("HH:mm:ss D/MM/YYYY");
    const userName = await Users.getNameUser(senderID);
    const threadInfo = (await Threads.getData(threadID)).threadInfo || {};

    // List of banned phrases (case insensitive)
    const bannedPhrases = [
        "stupid bot", "dumb bot", "useless bot", "idiot bot", "worthless bot", 
        "fuck you bot", "bot sucks", "shit bot", "motherfucker bot", 
        "retarded bot", "garbage bot", "trash bot", "hate this bot", 
        "worst bot", "delete bot", "kill bot", "die bot", "bot is trash",
        "bot is stupid", "bot is dumb", "admin is stupid", "developer is dumb"
    ].map(phrase => phrase.toLowerCase());

    // Check if message contains any banned phrase
    const message = body.toLowerCase();
    const foundPhrase = bannedPhrases.find(phrase => 
        message.includes(phrase) || 
        message === phrase || 
        message === phrase.toUpperCase()
    );

    if (foundPhrase) {
        const userData = (await Users.getData(senderID)).data || {};
        userData.banned = 1;
        userData.reason = `Insult: ${foundPhrase}`;
        userData.dateAdded = time;
        
        await Users.setData(senderID, { data: userData });
        global.data.userBanned.set(senderID, { 
            reason: userData.reason, 
            dateAdded: userData.dateAdded 
        });

        // Notification to banned user
        const banMessage = {
            body: `⚠️ You have been banned from using this bot\n• Reason: ${userData.reason}\n• To request unban, contact admin\n• Admin: ${global.config.FACEBOOK_ADMIN}\n• Ban decision is at admin's discretion`
        };
        
        await api.sendMessage(banMessage, threadID);

        // Notify all admins
        const adminList = [...Object.values(global.config.ADMINBOT), ...Object.values(global.config.NDH)];
        const notificationMessage = `🚨 User Banned 🚨\n──────────────────\n• User: ${userName}\n• UID: ${senderID}\n• Group: ${threadInfo.threadName || 'Unknown'}\n• Reason: ${userData.reason}\n• Time: ${time}\n\nThe user has been automatically banned from using the bot.`;

        for (const admin of adminList) {
            api.sendMessage(notificationMessage, admin, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    author: senderID,
                    messageID: info.messageID,
                    originalMessageID: messageID,
                    threadID: threadID,
                    type: "insultReport"
                });
            });
        }
    }
};

module.exports.run = () => {};
