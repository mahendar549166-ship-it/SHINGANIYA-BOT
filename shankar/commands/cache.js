module.exports.config = {
  name: "cache",
  version: "1.0.1",
  hasPermssion: 2,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Cache folder se file ya folder delete karo",
  commandCategory: "Utility",
  usages: "\ncache start <text>\ncache ext <text>\ncache <text>\ncache [khali rakho]\ncache help\nNOTE: <text> apki marzi ka koi word ya character",
  cooldowns: 5
};

// Reply handler to delete files
module.exports.handleReply = ({ api, event, args, handleReply }) => {
  if (event.senderID != handleReply.author) return;
  const fs = require("fs-extra");
  var arrnum = event.body.split(" ");
  var msg = "";
  var nums = arrnum.map(n => parseInt(n));

  for (let num of nums) {
    var target = handleReply.files[num - 1];
    var fileOrdir = fs.statSync(__dirname + '/cache/' + target);
    if (fileOrdir.isDirectory() == true) {
      var typef = "[Folder🗂️]";
      fs.rmdirSync(__dirname + '/cache/' + target, { recursive: true });
    } else if (fileOrdir.isFile() == true) {
      var typef = "[File📄]";
      fs.unlinkSync(__dirname + "/cache/" + target);
    }
    msg += typef + ' ' + handleReply.files[num - 1] + "\n";
  }
  api.sendMessage("Cache folder se yeh files delete kar di gayi:\n\n" + msg, event.threadID, event.messageID);
}

// Main run function
module.exports.run = async function ({ api, event, args, Threads }) {
  const fs = require("fs-extra");
  var files = fs.readdirSync(__dirname + "/cache") || [];
  var msg = "", i = 1;

  // Help command
  if (args[0] == 'help') {
    var msg = `
👉 Module code by NTKhang 👈
Lene ka tarika:
• Key: start <text>
• Kaam: File filter karo jo is word se start hota hai
• Misal: cache rank
• Key: ext <text>
• Kaam: File filter karo jo is extension se khatam hota hai
• Misal: cache png
• Key: <text>
• Kaam: File filter karo jisme yeh word ho
• Misal: cache a
• Key: [khali rakho]
• Kaam: Cache ke sab files dikhao
• Misal: cache
• Key: help
• Kaam: Command ka tarika dekho
• Misal: cache help`;
    
    return api.sendMessage(msg, event.threadID, event.messageID);
  }
  // Filter files starting with a word
  else if (args[0] == "start" && args[1]) {
    var word = args.slice(1).join(" ");
    var files = files.filter(file => file.startsWith(word));
    
    if (files.length == 0) return api.sendMessage(`Cache mein koi file nahi jo "${word}" se start hota ho`, event.threadID, event.messageID);
    var key = `${files.length} file(s) "${word}" se start hote hain`;
  }
  // Filter files by extension
  else if (args[0] == "ext" && args[1]) {
    var ext = args[1];
    var files = files.filter(file => file.endsWith(ext));
    
    if (files.length == 0) return api.sendMessage(`Cache mein koi file nahi jo "${ext}" se khatam hota ho`, event.threadID, event.messageID);
    var key = `${files.length} file(s) "${ext}" extension ke hain`;
  }
  // Show all files
  else if (!args[0]) {
    if (files.length == 0) return api.sendMessage("Cache mein koi file ya folder nahi hai", event.threadID, event.messageID);
    var key = "Cache folder ke sab files:";
  }
  // Filter files containing a word
  else {
    var word = args.slice(0).join(" ");
    var files = files.filter(file => file.includes(word));
    if (files.length == 0) return api.sendMessage(`Cache mein koi file nahi jisme "${word}" ho`, event.threadID, event.messageID);
    var key = `${files.length} file(s) jisme "${word}" hai`;
  }

  files.forEach(file => {
    var fileOrdir = fs.statSync(__dirname + '/cache/' + file);
    if (fileOrdir.isDirectory() == true) var typef = "[Folder🗂️]";
    if (fileOrdir.isFile() == true) var typef = "[File📄]";
    msg += (i++) + '. ' + typef + ' ' + file + '\n';
  });

  api.sendMessage(`Number ke saath reply karke file delete karo, ek se zyada number bhi daal sakte ho (space se alag karke).\n${key}\n\n` + msg, event.threadID, (e, info) => global.client.handleReply.push({
    name: this.config.name,
    messageID: info.messageID,
    author: event.senderID,
    files
  }));
}
