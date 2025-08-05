const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const pathFile = path.join(__dirname, 'data', 'autoseen.txt');

if (!fs.existsSync(pathFile)) {
 fs.writeFileSync(pathFile, 'false');
}

module.exports.config = {
 name: 'autoseen',
 version: '1.0.0',
 hasPermssion: 3,
 credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
 description: 'Naye message aane par swat: seen chalu/band karein',
 commandCategory: 'Admin',
 usages: 'on/off',
 cooldowns: 5,
};

module.exports.handleEvent = async ({ api, event, args }) => {
 const isEnable = fs.readFileSync(pathFile, 'utf-8');
 if (isEnable === 'true') {
 api.markAsReadAll(() => {});
 }
};

module.exports.run = async ({ api, event, args }) => {
 try {
 if (args && args[0]) {
 if (args[0] === 'on') {
 fs.writeFileSync(pathFile, 'true');
 api.sendMessage('☑️ Naye message aane par autoseen chalu kar diya gaya hai', event.threadID, event.messageID);
 } else if (args[0] === 'off') {
 fs.writeFileSync(pathFile, 'false');
 api.sendMessage('☑️ Naye message aane par autoseen band kar diya gaya hai', event.threadID, event.messageID);
 } else {
 api.sendMessage('⚠️ Kripya chunein: on ya off', event.threadID, event.messageID);
 }
 } else {
 api.sendMessage('⚠️ Kripya chunein: on ya off', event.threadID, event.messageID);
 }
 } catch (e) {
 console.error(e);
 }
};
