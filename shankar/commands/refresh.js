module.exports.config = {
	name: "refresh",
	version: "1.0",
	hasPermssion: 1,
	credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
	description: "Group ke admin list ko refresh karein",
	commandCategory: "Box chat",
	usages: "khaali chhod dein/threadID",
	cooldowns: 5,
	images: [],
};

module.exports.run = async function ({ event, args, api, Threads }) { 
	const { threadID } = event;
	const targetID = args[0] || event.threadID;
	var threadInfo = await api.getThreadInfo(targetID);
	let threadName = threadInfo.threadName;
	let qtv = threadInfo.adminIDs.length;
	await Threads.setData(targetID, { threadInfo });
	global.data.threadInfo.set(targetID, threadInfo);
	return api.sendMessage(`✅ Group ke admin list ko safalta se refresh kar diya gaya!\n\n👨‍💻 Box: ${threadName}\n🔎 ID: ${targetID}\n\n📌 ${qtv} admin(s) ko safalta se update kiya gaya!`, threadID);
};
