const { loadImage, createCanvas } = require("canvas");
const request = require('request');
const fs = require("fs");
const axios = require("axios");
const Canvas = require("canvas");

// Function to create circular image
async function circle(imagePath) {
  const img = await loadImage(imagePath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.arc(img.width / 2, img.height / 2, img.width / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, 0, 0, img.width, img.height);
  return canvas.toBuffer();
}

module.exports.config = {
  name: "cardinfov10",
  version: "1.0.1",
  hasPermission: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Facebook ke liye user ka info card v10",
  commandCategory: "Edit-img",
  usages: "cardinfo fb",
  usePrefix: false,
  cooldowns: 5
};

// Main run function
module.exports.run = async ({ api, event, Users, Threads, args }) => {
  try {
    const token = global.config.ACCESSTOKEN;
    let id;

    // Determine user ID
    if (Object.keys(event.mentions).length > 0) {
      id = Object.keys(event.mentions)[0].replace(/\&mibextid=ZbWKwL/g, '');
    } else {
      id = args[0] !== undefined ? (isNaN(args[0]) ? await global.utils.getUID(args[0]) : args[0]) : event.senderID;
      if (event.type === "message_reply") {
        id = event.messageReply.senderID;
      }
    }

    // Fetch user info from Facebook API
    const resp = await axios.get(`https://graph.facebook.com/${id}?fields=id,is_verified,cover,updated_time,work,education,likes,created_time,work,posts,hometown,username,family,timezone,link,name,locale,location,about,website,birthday,gender,relationship_status,significant_other,quotes,first_name,subscribers.limit(0)&access_token=${token}`);
    const name = resp.data.name;
    const uid = resp.data.id;
    const link_profile = resp.data.link;
    const avatar = `https://graph.facebook.com/${id}/picture?width=1500&height=1500&access_token=2712477385668128%7Cb429aeb53369951d411e1cae8e810640`;
    const gender = resp.data.gender === 'male' ? 'Purush' : resp.data.gender === 'female' ? 'Mahila' : 'Nahi bataya';
    const relationship_status = resp.data.relationship_status || "Koi jankari nahi";
    var birthday = resp.data.birthday || "Nahi bataya";
    const follower = resp.data.subscribers?.summary?.total_count || "Nahi bataya";
    const hometown = resp.data.hometown?.name || "Koi jankari nahi";
    const location = resp.data.location?.name || 'Koi jankari nahi';
    const love = resp.data.love?.name || 'Koi jankari nahi';

    // Font and color settings
    const fontsLink = 20;
    const fontsInfo = 28;
    const colorName = "#00FF00";
    let pathImg = __dirname + `/cache/cardinfo.png`;
    let pathAvata = __dirname + `/cache/avtuserrd.png`;

    // Fetch and save images
    let getAvatarOne = (await axios.get(avatar, { responseType: 'arraybuffer' })).data;
    let bg = (
      await axios.get(encodeURI(`https://i.imgur.com/kPDp0s7.jpg`), {
        responseType: "arraybuffer",
      })
    ).data;
    fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
    avataruser = await circle(pathAvata);
    fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

    // Load images and create canvas
    let baseImage = await loadImage(pathImg);
    let baseAvata = await loadImage(avataruser);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseAvata, 45, 63, 290, 290);

    // Draw text on canvas
    ctx.font = `${fontsInfo}px Play-Bold`;
    ctx.fillStyle = "#ffcc00";
    ctx.textAlign = "start";
    fontSize = 20;
    ctx.fillText(`Naam: ${name}`, 720, 230);
    ctx.font = `${fontsInfo}px Play-Bold`;
    ctx.fillStyle = "#ffcc00";
    ctx.textAlign = "start";
    fontSize = 15;
    ctx.fillText(`Ling: ${gender}`, 720, 255);
    ctx.fillText(`Followers: ${follower}`, 720, 280);
    ctx.fillText(`Rishta: ${relationship_status}`, 720, 305);
    ctx.fillText(`Janmdin: ${birthday}`, 720, 330);
    ctx.fillText(`UID: ${uid}`, 720, 360);
    ctx.fillText(`Profile: ${link_profile}`, 620, 390);
    ctx.font = `${fontsLink}px Play-Bold`;
    ctx.fillStyle = "#ffcc00";
    ctx.textAlign = "start";
    fontSize = 20;
    ctx.fillText(`  ${name}  `, 130, 385);

    ctx.beginPath();
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    // Send final message with card
    var msg = {
      body: `🎨===「 𝗨𝗦𝗘𝗥 𝗖𝗔𝗥𝗗𝗜𝗡𝗙𝗢 」===🎨
──────────────────
👤 Naam: ${name}
🎎 Ling: ${gender}
🔰 Followers: ${follower}
💖 Rishta: ${relationship_status}
🎂 Janmdin: ${birthday}
🌍 Jagah: ${location}
🔗 UID: ${uid}
🌐 FB Link: ${link_profile}
──────────────────
👉 Aapka cardinfo ban gaya, aur designs try karo!`,
      attachment: fs.createReadStream(pathImg)
    };

    api.sendMessage(msg, event.threadID, () => fs.unlinkSync(pathImg));
  } catch (error) {
    console.error('Image load karne mein error:', error);
    api.sendMessage(`❌ Request process karne mein error aaya. Thodi der baad try karo.`, event.threadID);
  }
};
