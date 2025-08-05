module.exports.config = {
	name: "choose",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
	description: "Bot se apne liye ek vikalp chunvayein",
	commandCategory: "Game",
	usages: "[Vikalp 1] | [Vikalp 2]",
	cooldowns: 5
};

module.exports.languages = {
	"vi": {
		"return": "🌸%1 phù hợp với bạn hơn, tôi nghĩ vậy :thinking:🌸"
	},
	"en": {
		"return": "%1 is more suitable with you, I think so :thinking:"
	},
	"hi": {
		"return": "🌸%1 aapke liye zyada upyukt hai, main aisa sochta hoon :thinking:🌸"
	}
}

module.exports.run = async ({ api, event, args, getText }) => {
	const { threadID, messageID } = event;

	var input = args.join(" ").trim();
	if (!input) return api.sendMessage("Kripya kam se kam do vikalp | ke saath dein", threadID, messageID);
	var array = input.split(" | ");
	return api.sendMessage(getText("return", array[Math.floor(Math.random() * array.length)]), threadID, messageID);
}
