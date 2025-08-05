const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

// Group list fetch karne ka function
async function getThreadList(api) {
  return await api.getThreadList(50, null, ["INBOX"]);
}

// Level calculate karne ka function
function LV(x) {
  return Math.floor((Math.sqrt(1 + (4 * x) / 3) + 1) / 2);
}

// Number ko format karne ka function
function CC(n) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 0
  });
}

// Sort karne ka function
function S(k) {
  return function (a, b) {
    return b[k] - a[k];
  };
}

// Top group ka message
function TX(i) {
  return `Group ${i >= 1 && i <= 10 ? `top ${i} server par hai` : "server ke top groups mein hai"}`;
}

module.exports.config = {
  name: 'boxinfo',
  version: '1.0.0',
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  hasPermission: 0,
  description: 'Group ki jankari',
  commandCategory: 'Jankari',
  usage: 'info box',
  cooldowns: 5
};

// Main run function
module.exports.run = async ({ api, event, sender }) => {
  try {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const data = await getThreadList(api);
    const topGroups = data
      .filter(thread => thread.isGroup && typeof thread.messageCount === 'number')
      .map(thread => ({
        threadName: thread.name || "Naam nahi hai",
        threadID: thread.threadID,
        messageCount: thread.messageCount || 0,
      })).sort((a, b) => b.messageCount - a.messageCount);

    const seenThreadIDs = new Set();
    const uniqueTopGroups = [];
    
    topGroups.forEach(group => {
      if (!seenThreadIDs.has(group.threadID)) {
        seenThreadIDs.add(group.threadID);
        uniqueTopGroups.push(group);
      }
    });

    const userRank = uniqueTopGroups.findIndex(group => group.threadID === threadInfo.threadID) + 1;
    const isInTop10 = userRank > 0 && userRank <= 10;

    let threadMem = threadInfo.participantIDs.length;
    let gendernam = [];
    let gendernu = [];
    let nope = [];

    for (let z in threadInfo.userInfo) {
      let gioitinhone = threadInfo.userInfo[z].gender;
      if (gioitinhone === "MALE") {
        gendernam.push(z + gioitinhone);
      } else if (gioitinhone === "FEMALE") {
        gendernu.push(gioitinhone);
      } else {
        nope.push(threadInfo.userInfo[z].name);
      }
    }

    let threadName = threadInfo.threadName;
    let id = threadInfo.threadID;
    let icon = threadInfo.emoji;
    let color = threadInfo.color;
    let nam = gendernam.length;
    let nu = gendernu.length;
    let qtv = threadInfo.adminIDs.length;

    const pathData = JSON.parse(await fs.promises.readFile(__dirname + '/data/thuebot.json'));
    const matchingEntry = pathData.find(entry => entry.t_id === event.threadID);
    let thuebot;
    if (matchingEntry) {
      const currentDate = moment();
      const hethan = moment(matchingEntry.time_end, 'DD/MM/YYYY');
      const daysRemaining = hethan.diff(currentDate, 'days');
      thuebot = daysRemaining <= 0
        ? "Bot ka rent khatam ho gaya ⚠️"
        : `Bot ka rent ${hethan.format('DD/MM/YYYY')} tak hai (baki ${daysRemaining} din)`;
    } else {
      thuebot = "Group ne bot rent nahi kiya ❎";
    }

    api.sendMessage(`====== 𝗚𝗥𝗢𝗨𝗣 𝗝𝗔𝗡𝗞𝗔𝗥𝗜 ======\n────────────────────\n
➞ 𝗚𝗿𝗼𝘂𝗽 𝗸𝗮 𝗻𝗮𝗮𝗺: ${threadName || 'Koi naam nahi'}\n
➞ 𝗜𝗗: ${id}\n
➞ 𝗘𝗺𝗼𝗷𝗶: ${icon ? icon : '👍'}\n
➞ 𝗦𝘆𝘀𝘁𝗲𝗺 𝗣𝗿𝗲𝗳𝗶𝘅: ${global.config.PREFIX}\n
➞ 𝗧𝗵𝗲𝗺𝗲 𝗰𝗼𝗹𝗼𝗿: ${color || 'Default'}\n
➞ �_K𝘂𝗹 𝘀𝗮𝗱𝗮𝘀𝘆𝗮: ${threadMem}\n
➞ 𝗣𝘂𝗿𝘂𝘀𝗵: ${nam}\n
➞ 𝗠𝗮𝗵𝗶𝗹𝗮: ${nu}\n
➞ 𝗔𝗱𝗺𝗶𝗻: ${qtv}\n
────────────────────\n
➞ 𝗕𝗼𝘁 𝗸𝗮 𝗿𝗲𝗻𝘁 𝘀𝘁𝗮𝘁𝘂𝘀: ${thuebot}\n
➞ ${TX(isInTop10 ? userRank : null)} with ${CC(threadInfo.messageCount)} messages\n
────────────────────\n
Groups ke interaction chart dekhne ke liye "👍" emoji se react karein!`, event.threadID, (err, info) => {
      global.client.handleReaction.push({
        name: this.config.name, 
        messageID: info.messageID,
        author: event.senderID,
      });
    }, event.messageID);
  } catch (error) {
    console.error(error);
  }
};

// Reaction handler for interaction chart
module.exports.handleReaction = async ({ event, api, handleReaction }) => {
  try {
    const axios = require("axios");
    const { createReadStream, unlinkSync, writeFileSync } = require("fs-extra");
    const { threadID, messageID, userID } = event;

    if (event.userID != handleReaction.author) return;
    if (event.reaction != "👍") return; 

    const data = await api.getThreadInfo(event.threadID);
    const KMath = (data) => data.reduce((a, b) => a + b, 0);
    const inbox = await api.getThreadList(100, null, ['INBOX']);
    
    let xx = [...inbox].filter(group => group.isSubscribed && group.isGroup);
    let kho = [], search = [], count = [];

    for (let n of xx) {
      let threadInfo = n.name;
      let threadye = n.messageCount;
      kho.push({"name": threadInfo, "exp": (typeof threadye === "undefined") ? 0 : threadye});
    }

    kho.sort((a, b) => b.exp - a.exp);

    for (let num = 0; num < 7; num++) {
      search.push("'" + kho[num].name + "'");
      count.push(kho[num].exp);
    }

    const path = __dirname + `/cache/chart.png`;
    const full = KMath(count);
    const url = `https://quickchart.io/chart?c={type:'doughnut',data:{labels:[${encodeURIComponent(search)}],datasets:[{label:'${encodeURIComponent('Interaction')}',data:[${encodeURIComponent(count)}]}]},options:{plugins:{doughnutlabel:{labels:[{text:'${full}',font:{size:26}},{text:'${encodeURIComponent('Total')}'}]}}}}`;
    api.unsendMessage(handleReaction.messageID);

    const { data: stream } = await axios.get(url, { method: 'GET', responseType: 'arraybuffer' });
    writeFileSync(path, Buffer.from(stream, 'utf-8'));

    api.sendMessage({ body: '', attachment: createReadStream(path) }, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
  }
};
