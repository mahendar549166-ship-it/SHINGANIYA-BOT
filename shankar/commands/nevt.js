const axios = require('axios');
const fs = require('fs');

module.exports = {
 config: {
 name: 'nevt',
 version: '0.0.1',
 hasPermssion: 3,
 credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
 description: 'https://niiozic.site/note/:UUID',
 commandCategory: 'Admin',
 usages: '[]',
 images: [],
 cooldowns: 3,
 },
 run: async function(o) {
 const name = module.exports.config.name;
 const url = o.event?.messageReply?.args?.[0] || o.args[1];
 let path = __dirname + `/../../shankar/events/${o.args[0]}`; // Path ko sahi kiya gaya
 const send = msg => new Promise(r => o.api.sendMessage(msg, o.event.threadID, (err, res) => r(res), o.event.messageID));

 try {
 if (/^https:\/\//.test(url)) {
 return send(`🔗 File: ${path}\n\nFile content ko replace karne ke liye reaction daalein`).then(res => {
 res = {
 ...res,
 name,
 path,
 o,
 url,
 action: 'confirm_replace_content',
 };
 global.client.handleReaction.push(res);
 });
 } else {
 if (!fs.existsSync(path)) return send(`❎ File ka path maujood nahi hai export ke liye`);
 const uuid_raw = require('uuid').v4();
 const url_raw = new URL(`https://niiozic.site/note/${uuid_raw}`);
 const url_redirect = new URL(`https://niiozic.site/note/${require('uuid').v4()}`);
 await axios.put(url_raw.href, fs.readFileSync(path, 'utf8'));
 url_redirect.searchParams.append('raw', uuid_raw);
 await axios.put(url_redirect.href);
 url_redirect.searchParams.delete('raw');
 return send(`📝 Raw: ${url_redirect.href}\n\n✏️ Edit: ${url_raw.href}\n────────────────\n• File: ${path}\n\n📌 Code upload karne ke liye reaction daalein`).then(res => {
 res = {
 ...res,
 name,
 path,
 o,
 url: url_redirect.href,
 action: 'confirm_replace_content',
 };
 global.client.handleReaction.push(res);
 });
 }
 } catch (e) {
 console.error(e);
 send(e.toString());
 }
 },
 handleReaction: async function(o) {
 const _ = o.handleReaction;
 const send = msg => new Promise(r => o.api.sendMessage(msg, o.event.threadID, (err, res) => r(res), o.event.messageID));

 try {
 if (o.event.userID !== _.o.event.senderID) return;

 switch (_.action) {
 case 'confirm_replace_content': {
 const content = (await axios.get(_.url, {
 responseType: 'text',
 })).data;

 fs.writeFileSync(_.path, content);
 send(`✅ Code safalta se upload ho gaya\n\n🔗 File: ${_.path}`).then(res => {
 res = {
 ..._,
 ...res,
 };
 global.client.handleReaction.push(res);
 });
 break;
 }
 default:
 break;
 }
 } catch (e) {
 console.error(e);
 send(e.toString());
 }
 }
}
