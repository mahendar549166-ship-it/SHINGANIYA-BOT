const fs = require("fs");
const moment = require('moment-timezone');
module.exports.config = {
	name: "datlich", // Komand ka naam, iska upyog komand ko call karne mein hota hai
	version: "1.0.0", // Is module ka version
	hasPermssion: 0, // Upayog ke liye permission, 0 matlab sabhi sadasya, 1 matlab prashasak ya usse upar, 2 matlab admin/owner
	credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑", // Module ke malik ka naam
	description: "", // Komand ke baare mein vistrit jankari
	commandCategory: "Upyogita", // Kis group se sambandhit hai: system, other, game-sp, game-mp, random-img, edit-img, media, economy, ...
	usages: "prefix+datlich Kaaran | din/maah/saal_ghanta:minute:second", // Komand ka upyog kaise karna hai
	cooldowns: 5, // Ek vyakti kitni der baad komand dohra sakta hai
	dependencies: {
	}, // Yahan par bahari package modules ki soochi jo load hone par apne aap install honge
	cooldowns: 5
};

// YE FUNCTION APNE NAAM KE ANUSAAR KAAM KARTA HAI, CRE: DUNGUWU
const monthToMSObj = {
	1: 31 * 24 * 60 * 60 * 1000,
	2: 28 * 24 * 60 * 60 * 1000,
	3: 31 * 24 * 60 * 60 * 1000,
	4: 30 * 24 * 60 * 60 * 1000,
	5: 31 * 24 * 60 * 60 * 1000,
	6: 30 * 24 * 60 * 60 * 1000,
	7: 31 * 24 * 60 * 60 * 1000,
	8: 31 * 24 * 60 * 60 * 1000,
	9: 30 * 24 * 60 * 60 * 1000,
	10: 31 * 24 * 60 * 60 * 1000,
	11: 30 * 24 * 60 * 60 * 1000,
	12: 31 * 24 * 60 * 60 * 1000
}
const checkTime = (time) => new Promise((resolve) => {
	time.forEach((e, i) => time[i] = parseInt(String(e).trim()));
	const getDayFromMonth = (month) => (month == 0) ? 0 : (month == 2) ? (time[2] % 4 == 0) ? 29 : 28 : ([1, 3, 5, 7, 8, 10, 12].includes(month)) ? 31 : 30;
	if (time[1] > 12 || time[1] < 1) resolve("Aapka mahina shayad sahi nahi hai");
	if (time[0] > getDayFromMonth(time[1]) || time[0] < 1) resolve("Aapka din shayad sahi nahi hai");
	if (time[2] < 2022) resolve("Aap kis yug mein jee rahe hain?");
	if (time[3] > 23 || time[3] < 0) resolve("Aapka ghanta shayad sahi nahi hai");
	if (time[4] > 59 || time[3] < 0) resolve("Aapka minute shayad sahi nahi hai");
	if (time[5] > 59 || time[3] < 0) resolve("Aapka second shayad sahi nahi hai");
	yr = time[2] - 1970;
	yearToMS = (yr) * 365 * 24 * 60 * 60 * 1000;
	yearToMS += ((yr - 2) / 4).toFixed(0) * 24 * 60 * 60 * 1000;
	monthToMS = 0;
	for (let i = 1; i < time[1]; i++) monthToMS += monthToMSObj[i];
	if (time[2] % 4 == 0) monthToMS += 24 * 60 * 60 * 1000;
	dayToMS = time[0] * 24 * 60 * 60 * 1000;
	hourToMS = time[3] * 60 * 60 * 1000;
	minuteToMS = time[4] * 60 * 1000;
	secondToMS = time[5] * 1000;
	oneDayToMS = 24 * 60 * 60 * 1000;
	timeMs = yearToMS + monthToMS + dayToMS + hourToMS + minuteToMS + secondToMS - oneDayToMS;
	resolve(timeMs);
});

// PATH KO DEFINE KAREN
const path = __dirname + '/data/datlich.json';

module.exports.run = async function ({ api, event, args, Users }) {
	// DEFINE KAREN AUR AUR...
	const { threadID, messageID, senderID: ID } = event;
	/*Chhota sa check*/
	if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}, null, 4));
	var data = JSON.parse(fs.readFileSync(path));

	args = args.join(" ").split("|");
	/*Ek aur chhota sa check*/
	if (!args[0]) return api.sendMessage("Aapko datlich ka kaaran daalna hoga", threadID, messageID);
	if (!args[1]) return api.sendMessage("Aapko datlich ka samay daalna hoga", threadID, messageID);

	var date = args[1].split("_");

	// CHECK CHECK CHECK
	if (date[0].split("/").length != 3 || date[1].split(":").length != 3) return api.sendMessage("Aapko sahi format ka upyog karna hoga!, Format: prefix+datlich Kaaran | din/maah/saal_ghanta:minute:second", threadID, messageID);

	var timeInput = [...date[0].split("/"), ...date[1].split(":")];
	timeInput.forEach((e, i) => timeInput[i] = parseInt(e));
	var timeVN = moment().tz('Asia/Kolkata').format('DD/MM/YYYY_HH:mm:ss');
	timeVN = timeVN.split("_");
	timeVN = [...timeVN[0].split("/"), ...timeVN[1].split(":")];
	// MILLISECONDS MEIN BADLO
	var inputMS = await checkTime(timeInput);
	var vnMS = await checkTime(timeVN);
	/* EK AUR CHECK */
	if (isNaN(inputMS)) return api.sendMessage(inputMS, threadID, messageID);
	if (inputMS <= vnMS) return api.sendMessage("Aap vartaman samay se pehle datlich nahi kar sakte!", threadID, messageID);
	var msg, owo = timeInput.join("_");
	if (!(threadID in data)) {
		data[threadID] = {};
	}
	if(!(owo in data[threadID])) {
		data[threadID][owo] = {};
	} else {
		if(ID == data[threadID][owo]["ID"]) {
			msg = "Aap is samay mocl par pehle hi datlich kar chuke hain, kripaya doosra datlich chunen!";
		} else {
			let name = await Users.getNameUser(data[threadID][owo].ID);
			msg = `👤 ${name} ne is samay mocl par pehle hi datlich kar liya hai, kripaya doosra datlich chunen!`;
		}
		return api.sendMessage(msg, threadID, messageID);
	}
	var reply = [];
	if (event.type == "message_reply") {
		for (let e of event.messageReply.attachments) {
			let url = e["url"], fileName = e["fileName"];
			// FILE TYPE CHECK KAREN
			switch(e.type) {
				case "photo": fileName += ".jpg"; break;
				case "video": fileName += ".mp4"; break;
				case "animated_image": fileName += ".gif"; break;
				case "audio": fileName += ".mp3"; break;
				case "share": fileName += ".jpg"; url = e["image"]; break;
				case "file": break;
				default: return api.sendMessage("Aapke reply kiya gaya file samarthit nahi hai.", threadID, messageID);
			}
			reply.push({fileName, url});
		}
	}
	args.forEach((e, i) => args[i] = e.trim());
	// SAWAAL MAT KARO, BAS OWO
	data[threadID][owo] = { KAARAN: args[0], ID};

	if (event.type == "message_reply") data[threadID][owo].ATTACHMENT = reply;
	if (args[2]) data[threadID][owo].BOX = args[2];

	msg = `📆 Datlich safalta se sthapit ho gaya!\n📝 Kaaran: ${args[0]}\n⏰ Samay: ${date}${(args[2]) ? `\n✏️ Naam badla gaya: ${args[2]}` : ""}`;
	fs.writeFileSync(path, JSON.stringify(data, null, 4));
	return api.sendMessage(msg, threadID, messageID);
}
