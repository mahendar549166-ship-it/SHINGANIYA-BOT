const fs = require('fs');
const ytdl = require('@distube/ytdl-core');
const { resolve } = require('path');
const moment = require("moment-timezone");

async function getdl(link, path) {
    var samayShuru = Date.now();
    if (!link) return 'Link nahi hai';
    var resolveFunc = function () { };
    var rejectFunc = function () { };
    var returnPromise = new Promise(function (resolve, reject) {
        resolveFunc = resolve;
        rejectFunc = reject;
    });
    ytdl(link, {
        filter: format =>
            format.quality == 'tiny' && format.audioBitrate == 128 && format.hasAudio == true
    }).pipe(fs.createWriteStream(path))
        .on("close", async () => {
            var data = await ytdl.getInfo(link);
            var parinaam = {
                shirshak: data.videoDetails.title,
                avadhi: Number(data.videoDetails.lengthSeconds),
                dekhCount: data.videoDetails.viewCount,
                pasand: data.videoDetails.likes,
                uploadTareekh: data.videoDetails.uploadDate,
                sadasya: data.videoDetails.author.subscriber_count,
                lekhak: data.videoDetails.author.name,
                samayShuru: samayShuru
            };
            resolveFunc(parinaam);
        });
    return returnPromise;
}

module.exports.config = {
    naam: "sing",
    version: "1.0.0",
    anumati: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    vivaran: "YouTube par khoj ke saath gaana bajao",
    commandCategory: "Upyogita",
    upyog: "[khojSangeet]",
    cooldowns: 0,
    tasveerein: [],
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
    const axios = require('axios');
    const { createReadStream, unlinkSync, statSync } = require("fs-extra");
    const id = handleReply.link[event.body - 1];
    try {
        var path = `${__dirname}/cache/gaana-${event.senderID}.mp3`;
        var data = await getdl(`https://www.youtube.com/watch?v=${id}`, path);      
        if (fs.statSync(path).size > 26214400) {
            return api.sendMessage('❎ File bahut bada hai, kripya doosra gaana chunein!', event.threadID, () => fs.unlinkSync(path), event.messageID);
        }
        api.unsendMessage(handleReply.messageID);
        return api.sendMessage({
            body: `[ YouTube Sangeet ]\n──────────────────\n|› 🎬 Shirshak: ${data.shirshak}\n|› ⏱️ Avadhi: ${convertHMS(data.avadhi)} second\n|› 🗓️ Upload Tareekh: ${data.uploadTareekh}\n|› 👤 Channel Naam: ${data.lekhak} (${data.sadasya})\n|› 🌐 Dekha: ${data.dekhCount}\n|› 📥 Download Link: https://www.youtubepp.com/watch?v=${id}\n|› ⏳ Processing Samay: ${Math.floor((Date.now() - data.samayShuru) / 1000)} second\n──────────────────\n|› ⏰ Samay: ${moment.tz("Asia/Kolkata").format("HH:mm:ss | DD/MM/YYYY")}`,
            attachment: createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path), event.messageID);

    } catch (e) {
        console.log(e);
    }
};

function convertHMS(value) {
    const sec = parseInt(value, 10); 
    let ghante = Math.floor(sec / 3600);
    let minute = Math.floor((sec - (ghante * 3600)) / 60); 
    let second = sec - (ghante * 3600) - (minute * 60); 
    if (ghante < 10) {ghante = "0"+ghante;}
    if (minute < 10) {minute = "0"+minute;}
    if (second < 10) {second = "0"+second;}
    return (ghante != '00' ? ghante +':': '') + minute+':'+second;
}

module.exports.run = async function ({ api, event, args }) {
    if (args.length == 0 || !args) return api.sendMessage('❎ Khoj ka hissa khali nahi hona chahiye!', event.threadID, event.messageID);
    const keywordKhoj = args.join(" ");
    const path = `${__dirname}/cache/gaana-${event.senderID}.mp3`;
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
    try {
        const link = [];
        const Youtube = require('youtube-search-api');
        const data = (await Youtube.GetListByKeyword(keywordKhoj, false, 8)).items;
        const sandesh = data.map((value, index) => {
            link.push(value.id);
            return `|› ${index + 1}. ${value.title}\n|› 👤 Channel: ${value.channelTitle}\n|› ⏱️ Avadhi: ${value.length.simpleText}\n──────────────────`;
        }).join('\n');
        return api.sendMessage(`📝 Aapke khoj ke shabd se ${link.length} parinaam mile:\n──────────────────\n${sandesh}\n\n📌 Gaana download karne ke liye STT ke saath jawab dein`, event.threadID, (error, info) => global.client.handleReply.push({
            type: 'jawab',
            naam: this.config.naam,
            messageID: info.messageID,
            lekhak: event.senderID,
            link
        }), event.messageID);
    } catch (e) {
        return api.sendMessage('❎ Error ho gaya, kripya baad mein dobara koshish karein!\n' + e, event.threadID, event.messageID);
    }
};
