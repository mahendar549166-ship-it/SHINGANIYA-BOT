const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
 name: 'changeapp',
 version: '1.0.0',
 hasPermssion: 3,
 credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
 description: 'Bot ka appstate tezi se badlein',
 commandCategory: 'Admin',
 usages: '[]',
 cooldowns: 5,
 images: [],
};

module.exports.run = async ({ api, event }) => {
 try {
 const { configPath } = global.client;
 const config = require(configPath);
 const { threadID, senderID } = event;

 api.sendMessage(`📝 Config ki sthiti: ${config.APPSTATEPATH}\n\n1. fbstate.json\n2. appstate.json\n\n📌 Is sandesh ka jawab dein aur STT + appstate data likhein taaki appstate file badla ja sake`, threadID, (error, info) => {
 global.client.handleReply.push({
 name: module.exports.config.name,
 messageID: info.messageID,
 author: senderID,
 permssion: module.exports.config.hasPermssion,
 });
 });
 } catch (error) {
 console.error('Error in run:', error);
 api.sendMessage('❎ Command ke prakriya mein error aaya!', event.threadID);
 }
};

module.exports.handleReply = async function ({ api, event, args, handleReply }) {
 const { senderID, threadID, messageID } = event;
 const { author, permssion } = handleReply;

 api.unsendMessage(handleReply.messageID);

 if (author !== senderID) {
 return api.sendMessage('❎ Aap is command ke upyogkarta nahi hain', threadID, messageID);
 }

 try {
 switch (args[0]) {
 case '1': {
 const filePathCase1 = path.join(__dirname, './../../fbstate.json');
 const cookiesData = JSON.parse(args.slice(1).join(' '));

 if (!cookiesData.length) {
 return api.sendMessage('❎ Cookies data galat hai!', threadID, messageID);
 }

 if (permssion < 3) {
 return api.sendMessage("⚠️ Is command ko istemal karne ke liye aapke paas paryapt adhikar nahi hain", threadID, messageID);
 }

 const cookiesJson = JSON.stringify(cookiesData, null, 2);
 fs.writeFileSync(filePathCase1, cookiesJson, 'utf-8');
 api.sendMessage('☑️ Appstate safalta se badal diya gaya!\n🔄 Bot ko restart kiya ja raha hai!', threadID, () => process.exit(1));
 break;
 }

 case '2': {
 const filePathCase2 = path.join(__dirname, './../../appstate.json');
 const cookiesData = JSON.parse(args.slice(1).join(' '));

 if (!cookiesData.length) {
 return api.sendMessage('❎ Cookies data galat hai!', threadID, messageID);
 }

 if (permssion < 3) {
 return api.sendMessage("⚠️ Is command ko istemal karne ke liye aapke paas paryapt adhikar nahi hain", threadID, messageID);
 }

 const cookiesJson = JSON.stringify(cookiesData, null, 2);
 fs.writeFileSync(filePathCase2, cookiesJson, 'utf-8');
 api.sendMessage('☑️ Appstate safalta se badal diya gaya!\n🔄 Bot ko restart kiya ja raha hai!', threadID, () => process.exit(1));
 break;
 }

 default: {
 return api.sendMessage('❎ Aapka chayan command mein nahi hai', threadID, messageID);
 }
 }
 } catch (error) {
 console.error('Error in handleReply:', error);
 api.sendMessage('❎ Jawab ke prakriya mein error aaya!', threadID);
 }
};
