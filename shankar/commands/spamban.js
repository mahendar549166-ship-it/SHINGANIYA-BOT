module.exports.config = {
	name: "spamban",
	version: "1.0.0",
	hasPermssion: 0, 
	credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑", // Mod by H.Thanh
	description: "Agar bot ko spam kiya toh user ko automatic ban karta hai (random tasveerein)",
	commandCategory: "System",
	usages: "Automatic ban ho jayega",
	cooldowns: 5
};

module.exports.run = ({api, event}) => {
	return api.sendMessage("📝 Agar aap bot ko baar-baar spam karenge toh ban ho jayenge", event.threadID, event.messageID);
};

module.exports.handleEvent = async ({ Users, api, event})=> {
	const fs = require("fs-extra");
	const moment = require("moment-timezone"); 
	let { senderID, messageID, threadID } = event;
	const threadInfo = await api.getThreadInfo(event.threadID);
	var threadName = threadInfo.threadName || "Naam maujood nahi";
	var time = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm:ss");
	const so_lan_spam = 5; // Spam ki had, isse zyada hone par ban
	const thoi_gian_spam = 60000; // 60000 millisecond (1 minute)
	const unbanAfter = 600000; // 600000 millisecond (10 minute)
	// Agar global.client.autoban nahi hai toh initialize karein
	if (!global.client.autoban) global.client.autoban = {};
	if (!global.client.autoban[senderID]) {
		global.client.autoban[senderID] = {
			timeStart: Date.now(),
			number: 0
		}
	};
  
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	const prefix = threadSetting.PREFIX || global.config.PREFIX;
	if (!event.body || event.body.indexOf(prefix) != 0) return; 
	let dataUser = await Users.getData(senderID) || {};
	let data = dataUser.data || {};
	
	if ((global.client.autoban[senderID].timeStart + thoi_gian_spam) <= Date.now()) {
		global.client.autoban[senderID] = {
			timeStart: Date.now(),
			number: 0
		}
	}
	else {
		global.client.autoban[senderID].number++;
		if (global.client.autoban[senderID].number >= so_lan_spam) {
			const moment = require("moment-timezone");
			if (data && data.banned == true) return;
			data.banned = true;
			data.reason = `Bot ko ${so_lan_spam} baar/${thoi_gian_spam / (1000 * 60)} minute mein spam kiya`;
			data.autoban = {
				timeStart: Date.now(),
				unbanAfter
			};
			data.dateAdded = time;
			await Users.setData(senderID, { data });
			global.data.userBanned.set(senderID, { reason: data.reason, dateAdded: data.dateAdded });
			global.client.autoban[senderID] = {
				timeStart: Date.now(),
				number: 0
			};
			api.sendMessage(`👤 Naam: ${dataUser.name}\n🔰 Uid: ${senderID}\n⛔ Bot ka upyog ${unbanAfter / (1000 * 60)} minute ke liye band kar diya gaya\n📝 Wajah: bot ko ${so_lan_spam} baar/${thoi_gian_spam / (1000 * 60)} minute mein spam kiya\n⚠️ Kripya Admin ko report karein\n🔰 Bot ${unbanAfter / (1000 * 60)} minute baad khud ban hata dega\n⏰ Samay: ${time}\n──────────────────\n✏️ Admin ko message bhej diya gaya`, threadID, () => {
				setTimeout(async function() {
					delete data.autoban;
					data.banned = false;
					data.reason = null;
					data.dateAdded = null;
					await Users.setData(senderID, { data });
					global.data.userBanned.delete(senderID);
					api.sendMessage(`🔰 ${dataUser.name} ka ban khud se hata diya gaya\n⏰ Ban ka samay: ${time}\n📝 Wajah: Bot ko spam kiya\n──────────────────\n🤬 Spam karna chhod do, pyar karo`, threadID);
				}, unbanAfter);
			});
			let allAdmin = '100077366272669';
			for (let idAdmin of allAdmin) {
				api.sendMessage(`👤 Naam: ${dataUser.name}\n🔰 Uid: ${senderID}\n⛔ Bot ko ${so_lan_spam} baar/${thoi_gian_spam / (1000 * 60)} minute mein spam kiya\n🎟️ Group mein: ${threadName}\n✏️ Tid: ${threadID}\n📌 Bot ${unbanAfter / (1000 * 60)} minute baad khud user ka ban hata dega\n──────────────────\n⏰ Samay: ${time}`, idAdmin);
			};
		}
	}
};
