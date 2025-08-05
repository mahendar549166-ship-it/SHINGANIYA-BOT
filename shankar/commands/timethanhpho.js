const axios = require('axios');
const fse = require('fs-extra');
const moment = require('moment-timezone');
const imageDownloader = require('image-downloader');

/*const DownLoad = async (url, file, ext) => {
 const array = [];

 for (let i = 0; i < url.length; i++) {
 const dest = `${__dirname}/cache/${file}_${i}.${ext}`;
 await imageDownloader.image({ url: url[i], dest });
 array.push(fse.createReadStream(dest));
 fse.unlinkSync(dest);
 }

 return array;
};*/

const config = {
 name: 'timethanhpho',
 version: '1.1.1',
 hasPermssion: 0,
 credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
 description: 'Jaise naam hai',
 commandCategory: 'Sadasya',
 usages: 'shahar ka samay dekho',
 cooldowns: 5,
};

const run = async ({ api, event }) => {
 const { threadID: tid, messageID: mid, senderID: sid, args } = event;

 const getTimeFormatted = (timezone) => moment.tz(timezone).format("HH:mm:ss || D/MM/YYYY");

 const timezones = [
 { name: 'Hà Nội', timezone: 'Asia/Kolkata' },
 { name: 'London', timezone: 'Europe/London' },
 { name: 'New York', timezone: 'America/New_York' },
 { name: 'Seoul', timezone: 'Asia/Seoul' },
 { name: 'Tokyo', timezone: 'Asia/Tokyo' },
 { name: 'Brasília', timezone: 'America/Brasilia' },
 { name: 'Kuala Lumpur', timezone: 'Asia/Kuala_Lumpur' },
 { name: 'Paris', timezone: 'Europe/Paris' },
 { name: 'Lisbon', timezone: 'Europe/Lisbon' },
 ];

 const images = [
 "https://i.imgur.com/2dvR7Wp.jpeg",
 "https://i.imgur.com/wxWx21V.png",
 "https://i.imgur.com/YA4eZGl.jpeg",
 "https://i.imgur.com/KHT6I9i.png",
 "https://i.imgur.com/6jAwMWB.png",
 "https://i.imgur.com/BOGXcfD.png",
 "https://i.imgur.com/gevqTxd.png",
 "https://i.imgur.com/KxSUuPk.png",
 "https://i.imgur.com/DZ4iF2k.png"
 // ... add more image URLs as needed
 ];

 const formattedTimes = timezones.map(({ name, timezone }) => `${name}: ${getTimeFormatted(timezone)}`).join('\n');

 const messageBody = `🌐=== 「 SHAHAR KA SAMAY 」===🌐\n\n${formattedTimes}\n\n→ Upar diya gaya hai vibhinn desh ke shaharon ka samay 🌸`;
 api.sendMessage(messageBody, tid, mid);
};

module.exports = { config, run };
