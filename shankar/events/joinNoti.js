module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "1.0.1",
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Bot ya user ke samuh mein pravesh ki suchna random gif/chitra/video ke sath",
    dependencies: {
        "fs-extra": "",
        "path": "",
        "pidusage": ""
    }
};

const fs = require("fs");
const axios = require('axios');
const request = require('request');
const moment = require("moment-timezone");

module.exports.run = async function ({ api, event, Users, Threads, handleReply }) {
    const abhiKaSamay = moment.tz("Asia/Kolkata").format("DD/MM/YYYY | HH:mm:ss");
    const shuruSamay = Date.now();
    const t = process.uptime();
    var ghanta = Math.floor(t / (60 * 60));
    var minute = Math.floor((t % (60 * 60)) / 60);
    var second = Math.floor(t % 60);
    var puraSaal = global.client.getTime("fullYear");
    var ghantePao = await global.client.getTime("hours");
    var samayKaal = `${ghantePao < 3 ? "gahri raat" : ghantePao < 8 ? "subah jaldi" : ghantePao < 12 ? "dopahar" : ghantePao < 17 ? "shaam" : ghantePao < 23 ? "shaam" : "gahri raat"}`;
    const { samuhID } = event;
    let samuhJankari = await api.getThreadInfo(event.threadID);
    var sadasyaSankhya = samuhJankari.participantIDs.length;
    let samuhSadasya = samuhJankari.participantIDs.length;
    var purushNaam = [];
    var lingPurush = [];
    var lingMahila = [];
    var koiNahi = [];
    for (let z in samuhJankari.userInfo) {
        var lingEk = samuhJankari.userInfo[z].gender;
        var nNaam = samuhJankari.userInfo[z].name;
        if (lingEk == "MALE") {
            lingPurush.push(z + lingEk);
        } else if (lingEk == "FEMALE") {
            lingMahila.push(lingEk);
        } else {
            koiNahi.push(nNaam);
        }
    }
    var purush = lingPurush.length;
    var mahila = lingMahila.length;
    let prashasak = samuhJankari.adminIDs.length;
    let chinh = samuhJankari.emoji;
    let samuhNaam = samuhJankari.threadName;
    let id = samuhJankari.threadID;
    var prashasakSuchi = '';
    var prashasakIDs = samuhJankari.adminIDs;
    for (let prapt of prashasakIDs) {
        const userJankari = await Users.getInfo(prapt.id);
        prashasakSuchi += `• ${userJankari.name},\n`;
    }
    const samuhSetting = (await Threads.getData(String(event.threadID))).data || {};
    const upasarg = (samuhSetting.hasOwnProperty("PREFIX")) ? samuhSetting.PREFIX : global.config.PREFIX;
    let samuh = global.data.threadData.get(event.threadID) || {};
    if (typeof samuh["join"] == "undefined", samuh["join"] == false) return;
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        api.changeNickname(`『 ${upasarg} 』 ⪼ ${(!global.config.BOTNAME) ? "𝙱𝙾𝚃 𝙳𝚘𝚗𝚐𝙳𝚎𝚟👾" : global.config.BOTNAME}`, samuhID, api.getCurrentUserID());

        api.sendMessage("🔄 Jodne ki prakriya chal rahi hai, kripaya prateeksha karen...", samuhID, async (err, info) => {
            if (!err) {
                await new Promise(resolve => setTimeout(resolve, 9 * 1000));
                await api.unsendMessage(info.messageID);
            }
        });
        setTimeout(() => {
            api.sendMessage("✅ Samuh se safalta se juda gaya", samuhID, async (err, info) => {
                if (!err) {
                    await new Promise(resolve => setTimeout(resolve, 30 * 1000));
                    await api.unsendMessage(info.messageID);
                }
            });
        }, 10 * 1000);

        setTimeout(async () => {
            const sandesh = `𝐒𝐚𝐟𝐚𝐥𝐭𝐚 𝐒𝐞 𝐏𝐮𝐫𝐚 𝐃𝐚𝐭𝐚 𝐋𝐨𝐚𝐝 𝐊𝐢𝐲𝐚 𝐆𝐚𝐲𝐚 𝐒𝐚𝐦𝐮𝐡 𝐊𝐞 𝐋𝐢𝐲𝐞\n\n𝐒𝐚𝐦𝐮𝐡 𝐊𝐚 𝐍𝐚𝐚𝐦: ${samuhNaam},\n𝐒𝐚𝐦𝐮𝐡 𝐔𝐈𝐃: ${id},\n𝐒𝐚𝐦𝐮𝐡 𝐊𝐚 𝐂𝐡𝐢𝐧𝐡: ${chinh || '👍'},\n𝐊𝐮𝐥 𝐒𝐚𝐝𝐚𝐬𝐲𝐚: ${samuhSadasya},\n𝐊𝐮𝐥 𝐏𝐮𝐫𝐮𝐬𝐡 𝐒𝐚𝐝𝐚𝐬𝐲𝐚: ${purush},\n𝐊𝐮𝐥 𝐌𝐚𝐡𝐢𝐥𝐚 𝐒𝐚𝐝𝐚𝐬𝐲𝐚: ${mahila},\n𝐊𝐮𝐥 𝐏𝐫𝐚𝐬𝐡𝐚𝐬𝐚𝐤: ${prashasak},\n𝐏𝐫𝐚𝐬𝐡𝐚𝐬𝐚𝐤𝐨𝐧 𝐊𝐢 𝐒𝐮𝐜𝐡𝐢:\n${prashasakSuchi}\n────────────────────\n⏰ 𝐀𝐛𝐡𝐢 𝐊𝐚 𝐒𝐚𝐦𝐚𝐲: ${abhiKaSamay}\n⚠️ 𝐘𝐞𝐡 𝐒𝐚𝐧𝐝𝐞𝐬𝐡 𝟔𝟎 𝐒𝐞𝐤𝐞𝐧𝐝 𝐌𝐞𝐢𝐧 𝐀𝐩𝐧𝐞 𝐀𝐚𝐩 𝐇𝐚𝐭 𝐉𝐚𝐲𝐞𝐠𝐚`;

            const bhejaSandesh = await api.sendMessage(sandesh, samuhID);

            setTimeout(async () => {
                await api.unsendMessage(bhejaSandesh.messageID);
            }, 60 * 1000);
        }, 12 * 1000);
    } else {
        try {
            const { mainPath } = global.client;
            const pathE = mainPath + '/shankar/commands/data/dataEvent.json';
            const dataE = JSON.parse(fs.readFileSync(pathE));
            const samuhDhoondho = dataE.join.find(i => i.threadID === samuhID);
            if (samuhDhoondho) {
                if (!samuhDhoondho.status) return;
            }
            let { samuhNaam, participantIDs } = await api.getThreadInfo(samuhID);
            const moment = require("moment-timezone");
            const ghante = moment.tz("Asia/Kolkata").format("HH");
            const samay = moment.tz("Asia/Kolkata").format("DD/MM/YYYY | HH:mm:ss");
            const samuhData = global.data.threadData.get(parseInt(samuhID)) || {};
            var ullekh = [], naamArray = [], sadasyaSankhya = [], userID = [], i = 0;
            for (id in event.logMessageData.addedParticipants) {
                const userNaam = event.logMessageData.addedParticipants[id].fullName;
                userID.push(event.logMessageData.addedParticipants[id].userFbId.toString());
                naamArray.push(userNaam);
                ullekh.push({ tag: userNaam, id: event.senderID });
                sadasyaSankhya.push(participantIDs.length - i++);
            }
            sadasyaSankhya.sort((a, b) => a - b);
            (typeof samuhData.customJoin == "undefined") ? sandesh = "[ Sadasya Pravesh ]\n────────────────────\n👤 Naam: {name}\n🔗 Link: https://www.facebook.com/profile.php?id={iduser}\n📝 {type} samuh ka {soThanhVien} sadasya hai: {threadName}\n✏️ Samuh mein joda gaya dwara: {author}\n🔗 Link: https://www.facebook.com/profile.php?id={uidAuthor}\n────────────────────\n⏰ Samay: {time}" : sandesh = samuhData.customJoin;
            var naamLekhak = await Users.getNameUser(event.author);
            sandesh = sandesh
                .replace(/\{iduser}/g, userID.join(', '))
                .replace(/\{name}/g, naamArray.join(', '))
                .replace(/\{type}/g, (sadasyaSankhya.length > 1) ? 'Aap sab' : 'Aap')
                .replace(/\{soThanhVien}/g, sadasyaSankhya.join(', '))
                .replace(/\{threadName}/g, samuhNaam)
                .replace(/\{author}/g, naamLekhak)
                .replace(/\{uidAuthor}/g, event.author)
                .replace(/\{buoi}/g, samayKaal)
                .replace(/\{time}/g, samay);
            const datalink = require('./../../includes/datajson/vdgai.json');
            const vdurl = datalink[Math.floor(Math.random() * datalink.length)];
            let streamURL = (url, ext = 'jpg') => axios.get(url, {
                responseType: 'stream',
            }).then(res => (res.data.path = `tmp.${ext}`, res.data)).catch(e => null);
            a = { body: sandesh, attachment: await streamURL(vdurl, 'mp4') };
            return api.sendMessage(a, samuhID, async (err, info) => {
                await new Promise(resolve => setTimeout(resolve, 20 * 1000));
                return api.unsendMessage(info.messageID);
            });
        } catch (e) {
            return console.log(e);
        }
    }
};
