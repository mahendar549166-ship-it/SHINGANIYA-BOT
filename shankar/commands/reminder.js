module.exports.config = {
	name: "reminder",
	version: "0.0.1-beta",
	hasPermssion: 0,
	credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
	description: "Aapko kisi baat ke liye ek nirdharit samay mein yaad dilaye",
	commandCategory: "Utility",
	usages: "[Time] [Text] ",
	cooldowns: 5
};

module.exports.run = async function({ api, event, args, Users }) {
	const time = args[0];
	const text = args.join(" ").replace(time, "");
	if (isNaN(time)) return api.sendMessage(`Aapne jo samay dala hai, woh ek number nahi hai!`, event.threadID, event.messageID);
	const display = time > 59 ? `${time / 60} minute` : `${time} second`;
	api.sendMessage(`Main aapko iske baad yaad dilaunga: ${display}`, event.threadID, event.messageID);
	await new Promise(resolve => setTimeout(resolve, time * 1000));
	var value = await api.getThreadInfo(event.threadID);
	if (!(value.nicknames)[event.userID]) value = (await Users.getInfo(event.senderID)).name;
	else value = (value.nicknames)[event.senderID];
	return api.sendMessage({
		body: `${(text) ? value + ", aapne yeh sandesh chhoda tha:" + text : value + ", lagta hai aapne mujhe kisi kaam ke liye yaad dilane ko kaha tha?"}`,
		mentions: [{
			tag: value,
			id: event.senderID
		}]
	}, event.threadID, event.messageID);
}
