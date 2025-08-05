module.exports.config = {
  name: "evt",
  version: "1.0.1",
  hasPermission: 3,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Event folder se files/folders delete karta hai",
  commandCategory: "Admin",
  usages: "[]",
  cooldowns: 5
};

module.exports.handleReply = ({ api, event, args, handleReply }) => {
  if (event.senderID != handleReply.author) {
    const permission = global.config.NDH;
    if (!permission.includes(event.senderID)) {
      return api.sendMessage("❎ Aap is command ko use nahi kar sakte", event.threadID, event.messageID);
    }
    return;
  }
  
  const fs = require("fs-extra");
  var arrnum = event.body.split(" ");
  var msg = "";
  var nums = arrnum.map(n => parseInt(n));

  for (let num of nums) {
    var target = handleReply.files[num - 1];
    var fileOrdir = fs.statSync(__dirname + '/../../shankar/events/' + target);
    var typef = "";
    
    if (fileOrdir.isDirectory()) {
      typef = "[Folder🗂️]";
      fs.rmdirSync(__dirname + '/../../shankar/events/' + target, { recursive: true });
    } else if (fileOrdir.isFile()) {
      typef = "[File📄]";
      fs.unlinkSync(__dirname + "/../../shankar/events/" + target);
    }
    msg += typef + ' ' + handleReply.files[num - 1] + " (" + formatBytes(fileOrdir.size) + ")"+"\n";
  }
  
  api.sendMessage("✅ Event folder se ye files/folders delete ho gaye:\n\n" + msg, event.threadID, event.messageID);
}

module.exports.run = async function({ api, event, args, Threads }) {
  const permission = global.config.NDH;
  if (!permission.includes(event.senderID)) {
    return api.sendMessage("=))", event.threadID, event.messageID);
  }
  
  const fs = require("fs-extra");
  var allFiles = fs.readdirSync(__dirname + "/../../shankar/events/") || [];
  var msg = "", i = 1;
  var files;

  if (!args[0]) {
    files = allFiles;
  } else {
    var word = args.join(" ");
    if (args[0] == "start" && args[1]) {
      files = allFiles.filter(file => file.startsWith(word));
    } else if (args[0] == "ext" && args[1]) {
      files = allFiles.filter(file => file.endsWith(word));
    } else {
      files = allFiles.filter(file => file.includes(word));
    }
  }

  if (files.length == 0) return api.sendMessage("❎ Koi file nahi mila", event.threadID, event.messageID);

  files.forEach(file => {
    var fileOrdir = fs.statSync(__dirname + '/../../shankar/events/' + file);
    var typef = "";
    if (fileOrdir.isDirectory()) {
      typef = "[Folder🗂️]";
    } else if (fileOrdir.isFile()) {
      typef = "[File📄]";
    }
    msg += (i++) + '. ' + typef + ' ' + file + " ("+ formatBytes(fileOrdir.size) + ")"+'\n';
  });

  api.sendMessage(`📝 Milne wale files/folders:\n──────────────────\n\n` + msg + `\n📌 Delete karne ke liye number reply karein`, event.threadID, (e, info) => global.client.handleReply.push({
    name: this.config.name,
    messageID: info.messageID,
    author: event.senderID,
    files
  }));
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
