const fs = require("fs");
const path = require("path");

const statusDir = path.join(__dirname, "data");
const statusFile = path.join(statusDir, "rankup_set.json");

if (!fs.existsSync(statusDir)) fs.mkdirSync(statusDir, { recursive: true });

module.exports.config = {
	name: "rankup",
	version: "2.0.0",
	hasPermssion: 1,
	credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
	description: "Level up ka pata lagayein aur group ke hisaab se on/off karein",
	commandCategory: "System",
	cooldowns: 1
};

function getStatus(threadID) {
	try {
		if (!fs.existsSync(statusFile)) fs.writeFileSync(statusFile, JSON.stringify({}, null, 2));
		const data = JSON.parse(fs.readFileSync(statusFile));
		return data[threadID] ?? false;
	} catch (err) {
		console.error("rankup.json padhne mein error:", err);
		return true;
	}
}

function setStatus(threadID, status) {
	try {
		const data = fs.existsSync(statusFile) ? JSON.parse(fs.readFileSync(statusFile)) : {};
		data[threadID] = status;
		fs.writeFileSync(statusFile, JSON.stringify(data, null, 2));
	} catch (err) {
		console.error("rankup.json likhne mein error:", err);
	}
}

function calculateLevel(exp) {
	return Math.floor(Math.sqrt(exp));
}

const levelRanges = [
	{ maxExp: 10, rank: "Sadharan Manushya", icon: "👣" },
	{ maxExp: 100, rank: "Pranayam", icon: "🔥" },
	{ maxExp: 200, rank: "Mooladhar", icon: "🌱" },
	{ maxExp: 400, rank: "Swarna Bindu", icon: "💊" },
	{ maxExp: 800, rank: "Atma Sakshatkar", icon: "🧘" },
	{ maxExp: 1200, rank: "Bahirgaman", icon: "🌌" },
	{ maxExp: 1800, rank: "Shunya Sadhana", icon: "⚡️" },
	{ maxExp: 2500, rank: "Samavesh", icon: "🌀" },
	{ maxExp: 3200, rank: "Divya Roop", icon: "☄️" },
	{ maxExp: 4000, rank: "Sankraman", icon: "⛈️" },
	{ maxExp: 4800, rank: "Satya Dev", icon: "👼" },
	{ maxExp: 5800, rank: "Mahayana", icon: "🛕" },
	{ maxExp: 7000, rank: "Swarna Dev", icon: "👑" },
	{ maxExp: Infinity, rank: "Dev Samrat", icon: "✨" }
];

function getRankInfo(exp) {
	for (let i = 0; i < levelRanges.length; i++) {
		if (exp <= levelRanges[i].maxExp) {
			const prevExp = i === 0 ? 0 : levelRanges[i - 1].maxExp + 1;
			const nextExp = levelRanges[i].maxExp;
			const progress = ((exp - prevExp) / (nextExp - prevExp)) * 100;
			return {
				rank: levelRanges[i].rank,
				icon: levelRanges[i].icon,
				progress: Math.round(progress)
			};
		}
	}
}

module.exports.handleEvent = async function ({ api, event, Currencies, Users }) {
	const { threadID, senderID } = event;
	if (!getStatus(threadID)) return;

	let userData = await Currencies.getData(senderID);
	let exp = userData.exp || 0;
	const oldLevel = calculateLevel(exp);

	exp += 1;
	const newLevel = calculateLevel(exp);
	userData.exp = exp;
	await Currencies.setData(senderID, userData);

	if (isNaN(exp) || newLevel <= oldLevel || newLevel === 1) return;

	const reward = newLevel * 100;
	await Currencies.increaseMoney(senderID, reward);
	const userInfo = await Users.getData(senderID);
	const name = userInfo.name || "User";
	const { rank, icon, progress } = getRankInfo(exp);

	const msg =
		`⚔️ [Level Up] ⚔️\n` +
		`👤 Sadhak: ${name}\n` +
		`📈 Vartman Stithi: ${icon} ${rank} (Level ${newLevel})\n` +
		`💰 Puraskar: +${reward}$\n` +
		`🔮 Agle level tak pragati: ${progress}%`;

	api.sendMessage(msg, threadID, (err, info) => {
		if (err) return;
		setTimeout(() => api.unsendMessage(info.messageID), 25000);
	});
};

module.exports.run = async function ({ api, event, args, Currencies, Users }) {
	const { threadID, messageID, senderID, mentions, type, messageReply } = event;

	const getRankMessage = async (targetID, name) => {
		const userData = await Currencies.getData(targetID);
		const exp = userData.exp || 0;
		const { rank, icon, progress } = getRankInfo(exp);
		const level = calculateLevel(exp);

		return (
			`⚔️ [Sadhana Ki Jaankari] ⚔️\n` +
			`👤 Sadhak: ${name}\n` +
			`📊 Anubhav: ${exp}\n` +
			`📈 Vartman Stithi: ${icon} ${rank} (Level ${level})\n` +
			`🔮 Agle level tak pragati: ${progress}%`
		);
	};

	if (!args[0]) {
		if (Object.keys(mentions).length > 0) {
			const targetID = Object.keys(mentions)[0];
			const name = mentions[targetID].replace(/@/g, '');
			const msg = await getRankMessage(targetID, name);
			return api.sendMessage(msg, threadID, messageID);
		}

		if (type === "message_reply" && messageReply.senderID) {
			const targetID = messageReply.senderID;
			const name = (await Users.getData(targetID)).name || "User";
			const msg = await getRankMessage(targetID, name);
			return api.sendMessage(msg, threadID, messageID);
		}

		const userInfo = await Users.getData(senderID);
		const name = userInfo.name || "User";
		const msg = await getRankMessage(senderID, name);
		return api.sendMessage(msg, threadID, messageID);
	}

	const input = args[0].toLowerCase();

	if (input === "on") {
		if (getStatus(threadID)) return api.sendMessage("✅ Rankup pehle se hi chalu hai.", threadID, messageID);
		setStatus(threadID, true);
		return api.sendMessage("✅ Is group ke liye rankup feature chalu kar diya gaya hai.", threadID, messageID);
	}

	if (input === "off") {
		if (!getStatus(threadID)) return api.sendMessage("⛔ Rankup pehle se hi band hai.", threadID, messageID);
		setStatus(threadID, false);
		return api.sendMessage("⛔ Is group ke liye rankup feature band kar diya gaya hai.", threadID, messageID);
	}

	return api.sendMessage("Galat syntax. Istemal karein: `rankup on`, `off`, `me`, `@tag`, ya reply karein.", threadID, messageID);
};
