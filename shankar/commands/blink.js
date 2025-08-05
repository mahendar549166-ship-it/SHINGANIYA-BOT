module.exports.config = {
  name: "blink",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Tag kiye gaye members ke avatar se ek GIF banayein",
  commandCategory: "Image-Edit",
  usages: "[delay mentions/all delay]",
  cooldowns: 5
};

module.exports.run = async ({ event, api, args }) => {
  const fs = require('fs-extra');
  const axios = require('axios');
  var mention = Object.keys(event.mentions);
  var delay = args[0];
  var daylayAll = args[1];
  var blink = [], listID = [];
  if (args[0] == 'all') {
    var participant = event.participantIDs.length;
    for (var i = 0; i < participant; i++) {
      var id = event.participantIDs[i];
      listID += id + ',';
    }
    let getAPI = (await axios.get(encodeURI(`https://concacvip99.haminh2.repl.co/blink?id=${listID + ','}&delay=${parseInt(daylayAll) || 500}`), 
      { responseType: "arraybuffer" } )).data; 
    fs.writeFileSync(__dirname + "/cache/blink.gif", Buffer.from(getAPI, "utf-8"));
    blink.push(fs.createReadStream(__dirname + "/cache/blink.gif"));  
    var msg = { attachment: blink };
    return api.sendMessage(msg, event.threadID, event.messageID);
  } else {
    if (!mention) return api.sendMessage('Kripya un members ko tag karein jinke sath GIF banana hai', event.threadID, event.messageID);
    var mentions = mention.length;
    for (var i = 0; i < mentions; i++) {
      var id = mention[i];
      listID += id + ',';
    }
    let getAPI = (await axios.get(encodeURI(`https://concacvip99.haminh2.repl.co/blink?id=${listID + ',' + event.senderID}&delay=${parseInt(delay) || 500}`), 
      { responseType: "arraybuffer" } )).data; 
    fs.writeFileSync(__dirname + "/cache/blink.gif", Buffer.from(getAPI, "utf-8"));
    blink.push(fs.createReadStream(__dirname + "/cache/blink.gif"));  
    var msg = { attachment: blink };
    return api.sendMessage(msg, event.threadID, event.messageID);
  }
};
