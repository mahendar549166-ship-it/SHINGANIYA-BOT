module.exports.config = {
    name: "totinh",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Pyar ka izhaar karein",
    commandCategory: "Khel",
    usages: "[purush/mahila] [naam dhoondh]",
    cooldowns: 5
};

function getMsg() {
    // Aap yahan naye jode ke liye badhai ka sandesh customize kar sakte hain
    return `Sab log milkar is naye jode ki khushi mein badhai dein 🥰`
}

module.exports.handleReaction = async function({ api, event, handleReaction, Users, Threads }) {
    var { threadID, messageID, userID } = event;
    var { change, talkID } = handleReaction;
    const { PREFIX } = global.config;
    if (userID == change.ID) {
        var userInfo = await Users.getData(talkID);
        var matesInfo = await Users.getData(change.ID);
        var infoUser_1 = await Users.getData(talkID);
        var infoUser_2 = await Users.getData(change.ID);
        if (!infoUser_1.data) infoUser_1.data = new Object();
        if (!infoUser_2.data) infoUser_2.data = new Object();
        infoUser_1.data.dating = { status: true, mates: change.ID, time: { origin: Date.now(), fullTime: global.client.getTime('fullTime') } };
        infoUser_2.data.dating = { status: true, mates: talkID, time: { origin: Date.now(), fullTime: global.client.getTime('fullTime') } };
        await Users.setData(talkID, infoUser_1);
        await Users.setData(change.ID, infoUser_2);
        return api.sendMessage(`Aapne is sandesh par reaction diya, iska matlab hai ki aapne doosre vyakti ke pyar ke izhaar ko sweekar kiya hai.\n\n${getMsg()}\nNotes:\n- Agle 7 din tak aap dono alag nahi ho sakte.\n- Abhi aap apne jode ki jankari ${PREFIX}dating info se dekh sakte hain`, threadID, async (error, info) => {
            api.changeNickname(`${change.name} - Dating with ${infoUser_1.name}`, threadID, change.ID);
            var { userInfo } = await Threads.getInfo(threadID);
            if (Object.keys(userInfo).includes(talkID)) {
                api.changeNickname(`${userInfo_1.name} - Dating with ${change.name}`, threadID, talkID);
            }
            api.sendMessage(`${change.name} ne aapke pyar ke izhaar ko sweekar kar liya hai, ab aap dono dating status mein hain. Aap apne jode ki jankari dating command se dekh sakte hain.`, talkID);
        })
    }
}

module.exports.handleReply = async function({ api, event, handleReply, Threads }) {
    var { threadID, messageID, senderID, body } = event;
    var { type, match } = handleReply;
    switch (type) {
        case "change":
            if (isNaN(body)) return api.sendMessage(`Aapka chayan ek positive number hona chahiye.`, threadID, messageID);
            if (body > match.length) return api.sendMessage(`Aapka chayan list mein nahi hai.`, threadID, messageID);
            var change = match[body - 1];
            return api.sendMessage(`Kripya is sandesh ka jawab dein aur us vyakti ke liye sandesh likhein jo aap bhejna chahte hain.`, threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    change: change,
                    type: "message"
                })
            })
        case "message":
            if (!body) return api.sendMessage(`Aapko sandesh likhna zaroori hai.`, threadID, messageID);
            var { change } = handleReply;
            var allThreads = await Threads.getAll();
            var allThreadsInfo = [], finish = 0
            for (var i of allThreads) {
                var { userInfo: allUsers } = await Threads.getInfo(i.threadID);
                for (var user of allUsers) {
                    if (user.id == change.ID) {
                        var msg = {
                            body: `Hey ~ ${change.name} - Aapko ek gumnam vyakti se pyar ka izhaar mila hai:\n\n${body}.\n\nAgar aap sweekar karte hain, to is sandesh par <3 reaction dein.`,
                            mentions: [ { tag: change.name, id: change.ID } ]
                        };
                        return api.sendMessage(msg, i.threadID, (error, info) => {
                            finish++;
                            global.client.handleReaction.push({
                                name: this.config.name,
                                messageID: info.messageID,
                                change: change,
                                talkID: senderID,
                                type: 'accept'
                            })
                            api.sendMessage(`Aapka pyar ka izhaar ${change.name} ke liye safalta se bhej diya gaya hai. Jab ${change.name} sweekar karega, aapko suchit kiya jayega`, threadID);
                        })
                        if (finish == 0) return api.sendMessage(`${change.name} ke liye pyar ka izhaar bhejne mein galti hui, kripya dobara koshish karein.`, threadID);
                    }
                }
            }
        default:
            break;
    }
}

module.exports.run = async function({ api, args, event, Users }) {
    var { threadID, messageID, senderID, isGroup } = event;
    var { allowInbox } = global.config;
    if (isGroup == true) return api.sendMessage(`Yeh command box mein nahi chal sakta, kripya Bot ke saath private chat karein.`, threadID);
    if (allowInbox == false) return api.sendMessage(`Is command ko istemal karne ke liye, kripya config mein allowInbox chalu karein`, threadID);
    if (!/Mahila|Purush|mahila|purush/g.test(args[0])) return api.sendMessage(`Aapko us vyakti ka ling daalna hoga jise aap dhoondhna chahte hain.\n\nUdaharan: <prefix>totinh purush/mahila p`, threadID, messageID);
    if (!/[a-z]|[A-Z]/g.test(args[1])) return api.sendMessage(`Dhoondhne ko asaan banane ke liye, aapko pehla akshar ya naam daalna hoga.`, threadID, messageID);
    var userInfo = await Users.getData(senderID);
    if (userInfo.data && userInfo.data.dating && userInfo.data.dating.status == true) return api.sendMessage(`Kya aap kisi aur ko dhoka dekar kisi aur se pyar ka izhaar karna chahte hain?`, threadID, messageID);
    switch (args[0]) {
        case "Purush":
        case "purush":
            var gender = 2;
            break;
        case "Mahila":
        case "mahila":
            var gender = 1;
            break;
        default:
            break;
    }
    var match = [], msg = 'Yeh hain woh log jinse aap pyar ka izhaar kar sakte hain:\n\n', number = 1;
    var allUsersInfo = await Users.getAll();
    for (var i of allUsersInfo) {
        if (i.name.toLowerCase().includes(args[1].toLowerCase())) {
            if (i.data !== null && !i.data.dating || i.data !== null && i.data.dating && i.data.dating.status == false) {
                let uif = await Users.getInfo(i.userID);
                if (uif.gender == gender) match.push({ ID: i.userID, name: i.name });
            }
        }
    }
    if (match.length == 0) return api.sendMessage(`Maaf kijiye, koi aisa vyakti nahi mila jisse aap pyar ka izhaar kar sakte hain.`, threadID);
    for (var i of match) msg += `${number++}. ${i.name}\n`;
    msg += `\nIs sandesh ka jawab dein aur us number ke saath jo vyakti se aap pyar ka izhaar karna chahte hain.`;
    return api.sendMessage(msg, threadID, (error, info) => {
        global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            type: 'change',
            match: match
        })
    });
}
