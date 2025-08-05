module.exports.config = {
  name: "ludo",
  version: "6.9.3",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Bot Zuri par vibhinn prakar ke tai xiu khel",
  commandCategory: "Khel",
  usages: "[tai/xiu/b3gn/b2gn/cs/ct] [rashi]",
  cooldowns: 5
};

const axios = require('axios');
var bdsd = true;
var tilethang = 2;
var tilethangb3dn = 10;
var tilethangb2dn = 5;
var timedelay = 2;
var haisogiong = 2;
var basogiong = 3;
var motsogiong = 1;

function replace(int) {
  var str = int.toString();
  var newstr = str.replace(/(.)(?=(\d{3})+$)/g, '$1,');
  return newstr;
}

function getImage(number) {
  switch (number) {
    case 1: return "https://i.imgur.com/cmdORaJ.jpg";
    case 2: return "https://i.imgur.com/WNFbw4O.jpg";
    case 3: return "https://i.imgur.com/Xo6xIX2.jpg";
    case 4: return "https://i.imgur.com/NJJjlRK.jpg";
    case 5: return "https://i.imgur.com/QLixtBe.jpg";
    case 6: return "https://i.imgur.com/y8gyJYG.jpg";
  }
}

function getRATE(tong) {
  if (tong == 4) var rate = 40;
  if (tong == 5) var rate = 35;
  if (tong == 6) var rate = 33.33;
  if (tong == 7) var rate = 25;
  if (tong == 8) var rate = 20;
  if (tong == 9) var rate = 16.66;
  if (tong == 10) var rate = 14.28;
  if (tong == 11) var rate = 12.5;
  if (tong == 12) var rate = 11.11;
  if (tong == 13) var rate = 10;
  if (tong == 14) var rate = 9.09;
  if (tong == 15) var rate = 8.33;
  if (tong == 16) var rate = 7.69;
  if (tong == 17) var rate = 7.14;
  return rate;
}

module.exports.run = async function ({ event, api, Currencies, Users, args }) {
  try {
    const moment = require("moment-timezone");
    const format_day = moment.tz("Asia/Kolkata").format("DD/MM/YYYY - HH:mm:ss");
    const { increaseMoney, decreaseMoney } = Currencies;
    const { threadID, messageID, senderID } = event;
    var name = await Users.getNameUser(senderID);
    var money = (await Currencies.getData(event.senderID)).money;
    var bet = parseInt((args[1] == "allin" ? money : args[1]));
    var input = args[0];
    var tong = parseInt(args[2]);
    if (!input) return api.sendMessage("[ ❗ ] Aapne tai/xiu/b3gn/b2gn/cs/ct nahi chuna", threadID, messageID);
    if (!bet) return api.sendMessage("Aapke paas paryapt paisa nahi hai", threadID, messageID);
    if (bet < 1000) return api.sendMessage("[ 💸 ] Kam se kam 1000$ ki shart lagayein", threadID, messageID);
    if (bet > money) return api.sendMessage("[ 💸 ] Aapke paas itna paisa nahi hai", threadID, messageID);
    if (input == "tai" || input == "Tai" || input == '-t') var choose = 'tai';
    if (input == "xiu" || input == "Xiu" || input == '-x') var choose = 'xiu';
    if (input == 'b3gn' || input == 'bbgn' || input == 'btgn') var choose = 'b3gn';
    if (input == 'b2gn' || input == 'bdgn' || input == 'bhgn') var choose = 'b2gn';
    if (input == 'cuoctong' || input == 'ct') var choose = 'cuoctong';
    if (input == 'cuocso' || input == 'cs') var choose = 'cuocso';
    var tag = ['tai', 'xiu', 'b3gn', 'b2gn', 'cuoctong', 'cuocso'];
    if (!tag.includes(choose)) return api.sendMessage('[ ❗ ] Galat chunav, tai/xiu/b3gn/b2gn/ct/cs chunein', threadID, messageID);
    if (choose == 'cuoctong' && (tong < 4 || tong > 17)) return api.sendMessage("[ 💸 ] Kul shart manjoor nahi hai", threadID, messageID);
    if (choose == 'cuocso' && (tong < 1 || tong > 6)) return api.sendMessage("[ ❗ ] Aapka chuna hua number manjoor nahi hai", threadID, messageID);
    const number = [], img = [], bodem = 0;
    api.sendMessage("[ 🎲 ] - Bot lak raha hai...", threadID, async (err, info) => {
      await new Promise(resolve => setTimeout(resolve, 7 * 1000));
      return api.unsendMessage(info.messageID);
    }, messageID);
    for (let i = 1; i < 4; i++) {
      var n = Math.floor(Math.random() * 6 + 1);
      number.push(n);
      var img_ = (await axios.get(encodeURI(getImage(n)), { responseType: 'stream' })).data;
      img.push(img_);
      await new Promise(resolve => setTimeout(resolve, timedelay * 1000));
    }
    var total = number[0] + number[1] + number[2];
    if (choose == 'cuocso') {
      if (number[0] == tong || number[1] == tong || number[2] == tong) {
        var ans = `${tong}`;
        var result = 'win';
        var mn = bet * motsogiong;
      }
      if (number[1] == tong && number[2] == tong || number[0] == tong && number[2] == tong || number[0] == tong && number[1] == tong) {
        var ans = `${tong}`;
        var result = 'win';
        var mn = bet * haisogiong;
      }
      if (number[0] == tong && number[1] == tong && number[2] == tong) {
        var ans = `${tong}`;
        var result = 'win';
        var mn = bet * basogiong;
      }
      if (number[0] != tong && number[1] != tong && number[2] != tong) {
        var ans = `${tong}`;
        var result = 'lose';
        var mn = bet;
      }
    }
    if (choose == 'cuoctong') {
      if (total == tong) {
        var ans = "kul shart";
        var result = 'win';
        var mn = bet * parseInt((getRATE(tong)));
      } else {
        var ans = `${total}`;
        var result = 'lose';
        var mn = bet;
      }
    }
    if (choose == 'b3gn') {
      if (number[0] == number[1] && number[1] == number[2]) {
        var ans = "teen ek samaan";
        var result = 'win';
        var mn = bet * tilethangb3dn;
      } else {
        var ans = (total >= 11 && total <= 18 ? "tai" : "xiu");
        var result = 'lose';
        var mn = bet;
      }
    }
    if (choose == 'b2gn') {
      if (number[0] == number[1] || number[1] == number[2] || number[0] == number[2]) {
        var ans = "do ek samaan";
        var result = 'win';
        var mn = bet * tilethangb2dn;
      } else {
        var ans = (total >= 11 && total <= 18 ? "tai" : "xiu");
        var result = 'lose';
        var mn = bet;
      }
    }
    if (choose == 'tai' || choose == 'xiu') {
      if (number[0] == number[1] && number[1] == number[2]) {
        var ans = "teen ek samaan";
      } else {
        var ans = (total >= 11 && total <= 18 ? "tai" : "xiu");
      }
      if (number[0] == number[1] && number[1] == number[2]) {
        var result = 'lose';
        var mn = bet;
      }
      if (ans == choose) {
        var result = 'win';
        var mn = bet * tilethang;
      } else {
        var result = 'lose';
        var mn = bet;
      }
    }
    if (result == 'lose') {
      Currencies.decreaseMoney(senderID, mn);
    } else if (result == 'win') {
      Currencies.increaseMoney(senderID, mn);
    }
    var msg = `=======〘 KHEL PARINAAM 〙=======`
      + '\n' +
      `◈ Samay: ${format_day}`
      + '\n' +
      `◈🧸 Khiladi: ${name}`
      + '\n' +
      `◈🎲 Chunav: ${choose}`
      + '\n' +
      `◈💰 Shart Rashi: ${replace(bet)}`
      + '\n' +
      `▭▭▭▭▭▭▭▭▭▭▭▭▭▭`
      + '\n' +
      `◈🎲 Pehla Lak: ${number[0]}`
      + '\n' +
      `◈🎲 Dusra Lak: ${number[1]}`
      + '\n' +
      `◈🎲 Teesra Lak: ${number[2]}`
      + '\n' +
      `▭▭▭▭▭▭▭▭▭▭▭▭▭▭`
      + '\n' +
      `➾🎲 Bot Ne Lak Kiya: ${ans}`
      + '\n' +
      `➾🔎 Kul Point: ${total}`
      + '\n' +
      `➾🤑 Parinaam: ${(result == 'win' ? 'Jeet' : 'Haar')}`
      + '\n' +
      `➾📌 Paisa: ${(result == 'win' ? '+' : '-')} ${replace(Math.floor(mn))}$`
      + '\n' +
      `➾🛎️ Sthiti: ${(result == 'win' ? 'Inaam Diya Gaya' : 'Paisa Kata Gaya')}`;
    api.sendMessage({ body: msg, attachment: img }, threadID, messageID);
  } catch (e) {
    console.log(e);
  }
};
