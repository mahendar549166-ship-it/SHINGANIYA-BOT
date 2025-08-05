module.exports.config = {
	name: "approve",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
	description: "Approve pending member requests in group",
	commandCategory: "Group Chat",
	usages: "",
	cooldowns: 0
};

module.exports.run = async function({
	args: e,
	event: a,
	api: s,
	Users: n,
	Threads: r
}) {
	var {
		userInfo: t,
		adminIDs: o
	} = await s.getThreadInfo(a.threadID);
	
	if (o = o.map((e => e.id)).some((e => e == s.getCurrentUserID()))) {
		const e = await s.getThreadInfo(a.threadID);
		let r = e.approvalQueue.length;
		var u = "";
		
		for (let a = 0; a < r; a++) {
			u += `[${a+1}]. ${await n.getNameUser(e.approvalQueue[a].requesterID)} - ${e.approvalQueue[a].requesterID}\n\n`
		}
		
		u += "[👉] Is message ko reply karke number likhe jis member ko approve karna hai";
		s.sendMessage(`🦋====『 PENDING REQUESTS 』====🦋\n\n${u}`, a.threadID, ((e, s) => global.client.handleReply.push({
			name: this.config.name,
			author: a.senderID,
			messageID: s.messageID,
			type: "reply"
		})))
	} else {
		s.sendMessage("Bot ko admin banao approve karne ke liye, phir try karo", a.threadID)
	}
};

module.exports.handleReply = async function({
	api: e,
	args: a,
	Users: s,
	handleReply: n,
	event: r,
	Threads: t
}) {
	const {
		threadID: o,
		messageID: u
	} = r;
	
	if ("reply" === n.type) {
		let a = (await e.getThreadInfo(r.threadID)).approvalQueue[parseInt(r.body - 1)].requesterID;
		e.addUserToGroup(a, o);
		e.sendMessage(`Member ko group mein add kar diya gaya hai ❤️`, o, (() => e.unsendMessage(n.messageID)))
	}
};
