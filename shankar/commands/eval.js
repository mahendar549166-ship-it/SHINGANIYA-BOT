module.exports.config = {
  name: "eval",
  version: "111.1.1",
  hasPermission: 2,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "JavaScript code ko execute karta hai",
  commandCategory: "System",
  usages: "[code]",
  cooldowns: 3
};

module.exports.run = function(o) {
  // Message send karne ka shortcut function
  let send = (msg, callback) => o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
  
  try {
    // User ka diya hua code execute karo
    eval(o.args.join(' '));
  } catch (e) {
    // Agar error aaye toh error message bhejo
    send("❌ Error: " + e.toString());
  }
};
