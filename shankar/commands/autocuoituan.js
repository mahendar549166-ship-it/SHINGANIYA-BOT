const { exec } = require('child_process');

const weekendMessages = [
  {
    timer: '9:00:00 AM',
    saturdayMessage: [
      'Ab toh weekend hai, Alex sabhi group members ko ek khushnuma weekend ki shubhkaamna deta hai!',
      'Pura hafta busy raha, ab aaram ka din hai, main Alex hoon aur sabko parivaar aur apno ke saath khushi bhare din ki shubhkaamna deta hoon <3',
      'Main Zuri hoon, sabhi ko ek khushnuma aaram ke din ki shubhkaamna deta hoon, saari udaasi ko bhulakar naye hafta ke liye energy bharo <3',
      'Jo bhi aapko sabse zyada sukoon de, woh karo, stress chhodo aur naye din ke liye energy bharo'
    ],
    sundayMessage: [
      'Ravivaar hai, naye hafte ke liye taiyaari shuru karo!',
      'Sabhi ko ek energy se bharpur Ravivaar ki shubhkaamna!'
    ]
  },
  {
    timer: '7:00:00 PM',
    saturdayMessage: [
      'Relax aur stress chhodne ka time aa gaya, Shaniwaar ki raat ka maza lo!',
      'Shaniwaar ki raat, ek hafta kaam ke baad khud ko inaam do!'
    ],
    sundayMessage: [
      'Hafte ke pehle din 00:01 par, Alex bot system sabhi groups ke checktt data ko automatically reset karega, admin log dhyan se sadasya filter karein\n!check - weekend ke saare interactions dekhne ke liye\n!check loc= <number of messages> - bot se sadasya filter karne ke liye'
    ]
  }
];

function getWeekendMessage(isSaturday) {
  const currentMessages = weekendMessages.find(({ timer }) => timer == new Date(Date.now() + 25200000).toLocaleString().split(/,/).pop().trim());
  return currentMessages ? (isSaturday ? currentMessages.saturdayMessage : currentMessages.sundayMessage) : null;
}

function getMillisecondsUntilMonday002() {
  const now = new Date(), daysUntilMonday = (7 - now.getDay()) % 7, nextMonday002 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilMonday, 0, 2, 0, 0);
  return nextMonday002.getTime() - now.getTime();
}

module.exports.config = {
  name: 'autocuoituan',
  version: '1.5.0',
  hasPermission: 3,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: 'Weekend par automatic messages bhejein',
  commandCategory: 'System',
  usages: '',
  cooldowns: 3
};

module.exports.onLoad = async ({ global, api }) => {
  setInterval(() => {
    const today = new Date().getDay();
    if (today === 6 || today === 0) {
      const isSaturday = today === 6, messageArray = getWeekendMessage(isSaturday);
      if (messageArray) {
        const randomMessage = messageArray[Math.floor(Math.random() * messageArray.length)];
        global.data.allThreadID.forEach(threadID => api.sendMessage(randomMessage, threadID));
      }
      if (today === 0) {
        // Data reset hone se pehle admin ko message bhejein
        const adminID = '61567780432797';
        const adminMessage = '⚠️ System 00:02 par reset hoga';

        const millisecondsUntil002 = getMillisecondsUntilMonday002();
        if (millisecondsUntil002 > 0) {
          setTimeout(() => {
            api.sendMessage(adminMessage, adminID);
            exec('rm -fr shankar/commands/checktt/*', (error, stdout, stderr) => {
              if (error) console.error(`Data reset karne mein error: ${error}`);
              if (stderr) console.error(`Command chalane mein error: ${stderr}`);
              console.log('Interaction data reset ho gaya.');
            });
            global.data.allThreadID.forEach(threadID => api.sendMessage('⚠️ Bot system abhi restart hoga!', threadID, () => process.exit(1)));
          }, millisecondsUntil002);
        }
      }
    }
  }, 1000 * 60 * 60);
};

module.exports.run = function ({ }) {};
