module.exports.config = {
    name: "data",
    version: "0.0.1",
    hasPermssion: 3,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "System ka database",
    commandCategory: "Admin",
    cooldowns: 5,
    images: [],
};

module.exports.run = async ({ event, api, args, Currencies }) => {
    const { threadID, messageID } = event;
    return api.sendMessage(`[ SYSTEM DATABASE ]\n──────────────────\n1. Group ke sadasyon ka money reset karen\n2. Group ka exp/tinnhan reset karen\n3. Group ke sadasyon ka data load karen\n4. System par sabhi group ka data load karen\n5. System par sabhi users ka data load karen\n\n📌 Anurodh ko pura karne ke liye STT ka reply (phanhoti) karen`, threadID, (error, info) => {
        global.client.handleReply.push({
            type: "choosee",
            name: module.exports.config.name,
            author: event.senderID,
            messageID: info.messageID
        });
    }, messageID);
};

module.exports.handleReply = async function ({
    event,
    Users,
    api,
    Threads,
    handleReply,
    Currencies,
    __GLOBAL
}) {
    const { threadID } = event;

    switch (handleReply.type) {
        case "choosee": {
            switch (event.body.toLowerCase()) {
                case "1": {
                    api.unsendMessage(handleReply.messageID);
                    const data = await api.getThreadInfo(threadID);
                    for (const user of data.userInfo) {
                        var currenciesData = await Currencies.getData(user.id);
                        if (currenciesData != false) {
                            var money = currenciesData.money;
                            if (typeof money != "undefined") {
                                money = 0;
                                await Currencies.setData(user.id, { money });
                            }
                        }
                    }
                    return api.sendMessage("☑️ Group ke sadasyon ka money 0 kar diya gaya hai", threadID);
                }
                case "2": {
                    api.unsendMessage(handleReply.messageID);
                    const data = await api.getThreadInfo(threadID);
                    for (const user of data.userInfo) {
                        var currenciesData = await Currencies.getData(user.id);
                        if (currenciesData != false) {
                            var exp = currenciesData.exp;
                            if (typeof exp != "undefined") {
                                exp = 0;
                                await Currencies.setData(user.id, { exp });
                            }
                        }
                    }
                    return api.sendMessage("☑️ Group ka exp/tinnhan 0 kar diya gaya hai", threadID);
                }
                case "3": {
                    const { setData } = Users;
                    var { participantIDs } = await Threads.getInfo(threadID) || await api.getThreadInfo(threadID);
                    for (const id of participantIDs) {
                        let data = await api.getUserInfo(id);
                        let userName = data[id].name;
                        await Users.setData(id, { name: userName, data: {} });
                    }
                    api.unsendMessage(handleReply.messageID);
                    return api.sendMessage(`☑️ Group ke sadasyon ka data update kar diya gaya hai`, threadID);
                }
                case "4": {
                    api.unsendMessage(handleReply.messageID);
                    const { setData } = Threads;
                    var inbox = await api.getThreadList(100, null, ['INBOX']);
                    let list = [...inbox].filter(group => group.isSubscribed && group.isGroup);
                    const lengthGroup = list.length;
                    for (var groupInfo of list) {
                        var threadInfo = await api.getThreadInfo(groupInfo.threadID);
                        await Threads.setData(groupInfo.threadID, { threadInfo });
                    }
                    return api.sendMessage(`☑️ ${lengthGroup} group ka data update kar diya gaya hai`, threadID);
                }
                case "5": {
                    api.unsendMessage(handleReply.messageID);
                    const { setData } = Users;
                    var threads = await api.getThreadList(100, null, ['INBOX']);
                    let loadedUsers = 0;
                    for (const thread of threads) {
                        var { participantIDs } = await Threads.getInfo(thread.threadID) || await api.getThreadInfo(thread.threadID);
                        for (const id of participantIDs) {
                            let data = await api.getUserInfo(id);
                            let userName = data[id].name;
                            await Users.setData(id, { name: userName, data: {} });
                            loadedUsers++;
                            console.log(`Loaded user ${loadedUsers}: ${userName} (${id})`);
                        }
                    }
                    return api.sendMessage(`👉 Safalta se ${loadedUsers} users ka data sabhi group mein load kar diya gaya hai`, threadID);
                }
                default:
                    const choose = parseInt(event.body);
                    if (isNaN(event.body)) return api.sendMessage("❎ Kripya ek number daalein", threadID);
                    if (choose > 10 || choose < 1) return api.sendMessage("❎ Vikalp list mein nahi hai", threadID);
            }
        }
    }
};
