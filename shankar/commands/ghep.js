module.exports.config = {
  name: "ghep",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Ling chayan ke saath jodi banayein",
  commandCategory: "Prem",
  usages: "Purush/Mahila",
  cooldowns: 10
};

module.exports.run = async ({ api, event, handleReply, Users, Currencies }) => {
  const { threadID, messageID, senderID } = event;
  /*var data = await Currencies.getData(event.senderID);
  var money = data.money
  if (money == 0) api.sendMessage(`Aap jodi banana chahte hain? Pehle 1000$ kamao, tab main jodi banaungi!\nAapke paas abhi: ${money}$`, threadID, messageID)
  else {
    Currencies.setData(event.senderID, options = {money: money - 1000})*/
  return api.sendMessage(`🌸<<「 𝗧𝗜𝗡𝗗𝗘𝗥 」>>🌸\n▱▱▱▱▱▱▱▱▱▱▱▱\n\n🎎 𝗝𝗼𝗱𝗶 𝗯𝗮𝗻𝗮𝗻𝗲 𝗸𝗮 𝗸𝗮𝗮𝗺 𝗦𝗮𝗳𝗮𝗹\n👉 �_I𝘀 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝗸𝗮 𝗷𝗮𝘃𝗮𝗯 𝗱𝗲𝗸𝗮𝗿 𝗮𝗽𝗻𝗲 𝗷𝗼𝗱𝗶 𝗸𝗲 𝗹𝗶𝘆𝗲 𝗹𝗶𝗻𝗴 𝗰𝗵𝘂𝗻𝗲 "𝗣𝘂𝗿𝘂𝘀𝗵 𝘆𝗮 𝗠𝗮𝗵𝗶𝗹𝗮"`, event.threadID, (error, info) => {
    global.client.handleReply.push({
      type: "tinder",
      name: this.config.name,
      author: event.senderID,
      messageID: info.messageID
    });
  });
};

module.exports.handleReply = async ({ api, event, handleReply, Users, Currencies }) => {
  var token = `6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];
  const tile = (Math.random() * 50) + 50;
  const emoji = ["♥️", "❤️", "💛", "💚", "💙", "💜", "🖤", "💖", "💝", "💓", "💘", "💍"];
  const random = [
    "𝗗𝗼𝗻𝗼𝗻 𝗸𝗼 𝗯𝗮𝗱𝗵𝗮𝗶 𝗵𝗼 𝗮𝗯𝗵𝗶 𝘀𝗲 𝗵𝗮𝗺𝗲𝘀𝗵𝗮 𝗸𝗲 𝗹𝗶𝘆𝗲",
    "𝗗𝗼𝗻𝗼𝗻 𝗸𝗼 𝗽𝘆𝗮𝗿 𝗯𝗮𝗻𝗲 𝗿𝗮𝗵𝗲 𝗵𝗮𝗶𝗻 𝗮𝗯𝗵𝗶 𝘀𝗲",
    "𝗗𝗼𝗻𝗼𝗻 𝗸𝗼 𝗯𝗮𝗱𝗵𝗮𝗶 𝗵𝗼 𝗷𝗮𝗹𝗱𝗶 𝘀𝗲 𝗮𝗹𝗮𝗴 𝗵𝗼𝗻𝗲",
    "𝗗𝗼𝗻𝗼𝗻 𝗸𝗲 𝗹𝗶𝘆𝗲 𝗵𝗮𝗺𝗲𝘀𝗵𝗮 𝗸𝗲 𝗹𝗶𝘆𝗲 𝗽𝘆𝗮𝗿",
    "𝗝𝗮𝗹𝗱𝗶 𝗲𝗸 𝗻𝗮𝘆𝗮 𝗯𝗮𝗰𝗰𝗵𝗮 𝗵𝗼𝗴𝗮 𝗱𝗼𝗻𝗼𝗻 𝗸𝗲 𝗴𝗵𝗮𝗿",
    "𝗝𝗮𝗹𝗱𝗶 𝗲𝗸 𝗻𝗮𝘆𝗮 𝗯𝗮𝗰𝗰𝗵𝗮 𝗵𝗼𝗴𝗮 𝗱𝗼𝗻𝗼𝗻 𝗸𝗲 𝗴𝗵𝗮𝗿",
    "𝗗𝗼𝗻𝗼𝗻 𝗸𝗼 𝗯𝗮𝗱𝗵𝗮𝗶 𝗵𝗼 𝗲𝗸 𝗱𝗼𝗼𝘀𝗿𝗲 𝗸𝗲 𝘀𝗮𝗮𝘁𝗵 𝗸𝗮 𝗽𝘆𝗮𝗿 𝗸𝗮𝗿𝗻𝗲",
    "𝗗𝗼𝗻𝗼�_n 𝗸𝗼 𝗯𝗮𝗱𝗵𝗮𝗶 𝗵𝗼 𝗵𝗮𝗺𝗲𝘀𝗵𝗮 𝗸𝗲 𝗹𝗶𝘆𝗲 𝗽𝘆𝗮𝗿 𝗸𝗮𝗿𝗻𝗲"
  ];

  switch (handleReply.type) {
    case "tinder": {
      switch (event.body.toLowerCase()) {
        case "purush":
        case "ladka":
        case "Purush":
        case "Ladka": {
          api.unsendMessage(handleReply.messageID);
          api.sendMessage(`𝗝𝗼𝗱𝗶 𝗸𝗲 𝗹𝗶𝘆𝗲 𝗲𝗸 𝗽𝘂𝗿𝘂𝘀𝗵 𝗸𝗶 𝘁𝗮𝗹𝗮𝘀𝗵 𝗸𝗮𝗿 𝗿𝗮𝗵𝗲 𝗵𝗮𝗶𝗻...`, event.threadID);
          var ThreadInfo = await api.getThreadInfo(event.threadID);
          var all = ThreadInfo.userInfo;
          let data = [];
          for (let male of all) {
            if (male.gender == "MALE") {
              if (male.id != event.senderID) data.push(male.id);
            }
          }
          let member = data[Math.floor(Math.random() * data.length)];
          let n = (await Users.getData(member)).name;
          const url = api.getCurrentUserID(member);
          let Avatar_boy = (await axios.get(`https://graph.facebook.com/${member}/picture?height=1500&width=1500&access_token=` + token, { responseType: "arraybuffer" })).data;
          fs.writeFileSync(__dirname + `/cache/avt1.png`, Buffer.from(Avatar_boy, "utf-8"));
          let name = await Users.getNameUser(handleReply.author);
          let gifLove = (await axios.get(`https://i.imgur.com/vm7TYSA.png`, { responseType: "arraybuffer" })).data;
          fs.writeFileSync(__dirname + "/cache/gheplove.png", Buffer.from(gifLove, "utf-8"));
          let Avatar_author = (await axios.get(`https://graph.facebook.com/${handleReply.author}/picture?width=512&height=512&access_token=` + token, { responseType: "arraybuffer" })).data;
          fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(Avatar_author, "utf-8"));
          var arraytag = [];
          arraytag.push({ id: handleReply.author, tag: name });
          arraytag.push({ id: member, tag: n });
          var imglove = [];
          imglove.push(fs.createReadStream(__dirname + "/cache/avt1.png"));
          imglove.push(fs.createReadStream(__dirname + "/cache/gheplove.png"));
          imglove.push(fs.createReadStream(__dirname + "/cache/avt2.png"));
          var msg = {
            body: `🌸<<「 𝗧𝗜𝗡𝗗𝗘𝗥 」>>🌸\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n\n• 𝗝𝗼𝗱𝗶 𝗯𝗮𝗻𝗮𝗻𝗲 𝗸𝗮 𝗸𝗮𝗮𝗺 𝗦𝗮𝗳𝗮𝗹 💮\n• 𝗗𝗼𝗻𝗼𝗻 𝗸𝗶 𝗷𝗼𝗱𝗶 𝗸𝗮 𝗺𝗶𝗹𝗮𝗻 𝗱𝗿𝗮𝗷 ${tile.toFixed(2)}%\n• ${random[Math.floor(Math.random() * random.length)]}\n` + n + " " + emoji[Math.floor(Math.random() * emoji.length)] + " " + name + "",
            mentions: arraytag,
            attachment: imglove
          };
          return api.sendMessage(msg, event.threadID, event.messageID);
        } break;
        case "mahila":
        case "ladki":
        case "Mahila":
        case "Ladki": {
          api.unsendMessage(handleReply.messageID);
          api.sendMessage(`𝗝𝗼𝗱𝗶 𝗸𝗲 𝗹𝗶𝘆𝗲 𝗲𝗸 𝗺𝗮𝗵𝗶𝗹𝗮 𝗸𝗶 𝘁𝗮𝗹𝗮𝘀𝗵 𝗸𝗮𝗿 𝗿𝗮𝗵𝗲 𝗵𝗮𝗶𝗻...`, event.threadID);
          var ThreadInfo = await api.getThreadInfo(event.threadID);
          var all = ThreadInfo.userInfo;
          let data = [];
          for (let female of all) {
            if (female.gender == "FEMALE") {
              if (female.id != event.senderID) data.push(female.id);
            }
          }
          let member = data[Math.floor(Math.random() * data.length)];
          let n = (await Users.getData(member)).name;
          let Avatar_girl = (await axios.get(`https://graph.facebook.com/${member}/picture?height=1500&width=1500&access_token=` + token, { responseType: "arraybuffer" })).data;
          fs.writeFileSync(__dirname + `/cache/avt1.png`, Buffer.from(Avatar_girl, "utf-8"));
          let name = await Users.getNameUser(handleReply.author);
          let gifLove = (await axios.get(`https://i.imgur.com/vm7TYSA.png`, { responseType: "arraybuffer" })).data;
          fs.writeFileSync(__dirname + "/cache/gheplove.png", Buffer.from(gifLove, "utf-8"));
          let Avatar_author = (await axios.get(`https://graph.facebook.com/${handleReply.author}/picture?width=512&height=512&access_token=` + token, { responseType: "arraybuffer" })).data;
          fs.writeFileSync(__dirname + "/cache/avt2.png", Buffer.from(Avatar_author, "utf-8"));
          var arraytag = [];
          arraytag.push({ id: handleReply.author, tag: name });
          arraytag.push({ id: member, tag: n });
          var imglove = [];
          imglove.push(fs.createReadStream(__dirname + "/cache/avt1.png"));
          imglove.push(fs.createReadStream(__dirname + "/cache/gheplove.png"));
          imglove.push(fs.createReadStream(__dirname + "/cache/avt2.png"));
          var msg = {
            body: `🖤====「 𝗧𝗜𝗡𝗗𝗘𝗥 」====🖤\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n\n• 𝗝𝗼𝗱𝗶 𝗯𝗮𝗻𝗮𝗻𝗲 𝗸𝗮 𝗸𝗮𝗮𝗺 𝗦𝗮𝗳𝗮𝗹 💮\n• 𝗗𝗼𝗻𝗼𝗻 𝗸𝗶 𝗷𝗼𝗱𝗶 𝗸𝗮 𝗺𝗶𝗹𝗮𝗻 𝗱𝗿𝗮𝗷 ${tile.toFixed(2)}%\n• ${random[Math.floor(Math.random() * random.length)]}\n` + n + " " + emoji[Math.floor(Math.random() * emoji.length)] + " " + name + "",
            mentions: arraytag,
            attachment: imglove
          };
          return api.sendMessage(msg, event.threadID, event.messageID);
        } break;
      }
    }
  }
};
