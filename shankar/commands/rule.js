module.exports.config = {
	name: "rule",
	version: "1.0.1",
	hasPermssion: 1,
	credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
	description: "Har group ke liye rules customize karen",
	commandCategory: "Group Chat",
	usages: "[ add/remove/all ] [ content/ID ]",
	cooldowns: 5,
	dependencies: {
		"fs-extra": "",
		"path": ""
	}
};

module.exports.onLoad = () => {
	const { existsSync, writeFileSync } = require("fs-extra");
	const { join } = require("path");
	const pathData = join(__dirname, "data", "rules.json");
	if (!existsSync(pathData)) return writeFileSync(pathData, "[]", "utf-8"); 
};

module.exports.run = async function({ event, api, args, permssion, Users }) {
	const { threadID, messageID } = event;
	const { readFileSync, writeFileSync } = require("fs-extra");
	const { join } = require("path");

	const pathData = join(__dirname, "data", "rules.json");
	const content = (args.slice(1, args.length)).join(" ");
	var dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
	var thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, listRule: [] };

	switch (args[0]) {
		case "add": {
			if (permssion == 0) return api.sendMessage("[ RULE ] - Aapke paas rule add karne ka permission nahi hai!", threadID, messageID);
			if (content.length == 0) return api.sendMessage("[ RULE ] - Content khali nahi hona chahiye", threadID, messageID);
			if (content.indexOf("\n") != -1) {
				const contentSplit = content.split("\n");
				for (const item of contentSplit) thisThread.listRule.push(item);
			} else {
				thisThread.listRule.push(content);
			}
			writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
			api.sendMessage('[ RULE ] - Group ke liye naya rule safalta se jod diya!', threadID, messageID);
			break;
		}
		case "list":
		case "all": {
			var msg = "", index = 0;
			for (const item of thisThread.listRule) msg += `${index+=1}/ ${item}\n`;
			if (msg.length == 0) return api.sendMessage("[ RULE ] - Aapke group mein abhi koi rules nahi hain!", threadID, messageID);
			api.sendMessage(`=== Group ke Rules ===\n\n${msg}`, threadID, messageID);
			break;
		}
		case "rm":
		case "remove":
		case "delete": {
			if (!isNaN(content) && content > 0) {
				if (permssion == 0) return api.sendMessage("[ RULE ] - Aapke paas rule hataane ka permission nahi hai!", threadID, messageID);
				if (thisThread.listRule.length == 0) return api.sendMessage("[ RULE ] - Aapke group mein koi rules nahi hain jo hataaye ja sakein!", threadID, messageID);
				thisThread.listRule.splice(content - 1, 1);
				api.sendMessage(`[ RULE ] - ${content} number ka rule safalta se hata diya`, threadID, messageID);
				break;
			}
			else if (content == "all") {
				if (permssion == 0) return api.sendMessage("[ RULE ] - Aapke paas rule hataane ka permission nahi hai!", threadID, messageID);
				if (thisThread.listRule.length == 0) return api.sendMessage("[ RULE ] - Aapke group mein koi rules nahi hain jo hataaye ja sakein!", threadID, messageID);
				thisThread.listRule = [];
				api.sendMessage(`[ RULE ] - Group ke sabhi rules safalta se hata diye!`, threadID, messageID);
				break;
			}
		}
		default: {
			if (thisThread.listRule.length != 0) {
				var msg = "", index = 0;
				for (const item of thisThread.listRule) msg += `${index+=1}/ ${item}\n`;
				return api.sendMessage(`==== [ Group ke Rules ] ====\n━━━━━━━━━━━━━━━━━━\n${msg}`, threadID, messageID);
			}
			else return global.utils.throwError(this.config.name, threadID, messageID);
		}
	}
	if (!dataJson.some(item => item.threadID == threadID)) dataJson.push(thisThread);
	return writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
};
