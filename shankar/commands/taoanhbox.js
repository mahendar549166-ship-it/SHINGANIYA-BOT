module.exports.config = {
  name: "taoanhbox",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Box ke sabhi sadasyon ka photo banayein",
  commandCategory: "Khel",
  usages: "family <size> [#rang ka code] ya family <size>\nSadasya ke avatar ka size aur text ke liye rang ka code (default kala) is prakar daalein:\n$family <size> <rang ka code> <title>\nJisme:\n•size: Sadasya ke avatar ka size\n•rang ka code: Hex format mein rang\n•title: Photo ka title, default box ka naam\nUdaaharan: $family 200 #ffffff Bhai ek parivaar\nAgar size = 0 chuna to auto size hoga, agar title nahi diya to title box ka naam hoga",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "", 
    "axios": "", 
    "canvas": "", 
    "jimp": "", 
    "node-superfetch": "",
    "chalk": ""
  }
};

module.exports.circle = async (image) => {
  const jimp = global.nodemodule["jimp"];
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
};

module.exports.run = async ({ event, api, args }) => {
  const jimp = global.nodemodule["jimp"];
  const Canvas = global.nodemodule["canvas"];
  const superfetch = global.nodemodule["node-superfetch"];
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const img = new Canvas.Image();
  function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)) };
  const { threadID, messageID } = event;
  var live = [], admin = [], i = 0;
  if (args[0] == 'help' || args[0] == '0' || args[0] == '-h') return api.sendMessage('Istemaal: ' + this.config.name + ' [avatar size]' + ' [rang ka code]' + ' [samooh ka naam] || sab khali chod dein to bot apne aap jankari lega', threadID, messageID);
  /*============FONTS DOWNLOAD=============*/
  if (!fs.existsSync(__dirname + `/cache/TUVBenchmark.ttf`)) { 
    let downFonts = (await axios.get(`https://drive.google.com/u/0/uc?id=1NIoSu00tStE8bIpVgFjWt2in9hkiIzYz&export=download`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + `/cache/TUVBenchmark.ttf`, Buffer.from(downFonts, "utf-8"));
  }
  /*===========BACKGROUND & AVATAR FRAMES==========*/
  var bg = ['https://i.imgur.com/P3QrAgh.jpg', 'https://i.imgur.com/RueGAGI.jpg', 'https://i.imgur.com/bwMjOdp.jpg', 'https://i.imgur.com/trR9fNf.jpg'];
  var background = await Canvas.loadImage(bg[Math.floor(Math.random() * bg.length)]);
  var bgX = background.width;
  var bgY = background.height;
  var khungAvt = await Canvas.loadImage("https://i.imgur.com/gYxZFzx.png");
  const imgCanvas = Canvas.createCanvas(bgX, bgY);
  const ctx = imgCanvas.getContext('2d');
  ctx.drawImage(background, 0, 0, imgCanvas.width, imgCanvas.height);
  /*===============SAMOOH KI JANKARI==============*/
  var { participantIDs, adminIDs, name, userInfo } = await api.getThreadInfo(threadID);
  for (let idAD of adminIDs) { admin.push(idAD.id) };
  /*=====================MRIT ID HATAO===================*/
  for (let idUser of userInfo) {
    if (idUser.gender != undefined) { live.push(idUser) }
  }
  /*======================CUSTOM====================*/
  let size, color, title;
  var image = bgX * (bgY - 200);
  var sizeParti = Math.floor(image / live.length);
  var sizeAuto = Math.floor(Math.sqrt(sizeParti));
  if (!args[0]) { size = sizeAuto; color = '#FFFFFF'; title = encodeURIComponent(name); }
  else { size = parseInt(args[0]); color = args[1] || '#FFFFFF'; title = args.slice(2).join(" ") || name; }
  /*===========DURI============*/
  var l = parseInt(size / 15), x = parseInt(l), y = parseInt(200), xcrop = parseInt(live.length * size), ycrop = parseInt(200 + size);
  size = size - l * 2;
  /*================AVATAR PATH BANAYE===============*/
  api.sendMessage(`🍗Photo anuman: ${participantIDs.length}\n🍠Background size: ${bgX} x ${bgY}\n🥑Avatar size: ${size}\n🥪Rang: ${color}`, threadID, messageID);
  var pathAVT = (__dirname + `/cache/${Date.now() + 10000}.png`);
  /*=================SADASYA AVATAR VAARE==============*/
  for (let idUser of live) {
    console.log("Vaar raha hai: " + idUser.id);
    try { var avtUser = await superfetch.get(`https://graph.facebook.com/${idUser.id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`) } 
    catch (e) { continue }
    if (x + size > bgX) { xcrop = x; x += (-x) + l; y += size + l; ycrop += size + l };
    if (ycrop > bgY) { ycrop += (-size); break };
    avtUser = avtUser.body;
    var avatar = await this.circle(avtUser);
    var avatarload = await Canvas.loadImage(avatar);
    img.src = avatarload;
    ctx.drawImage(avatarload, x, y, size, size);
    if (admin.includes(idUser.id)) { ctx.drawImage(khungAvt, x, y, size, size) };
    i++;
    console.log("Pura hua: " + idUser.id);
    x += parseInt(size + l);
  }
  /*==================TITLE VAARE==================*/
  Canvas.registerFont(__dirname + `/cache/TUVBenchmark.ttf`, { family: "TUVBenchmark" });
  ctx.font = "100px TUVBenchmark";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(decodeURIComponent(title), xcrop / 2, 133);
  /*===================PHOTO KAATO===================*/
  console.log(`Safalata se ${i} avatar vaare`);
  console.log(`Safalata se ${participantIDs.length - i} Facebook upyogkarta chhane`);
  const cutImage = await jimp.read(imgCanvas.toBuffer());
  cutImage.crop(0, 0, xcrop, ycrop + l - 30).writeAsync(pathAVT);
  await delay(300);
  /*====================PHOTO BHEJO==================*/ 
  return api.sendMessage({
    body: `🍗Sadasya sankhya: ${i}\n🥪Background size: ${bgX} x ${bgY}\n🍠${participantIDs.length - i} Facebook upyogkarta chhane gaye`,
    attachment: fs.createReadStream(pathAVT)
  }, threadID, (error, info) => {
    if (error) return api.sendMessage(`Galti hui ${error}`, threadID, () => fs.unlinkSync(pathAVT), messageID);
    console.log('Photo safalata se bheja gaya'); 
    fs.unlinkSync(pathAVT);
  }, messageID); 
};
