const fs = require('fs');
const ytdl = require('ytdl-core');
const { resolve } = require('path');
const moment = require("moment-timezone");
var samay = moment.tz("Asia/Kolkata").format("HH:mm:ss");

async function youtubeSeGaanaDownload(link, path) {
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
    naam: "sing1",
    version: "1.0.0",
    anumati: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    vivaran: "YouTube link ya khoj ke shabd ke jariye gaana bajao",
    commandCategory: "Upyogita",
    upyog: "[khojSangeet]",
    cooldowns: 0
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
    const axios = require('axios');
    const { createReadStream, unlinkSync, statSync } = require("fs-extra");
    try {
        var path = `${__dirname}/cache/gaana-${event.senderID}.mp3`;
        var data = await youtubeSeGaanaDownload('https://www.youtube.com/watch?v=' + handleReply.link[event.body - 1], path);
        if (fs.statSync(path).size > 26214400) return api.sendMessage('❎ File bhejne mein asamarth. Kripya doosra gaana chunein!', event.threadID, () => fs.unlinkSync(path), event.messageID);
        api.unsendMessage(handleReply.messageID);
        return api.sendMessage({ 
            body: `[ SANGEET KI DUNIA ]\n🎬 Gaana: ${data.shirshak} ( ${this.convertHMS(data.avadhi)} )\n⏱ Upload Tareekh: ${data.uploadTareekh}\n🔍 Channel Naam: ${data.lekhak} ( ${data.sadasya} )\n🌐 Dekha: ${data.dekhCount}\n👍 Pasand: ${data.pasand}\n📥 Download Link: https://www.y2meta.com/hi/youtube/${handleReply.link[event.body - 1]}\n⏳ Processing Samay: ${Math.floor((Date.now()- data.samayShuru)/1000)} second`,
            attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    }
    catch (e) { return console.log(e); }
};

module.exports.convertHMS = function(value) {
    const sec = parseInt(value, 10); 
    let ghante = Math.floor(sec / 3600);
    let minute = Math.floor((sec - (ghante * 3600)) / 60); 
    let second = sec - (ghante * 3600) - (minute * 60); 
    if (ghante < 10) {ghante = "0"+ghante;}
    if (minute < 10) {minute = "0"+minute;}
    if (second < 10) {second = "0"+second;}
    return (ghante != '00' ? ghante +':': '') + minute+':'+second;
};

module.exports.run = async function ({ api, event, args }) {
    let axios = require('axios');
    if (args.length == 0 || !args) return api.sendMessage('❎ Khoj ka hissa khali nahi hona chahiye!', event.threadID, event.messageID);
    const keywordKhoj = args.join(" ");
    var path = `${__dirname}/cache/gaana-${event.senderID}.mp3`;
    if (fs.existsSync(path)) { 
        fs.unlinkSync(path);
    }
    if (args.join(" ").indexOf("https://") == 0) {
        try {
            var data = await youtubeSeGaanaDownload(args.join(" "), path);
            if (fs.statSync(path).size > 2621440000) return api.sendMessage('❎ File bhejne mein asamarth kyunki samay 01:10:10 se adhik hai. Kripya bina awaaz wala file chunein.', event.threadID, () => fs.unlinkSync(path), event.messageID);
            return api.sendMessage({ 
                body: `[ SANGEET KI DUNIA ]\n━━━━━━━━━━━━━━━━\n🎬 Gaana: ${data.shirshak} ( ${this.convertHMS(data.avadhi)} )\n⏱ Upload Tareekh: ${data.uploadTareekh}\n🔍 Channel Naam: ${data.lekhak} ( ${data.sadasya} )\n🌐 Dekha: ${data.dekhCount}\n👍 Pasand: ${data.pasand}\n⏳ Processing Samay: ${Math.floor((Date.now()- data.samayShuru)/1000)} second`,
                attachment: fs.createReadStream(path)
            }, event.threadID, () => fs.unlinkSync(path), event.messageID);
        }
        catch (e) { return console.log(e); }
    } else {
        try {
            var link = [],
                sandesh = "",
                sankhya = 0,
                num = 0;
            var tasveerThumnail = [];
            const Youtube = require('youtube-search-api');
            var data = (await Youtube.GetListByKeyword(keywordKhoj, false, 6)).items;
            for (let value of data) {
                link.push(value.id);
                let folderThumnail = __dirname + `/cache/${num+=1}.png`;
                let linkThumnail = `https://img.youtube.com/vi/${value.id}/hqdefault.jpg`;
                let getThumnail = (await axios.get(`${linkThumnail}`, {
                    responseType: 'arraybuffer'
                })).data;
                let datac = (await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${value.id}&key=AIzaSyANZ2iLlzjDztWXgbCgL8Oeimn3i3qd0bE`)).data;
                fs.writeFileSync(folderThumnail, Buffer.from(getThumnail, 'utf-8'));
                tasveerThumnail.push(fs.createReadStream(__dirname + `/cache/${num}.png`));
                let channel = datac.items[0].snippet.channelTitle;
                sankhya = sankhya+=1;
                if (sankhya == 1) var num1 = "1. ";
                if (sankhya == 2) var num1 = "2. ";
                if (sankhya == 3) var num1 = "3. ";
                if (sankhya == 4) var num1 = "4. ";
                if (sankhya == 5) var num1 = "5. ";
                if (sankhya == 6) var num1 = "6. ";

                sandesh += (`${num1} - ${value.title} ( ${value.length.simpleText} )\n➝ Channel: ${channel}\n━━━━━━━━━━━━━━━━━━\n`);
            }
            var body = `➝ ${link.length} parinaam aapke khoj ke shabd se mile:\n━━━━━━━━━━━━━━━━━━\n${sandesh}➝ Kripya jawab dein (reply) aur upar ke khoj parinaam mein se ek chunein`;
            return api.sendMessage({
                attachment: tasveerThumnail,
                body: body
            }, event.threadID, (error, info) => global.client.handleReply.push({
                type: 'jawab',
                naam: this.config.naam,
                messageID: info.messageID,
                lekhak: event.senderID,
                link
            }), event.messageID);
        } catch(e) {
            return api.sendMessage('Error ho gaya, kripya thodi der baad dobara koshish karein!!\n' + e, event.threadID, event.messageID);
        }
    }
};
