module.exports.config = {
	name: "restart",
	version: "1.0.0",
	hasPermssion: 3,
	credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
	description: "Bot ko restart karen",
	commandCategory: "Admin",
	cooldowns: 0
};

module.exports.run = ({event, api}) => api.sendMessage("Thik hai!", event.threadID, () => process.exit(1));
