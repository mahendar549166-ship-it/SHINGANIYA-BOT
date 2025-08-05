const fs = require('fs');

module.exports.config = {
  name: "clean",
  version: "0.0.2",
  hasPermssion: 3,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Bot ke cache ko saaf karen",
  commandCategory: "Admin",
  usages: "Y/N",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args, utils }) {
  api.sendMessage('Kya aap AI ke anusaar saaf karna chahte hain ya khud Y/N chunna chahte hain?', event.threadID, (e, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      author: event.senderID,
      messageID: info.messageID
    });
  });
}

module.exports.handleReply = async function ({ api, event, args, handleReply }) {
  if (handleReply.type === 'n') {
    var a = [],
      success = [],
      txt = event.body.split(' ');
    for (const type of txt) {
      a.push(type);
      const fileb = fs
        .readdirSync(__dirname + `/cache`)
        .filter((file) => file.endsWith(`.` + type));
      for (const filec of fileb) {
        try {
          fs.unlinkSync(__dirname + `/cache/` + filec);
          success.push(filec);
        } catch {
          api.sendMessage("[ ERROR ] - Cache saaf karte waqt galti hui: " + filec, event.threadID);
        }
      }
    }
    if (success.length === 0) {
      return api.sendMessage(`[ CLEAR ] - Aapka cache pehle se hi saaf hai ❎`, event.threadID);
    }
    api.sendMessage(`[ CLEAR ] - Cache safalata se saaf kiya gaya ☑️`, event.threadID);
  }

  switch (event.args[0]) {
    case 'y':
    case 'Y': {
      const a = [],
        success = [],
        txt = ["png", "jpg", "mp4", "jpeg", "gif", "m4a", "txt", "mp3", "wav"];
      for (const type of txt) {
        a.push(type);
        const fileb = fs
          .readdirSync(__dirname + `/cache`)
          .filter((file) => file.endsWith(`.` + type));
        for (const filec of fileb) {
          try {
            fs.unlinkSync(__dirname + `/cache/` + filec);
            success.push(filec);
          } catch {
            api.sendMessage("[ ERROR ] - Cache saaf karte waqt galti hui: " + filec, event.threadID);
          }
        }
      }
      if (success.length === 0) {
        return api.sendMessage(`[ CLEAR ] - Aapka cache pehle se hi saaf hai ❎`, event.threadID);
      }
      api.sendMessage(`[ CLEAR ] - Cache safalata se saaf kiya gaya ☑️`, event.threadID);
    }
    break;
    case 'n':
    case 'N': {
      api.sendMessage('📌 Kripya un file prakaaron ka jawab dein jo aap saaf karna chahte hain\nUdaaharan: mp3 mp4', event.threadID, (e, info) => {
        global.client.handleReply.push({
          type: 'n',
          name: this.config.name,
          author: event.senderID,
          messageID: info.messageID
        });
      });
    }
  }
}
