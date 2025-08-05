module.exports.config = {
	name: "reset",
	version: "1.0.2",
	hasPermssion: 3,
	credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
	description: "Bot ko restart karen",
	commandCategory: "admin",
	cooldowns: 5,
	dependencies: {
		"eval": ""
	}
};

module.exports.run = async ({ api, event, args, client, utils }) => {
    const eval = require("eval");
    return api.sendMessage("[⚜️] 𝐓𝐫𝐢𝐞𝐮 𝐓𝐚𝐢 [⚜️]\n[🔰𝙍𝙀𝙎𝙀𝙏🔰] Thodi der ruk, mujhe peshab karne jana hai...!", 
        event.threadID, () => eval("module.exports = process.exit(1)", true), event.messageID);
};
