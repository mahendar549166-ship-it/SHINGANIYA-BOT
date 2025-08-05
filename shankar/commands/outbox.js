module.exports.config = {
  name: "outbox",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Group se nikal jao",
  commandCategory: "System",
  usages: "[tid]",
  cooldowns: 10,
  usePrefix: false
};

module.exports.run = async function({ api, event, args }) {
  const permission = ["100068096370437"];
  if (!permission.includes(event.senderID))
    return api.sendMessage("Nahi kar sakta", event.threadID, event.messageID);
  var id;
  if (!args.join(" ")) {
    id = event.threadID;
  } else {
    id = parseInt(args.join(" "));
  }
  return api.setMessageReaction("☑️", event.messageID, (err) => {}, true)
    .then(api.removeUserFromGroup(api.getCurrentUserID(), id));
}
