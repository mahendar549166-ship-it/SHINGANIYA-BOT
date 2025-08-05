module.exports.config = {
	name: "rname",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
	description: "Random Japanese naam ka nickname 🤔",
	commandCategory: "Utility",
	cooldowns: 5,
	dependencies: {
		"request": ""
	},
	envConfig: {
		"APIKEY": "mi451266190"
	}
};

module.exports.run = async ({ api, event }) => {
	return global.nodemodule["request"](`https://www.behindthename.com/api/random.json?usage=jap&gender=f&key=${global.configModule[this.config.name].APIKEY}`, (err, response, body) => {
		const data = JSON.parse(body);
		api.changeNickname(`${data.names[0]} ${data.names[1]}`, event.threadID, event.senderID);
	});
};
