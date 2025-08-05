const { createReadStream, unlinkSync } = require("fs-extra");

module.exports.config = {
	name: "screenshot",
	version: "1.0.0",
	hasPermission: 0,
	credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
	description: "Kisi website ka screenshot lein",
	commandCategory: "Utility",
	usages: "[website ka URL] [size]", // Size ko waisa hi rakha gaya hai
	cooldowns: 5,
	dependencies: {
		"fs-extra": "",
		"path": ""
	}
};

module.exports.run = async ({ event, api, args }) => {
	if (!args || args.length < 2) {
		return api.sendMessage("⚠️ Kripya URL aur size provide karein. Istemal karein: [website ka URL] [size]", event.threadID, event.messageID);
	}

	const url = args[0];
	const requestedSize = args[1]; // Size image ke ratio ke barabar hai

	// Pre-defined sizes aur crop ka declaration
	const availableSizes = {
		"1": '1080x1920',
		"2": '1920x1080',
		"3": '1000x1000',
		"4": '800x1240',
		"5": '1920x1000',
	};

	if (!availableSizes[requestedSize]) {
		return api.sendMessage("⚠️ Size galat hai. Uplabdh sizes hain: 1, 2, 3, 4, 5", event.threadID, event.messageID);
	}

	const size = availableSizes[requestedSize];

	try {
		const filePath = __dirname + `/cache/screenshot.png`;
		await global.utils.downloadFile(`https://api.screenshotmachine.com/?key=ca867a&url=${url}&dimension=${size}&cacheLimit=0&delay=400`, filePath);
		api.sendMessage({ attachment: createReadStream(filePath) }, event.threadID, () => unlinkSync(filePath));
	} catch (error) {
		return api.sendMessage("❎ Ye URL nahi mila ya format galat hai!", event.threadID, event.messageID);
	}
};
