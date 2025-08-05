const moneydown = 1000; // Yahan par khelne ke liye register ka amount set karein

const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
const { loadImage, createCanvas, registerFont } = require("canvas");
const path = __dirname + "/cache/question.png";
const pathhelp = __dirname + "/cache/helpaltp.png";

module.exports.config = {
  name: "altp",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Ai Hai Crorepati, bohot mushkil vip pro khel",
  commandCategory: "Khel",
  usages: "register/play/info/stop",
  cooldowns: 0,
  images: [],
};

function equi(level) {
  if (level == 0) var tienthuong = 0x0;
  if (level == 1) var tienthuong = 0xC8;
  if (level == 2) var tienthuong = 0x190;
  if (level == 3) var tienthuong = 0x258;
  if (level == 4) var tienthuong = 0x3E8;
  if (level == 5) var tienthuong = 0x7D0;
  if (level == 6) var tienthuong = 0xBB8;
  if (level == 7) var tienthuong = 0x1770;
  if (level == 8) var tienthuong = 0x2710;
  if (level == 9) var tienthuong = 0x36B0;
  if (level == 10) var tienthuong = 0x55F0;
  if (level == 11) var tienthuong = 0x7530;
  if (level == 12) var tienthuong = 0x9C40;
  if (level == 13) var tienthuong = 0x13880;
  if (level == 14) var tienthuong = 0x249F0;
  if (level == 15) var tienthuong = 0x3D090;
  return tienthuong;
}

function getlink(helpp, dapan) {
  if (helpp == 1) {
    if (dapan == "A") var link = "https://i.postimg.cc/FKsB9FFL/A.png";
    if (dapan == "B") var link = "https://i.postimg.cc/XJtHcwff/B.png";
    if (dapan == "C") var link = "https://i.postimg.cc/9MDg7x7X/C.png";
    if (dapan == "D") var link = "https://i.postimg.cc/bvCFdXdF/D.png";
  }
  if (helpp == 3) {
    if (dapan == "A") var link = "https://i.postimg.cc/WzjrvzTR/A.png";
    if (dapan == "B") var link = "https://i.postimg.cc/sDjSHMT7/B.png";
    if (dapan == "C") var link = "https://i.postimg.cc/j2XfdTSD/C.png";
    if (dapan == "D") var link = "https://i.postimg.cc/wxcLkXQ9/D.png";
  }
  return link;
}

async function makeWinner(id, lv) {
  var arr = [];
  let canvas = createCanvas(1280, 720);
  let ctx = canvas.getContext("2d");
  let avatar = await loadImage(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  ctx.drawImage(avatar, 351, 75, 566, 566);
  let background = await loadImage("https://i.postimg.cc/gjyHDjYD/winner.png");
  ctx.drawImage(background, 0, 0, 1280, 720);
  var link = [
    "https://i.postimg.cc/6qzBnVGf/lv0.png",
    "https://i.postimg.cc/J7Qrf8dH/lv1.png",
    "https://i.postimg.cc/dttsvfzH/lv2.png",
    "https://i.postimg.cc/xdHYtVzC/lv3.png",
    "https://i.postimg.cc/cLvdtn1f/lv4.png",
    "https://i.postimg.cc/tCSXg5bX/lv5.png",
    "https://i.postimg.cc/d1YFfN29/lv6.png",
    "https://i.postimg.cc/x1Bnv1qh/lv7.png",
    "https://i.postimg.cc/Y287X3h1/lv8.png",
    "https://i.postimg.cc/2yHfVzPH/lv9.png",
    "https://i.postimg.cc/m2DsKHHK/lv10.png",
    "https://i.postimg.cc/4NSgGxvy/lv11.png",
    "https://i.postimg.cc/s2pd5PkG/lv12.png",
    "https://i.postimg.cc/vmRw12Nd/lv13.png",
    "https://i.postimg.cc/KzN6HGvZ/lv14.png",
    "https://i.postimg.cc/fLD4Cts2/lv15.png"
  ];
  let tienthuong = await loadImage(link[lv]);
  ctx.drawImage(tienthuong, 0, 0, 1280, 720);
  fs.writeFileSync(path, canvas.toBuffer("image/png"));
  arr.push(fs.createReadStream(path));
  return arr;
}

module.exports.handleReply = async function ({ event, Users, api, handleReply, Currencies }) {
  if (handleReply.type == "answer") {
    var { threadID, messageID, senderID } = event;
    if (senderID !== handleReply.author) return api.sendMessage("Main khel raha hoon, tu side mein ja!", threadID, messageID);
    var name = await Users.getNameUser(senderID);
    var senderInfo = await Users.getData(senderID);
    var choose = event.body.toUpperCase();
    var mot = handleReply.one;
    var hai = handleReply.two;
    var ba = handleReply.three;
    var a = handleReply.author;
    var b = handleReply.dapandung;
    var c = handleReply.giaithich;
    var loz = handleReply.link;

    if (choose == "HELP 1" || choose == "HELP1") {
      if (senderInfo.data.helpaltp.helpm !== 1) return api.sendMessage("Tune is madad ka haq pehle hi use kar liya hai!", threadID, messageID);
      api.unsendMessage(handleReply.messageID);
      let canvas = createCanvas(588, 375);
      let background = await loadImage(loz);
      let ctx = canvas.getContext("2d");
      ctx.drawImage(background, 0, 0, 588, 375);
      let loaibo1 = await loadImage(getlink(1, mot[0]));
      let loaibo2 = await loadImage(getlink(1, mot[1]));
      ctx.drawImage(loaibo1, 0, 0, 588, 375);
      ctx.drawImage(loaibo2, 0, 0, 588, 375);
      if (senderInfo.data.helpaltp.helpb == 2) {
        let tuvan1 = await loadImage(getlink(3, ba[0]));
        let tuvan2 = await loadImage(getlink(3, ba[1]));
        let tuvan3 = await loadImage(getlink(3, ba[2]));
        ctx.drawImage(tuvan1, 407, 50, 181, 50);
        ctx.drawImage(tuvan2, 407, 100, 181, 50);
        ctx.drawImage(tuvan3, 407, 150, 181, 50);
      }
      fs.writeFileSync(pathhelp, canvas.toBuffer("image/png"));
      senderInfo.data.helpaltp.helpm = 2;
      await Users.setData(senderID, senderInfo);
      var fuckk = `System ne do galat jawab hata diye hain: ${mot[0]} aur ${mot[1]}`;
      if (senderInfo.data.helpaltp.helph == 1 || senderInfo.data.helpaltp.helpb == 1) fuckk += "\n== [ 2 MADAD BAAKI HAIN ] ==";
      if (senderInfo.data.helpaltp.helph == 1) fuckk += '\n➝ Reply (Jawab) mein "help2" likhein: Public ki rai';
      if (senderInfo.data.helpaltp.helpb == 1) fuckk += '\n➝ Reply (Jawab) mein "help3" likhein: Experts ki salah';
      return api.sendMessage({
        body: fuckk,
        attachment: fs.createReadStream(pathhelp)}, threadID, (error, info) => {
          global.client.handleReply.push({
            type: "answer",
            name: this.config.name,
            author: a,
            dapandung: b,
            giaithich: c,
            one: mot,
            two: hai,
            three: ba,
            link: loz,
            level: senderInfo.data.altp.level,
            messageID: info.messageID
          })
        fs.unlinkSync(pathhelp)
      })
    }
    if (senderInfo.data.helpaltp.helpm == 2 && (choose == mot[0] || choose == mot[1])) return api.sendMessage("Yeh jawab pehle hi hata diya gaya hai!", threadID, messageID);

    if (choose == "HELP 2" || choose == "HELP2") {
      if (senderInfo.data.helpaltp.helph !== 1) return api.sendMessage("Tune is madad ka haq pehle hi use kar liya hai!", threadID, messageID);
      var linkhai = hai.length == 1 ? hai[0] : senderInfo.data.helpaltp.helpm == 2 ? hai[1] : hai[0];
      var down = (await axios.get(linkhai, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathhelp, Buffer.from(down, "utf-8"));
      senderInfo.data.helpaltp.helph = 2;
      await Users.setData(senderID, senderInfo);
      return api.sendMessage({
        body: "Yeh hai public ke survey ka result!",
        attachment: fs.createReadStream(pathhelp)
      }, threadID, () => fs.unlinkSync(pathhelp), messageID);
    }

    if (choose == "HELP 3" || choose == "HELP3") {
      if (senderInfo.data.helpaltp.helpb !== 1) return api.sendMessage("Tune is madad ka haq pehle hi use kar liya hai!", threadID, messageID);
      api.unsendMessage(handleReply.messageID);
      let background = await loadImage(loz);
      let tuvan1 = await loadImage(getlink(3, ba[0]));
      let tuvan2 = await loadImage(getlink(3, ba[1]));
      let tuvan3 = await loadImage(getlink(3, ba[2]));
      let canvas = createCanvas(588, 375);
      let ctx = canvas.getContext("2d");
      ctx.drawImage(background, 0, 0, 588, 375);
      if (senderInfo.data.helpaltp.helpm == 2) {
        let loaibo1 = await loadImage(getlink(1, mot[0]));
        let loaibo2 = await loadImage(getlink(1, mot[1]));
        ctx.drawImage(loaibo1, 0, 0, 588, 375);
        ctx.drawImage(loaibo2, 0, 0, 588, 375);
      }
      ctx.drawImage(tuvan1, 407, 50, 181, 50);
      ctx.drawImage(tuvan2, 407, 100, 181, 50);
      ctx.drawImage(tuvan3, 407, 150, 181, 50);
      fs.writeFileSync(pathhelp, canvas.toBuffer("image/png"));
      senderInfo.data.helpaltp.helpb = 2;
      await Users.setData(senderID, senderInfo);
      var bd = "Yeh hai teeno experts ki rai!";
      if (senderInfo.data.helpaltp.helpm == 1 || senderInfo.data.helpaltp.helph == 1) bd += "\n== [ 2 MADAD BAAKI HAIN ] ==";
      if (senderInfo.data.helpaltp.helpm == 1)  bd += '\n➝ Reply (Jawab) mein "help1" likhein: 50-50';
      if (senderInfo.data.helpaltp.helph == 1)  bd += '\n➝ Reply (Jawab) mein "help2" likhein: Public ki rai';
      return api.sendMessage({
        body: bd,
        attachment: fs.createReadStream(pathhelp)}, threadID, (error, info) => {
          global.client.handleReply.push({
            type: "answer",
            name: this.config.name,
            author: a,
            dapandung: b,
            giaithich: c,
            one: mot,
            two: hai,
            three: ba,
            link: loz,
            level: senderInfo.data.altp.level,
            messageID: info.messageID
          })
        fs.unlinkSync(pathhelp)
      })
    }

    if (choose !== "A" && choose !== "B" && choose !== "C" && choose !== "D") return api.sendMessage("Galat jawab chuna gaya!",threadID, messageID);
    if (choose == handleReply.dapandung) {
      var levelcc = handleReply.level + 1;
      if (levelcc < 15) {
        api.unsendMessage(handleReply.messageID);
        var djtme = levelcc == 1 ? "➝ pehla sawal" : `➝ sawal number ${levelcc}`;
        api.sendMessage(`➝ ${choose} sahi jawab hai, ${handleReply.giaithich}\n\n➝ Badhai ho khiladi ${name} ne shandaar tareeke se ${djtme} ka sahi jawab diya, inaam ki rakam ${equi(levelcc)}$ tak badh gayi`, threadID, messageID);
        var cauhoi = levelcc + 1;
try {
        const res = await axios.get(`https://raw.githubusercontent.com/dongdev06/ailatrieuphu/main/altp${cauhoi}.json`);
        var x = Math.floor(Math.random() * res.data.allquestion.length);
        var question = res.data.allquestion[x];
        var linkanh = question.link;
        var dapandung = question.dapan;
        var giaithich = question.giaithich;
        var helpmot = question.helpone;
        var helphai = question.helptwo;
        var helpba = question.helpthree;
        senderInfo.data.altp = { level: levelcc, rd: x };
        if (senderInfo.data.helpaltp.helpm == 2) senderInfo.data.helpaltp.helpm = 0;
        if (senderInfo.data.helpaltp.helph == 2) senderInfo.data.helpaltp.helph = 0;
        if (senderInfo.data.helpaltp.helpb == 2) senderInfo.data.helpaltp.helpb = 0;
        await Users.setData(senderID, senderInfo);
        var cc = cauhoi == 5 ? "➝ Pehla milestone sawal" : cauhoi == 10 ? "➝ Doosra milestone sawal" : cauhoi == 15 ? "➝ Aakhri sawal" : `➝ Sawal number ${cauhoi}`;
        var lmao = cc !== `Sawal number ${cauhoi}` ? "ki keemat" : "inaam ki rakam badhakar";
        var bruh = `${cc} ${lmao} ${equi(cauhoi)}$`;
        if (senderInfo.data.helpaltp.helpm == 1 || senderInfo.data.helpaltp.helph == 1 || senderInfo.data.helpaltp.helpb == 1) bruh += "\n== [ 3 MADAD BAAKI HAIN ] ==";
        if (senderInfo.data.helpaltp.helpm == 1) bruh += '\n➝ Reply (Jawab) mein "help1" likhein: 50-50';
        if (senderInfo.data.helpaltp.helph == 1) bruh += '\n➝ Reply (Jawab) mein "help2" likhein: Public ki rai';
        if (senderInfo.data.helpaltp.helpb == 1) bruh += '\n➝ Reply (Jawab) mein "help3" likhein: Experts ki salah';
        var callback = () => api.sendMessage({
        body: `${bruh}`,
        attachment: fs.createReadStream(path)}, threadID, (error, info) => {
          global.client.handleReply.push({
            type: "answer",
            name: this.config.name,
            author: senderID,
            dapandung: dapandung,
            giaithich: giaithich,
            one: helpmot,
            two: helphai,
            three: helpba,
            link: linkanh,
            level: senderInfo.data.altp.level,
            messageID: info.messageID
          })
        fs.unlinkSync(__dirname + "/cache/question.png")
        })
        return request(linkanh).pipe(fs.createWriteStream(path)).on("close",() => callback());
} catch (error) {
  return api.sendMessage(`➝ Agla sawal lene mein error aaya!\n${error}`,threadID);
}
      } else if (levelcc == 15) {
        api.unsendMessage(handleReply.messageID);
        Currencies.increaseMoney(senderID, 0x3D090);
        senderInfo.data.altp = { level: -1, rd: -1 };
        await Users.setData(senderID, senderInfo);
        return api.sendMessage({ body: `➝ ${choose} sahi jawab hai, ${handleReply.giaithich}\n\n➝ Badhai ho khiladi ${name} ne shandaar tareeke se 15 sawalon ka jawab diya aur 250000$ jeet liya\n➝ Agle program mein milte hain!`, attachment: await makeWinner(senderID, 15)}, threadID, () => fs.unlinkSync(path), messageID);
      }
    } else {
      api.unsendMessage(handleReply.messageID);
      var level = handleReply.level;
      if (level >= 5 && level < 10) { var tienthuong = 0x7D0; } else if (level >= 10) { var tienthuong = 0x55F0; } else var tienthuong = 0;
      senderInfo.data.altp = { level: -1, rd: -1 };
      await Users.setData(senderID, senderInfo);
      if (tienthuong == 0x7D0) var moc = "pehla", xx = 5;
      if (tienthuong == 0x55F0) var moc = "doosra", xx = 10;
      if (moc == "pehla" || moc == "doosra") {
        Currencies.increaseMoney(senderID, tienthuong);
        return api.sendMessage({ body:`➝ ${choose} galat jawab hai, sahi jawab tha ${handleReply.dapandung}, ${handleReply.giaithich}\n\n➝ Hamare khiladi ne galat jawab diya aur ${moc} milestone par ${tienthuong}$ ke saath wapas ja rahe hain\n➝ Program mein hissa lene ke liye shukriya, agle program mein milte hain!`, attachment: await makeWinner(senderID, xx)}, threadID, () => fs.unlinkSync(path), messageID);
      } else {
        return api.sendMessage({ body: `➝ ${choose} galat jawab hai, sahi jawab tha ${handleReply.dapandung}, ${handleReply.giaithich}\n\n➝ Program mein hissa lene ke liye shukriya, agle program mein milte hain!`, attachment: await makeWinner(senderID, 0)}, threadID, () => fs.unlinkSync(path), messageID); 
      }
    }
  }
}

module.exports.run = async function ({ api, event, args, Currencies, Users}) {
  const { ADMINBOT, PREFIX } = global.config;
  const timeVN = require("moment-timezone").tz("Asia/Kolkata"),
  gio = timeVN.format("HH:mm:ss"),
  ngay = timeVN.format("DD/MM/YYYY")
  const threadSetting = global.data.threadData.get(event.threadID) || {};
  var prefix = threadSetting.PREFIX || PREFIX;
  const { configPath } = global.client;
  delete require.cache[require.resolve(configPath)];
  var config = require(configPath);
  var { threadID, messageID, senderID } = event;
  const dataMoney = await Currencies.getData(senderID);
  const money = dataMoney.money;
  var senderInfo = await Users.getData(senderID);
  var playto = (!senderInfo.data.altp || senderInfo.data.altp.level == -1) ? "Khel shuru karein (register karna zaroori)" : senderInfo.data.altp.level == 0 ? "Khel shuru karein" : `sawal number ${senderInfo.data.altp.level} se aage khelein`;

var path = __dirname + "/cache/altp.png";
    let getimg = (await axios.get(`https://i.imgur.com/PiUzRJK.png`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(path, Buffer.from(getimg, "utf-8"));
  
  var msg = "=== [ 𝗔𝗜 𝗛𝗔𝗜 𝗖𝗥𝗢𝗥𝗘𝗣𝗔𝗧𝗜 ] ===" + "\n"
+ prefix + "𝗔𝗟𝗧𝗣 𝗥𝗘𝗚𝗜𝗦𝗧𝗘𝗥 ➝ Program mein register karein (1000$ chahiye)" + "\n"
+ prefix + "𝗔𝗟𝗧𝗣 𝗣𝗟𝗔𝗬 ➝ " + playto + "\n"
+ prefix + "�_A𝗟𝗧𝗣 𝗜𝗡𝗙𝗢 ➝ Sawal aur inaam ki jankari dekhein" + "\n"
+ prefix + "𝗔𝗟𝗧𝗣 𝗧𝗢𝗣 <𝗕𝗢𝗫/𝗦𝗘𝗩�_E𝗥> ➝ Group aur server ke level ki ranking dekhein" + "\n"
+ prefix + "𝗔𝗟𝗧𝗣 𝗦𝗧𝗢𝗣 ➝ Khel rok kar inaam lein"
  if (ADMINBOT.includes(senderID)) msg += `\n𝗔𝗟𝗧𝗣 𝗦𝗘𝗧�_L𝗩 ➝ @tag ka level set karein (sirf admin ke liye)\n\n`;
  if (args.length == 0) return api.sendMessage({ body: msg , attachment: fs.createReadStream(__dirname + "/cache/altp.png")}, event.threadID, event.messageID);

  var type = args[0].toLowerCase();
  const allType = ["register","play","info","stop","setlv","top"];
  if (!allType.includes(type)) return api.sendMessage(msg, threadID, messageID);
  
  if (type == "top") {
    if (args.length == 1 || (args[1] !== "box" && args[1] !== "sever")) return api.sendMessage(`➝ Syntax: ${prefix}altp top <Box/Server>`,threadID, messageID);
    var arr = [], count = 0;
    let allID = args[1] == "box" ? (await api.getThreadInfo(threadID)).participantIDs : args[1] == "sever" ? global.data.allUserID : ""
    for (const i of allID) {
      let dataUser = await Users.getData(i)
      var lv = (!dataUser.data.altp || dataUser.data.altp.level == -1) ? 0 : dataUser.data.altp.level;
      arr.push({
        idUser: i,
        nameUser: dataUser.name,
        level: lv
      })
      ++count;
      if (count > 10) break;
    }
    count = 0;
    arr.sort(VC("level"));
    var msg = `𝗧𝗢𝗣 ${arr.length} �_K𝗛𝗜𝗟𝗔𝗗𝗜 �_J𝗜𝗡𝗞𝗘 𝗦𝗔𝗕𝗦𝗘 𝗨𝗣𝗔𝗥 𝗞𝗘 𝗟𝗘𝗩𝗘𝗟 𝗛𝗔𝗜𝗡 ${args[1] == "box" ? "group mein" : args[1] == "sever" ? "server mein" : ""}\n`.toUpperCase()
    for (const i in arr) {
      msg += `${count == 1 ? "「🥇」" : count == 2 ? "「🥈」" : count == 3 ? "「🥉」" : ""} ${count == 0 ? "「🏆」" : `${count}`} ${arr[i].nameUser}\n➝ 𝗟𝗘𝗩𝗘𝗟: ${arr[i].level}\n`;
      ++count
      if (count >= 10) break;
    }
    api.sendMessage(msg, event.threadID);

    function VC(key) {
      return function(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) return 0;
        let sos = 0;
        if (a[key] > b[key]) {
          sos = 1
        } else if (a[key] < b[key]) {
          sos = -1
        }
        return sos * -1
      }
    }
  }
  
  if (type == "setlv") {
    try {
      if (!ADMINBOT.includes(event.senderID)) return api.sendMessage("➝ Tumhe is feature ko use karne ka adhikar nahi hai!", threadID, messageID);
      var lv = parseInt(args[1]);
      if (isNaN(lv) || lv < 0 || lv > 15) return api.sendMessage(`➝ Level ${args[1]} sahi nahi hai!`, threadID, messageID);
      let mention = Object.keys(event.mentions);
      var arr = [];
      var allName = [];
      if (event.type == 'message_reply') {
        arr.push(event.messageReply.senderID)
      } else if (mention.length != 0) {
        for (var i = 0; i < mention.length; i++) arr.push(mention[i])
      } else arr.push(event.senderID)
      for (var i = 0; i < arr.length; i++) {
        var Info = await Users.getData(arr[i]);
        if (!Info.data.altp || Info.data.altp.level == -1) Info.data.helpaltp = { helpm: 1, helph: 1, helpb: 1 };
        Info.data.altp = {
          level: lv,
          rd: -1
        };
        await Users.setData(arr[i], Info);
        if (arr[i] == senderID) {
          allName.push("khud ka");
        } else allName.push(`${i == 0 ? "" : " "}${Info.name}`)
      }
      return api.sendMessage(`Level ${allName} ka ${lv} set kar diya gaya!`, threadID, messageID);
    } catch (error) {
      return api.sendMessage(`${error}!`, threadID, messageID);
    }
  }

  if (type == "register") {
    if (senderInfo.data.altp && senderInfo.data.altp.level !== -1) return api.sendMessage("➝ Tum pehle hi register kar chuke ho, saare sawal poore karo ya khel roko phir dobara register karo!", threadID, messageID);
    if (money < moneydown) return api.sendMessage(`➝ Tumhare paas register karne ke liye ${moneydown}$ nahi hain, jaao kaam karke paise kamao!`, threadID, messageID);
    return api.sendMessage(`➝ Is message mein icon daal kar ${moneydown}$ ke saath program mein register hone ki pushti karein!`, threadID, (error, info) => {
      global.client.handleReaction.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "register"
      })
    }, messageID)
  };
  
  if (type == "stop") {
    if (!senderInfo.data.altp || senderInfo.data.altp.level == -1) return api.sendMessage("➝ Tumne abhi tak program mein register nahi kiya hai!", threadID, messageID);
    var abc = senderInfo.data.altp.level;
    return api.sendMessage(`➝ Is message mein icon daal kar yahan khel rokar ${equi(abc)}$ ke inaam ke saath wapas jane ki pushti karein`, threadID, (error, info) => {
      global.client.handleReaction.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "stop"
      })
    }, messageID)
  };
  
  if (type == "info") {
    const pathinfo = __dirname + '/cache/info.png';
    if (!senderInfo.data.altp || senderInfo.data.altp.level == -1) {
      var down = (await axios.get("https://i.postimg.cc/gJT4rzCb/chuadangki.png", { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathinfo, Buffer.from(down, "utf-8"));
      return api.sendMessage({body: `➝ ${prefix}altp register ka istemal karein register karne ke liye!`, attachment: fs.createReadStream(pathinfo)}, threadID, () => fs.unlinkSync(pathinfo), messageID);
    }
    var lv = senderInfo.data.altp.level;
    let canvas = createCanvas(1149, 1600);
    let ctx = canvas.getContext("2d");
    let avatar = await loadImage(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    ctx.drawImage(avatar, 49, 25, 204, 204);
    var linkinfo = [
      "https://i.postimg.cc/fbM8rgcp/lv0.png",
      "https://i.postimg.cc/jCVXQ8q8/lv1.png",
      "https://i.postimg.cc/Pxx2tpFM/lv2.png",
      "https://i.postimg.cc/RhJdtrm6/lv3.png",
      "https://i.postimg.cc/HWJ1zVs5/lv4.png",
      "https://i.postimg.cc/TPQtMqQw/lv5.png",
      "https://i.postimg.cc/9Xv5nCrk/lv6.png",
      "https://i.postimg.cc/hj6w61Pm/lv7.png",
      "https://i.postimg.cc/4ycMgHmS/lv8.png",
      "https://i.postimg.cc/RVc8pfr3/lv9.png",
      "https://i.postimg.cc/HsGRtzND/lv10.png",
      "https://i.postimg.cc/L4gGfwN3/lv11.png",
      "https://i.postimg.cc/6pcPtXpt/lv12.png",
      "https://i.postimg.cc/BvvVvVjD/lv13.png",
      "https://i.postimg.cc/G3DS9YmM/lv14.png",
      "https://i.postimg.cc/vHd2nB1G/lv15.png"
    ];
    let background = await loadImage(linkinfo[lv]);
    ctx.drawImage(background, 0, 0, 1149, 1600);
    if (senderInfo.data.helpaltp.helpm !== 1 || senderInfo.data.helpaltp.helph !== 1 || senderInfo.data.helpaltp.helpb !== 1) var gachcheo = await loadImage("https://i.postimg.cc/Mp7st8Q1/gachcheo.png");
    if (senderInfo.data.helpaltp.helpm !== 1) ctx.drawImage(gachcheo, 500, 65, 160, 107);
    if (senderInfo.data.helpaltp.helph !== 1) ctx.drawImage(gachcheo, 700, 65, 160, 107);
    if (senderInfo.data.helpaltp.helpb !== 1) ctx.drawImage(gachcheo, 900, 65, 160, 107);
    fs.writeFileSync(pathinfo, canvas.toBuffer("image/png"));
    var sucCak = lv == 0 ? "shuru karein!" : "aage badhein!";
    return api.sendMessage({ body: `${prefix}altp play ka istemal karein ${sucCak}`, attachment: fs.createReadStream(pathinfo)}, threadID, () => fs.unlinkSync(pathinfo), messageID);
  };

  if (type == "play") {
    try {
      if (!senderInfo.data.altp || senderInfo.data.altp.level == -1) return api.sendMessage (`➝ Tumne abhi tak program mein register nahi kiya hai\n"${prefix}altp register" ka istemal karein register karne ke liye (${moneydown}$ lagenge)`, threadID, messageID);
      if (isNaN(senderInfo.data.altp.level)) {
        senderInfo.data.altp = { level: 0, rd: -1 }
        await Users.setData(senderID, senderInfo);
      }
      var level = senderInfo.data.altp.level;
      if (level == 15) {
        var name = await Users.getNameUser(senderID);
        Currencies.increaseMoney(senderID, 0x3D090);
        senderInfo.data.altp = { level: -1, rd: -1 };
        await Users.setData(senderID, senderInfo);
        return api.sendMessage({ body: `➝ Badhai ho khiladi ${name} ne shandaar tareeke se 15 sawalon ka jawab diya aur 250000$ jeet liya\nAgli baar program mein milte hain!`, attachment: await makeWinner(senderID, 15)}, threadID, () => fs.unlinkSync(path), messageID);
      }
      var cauhoi = level + 1;
      const res = await axios.get(`https://raw.githubusercontent.com/dongdev06/ailatrieuphu/main/altp${cauhoi}.json`);
      if (!senderInfo.data.altp.rd || senderInfo.data.altp.rd == -1) {
        var x = Math.floor(Math.random() * res.data.allquestion.length);
        senderInfo.data.altp = { level: level, rd: x };
        await Users.setData(senderID, senderInfo);
      } else var x = senderInfo.data.altp.rd;
      var question = res.data.allquestion[x];
      var linkanh = question.link;
      var dapan = question.dapan;
      var giaithich = question.giaithich;
      var helpmot = question.helpone;
      var helphai = question.helptwo;
      var helpba = question.helpthree;
      var cc = cauhoi == 1 ? "Pehla sawal" : cauhoi == 5 ? "Pehla milestone sawal" : cauhoi == 10 ? "Doosra milestone sawal" : cauhoi == 15 ? "Aakhri sawal" : `Sawal number ${cauhoi}`;
      var lmao = cc !== `Sawal number ${cauhoi}` ? "ki keemat" : "inaam ki rakam badhakar";
  var bruh = `${cc} ${lmao} ${equi(level+1)}$`;
  if (senderInfo.data.helpaltp.helpm == 1 || senderInfo.data.helpaltp.helph == 1 || senderInfo.data.helpaltp.helpb == 1) bruh += "\n== [ 3 MADAD BAAKI HAIN ] ==";
  if (senderInfo.data.helpaltp.helpm == 1) bruh += '\n➝ Reply (Jawab) mein "help1" likhein: 50-50';
  if (senderInfo.data.helpaltp.helph == 1) bruh += '\n➝ Reply (Jawab) mein "help2" likhein: Public ki rai';
      if (senderInfo.data.helpaltp.helpb == 1) bruh += '\n➝ Reply (Jawab) mein "help3" likhein: Experts ki salah';
  
      if (senderInfo.data.helpaltp.helpm !== 2 && senderInfo.data.helpaltp.helph !== 2 && senderInfo.data.helpaltp.helpb !== 2) {
        var callback = () => api.sendMessage({
          body: `${bruh}`,
          attachment: fs.createReadStream(path)}, threadID, (error, info) => {
            global.client.handleReply.push({
            type: "answer",
            name: this.config.name,
            author: senderID,
            dapandung: dapan,
            giaithich: giaithich,
            one: helpmot,
            two: helphai,
            three: helpba,
            link: linkanh,
            level: level,
            messageID: info.messageID
          })
          fs.unlinkSync(path)
        })
        return request(linkanh).pipe(fs.createWriteStream(path)).on("close",() => callback());
      } else {
        api.sendMessage("Restore kar raha hoon...", threadID, messageID);
        let canvas = createCanvas(588, 375);
        let background = await loadImage(linkanh);
        let ctx = canvas.getContext("2d");
        ctx.drawImage(background, 0, 0, 588, 375);
        if (senderInfo.data.helpaltp.helpm == 2) {
          let loaibo1 = await loadImage(getlink(1, helpmot[0]));
          let loaibo2 = await loadImage(getlink(1, helpmot[1]));
          ctx.drawImage(loaibo1, 0, 0, 588, 375);
          ctx.drawImage(loaibo2, 0, 0, 588, 375);
        }
        if (senderInfo.data.helpaltp.helpb == 2) {
          let tuvan1 = await loadImage(getlink(3, helpba[0]));
          let tuvan2 = await loadImage(getlink(3, helpba[1]));
          let tuvan3 = await loadImage(getlink(3, helpba[2]));
          ctx.drawImage(tuvan1, 407, 50, 181, 50);
          ctx.drawImage(tuvan2, 407, 100, 181, 50);
          ctx.drawImage(tuvan3, 407, 150, 181, 50);
        }
        fs.writeFileSync(path, canvas.toBuffer("image/png"));
        api.sendMessage({
          body: `${bruh}`,
          attachment: fs.createReadStream(path)}, threadID, (error, info) => {
            global.client.handleReply.push({
            type: "answer",
            name: this.config.name,
            author: senderID,
            dapandung: dapan,
            giaithich: giaithich,
            one: helpmot,
            two: helphai,
            three: helpba,
            link: linkanh,
            level: level,
            messageID: info.messageID
            })
            fs.unlinkSync(path)
          })
        if (senderInfo.data.helpaltp.helph == 2) {
          var linkhai = helphai.length == 1 ? helphai[0] : senderInfo.data.helpaltp.helpm == 2 ? helphai[1] : helphai[0];
          var callback = () => api.sendMessage({ body: "→ Yeh hai studio mein public ke survey ka result!", attachment: fs.createReadStream(pathhelp)}, threadID, () => fs.unlinkSync(pathhelp));
          return request(linkhai).pipe(fs.createWriteStream(pathhelp)).on("close",() => callback());
        }
        return;
      }
    } catch (error) {
      return api.sendMessage(`Error aaya hai!\n${error}`, threadID, messageID);
    }
  }
}

module.exports.handleReaction = async({ api, event, Threads, handleReaction, Currencies, Users }) => {
  if (event.userID != handleReaction.author) return;
  var senderInfo = await Users.getData(handleReaction.author);
  if (handleReaction.type == "register") {
    const threadSetting = global.data.threadData.get(event.threadID) || {};
    var prefix = threadSetting.PREFIX || global.config.PREFIX;
    api.unsendMessage(handleReaction.messageID);
    Currencies.decreaseMoney(handleReaction.author, moneydown);
  //  const path1 = __dirname + '/cache/intro.png';
   // var down = (await axios.get("https://i.postimg.cc/FH7B0wvY/intronew.png", { responseType: "arraybuffer" })).data;
   // fs.writeFileSync(path1, Buffer.from(down, "utf-8"));
    senderInfo.data.altp = { level: 0, rd: -1 };
    senderInfo.data.helpaltp = { helpm: 1, helph: 1, helpb: 1 };
    await Users.setData(handleReaction.author, senderInfo);
    return api.sendMessage(`→ Register safal, Ai Hai Crorepati program mein aapka swagat hai!\n\n"${prefix}altp play" ka istemal karein shuru karne ke liye!`, event.threadID);
  }
  if (handleReaction.type == "stop") {
    api.unsendMessage(handleReaction.messageID);
    var level = senderInfo.data.altp.level;
    var name = await Users.getNameUser(handleReaction.author);
    Currencies.increaseMoney(handleReaction.author,equi(level));
    senderInfo.data.altp = { level: -1, rd: -1 };
    senderInfo.data.helpaltp = { helpm: 0, helph: 0, helpb: 0 };
    await Users.setData(handleReaction.author, senderInfo);
    return api.sendMessage({body: `→ Khiladi ${name} ne ${level} sawalon ka jawab diya aur ${equi(level)}$ ka inaam jeeta\nAgli baar program mein milte hain!`, attachment: await makeWinner(handleReaction.author, level)}, event.threadID, () => fs.unlinkSync(path));
  }
}
