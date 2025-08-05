module.exports = {
	config: {
		name: "ping",
		usePrefix: false,
		credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
		hasPermssion: 1,
		usages: "khali chhod den ya ping ke liye content daalen, photo ya video reply kar sakte hain",
		commandCategory: "Utility",
		cooldowns: 0
	},
	run: async function ({ api, event, args, Users }) {
		try {
			const
				ID = event.participantIDs || (await api.getThreadInfo(event.threadID)).participantIDs,
				axios = require("axios"),
				fs = require("fs-extra");
			if (event.type == 'message_reply') {
				if (!event.messageReply.attachments[0]) 
					return api.sendMessage("Sirf photo ya video reply karen", event.threadID, event.messageID);
				var
					mentions = [];
				for (var user of ID) {
					var body = (args.length == 0) ? "Pie Pie 🍒 ne aapko group se hata diya" : args.join(" ");
					mentions.push({
						tag: body,
						id: user
					});
				}
				var i = 1, ben = [];
				for (var cc in event.messageReply.attachments) {
					if (event.messageReply.attachments[cc].type == "photo" || event.messageReply.attachments[cc].type == "sticker") type = ".jpg";
					if (event.messageReply.attachments[cc].type == "video") type = ".mp4";
					if (event.messageReply.attachments[cc].type == "audio") type = ".mp3";
					var
						path = __dirname + "/cache/ping" + (i++) + type,
						img = (await axios.get(event.messageReply.attachments[cc].url, { responseType: "arraybuffer" })).data;
					fs.writeFileSync(path, Buffer.from(img, "utf-8"));
					ben.push(fs.createReadStream(path));
				}
				return api.sendMessage({
					body: `${body}`,
					attachment: ben,
					mentions
				}, event.threadID, () => fs.unlinkSync(path));
			} else {
				var
					mentions = [];
				for (var user of ID) {
					var body = (args.length == 0) ? "Boi Boi ne aapko group se hata diya" : args.join(" ");
					mentions.push({
						tag: body,
						id: user
					});
				}
				return api.sendMessage({
					body: `${body}`,
					mentions
				}, event.threadID);
			}
		} catch (e) {
			console.log(e);
		}
	}
};
