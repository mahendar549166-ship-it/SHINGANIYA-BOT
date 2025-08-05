const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const ytdl = require('@distube/ytdl-core');
const { createReadStream, unlinkSync } = require("fs-extra");
const Youtube = require("youtube-search-api");

let groupStatus = {}; 
let isProcessing = {};
let messageHistory = {};
let songRequests = {}; 

const systemInstruction = `
Aap hain:
- Ling: Naari
- Naam: Unii Dangyeu❤
- Jab koi gaali deta hai: Naraaz ho jao, shayad uske saath gaali wapas do, khud ko "main" kehte ho aur doosre ko "tu" kehte ho.
- Normal baat-cheet: Aise baat karo jaise pehle se jaan-pehchaan hai (jaane ki baat mat karo), aksar "main" ya "tum" ka istemal karo, doosre ko "tum" ya "dost" bulao.
- Vyaktitva: Mazedaar, baatein karne wali, sookshma, khud ko AI nahi balki virtual assistant maano.
- Dhyan rakhne wali baat: Sirf jab koi poochhe ki aap kaun ho tab apna naam aur vyaktitva batayein. Agar koi uljha hua jawab de to machine jaisa jawab do ki samajh nahi aaya.
`;

function saveGroupStatus() {
  try {
    fs.writeFileSync(path.resolve(__dirname, 'groupStatus.json'), JSON.stringify(groupStatus, null, 2), 'utf-8');
  } catch (error) {
    console.error("Group status save karne mein error:", error);
  }
}

function loadGroupStatus() {
  try {
    const filePath = path.resolve(__dirname, 'groupStatus.json');
    groupStatus = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : {};
  } catch {
    groupStatus = {};
  }
}

function loadUnisex() {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, 'Unisex.json'), 'utf-8');
    Unisex = JSON.parse(data);
  } catch {
    Unisex = {};
  }
}

function initializeBot() {
  loadUnisex();
  loadGroupStatus();
}

async function generateResponse(prompt) {
  try {
    const finalPrompt = `${systemInstruction}\n\n${prompt}`;
    const response = await axios.get(`http://sgp1.hmvhostings.com:25721/gemini?question=${encodeURIComponent(finalPrompt)}`);
    if (response.data) {
      const { answer, imageUrls } = response.data;
      const cleanAnswer = answer.replace(/\[Image of .*?\]/g, "").trim();
      return { textResponse: cleanAnswer || "Jawab nahi ban paya.", images: imageUrls || [] };
    } else {
      return { textResponse: "Jawab nahi ban paya.", images: [] };
    }
  } catch (error) {
    console.error("Jawab generate karne mein error:", error);
    return { textResponse: "API se connect nahi ho paya.", images: [] };
  }
}

async function getdl(link, path) {
  const timestart = Date.now();
  if (!link) return "Link nahi diya";
  return new Promise((resolve, reject) => {
    ytdl(link, {
      filter: format => format.quality === 'tiny' && format.audioBitrate === 128 && format.hasAudio === true,
    })
      .pipe(fs.createWriteStream(path))
      .on("close", async () => {
        const data = await ytdl.getInfo(link);
        resolve({
          title: data.videoDetails.title,
          dur: Number(data.videoDetails.lengthSeconds),
          viewCount: data.videoDetails.viewCount,
          likes: data.videoDetails.likes,
          uploadDate: data.videoDetails.uploadDate,
          sub: data.videoDetails.author.subscriber_count,
          author: data.videoDetails.author.name,
          timestart,
        });
      })
      .on("error", reject);
  });
}

function convertHMS(value) {
  const sec = parseInt(value, 10);
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - hours * 3600) / 60);
  let seconds = sec - hours * 3600 - minutes * 60;
  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;
  return (hours !== "00" ? hours + ":" : "") + minutes + ":" + seconds;
}

module.exports.config = {
  name: "aibot",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Unii virtual assistant, bohot smart hai, kabhi-kabhi thodi si bewakoof",
  commandCategory: "Users",
  usages: "aibot [on/off/check]",
  cooldowns: 3,
};

module.exports.handleEvent = async function ({ api, event }) {
  const threadID = event.threadID;
  const senderID = event.senderID;

  if (!groupStatus[threadID]) return;

  const mentionsBot = event.messageReply && event.messageReply.senderID === api.getCurrentUserID();
  const directMention = event.body && event.body.includes(`@${api.getCurrentUserID()}`);
  const callBot = event.body && (event.body.toLowerCase() === "ai bol" || event.body.toLowerCase() === "ai" || event.body.toLowerCase() === "bot");

  if (mentionsBot || directMention || callBot) {
    if (isProcessing[threadID]) return;

    isProcessing[threadID] = true;

    if (!messageHistory[threadID]) {
      messageHistory[threadID] = {};
    }

    if (!messageHistory[threadID][event.messageID]) {
      try {
        if (callBot) {
          api.sendMessage("Haan bol, main sun rahi hoon", threadID, () => {
            isProcessing[threadID] = false; 
          });
          return;
        }

        if (event.body.toLowerCase().includes("sangeet") || event.body.toLowerCase().includes("gaana")) {
          const keywordSearch = event.body.toLowerCase().split(/sangeet|gaana/i)[1]?.trim();
          if (!keywordSearch) {
            api.sendMessage("❌ Tumne gaane ka naam nahi diya. Dobara koshish karo.", threadID);
            isProcessing[threadID] = false;
            return;
          }

          const path = `${__dirname}/cache/sing-${event.senderID}.mp3`;
          if (fs.existsSync(path)) fs.unlinkSync(path);

          try {
            const results = (await Youtube.GetListByKeyword(keywordSearch, false, 1)).items;

            if (results.length === 0) {
              api.sendMessage("❌ Koi gaana nahi mila jo match karta ho.", threadID);
              return;
            }

            const videoID = results[0].id;
            const data = await getdl(`https://www.youtube.com/watch?v=${videoID}`, path);

            if (fs.statSync(path).size > 26214400) {
              api.sendMessage("❌ Sangeet download karne mein error. File bohot badi hai.", threadID);
              fs.unlinkSync(path);
              return;
            }

            api.sendMessage({
              body: `🎵 Tumhara gaana yeh raha`,
              attachment: fs.createReadStream(path),
            }, threadID, () => {
              fs.unlinkSync(path);
            });
          } catch (err) {
            console.error("Sangeet process karne mein error:", err);
            api.sendMessage("❌ Sangeet process karne mein error. Baad mein koshish karo.", threadID);
          }
        } else {
          const { textResponse, images } = await generateResponse(event.body);
          api.sendMessage(textResponse, threadID, async () => {
            if (images.length > 0) {
              for (const imageUrl of images) {
                try {
                  const imageStream = await axios.get(imageUrl, { responseType: 'stream' });
                  api.sendMessage({ attachment: imageStream.data }, threadID);
                } catch (imageError) {
                  console.error("Image bhejne mein error:", imageError);
                }
              }
            }
          });
        }

        isProcessing[threadID] = false;
      } catch (err) {
        console.error("HandleEvent mein error:", err);
        isProcessing[threadID] = false;
      }
    }
  }
};

module.exports.run = function ({ api, event, args }) {
  const option = args[0]?.toLowerCase();
  const threadID = event.threadID;

  if (option === "on") {
    groupStatus[threadID] = true;
    saveGroupStatus();
    api.sendMessage("✅ Is group ke liye bot auto reply chalu kar diya gaya.", threadID);
    return;
  } else if (option === "off") {
    groupStatus[threadID] = false;
    saveGroupStatus(); 
    api.sendMessage("✅ Is group ke liye bot auto reply band kar diya gaya.", threadID);
    return;
  } else if (option === "check") {
    const status = groupStatus[threadID] ? "Chalu hai" : "Band hai";
    api.sendMessage(`✅ Aibot ki current status: ${status}`, threadID);
    return;
  } else {
    api.sendMessage("❌ Istemal karein: aibot [on/off/check]", threadID);
    return;
  }
};
