const { loadImage, createCanvas } = require("canvas");
const axios = require("axios");
const fs = require("fs");

async function circle(imagePath) {
  const img = await loadImage(imagePath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.arc(img.width / 2, img.height / 2, img.width / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, 0, 0, img.width, img.height);
  return canvas.toBuffer();
}

module.exports.config = {
  name: "cardinfov13",
  version: "1.0.1",
  hasPermission: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "फेसबुक कार्ड जानकारी v13",
  commandCategory: "इमेज संपादन",
  usages: "cardinfo fb",
  usePrefix: false,
  cooldowns: 5,
};

module.exports.run = async ({ api, event, Users, Threads, args }) => {
  try {
    const token = global.config.ACCESSTOKEN;
    let id;

    if (Object.keys(event.mentions).length > 0) {
      id = Object.keys(event.mentions)[0].replace(/\&mibextid=ZbWKwL/g, "");
    } else {
      id =
        args[0] !== undefined
          ? isNaN(args[0])
            ? await global.utils.getUID(args[0])
            : args[0]
          : event.senderID;
      if (event.type === "message_reply") {
        id = event.messageReply.senderID;
      }
    }

    const resp = await axios.get(
      `https://graph.facebook.com/${id}?fields=id,is_verified,cover,updated_time,work,education,likes,created_time,work,posts,hometown,username,family,timezone,link,name,locale,location,about,website,birthday,gender,relationship_status,significant_other,quotes,first_name,subscribers.limit(0)&access_token=${token}`
    );

    const name = resp.data.name;
    const uid = resp.data.id;
    const link_profile = resp.data.link;
    const avatar = `https://graph.facebook.com/${id}/picture?width=1500&height=1500&access_token=2712477385668128%7Cb429aeb53369951d411e1cae8e810640`;
    const gender =
      resp.data.gender === "male"
        ? "पुरुष"
        : resp.data.gender === "female"
        ? "महिला"
        : "प्रकाशित नहीं";
    const relationship_status =
      resp.data.relationship_status || "कोई डेटा नहीं";
    var birthday = resp.data.birthday || "प्रकाशित नहीं";
    const follower =
      resp.data.subscribers?.summary?.total_count || "प्रकाशित नहीं";
    const hometown = resp.data.hometown?.name || "कोई डेटा नहीं";
    const location = resp.data.location?.name || "कोई डेटा नहीं";

    const fontsName = 210;
    const fontsLink = 30;
    const fontsInfo = 190;
    const fontsUid = 190;
    const colorName = "#00FFFF";
    let pathImg = __dirname + `/cache/cardinfo.png`;
    let pathAvata = __dirname + `/cache/avtuserrd.png`;

    let getAvatarOne = (
      await axios.get(avatar, { responseType: "arraybuffer" })
    ).data;

    let bg = (
      await axios.get(
        encodeURI(`https://i.imgur.com/dazQDPT.jpeg`),
        { responseType: "arraybuffer" }
      )
    ).data;

    fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, "utf-8"));
    avataruser = await circle(pathAvata);
    fs.writeFileSync(pathImg, Buffer.from(bg, "utf-8"));

    let baseImage = await loadImage(pathImg);
    let baseAvata = await loadImage(avataruser);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseAvata, 267, 628, 692, 692);

    ctx.font = `${fontsInfo}px Play-Bold`;
    ctx.fillStyle = "#FFCC33";
    ctx.textAlign = "start";
    fontSize = 30;

    ctx.font = `${fontsName}px Play-Bold`;
    ctx.fillStyle = "#00FF00";
    ctx.textAlign = "start";
    fontSize = 20;

    ctx.fillText(`${name}`, 1200, 260);
    ctx.font = `${fontsInfo}px Play-Bold`;
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "start";
    fontSize = 20;

    ctx.fillText(`लिंग: ${gender}`, 1505, 830);
    ctx.fillText(`फॉलोअर्स: ${follower}`, 1505, 1060);
    ctx.fillText(`रिलेशनशिप स्थिति: ${relationship_status}`, 1505, 1310);
    ctx.fillText(`जन्मदिन: ${birthday}`, 1505, 550);
    ctx.fillText(`निवास स्थान: ${location}`, 1505, 1600);
    ctx.fillText(`गृहनगर: ${hometown}`, 1505, 1850);

    ctx.font = `${fontsUid}px Play-Bold`;
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "start";
    fontSize = 20;
    ctx.fillText(`${uid}`, 1505, 2100);

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    var msg = {
      body: `🎨===「 उपयोगकर्ता की जानकारी कार्ड 」===🎨\n──────────────────\n👤 नाम: ${name}\n...`,
      attachment: fs.createReadStream(pathImg),
    };

    api.sendMessage(msg, event.threadID);
  } catch (error) {
    console.error("छवि लोड करने में त्रुटि:", error);
    api.sendMessage(
      `अनुरोध को संसाधित करने में त्रुटि हुई। कृपया बाद में पुनः प्रयास करें।`,
      event.threadID
    );
  }
};
