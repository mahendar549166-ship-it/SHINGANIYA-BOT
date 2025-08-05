const moment = require('moment-timezone');

exports.config = {
	name: 'rt',
	version: '2.0.0',
	hasPermssion: 2,
	credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
	description: 'Bot ko rent par den.', 
	commandCategory: 'Admin',
	usages: '[]',
	cooldowns: 3
};

let fs = require('fs');
if (!fs.existsSync(__dirname+'/data')) fs.mkdirSync(__dirname+'/data');
let path = __dirname+'/data/thuebot.json';
let data = [];
let save = () => fs.writeFileSync(path, JSON.stringify(data));
if (!fs.existsSync(path)) save(); else data = require(path);
let form_mm_dd_yyyy = (input = '', split = input.split('/')) => `${split[1]}/${split[0]}/${split[2]}`;
let invalid_date = date => /^Invalid Date$/.test(new Date(date));

exports.run = async function(o) {
	let send = (msg, callback) => {
		console.log(msg);
		o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
	};
	let prefix = (global.data.threadData.get(o.event.threadID) || {}).PREFIX || global.config.PREFIX;
	let info = data.find($ => $.t_id == o.event.threadID);
	try {
		switch (o.args[0]) {
			case 'add': {
				if (!o.args[1]) return send(`❎ ${prefix}${this.config.name} add + kisi ke message ko reply karen`);
				var uid = o.event.senderID;
				if (o.event.type == "message_reply") {
					uid = o.event.messageReply.senderID;
				} else if (Object.keys(o.event.mentions).length > 0) {
					uid = Object.keys(o.event.mentions)[0];
				}
				let t_id = o.event.threadID;
				let id = uid;
				let time_start = moment.tz("Asia/Kolkata").format("DD/MM/YYYY");
				let time_end = o.args[1];
				if (isNaN(id) || isNaN(t_id)) return send(`❎ ID galat hai!`);
				if (invalid_date(form_mm_dd_yyyy(time_end))) return send(`❎ Samay galat hai!`);
				data.push({
					t_id, id, time_start, time_end,
				});
				send(`✅ Group ka data safalta se add kar diya`);
			};
				break;
			case 'info': {
				let threadInfo = await o.api.getThreadInfo(info.t_id);
				send({
					body: `[ Rent Bot Info ]\n\n👤 Rent karne wale ka naam: ${global.data.userName.get(info.id)}\n🌐 Facebook link: https://www.facebook.com/profile.php?id=${info.id}\n🏘️ Group: ${(global.data.threadInfo.get(info.t_id) || {}).threadName}\n⚡ Group ID: ${info.t_id}\n📆 Rent shuru: ${info.time_start}\n⏳ Rent khatam: ${info.time_end}\n📌 Bacha hua samay: ${(() => {
						let time_diff = new Date(form_mm_dd_yyyy(info.time_end)).getTime() - (Date.now() + 25200000);
						let days = (time_diff / (1000 * 60 * 60 * 24)) << 0;
						let hour = (time_diff / (1000 * 60 * 60) % 24) << 0;
						return `${days} din ${hour} ghante mein khatam.`;
					})()}`,
					attachment: [
						await streamURL(`https://graph.facebook.com/${info.id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`),
						await streamURL(threadInfo.imageSrc)
					]
				});
			};
				break;
			case 'del': {
				let t_id = o.event.threadID;
				let id = o.event.senderID;
				var findData = data.find(item => item.t_id == t_id);
				if (!findData) return o.api.sendMessage("Is group ne bot rent nahi kiya hai", t_id);
				data = data.filter(item => item.t_id !== t_id);
				send(`✅ Group ka data safalta se hata diya`);
				await save();
			};
				break;
			case 'list': {
				try {
					const itemsPerPage = 10;
					const totalPages = Math.ceil(data.length / itemsPerPage);
					const startIndex = (1 - 1) * itemsPerPage;
					const endIndex = startIndex + itemsPerPage;
					const pageData = data.slice(startIndex, endIndex);

					o.api.sendMessage(
						`[ Rent Bot List ${1}/${totalPages}]\n\n${pageData.map(($, i) => 
							`${i + 1}. ${global.data.userName.get($.id)}\n📝 Status: ${new Date(form_mm_dd_yyyy($.time_end)).getTime() >= Date.now() + 25200000 ? 'Abhi active hai ✅' : 'Khatam ho gaya ❎'}\n🌾 Group: ${(global.data.threadInfo.get($.t_id) || {}).threadName}\nShuru: ${$.time_start}\nKhatam: ${$.time_end}`
						).join('\n\n')}\n\n→ Index ke sath reply karen details dekhne ke liye\n→ del + index reply karen list se hataane ke liye\n→ out + index reply karen group se nikalne ke liye (multiple numbers ke liye space se alag karen)\n→ giahan + index reply karen rent extend karne ke liye\nExample: 12/12/2023 => 1/1/2024\n→ page + index reply karen aur groups dekhne ke liye\nExample: page 2`,
						o.event.threadID, (err, info) => {
							global.client.handleReply.push({
								name: this.config.name,
								event: o.event,
								data,
								num: endIndex,
								messageID: info.messageID,
								author: o.event.senderID
							});
						}
					);
				} catch (e) {
					console.log(e);
				}
			};
				break;
			default:
				send(`Use: ${prefix}${this.config.name} list -> Rent bot ki list dekhne ke liye\nUse: ${prefix}${this.config.name} add + kisi ke message ko reply karen -> Group ko rent list mein add karne ke liye\nExample: ${prefix}${this.config.name} add 12/12/2023\nSamajh nahi aaya toh mat use karo =))`);
				break;
		}
	} catch (e) {
		console.log(e);
	}
	save();
};

exports.handleReply = async function(o) {
	try {
		let _ = o.handleReply;
		let send = (msg, callback) => o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
		if (o.event.senderID != _.event.senderID) return;
		if (isFinite(o.event.args[0])) {
			let info = data[o.event.args[0] - 1];
			let threadInfo = await o.api.getThreadInfo(info.t_id);
			if (!info) return send(`Index mojood nahi hai!`);
			return send({
				body: `[ Rent Bot Info ]\n\n👤 Rent karne wale ka naam: ${global.data.userName.get(info.id)}\n🌐 Facebook link: https://www.facebook.com/profile.php?id=${info.id}\n🏘️ Group: ${(global.data.threadInfo.get(info.t_id) || {}).threadName}\n⚡ Group ID: ${info.t_id}\n📆 Rent shuru: ${info.time_start}\n⏳ Rent khatam: ${info.time_end}\n📌 Bacha hua samay: ${(() => {
					let time_diff = new Date(form_mm_dd_yyyy(info.time_end)).getTime() - (Date.now() + 25200000);
					let days = (time_diff / (1000 * 60 * 60 * 24)) << 0;
					let hour = (time_diff / (1000 * 60 * 60) % 24) << 0;
					return `${days} din ${hour} ghante mein khatam.`;
				})()}`,
				attachment: [
					await streamURL(`https://graph.facebook.com/${info.id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`),
					await streamURL(threadInfo.imageSrc)
				]
			});
		} else if (o.event.args[0].toLowerCase() == 'del') {
			o.event.args.shift();
			for (const i of o.event.args) {
				if (isNaN(i)) return send(`Index ${i} galat hai!`);
				if (i > data.length) return send(`Index ${i} mojood nahi hai!`);
				data.splice(i - 1, 1);
			}
			send(`✅ Safalta se hata diya!`);
		} else if (o.event.args[0].toLowerCase() == 'giahan') {
			let STT = o.event.args[1];
			let time_start = o.event.args[2];
			let time_end = o.event.args[4];
			if (invalid_date(form_mm_dd_yyyy(time_start)) || invalid_date(form_mm_dd_yyyy(time_end))) return send(`❎ Samay galat hai!`);
			if (!data[STT - 1]) return send(`Index mojood nahi hai`);
			let $ = data[STT - 1];
			$.time_start = time_start;
			$.time_end = time_end;
			send(`✅ Group ka rent safalta se extend kar diya!`);
		} else if (o.event.args[0].toLowerCase() == 'out') {
			for (let i of o.event.args.slice(1)) await o.api.removeUserFromGroup(o.api.getCurrentUserID(), data[i - 1].t_id);
			send(`Request ke mutabik group se nikal gaya`);
		} else if (o.event.args[0].toLowerCase() == 'page') {
			try {
				const itemsPerPage = _.num;
				const totalPages = Math.ceil(data.length / itemsPerPage);
				const pageNumber = o.event.args[1];

				const startIndex = (pageNumber - 1) * itemsPerPage;
				const endIndex = startIndex + itemsPerPage;
				const pageData = data.slice(startIndex, endIndex);
				o.api.sendMessage(
					`[ Rent Bot List ${pageNumber}/${totalPages}]\n\n${pageData.map(($, i) => {
						const listItemNumber = startIndex + i + 1;
						return `${listItemNumber}. ${global.data.userName.get($.id) || ""}\n📝 Status: ${new Date(form_mm_dd_yyyy($.time_end)).getTime() >= Date.now() + 25200000 ? 'Abhi active hai ✅' : 'Khatam ho gaya ❎'}\n🌾 Group: ${(global.data.threadInfo.get($.t_id) || {}).threadName || ""}\nShuru: ${$.time_start}\nKhatam: ${$.time_end}`;
					}).join('\n\n')}\n\n→ Index ke sath reply karen details dekhne ke liye\n→ del + index reply karen list se hataane ke liye\n→ out + index reply karen group se nikalne ke liye (multiple numbers ke liye space se alag karen)\n→ giahan + index reply karen rent extend karne ke liye\nExample: 12/12/2023 => 1/1/2024\n→ page + index reply karen aur groups dekhne ke liye\nExample: page 2`,
					o.event.threadID, (err, info) => {
						if (err) return console.log(err);
						global.client.handleReply.push({
							name: this.config.name,
							event: o.event,
							data,
							num: endIndex,
							messageID: info.messageID,
							author: o.event.senderID
						});
					}
				);
			} catch (e) {
				console.log(e);
			}
		}
		save();
	} catch (e) {
		console.log(e);
	}
};

async function streamURL(url, mime = 'jpg') {
	const dest = `${__dirname}/data/${Date.now()}.${mime}`,
		downloader = require('image-downloader'),
		fse = require('fs-extra');
	await downloader.image({
		url, dest
	});
	setTimeout(j => fse.unlinkSync(j), 60 * 1000, dest);
	return fse.createReadStream(dest);
};
