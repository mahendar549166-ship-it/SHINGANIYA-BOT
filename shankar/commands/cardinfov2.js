const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { loadImage, createCanvas } = require('canvas');

// Function to create circular effect for image
async function circle(imagePath) {
  const img = await loadImage(imagePath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');

  // Draw circle
  ctx.beginPath();
  ctx.arc(img.width / 2, img.height / 2, img.width / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Draw image inside circle
  ctx.drawImage(img, 0, 0, img.width, img.height);

  return canvas.toBuffer();
}

module.exports.config = {
  name: "cardinfov2",
  version: "1.0.1",
  hasPermission: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Facebook user ka card info v2",
  commandCategory: "Edit-img",
  usages: "cardinfo fb",
  usePrefix: false,
  cooldowns: 5
};

module.exports.run = async ({ api, event, Users, Threads, args }) => {
  try {
    const token = global.config.ACCESSTOKEN;
    let id;

    if (Object.keys(event.mentions).length > 0) {
      id = Object.keys(event.mentions)[0].replace(/\&mibextid=ZbWKwL/g, '');
    } else {
      id = args[0] !== undefined ? (isNaN(args[0]) ? await global.utils.getUID(args[0]) : args[0]) : event.senderID;
      if (event.type === "message_reply") {
        id = event.messageReply.senderID;
      }
    }

    const resp = await axios.get(`https://graph.facebook.com/${id}?fields=id,is_verified,cover,updated_time,work,education,likes,created_time,work,posts,hometown,username,family,timezone,link,name,locale,location,about,website,birthday,gender,relationship_status,significant_other,quotes,first_name,subscribers.limit(0)&access_token=${token}`);
    const name = resp.data.name;
    const uid = resp.data.id;
    const link_profile = resp.data.link;
    const avatar = `https://graph.facebook.com/${id}/picture?width=1500&height=1500&access_token=2712477385668128%7Cb429aeb53369951d411e1cae8e810640`;
    const gender = resp.data.gender === 'male' ? 'Purush' : resp.data.gender === 'female' ? 'Mahila' : 'Prakaashit nahi';
    const relationship_status = resp.data.relationship_status || "Koi data nahi";
    const birthday = resp.data.birthday || "Prakaashit nahi";
    const follower = resp.data.subscribers?.summary?.total_count || "Prakaashit nahi";
    const hometown = resp.data.hometown?.name || "Koi data nahi";
    const location = resp.data.location?.name || 'Koi data nahi';
    const love = resp.data.love?.name || 'Koi data nahi';

    // Create 'cache' folder if it doesn't exist
    const cacheFolder = path.join(__dirname, '/cache');
    if (!fs.existsSync(cacheFolder)) {
      fs.mkdirSync(cacheFolder);
    }

    // Create file paths for images
    const pathImg = path.join(cacheFolder, `cardinfo.png`);
    const pathAvata = path.join(cacheFolder, 'avtuserrd.png');

    // Download and process avatar image
    const getAvatarOne = (await axios.get(avatar, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
    const avataruser = await circle(pathAvata);

    // Download background image
    const bg = (
      await axios.get(encodeURI(`https://imgur.com/kSfS1wX.png`), {
        responseType: "arraybuffer",
      })
    ).data;

    // Load base image and avatar
    const baseImage = await loadImage(bg);
    const baseAvata = await loadImage(avataruser);
    
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    // Draw background image
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // Draw base image and avatar
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseAvata, 50, 130, 270, 270);

    const fontsInfo = 22;
    const fontsLink = 23;

    ctx.font = `${fontsInfo}px Play-Bold`;
    ctx.fillStyle = "#D3D3D3";
    ctx.textAlign = "start";
    ctx.fillText(`Pura Naam: ${name}`, 410, 172);
    ctx.fillStyle = "#99CCFF";
    ctx.fillText(`Ling: ${gender}`, 410, 208);
    ctx.fillStyle = "#FFFFE0";
    ctx.fillText(`Followers: ${follower} followers`, 410, 244);
    ctx.fillStyle = "#FFE4E1";
    ctx.fillText(`Rishta: ${relationship_status}`, 410, 281);
    ctx.fillStyle = "#9AFF9A";
    ctx.fillText(`Janmdin: ${birthday}`, 410, 320);
    ctx.fillStyle = "#FF6A6A";
    ctx.fillText(`Sthaan: ${location}`, 410, 357);
    ctx.fillStyle = "#EEC591";
    ctx.fillText(`Facebook UID: ${uid}`, 410, 397);

    ctx.font = `${fontsLink}px Play-Bold`;
    ctx.fillStyle = "#FFBBFF";
    ctx.fillText(`Facebook Link: ${link_profile}`, 30, 450);

    ctx.beginPath();
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    // Prepare and send message
    const msg = {
      body: `
😻==「 CARDINFO CUTE 」==😻
──────────────────
👤 Naam: ${name}
🎎 Ling: ${gender}
🔰 Followers: ${follower}
💖 Rishta: ${relationship_status}
🎂 Janmdin: ${birthday}
🌍 Sthaan: ${location}
🔗 UID: ${uid}
🌐 Facebook Link: ${link_profile}
──────────────────
👉 Aapka cardinfo safalta se ban gaya, aap alag-alag design try kar sakte hain.`,
      attachment: fs.createReadStream(pathImg)
    };

    api.sendMessage(msg, event.threadID);
  } catch (error) {
    console.error('Error downloading image:', error);
    api.sendMessage(`Anurodh ke prakriya mein error hua. Kripya dobara prayas karen.`, event.threadID);
  }
};
