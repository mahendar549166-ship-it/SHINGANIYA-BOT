module.exports.config = {
 name: 'timejoin',
 version: '1.0.0',
 hasPermission: 0,
 credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
 description: 'Dekhiye samay box mein',
 commandCategory: 'Upyogita',
 usages: '',
 cooldowns: 5,
};

const fs = require('fs');
const moment = require('moment-timezone');
const filePath = __dirname + '/data/timeJoin.json';

module.exports.handleEvent = async function ({ event: e }) {
 const { threadID: t, senderID: u } = e,
 { readFileSync: r, writeFileSync: w } = fs,
 { parse: o, stringify: s } = JSON;

 const getTime = moment.tz('Asia/Kolkata');
 const gio = getTime.format('HH:mm:ss');
 const ngay = getTime.format('YYYY-MM-D');
 const burh = getTime.format('D/MM/YYYY');

 let data = o(r(filePath, 'utf8'));

 if (!data[u + t]) {
 data[u + t] = {
 uid: u,
 gio: gio,
 ngay: ngay,
 burh: burh,
 };
 w(filePath, s(data, null, 2), 'utf8');
 }
};

module.exports.run = async function ({
 api: a,
 event: e,
 args: g,
 Users: u,
 Threads: d,
}) {
 const { threadID: t, messageID: m, senderID: s } = e,
 c = this.config.credits,
 { readFileSync: f, existsSync: x } = fs,
 { parse: o } = JSON;

 if (!x(filePath)) {
 return a.sendMessage(`Abhi tak koi samay data nahi hai jab aap group mein shamil hue.`, t, m);
 }

 let storedData = o(f(filePath, 'utf8')),
 userJoinDate = moment(`${storedData[s + t].ngay} ${storedData[s + t].gio}`, 'YYYY-MM-D HH:mm:ss').tz('Asia/Kolkata'),
 currentDate = moment().tz('Asia/Kolkata'),
 daysSinceJoin = currentDate.diff(userJoinDate, 'days');

 if (daysSinceJoin < 1) {
 return a.sendMessage(`Sirf ek din ke baad ginti shuru hogi jab aap group mein shamil honge`, t, m);
 }

 a.sendMessage(`━━━━━━━━━━━━━\n== [ ${t} ] ==\n\nAap group mein shamil hue the:\n\n[ ${
 storedData[s + t].gio
 } ] din [ ${
 storedData[s + t].burh
 } ]\n\n━━━━━━━━━━━━━\n\nBox mein bitaye din: ${daysSinceJoin} din`, t, m);
};
