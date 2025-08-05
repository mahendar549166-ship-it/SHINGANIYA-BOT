module.exports.config = {
  name: "money",
  version: "1.1.1",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Paise set karein aur check karein?",
  commandCategory: "User",
  usages: "/money [ + , - , * , / , ++ , -- , +- , +% , -% ]",
  cooldowns: 0,
  usePrefix: false,
};

module.exports.run = async function ({ Currencies, api, event, args, Users, permssion }) {
  const axios = require("axios");
  const { threadID, messageID, senderID, mentions, type, messageReply } = event;
  let targetID = senderID;
  if (type == 'message_reply') {
    targetID = messageReply.senderID;
  } else if (Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
  }
  const name = (await Users.getNameUser(targetID));
  const i = (url) => axios.get(url, { responseType: "stream" }).then((r) => r.data);
  const link = /*[*/"https://i.imgur.com/u4PjmLl.jpeg"/*,"https://i.imgur.com/FPHWPcg.jpg"]*/;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Kolkata").format('HH:mm:ss - DD/MM/YYYY');
  const money = (await Currencies.getData(targetID)).money;
  const mon = args[1];
  try {
    switch (args[0]) {
      case "+": {
        if (permssion < 2) return api.sendMessage("Aapke paas kaafi adhikaar nahi hain", event.threadID);
        await Currencies.increaseMoney(targetID, parseInt(mon));
        return api.sendMessage({ body: `💸 ${name} ke paise mein ${mon}$ jode gaye\n💸 Abhi ${money + parseInt(mon)}$ hain\n⏰ ${time}`, attachment: await i(link) }, event.threadID);
      }
      case "-": {
        if (permssion < 2) return api.sendMessage("Aapke paas kaafi adhikaar nahi hain", event.threadID);
        await Currencies.increaseMoney(targetID, parseInt(-mon));
        return api.sendMessage({ body: `💸 ${name} ke paise se ${mon}$ ghata diye gaye\n💸 Abhi ${money - mon}$ hain\n⏰ ${time}`, attachment: await i(link) }, event.threadID);
      }
      case "*": {
        if (permssion < 2) return api.sendMessage("Aapke paas kaafi adhikaar nahi hain", event.threadID);
        await Currencies.increaseMoney(targetID, parseInt(money * (args[1] - 1)));
        return api.sendMessage({ body: `💸 ${name} ke paise ko ${mon} guna kiya gaya\n💸 Abhi ${money * mon}$ hain\n⏰ ${time}`, attachment: await i(link) }, event.threadID);
      }
      case "/": {
        if (permssion < 2) return api.sendMessage("Aapke paas kaafi adhikaar nahi hain", event.threadID);
        await Currencies.increaseMoney(targetID, parseInt(-money + (money / mon)));
        return api.sendMessage({ body: `💸 ${name} ke paise ko ${args[1]} baar bhaga gaya\n💸 Abhi ${money / mon}$ hain\n⏰ ${time}`, attachment: await i(link) }, event.threadID);
      }
      case "++": {
        if (permssion < 2) return api.sendMessage("Aapke paas kaafi adhikaar nahi hain", event.threadID);
        await Currencies.increaseMoney(targetID, Infinity);
        return api.sendMessage({ body: `💸 ${name} ke paise anant kar diye gaye\n💸 Abhi Infinity$ hain\n⏰ ${time}`, attachment: await i(link) }, event.threadID);
      }
      case "--": {
        if (permssion < 2) return api.sendMessage("Aapke paas kaafi adhikaar nahi hain", event.threadID);
        await Currencies.decreaseMoney(targetID, parseInt(money));
        return api.sendMessage({ body: `💸 ${name} ke paise reset kar diye gaye\n💸 Abhi 0$ hain\n⏰ ${time}`, attachment: await i(link) }, event.threadID);
      }
      case "+-": {
        if (permssion < 2) return api.sendMessage("Aapke paas kaafi adhikaar nahi hain", event.threadID);
        await Currencies.decreaseMoney(targetID, parseInt(money));
        await Currencies.increaseMoney(targetID, parseInt(mon));
        return api.sendMessage({ body: `💸 ${name} ke paise ko ${mon}$ mein badal diya gaya\n💸 Abhi ${mon}$ hain\n⏰ ${time}`, attachment: await i(link) }, event.threadID);
      }
      case "^": {
        if (permssion < 2) return api.sendMessage("Aapke paas kaafi adhikaar nahi hain", event.threadID);
        await Currencies.increaseMoney(targetID, parseInt(-money + Math.pow(money, mon)));
        return api.sendMessage({ body: `💸 ${name} ke paise ko ${mon} guna luyeth kiya gaya\n💸 Abhi ${Math.pow(money, mon)}$ hain\n⏰ ${time}`, attachment: await i(link) }, event.threadID);
      }
      case "√": {
        if (permssion < 2) return api.sendMessage("Aapke paas kaafi adhikaar nahi hain", event.threadID);
        await Currencies.increaseMoney(targetID, parseInt(-money + Math.pow(money, 1 / args[1])));
        return api.sendMessage({ body: `💸 ${name} ke paise ka ${args[1]}th mool nikala gaya\n💸 Abhi ${Math.pow(money, 1 / args[1])}$ hain\n⏰ ${time}`, attachment: await i(link) }, event.threadID);
      }
      case "+%": {
        if (permssion < 2) return api.sendMessage("Aapke paas kaafi adhikaar nahi hain", event.threadID);
        await Currencies.increaseMoney(targetID, parseInt(money / (100 / args[1])));
        return api.sendMessage({ body: `💸 ${name} ke paise mein ${args[1]}% joda gaya\n💸 Abhi ${money + (money / (100 / args[1]))}$ hain\n⏰ ${time}`, attachment: await i(link) }, event.threadID);
      }
      case "-%": {
        if (permssion < 2) return api.sendMessage("Aapke paas kaafi adhikaar nahi hain", event.threadID);
        await Currencies.increaseMoney(targetID, parseInt(-(money / (100 / args[1]))));
        return api.sendMessage({ body: `💸 ${name} ke paise se ${args[1]}% ghata diya gaya\n💸 Abhi ${money - (money / (100 / args[1]))}$ hain\n⏰ ${time}`, attachment: await i(link) }, event.threadID);
      }
      case "pay": {
        const money2 = (await Currencies.getData(event.senderID)).money;
        var bet = args[1] === 'all' ? money2 : args[1];
        if (money < 1) return api.sendMessage({ body: "Aapke paas 1$ se kam hai ya aapki transfer ki rashi aapke balance se zyada hai", attachment: await i(link) }, event.threadID);
        await Currencies.increaseMoney(event.senderID, parseInt(-bet));
        await Currencies.increaseMoney(targetID, parseInt(bet));
        return api.sendMessage(`💸 ${name} ko ${bet}$ transfer kar diya gaya`, event.threadID);
      }
    }
  } catch (e) { console.log(e); }
  if (money === Infinity) return api.sendMessage(`${name} ke paas anant paise hain`, event.threadID);
  if (money === null) return api.sendMessage(`${name} ke paas 0$ hain`, event.threadID);
  if (!args[0] || !args[1]) return api.sendMessage(`${name} ke paas ${money}$ hain`, event.threadID);
};
