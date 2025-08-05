const fs = require("fs");
const axios = require("axios");
const moment = require("moment-timezone");
const path = require("path");

const KEY = [
  "hello", "hi", "hai", "chào", "chao", "hí", "híí", "hì", "hìì", "lô", "hii", "helo", "hê nhô",
  "xin chào", "2", "helo", "hê nhô", "hi mn", "hello mn"
];

const DEFAULT_GREETINGS = {
  morning_early: [
    "Aapko subah ki taazgi bhari shubhkaamnaayein",
    "Nayi subah ke saath nayi umang shuru karein"
  ],
  morning: [
    "Aapko khushnuma subah ki shubhkaamnaayein"
  ],
  noon: [
    "Aapko dopahar ki khushi bhari shubhkaamnaayein",
    "Dopahar ka aaram bhara vishraam karein"
  ],
  afternoon: [
    "Aapko sham ki khushi bhari shubhkaamnaayein",
    "Sham ho gayi, ab aaram karein!"
  ],
  evening: [
    "Aapko sundar raat ki shubhkaamnaayein"
  ],
  night: [
    "Raat ho gayi, shubh ratri!",
    "Shubh ratri aur sundar sapne dekhein"
  ]
};

const AUDIO_PATH = path.join(__dirname, "..", "..", "music", "hi.mp3");
let filePath;

module.exports.config = {
  name: "hi",
  version: "1.3.0",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Swachalit abhivadan ke saath audio aur custom greetings",
  commandCategory: "Upyogita",
  usages: "[on/off/setaudio/add/remove/list]",
  cooldowns: 5
};

module.exports.onLoad = () => {
  const dir = path.join(__dirname, "data");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  filePath = path.join(dir, "hi.json");
  if (!fs.existsSync(filePath)) {
    const defaultData = {
      global: {
        customGreetings: {}
      }
    };
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
};

function getGreeting(hours, threadID) {
  let session;
  let greetings;
  let savedData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  let customGreetings = savedData.global.customGreetings[hours] || [];

  if (hours >= 0 && hours <= 4) {
    session = "raatri";
    greetings = [...DEFAULT_GREETINGS.night, ...customGreetings];
  } else if (hours > 4 && hours <= 7) {
    session = "subah jaldi";
    greetings = [...DEFAULT_GREETINGS.morning_early, ...customGreetings];
  } else if (hours > 7 && hours <= 11) {
    session = "subah";
    greetings = [...DEFAULT_GREETINGS.morning, ...customGreetings];
  } else if (hours > 11 && hours <= 13) {
    session = "dopahar";
    greetings = [...DEFAULT_GREETINGS.noon, ...customGreetings];
  } else if (hours > 13 && hours <= 17) {
    session = "sham";
    greetings = [...DEFAULT_GREETINGS.afternoon, ...customGreetings];
  } else if (hours > 17 && hours <= 21) {
    session = "raatri";
    greetings = [...DEFAULT_GREETINGS.evening, ...customGreetings];
  } else {
    session = "raatri";
    greetings = [...DEFAULT_GREETINGS.night, ...customGreetings];
  }

  return {
    session,
    greeting: greetings[Math.floor(Math.random() * greetings.length)]
  };
}

module.exports.handleEvent = async function ({ event, api, Users }) {
  const { threadID, messageID, body } = event;

  try {
    let savedData = {};
    try {
      const jsonData = fs.readFileSync(filePath, "utf-8");
      savedData = JSON.parse(jsonData);
    } catch (err) {
      console.error("hi.json file padhne mein error:", err);
      savedData = {};
    }

    if (typeof savedData[threadID]?.hi === "undefined" || savedData[threadID].hi === true) {
      if (body && KEY.includes(body.toLowerCase())) {
        const hours = parseInt(moment.tz('Asia/Kolkata').format('HH'));
        const { session, greeting } = getGreeting(hours, threadID);

        let name = await Users.getNameUser(event.senderID);
        let mentions = [{ tag: name, id: event.senderID }];

        let msg = {
          body: `Namaste ${name}, ${greeting} ❤️`,
          mentions,
          attachment: fs.existsSync(AUDIO_PATH) ? fs.createReadStream(AUDIO_PATH) : null
        };

        api.sendMessage(msg, threadID, messageID);
      }
    }
  } catch (error) {
    console.error("Abhivadan message prakriya mein error:", error);
  }
};

module.exports.run = async ({ event, api, args }) => {
  const { threadID, messageID } = event;

  try {
    let savedData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (!savedData.global) savedData.global = { customGreetings: {} };

    const command = (args[0] || "").toLowerCase();

    switch (command) {
      case "on":
        savedData[threadID] = { hi: true };
        api.sendMessage("☑️ Abhivadan feature chalu kar diya gaya!", threadID, messageID);
        break;

      case "off":
        savedData[threadID] = { hi: false };
        api.sendMessage("☑️ Abhivadan feature band kar diya gaya!", threadID, messageID);
        break;

      case "setaudio":
        if (!event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0].url) {
          return api.sendMessage("⚠️ Kripaya ek audio file ka jawab dein taaki set kiya ja sake!", threadID, messageID);
        }

        const dir = path.join(__dirname, "..", "..", "music");
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        try {
          const response = await axios.get(event.messageReply.attachments[0].url, { responseType: 'arraybuffer' });
          fs.writeFileSync(AUDIO_PATH, Buffer.from(response.data));
          api.sendMessage("✅ Abhivadan audio safalta se set kar diya gaya!", threadID, messageID);
        } catch (e) {
          api.sendMessage("❌ Audio file download karne mein error!", threadID, messageID);
        }
        break;

      case "add":
        const hour = parseInt(args[1]);
        if (isNaN(hour) || hour < 0 || hour > 23) {
          return api.sendMessage("⚠️ Kripaya ek valid ghanta (0-23) daalein!", threadID, messageID);
        }
        const greeting = args.slice(2).join(" ");
        if (!greeting) {
          return api.sendMessage("⚠️ Kripaya abhivadan wali baat likhein!", threadID, messageID);
        }

        if (!savedData.global.customGreetings[hour]) {
          savedData.global.customGreetings[hour] = [];
        }
        savedData.global.customGreetings[hour].push(greeting);
        api.sendMessage(`✅ ${hour} ghante ke liye abhivadan joda gaya: ${greeting}`, threadID, messageID);
        break;

      case "remove":
        const hourToRemove = parseInt(args[1]);
        const index = parseInt(args[2]) - 1;

        if (isNaN(hourToRemove) || !savedData.global.customGreetings[hourToRemove]) {
          return api.sendMessage("⚠️ Ghanta galat hai ya koi custom abhivadan nahi hai!", threadID, messageID);
        }

        if (isNaN(index) || index < 0 || index >= savedData.global.customGreetings[hourToRemove].length) {
          return api.sendMessage("⚠️ Abhivadan ka kramank galat hai!", threadID, messageID);
        }

        const removed = savedData.global.customGreetings[hourToRemove].splice(index, 1);
        api.sendMessage(`✅ Abhivadan hata diya gaya: ${removed[0]}`, threadID, messageID);
        break;

      case "list":
        const hour2 = parseInt(args[1]);
        if (isNaN(hour2) || hour2 < 0 || hour2 > 23) {
          let msg = "📝 Custom abhivadan ki suchi:\n";
          for (let h in savedData.global.customGreetings) {
            if (savedData.global.customGreetings[h].length > 0) {
              msg += `\n${h} ghanta:\n`;
              savedData.global.customGreetings[h].forEach((greeting, i) => {
                msg += `${i + 1}. ${greeting}\n`;
              });
            }
          }
          api.sendMessage(msg, threadID, messageID);
        } else {
          if (!savedData.global.customGreetings[hour2] || savedData.global.customGreetings[hour2].length === 0) {
            api.sendMessage(`❌ ${hour2} ghante ke liye koi custom abhivadan nahi hai!`, threadID, messageID);
          } else {
            let msg = `📝 ${hour2} ghante ke liye custom abhivadan:\n`;
            savedData.global.customGreetings[hour2].forEach((greeting, i) => {
              msg += `${i + 1}. ${greeting}\n`;
            });
            api.sendMessage(msg, threadID, messageID);
          }
        }
        break;

      default:
        api.sendMessage(
          "⚠️ Kripaya istemaal karein:\n- hi on: Feature chalu karein\n- hi off: Feature band karein\n- hi setaudio: Audio set karein (audio file ka jawab dein)\n- hi add [ghanta] [abhivadan]: Naya abhivadan jodein\n- hi remove [ghanta] [kramank]: Abhivadan hataayein\n- hi list [ghanta]: Abhivadan ki suchi dekhein",
          threadID,
          messageID
        );
        return;
    }

    fs.writeFileSync(filePath, JSON.stringify(savedData, null, 2));

  } catch (error) {
    console.error("Hi command prakriya mein error:", error);
    api.sendMessage("❌ Error ho gaya hai!", threadID, messageID);
  }
};
