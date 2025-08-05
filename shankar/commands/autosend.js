const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: 'autosend',
  version: '1.1.8',
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: 'Bharat ke samay ke hisaab se swat: audio file bhejein. Command se on/off karein!',
  commandCategory: 'System',
  usages: '[on/off]',
  cooldowns: 3
};

// Har ghante ke liye file list
const audioSchedule = [
  { timer: '6:00:00 AM', files: ['sang.mp3', 'sang2.mp3'], title: 'Subah ka Salaam' },
  { timer: '10:15:00 AM', files: ['trua.mp3', 'trua2.mp3'], title: 'Khana banane ka samay' },
  { timer: '5:00:00 PM', files: ['chieumuon.mp3'], title: 'Sham ka Salaam' },
  { timer: '7:00:00 PM', files: ['toi.mp3'], title: 'Raat ke khane ka samay' },
  { timer: '10:00:00 PM', files: ['ngu.mp3', 'ngu2.mp3', 'ngungon.mp3'], title: 'Shubh Ratri' }
];

const audioDir = path.join(__dirname, 'noprefix');
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

const configDir = path.join(__dirname, 'data');
if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });

const groupConfigPath = path.join(configDir, 'autosend.json');
let lastSentTime = "";
let enabledThreads = new Set();

function loadEnabledThreads() {
  try {
    if (fs.existsSync(groupConfigPath)) {
      const data = fs.readFileSync(groupConfigPath, 'utf8');
      enabledThreads = new Set(JSON.parse(data));
    } else {
      fs.writeFileSync(groupConfigPath, JSON.stringify([]));
    }
  } catch (err) {
    console.error('[autosend] Load mein error:', err);
  }
}

function saveEnabledThreads() {
  try {
    fs.writeFileSync(groupConfigPath, JSON.stringify([...enabledThreads]), 'utf8');
  } catch (err) {
    console.error('[autosend] Save mein error:', err);
  }
}

// List mein har file ko check karna
function checkAudioFiles() {
  let missing = [];
  for (const { files, title } of audioSchedule) {
    for (const file of files) {
      if (!fs.existsSync(path.join(audioDir, file))) {
        missing.push(file);
        console.warn(`[autosend] File missing: ${file} (${title})`);
      }
    }
  }
  return missing.length === 0;
}

module.exports.onLoad = async function () {
  loadEnabledThreads();
  if (!checkAudioFiles()) console.warn('[autosend] Kuch audio files missing hain');

  global.autosendInterval = setInterval(() => {
    try {
      const currentTime = new Date().toLocaleTimeString('en-US', {
        hour12: true,
        timeZone: 'Asia/Kolkata'
      });

      const timeTrimmed = currentTime.replace(/:\d{2}\s/, ':00 ');
      if (timeTrimmed === lastSentTime) return;

      const match = audioSchedule.find(item => item.timer === timeTrimmed);
      if (!match) return;

      lastSentTime = timeTrimmed;

      // Randomly ek file chuno
      const selectedFile = match.files[Math.floor(Math.random() * match.files.length)];
      const filePath = path.join(audioDir, selectedFile);

      if (!fs.existsSync(filePath)) {
        console.warn(`[autosend] File nahi mila: ${selectedFile}`);
        return;
      }

      const api = global.client?.api;
      if (!api) return console.error('[autosend] API uplabdh nahi hai');

      setTimeout(async () => {
        let sentCount = 0;
        for (const threadID of enabledThreads) {
          try {
            await api.sendMessage({
              body: `🎵 ${match.title} - ${timeTrimmed}\n🔊 File: ${selectedFile}\n⏰ Swat: samay ke hisaab se bheja gaya`,
              attachment: fs.createReadStream(filePath)
            }, threadID);
            sentCount++;
            await new Promise(res => setTimeout(res, 300));
          } catch (err) {
            console.error(`[autosend] ${threadID} ko bhejne mein error:`, err);
          }
        }
        console.log(`[autosend] ${sentCount}/${enabledThreads.size} groups mein safalta se bheja gaya (${match.title})`);
      }, 0);
    } catch (err) {
      console.error('[autosend] Processing mein error:', err);
    }
  }, 5000);
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const mode = args[0]?.toLowerCase();

  if (!mode || mode === 'status') {
    return api.sendMessage(
      `📊 Swat: bhejne ki sthiti:\n➤ Is group mein: ${enabledThreads.has(threadID) ? 'chalu' : 'band'}\n\n` +
      `🕒 Samay suchi:\n` +
      audioSchedule.map(item => `➤ ${item.timer} - ${item.title}`).join('\n') + '\n\n' +
      `💡 Istemal karein:\n➤ autosend on/off/status`,
      threadID, messageID
    );
  }

  if (mode === 'on') {
    enabledThreads.add(threadID);
    saveEnabledThreads();
    return api.sendMessage('✅ Is group ke liye swat: bhejne ko chalu kar diya gaya hai', threadID, messageID);
  }

  if (mode === 'off') {
    enabledThreads.delete(threadID);
    saveEnabledThreads();
    return api.sendMessage('❌ Is group ke liye swat: bhejne ko band kar diya gaya hai', threadID, messageID);
  }

  return api.sendMessage('❓ Amanya command. Istemal karein: autosend [on/off/status]', threadID, messageID);
};
