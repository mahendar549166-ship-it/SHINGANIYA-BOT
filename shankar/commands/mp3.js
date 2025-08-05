module.exports.config = {
	name: "mp3",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
	description: "Sangeet sunein",
	commandCategory: "Random-Tasveerein/Video",
	usages: "upt",
	cooldowns: 5,
	usePrefix: false
};

module.exports.handleEvent = async ({ api, event, Users, Threads }) => {
	const axios = require('axios');
	const moment = require("moment-timezone");
	const timeStart = Date.now();
	var gio = moment.tz("Asia/Kolkata").format("HH:mm:ss - D/MM/YYYY");
	var thu = moment.tz('Asia/Kolkata').format('dddd');
	if (thu == 'Sunday') thu = 'Ravivaar';
	if (thu == 'Monday') thu = 'Somvaar';
	if (thu == 'Tuesday') thu = 'Mangalvaar';
	if (thu == 'Wednesday') thu = 'Budhvaar';
	if (thu == 'Thursday') thu = 'Guruvaar';
	if (thu == 'Friday') thu = 'Shukravaar';
	if (thu == 'Saturday') thu = 'Shanivaar';
	const res = await axios.get(`${urlAPI}/text/thinh?apikey=${apiKey}`);
	var thinh = res.data.data;
	// if (!event.body) return;
	var { threadID, messageID } = event;
	if (event.body.indexOf("mp3") == 0 ||
		event.body.indexOf("Mp3") == 0 || 
		event.body.indexOf("nhac") == 0 || 
		event.body.indexOf("nhạc") == 0) {
		const time = process.uptime(),
			hours = Math.floor(time / (60 * 60)),
			minutes = Math.floor((time % (60 * 60)) / 60),
			seconds = Math.floor(time % 60);
		api.sendMessage(`🎶▭▭▭ [ AUTO SANGEET ] ▭▭▭🎶\n━━━━━━━━━━━━━━━━━━━\n[🍒] → Sangeet ka maza lein\n[💬] → Vichar: ${thinh}\n[⏳] → Bot Online: ${hours} ghante ${minutes} minute ${seconds} second\n[⚜️] → Processing Speed: ${Date.now() - timeStart} second\n[⏰] → Abhi ka samay: ${gio} ${thu}\n[🕊️] → Update by: Phạm Minh Đồng`, threadID, messageID);
	}
};

module.exports.run = async ({ api, event, Users, Threads }) => {
	const axios = require('axios');
	const moment = require("moment-timezone");
	const timeStart = Date.now();
	var gio = moment.tz("Asia/Kolkata").format("HH:mm:ss - D/MM/YYYY");
	var thu = moment.tz('Asia/Kolkata').format('dddd');
	if (thu == 'Sunday') thu = 'Ravivaar';
	if (thu == 'Monday') thu = 'Somvaar';
	if (thu == 'Tuesday') thu = 'Mangalvaar';
	if (thu == 'Wednesday') thu = 'Budhvaar';
	if (thu == 'Thursday') thu = 'Guruvaar';
	if (thu == 'Friday') thu = 'Shukravaar';
	if (thu == 'Saturday') thu = 'Shanivaar';
	const res = await axios.get(`${urlAPI}/text/thinh?apikey=${apiKey}`);
	var thinh = res.data.data;
	// if (!event.body) return;
	var { threadID, messageID } = event;
	const time = process.uptime(),
		hours = Math.floor(time / (60 * 60)),
		minutes = Math.floor((time % (60 * 60)) / 60),
		seconds = Math.floor(time % 60);
	api.sendMessage({
		body: `🎶▭▭▭ [ AUTO SANGEET ] ▭▭▭🎶\n━━━━━━━━━━━━━━━━━━━\n[🍒] → Sangeet ka maza lein\n[💬] → Vichar: ${thinh}\n[⏳] → Bot Online: ${hours} ghante ${minutes} minute ${seconds} second\n[⚜️] → Processing Speed: ${Date.now() - timeStart} second\n[⏰] → Abhi ka samay: ${gio} ${thu}\n[🕊️] → Update by: Shankar Singhaniya`,
		attachment: (await global.nodemodule["axios"]({
			url: (await global.nodemodule["axios"](`${urlAPI}/images/mp3?apikey=${apiKey}`)).data.data,
			method: "GET",
			responseType: "stream"
		})).data
	}, event.threadID, event.messageID);
};
