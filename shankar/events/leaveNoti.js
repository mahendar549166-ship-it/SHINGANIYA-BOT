const axios = require("axios");
const moment = require("moment-timezone");
const fs = require('fs');

module.exports.config = {
    name: "leaveNoti",
    eventType: ["log:unsubscribe"],
    version: "1.0.0",
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Bot ya vyakti ke samuh se nikalne ki suchna random gif/chitra/video ke sath",
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

const checkttPath = __dirname + '/../commands/data/checktt/';

module.exports.run = async function ({ api, event, Users, Threads }) {
    try {
        const { samuhID } = event;
        const { mainPath } = global.client;
        const pathLeave = mainPath + '/shankar/commands/data/dataEvent.json';
        const dataLeave = JSON.parse(fs.readFileSync(pathLeave));
        const nikalneKaDhoondho = dataLeave.leave.find(i => i.threadID === samuhID);

        if (nikalneKaDhoondho) {
            if (!nikalneKaDhoondho.status) return;
        }
        const { createReadStream, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
        const { join } = global.nodemodule["path"];

        var puraSaal = global.client.getTime("fullYear");
        var ghantePao = await global.client.getTime("hours");

        if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

        const samay = moment.tz("Asia/Kolkata").format("HH:mm:ss | DD/MM/YYYY");
        const data = global.data.threadData.get(parseInt(samuhID)) || (await Threads.getData(samuhID)).data;
        const userID = event.logMessageData.leftParticipantFbId;
        var praptData = await Users.getData(event.author);
        var naamLekhak = typeof praptData.name == "undefined" ? "" : praptData.name;
        const naam = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
        const prakar = (event.author == event.logMessageData.leftParticipantFbId) ? "Apne aap samuh se nikal gaya" : `Prashasak ne samuh se nikala\n👤 Nikalne wala: ${naamLekhak}\n🔗 Link: https://www.facebook.com/profile.php?id=${event.author}`;
        if (existsSync(checkttPath + samuhID + '.json')) {
            const samuhData = JSON.parse(readFileSync(checkttPath + samuhID + '.json'));
            const userData_saptah_index = samuhData.week.findIndex(e => e.id == event.logMessageData.leftParticipantFbId);
            const userData_din_index = samuhData.day.findIndex(e => e.id == event.logMessageData.leftParticipantFbId);
            const userData_kul_index = samuhData.total.findIndex(e => e.id == event.logMessageData.leftParticipantFbId);
            if (userData_kul_index != -1) {
                samuhData.total.splice(userData_kul_index, 1);
            }
            if (userData_saptah_index != -1) {
                samuhData.week.splice(userData_saptah_index, 1);
            }
            if (userData_din_index != -1) {
                samuhData.day.splice(userData_din_index, 1);
            }
            writeFileSync(checkttPath + samuhID + '.json', JSON.stringify(samuhData, null, 4));
        }

        (typeof data.customLeave == "undefined") ? sandesh = "[ Sadasya Samuh Se Nikla ]\n────────────────────\n👤 Naam: {name}\n🔗 Link: https://www.facebook.com/profile.php?id={iduser}\n📝 {type}\n────────────────────\n⏰ Samay: {time}" : sandesh = data.customLeave;
        var praptData = await Users.getData(event.author);
        var naamLekhak = typeof praptData.name == "undefined" ? "" : praptData.name;
        sandesh = sandesh.replace(/\{name}/g, naam).replace(/\{type}/g, prakar).replace(/\{iduser}/g, userID).replace(/\{time}/g, samay).replace(/\{author}/g, naamLekhak).replace(/\{uidAuthor}/g, event.author);
        return api.sendMessage(sandesh, samuhID, async (err, info) => {
            await new Promise(resolve => setTimeout(resolve, 20 * 1000));
            return api.unsendMessage(info.messageID);
        });

    } catch (e) {
        console.log(e);
    }
};
