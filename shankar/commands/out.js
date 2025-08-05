module.exports.config = {
    name: "out",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑", // ye mera nahi hai, bas yun hi likha
    description: "Group se nikal jao",
    commandCategory: "Admin",
    usages: "/[tid]",
    cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
    const moment = require("moment-timezone");
    var time = moment.tz('Asia/Kolkata').format('HH:mm:ss || DD/MM/YYYY');
    var id;
    if (!args.join(" ")) {
      id = event.threadID;
    } else {
      id = parseInt(args.join(" "));
    }
    return api.sendMessage(`🎄Bot ko admin se group se nikalne ka order mila hai\n🧦IDbox: ${id}\n🎁Samay: ${time}`, id, () => api.removeUserFromGroup(api.getCurrentUserID(), id)).then(api.sendMessage(`💦🎄Bot group se nikal gaya.\n🧦IDbox: ${id}\n🧦Samay: ${time}`, event.threadID, event.messageID));
}
