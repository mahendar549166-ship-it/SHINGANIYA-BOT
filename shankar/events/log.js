const moment = require("moment-timezone");
const axios = require("axios");

module.exports.config = {
    name: "log",
    eventType: ["log:unsubscribe", "log:subscribe", "log:thread-name"],
    version: "1.0.0",
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Bot ki gatividhiyon ka suchna patr banaye!",
    envConfig: {
        enable: true,
    },
};

module.exports.run = async function ({ api, event, Users, Threads, Currencies }) {
    const logger = require("../../utils/log");
    const botID = api.getCurrentUserID();
    const samuhJankari = await api.getThreadInfo(event.threadID);
    const samuhNaam = samuhJankari.threadName || "Naam maujood nahi";
    const samuhSadasya = samuhJankari.participantIDs.length;
    const ling = samuhJankari.approvalMode;
    const praman = ling === false ? "Band" : ling === true ? "Chalu" : '\n';
    const prashasak = samuhJankari.adminIDs.length;
    const chinh = samuhJankari.emoji;
    const userNaam = global.data.userName.get(event.author) || await Users.getNameUser(event.author);
    const samay = moment.tz("Asia/Kolkata").format("DD/MM/YYYY HH:mm:ss");

    let kaarya = "";

    switch (event.logMessageType) {
        case "log:thread-name": {
            const nayaNaam = event.logMessageData.name || "Naam maujood nahi";
            kaarya = `Vyakti ne samuh ka naam badal kar ${nayaNaam} kiya`;
            await Threads.setData(event.threadID, { name: nayaNaam });
            break;
        }
        case "log:subscribe": {
            if (event.logMessageData.addedParticipants.some(i => i.userFbId == botID)) {
                kaarya = "Vyakti ne bot ko naye samuh mein joda!";
            }
            break;
        }
        case "log:unsubscribe": {
            if (event.logMessageData.leftParticipantFbId == botID) {
                if (event.senderID == botID) return;
                const data = (await Threads.getData(event.threadID)).data || {};
                data.banned = true;
                const kaaran = "Bot ko bina anumati ke nikala gaya";
                data.reason = kaaran || null;
                data.dateAdded = samay;
                await Threads.setData(event.threadID, { data });
                global.data.threadBanned.set(event.threadID, { reason: data.reason, dateAdded: data.dateAdded });
                kaarya = "Vyakti ne bot ko samuh se nikala!";
            }
            break;
        }
        default:
            break;
    }

    if (kaarya.length === 0) return;

    const pratiwedan = `|› Samuh ka Naam: ${samuhNaam}\n|› TID: ${event.threadID}\n|› Sadasya Sankhya: ${samuhSadasya}\n|› Pramaanikaran: ${praman}\n|› Prashasak: ${prashasak}\n|› Bhavuk Chinh: ${chinh ? chinh : 'Koi istemal nahi'}\n──────────────────\n|› Karyawahi: ${kaarya}\n|› User ka Naam: ${userNaam}\n|› Uid: ${event.author}\n|› Facebook Link: https://www.facebook.com/profile.php?id=${event.author}\n──────────────────\n⏰️=『${samay}』=⏰️`;

    return api.sendMessage(pratiwedan, global.config.NDH[0], (error, info) => {
        if (error) return logger(pratiwedan, "[ Gatividhi Suchna ]");
    });
};
