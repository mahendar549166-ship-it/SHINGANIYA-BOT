module.exports.config = {
	name: "reload",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
	description: "Config file ke data ko dobara load karein",
	commandCategory: "Admin",
	usages: "[]",
	cooldowns: 0
};
module.exports.run = async function({ api, event, args, Threads, Users }) {
delete require.cache[require.resolve(global.client.configPath)];
global.config = require(global.client.configPath);
return api.sendMessage("Config.json ko safalta se reload kar diya gaya", event.threadID, event.messageID);    
}
