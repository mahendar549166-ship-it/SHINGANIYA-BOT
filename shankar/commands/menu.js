module.exports.config = {
	name: 'menu',
	version: '1.1.1',
	hasPermssion: 0,
	credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
	description: 'Commands ke samuh aur unki jaankari dekhein',
	commandCategory: 'Box Chat',
	usages: '[...command ka naam|all]',
	cooldowns: 5,
	usePrefix: false,
	images: [],
	envConfig: {
		autoUnsend: {
			status: true,
			timeOut: 300
		}
	}
};

const { autoUnsend = this.config.envConfig.autoUnsend } = global.config == undefined ? {} : global.config.menu == undefined ? {} : global.config.menu;
const { compareTwoStrings, findBestMatch } = require('string-similarity');
const { readFileSync, writeFileSync, existsSync } = require('fs-extra');

module.exports.run = async function ({ api, event, args }) {
	const moment = require("moment-timezone");
	const { sendMessage: send, unsendMessage: un } = api;
	const { threadID: tid, messageID: mid, senderID: sid } = event;
	const cmds = global.client.commands;

	const time = moment.tz("Asia/Kolkata").format("HH:mm:ss || DD/MM/YYYY");

	if (args.length >= 1) {
		if (typeof cmds.get(args.join(' ')) == 'object') {
			const body = infoCmds(cmds.get(args.join(' ')).config);
			return send(body, tid, mid);
		} else {
			if (args[0] == 'all') {
				const data = cmds.values();
				var txt = '[ BOT MENU LIST ALL ]\n────────────────────\n',
					count = 0;
				for (const cmd of data) txt += `|› ${++count}. ${cmd.config.name} | ${cmd.config.description}\n`;
				txt += `\n────────────────────\n|› ⏳ Message khud se hatayega ${autoUnsend.timeOut}s ke baad`;
				return send({ body: txt }, tid, (a, b) => autoUnsend.status ? setTimeout(v1 => un(v1), 1000 * autoUnsend.timeOut, b.messageID) : '');
			} else {
				const cmdsValue = cmds.values();
				const arrayCmds = [];
				for (const cmd of cmdsValue) arrayCmds.push(cmd.config.name);
				const similarly = findBestMatch(args.join(' '), arrayCmds);
				if (similarly.bestMatch.rating >= 0.3) return send(`"${args.join(' ')}" sabse nazdeek command hai "${similarly.bestMatch.target}" ?`, tid, mid);
			}
		}
	} else {
		const data = commandsGroup();
		var txt = '[ BOT MENU LIST ]\n────────────────────\n', count = 0;
		for (const { commandCategory, commandsName } of data) txt += `|› ${++count}. ${commandCategory} || ${commandsName.length} commands hain\n`;
		txt += `\n────────────────────\n|› 📝 Kul: ${global.client.commands.size} commands\n|› ⏰ Samay: ${time}\n|› 🔎 1 se ${data.length} tak reply karein chunne ke liye\n|› ⏳ Message khud se hatayega ${autoUnsend.timeOut}s ke baad`;
		return send({ body: txt }, tid, (a, b) => {
			global.client.handleReply.push({ name: this.config.name, messageID: b.messageID, author: sid, 'case': 'infoGr', data });
			if (autoUnsend.status) setTimeout(v1 => un(v1), 5000 * autoUnsend.timeOut, b.messageID);
		}, mid);
	}
};

module.exports.handleReply = async function ({ handleReply: $, api, event }) {
	const { sendMessage: send, unsendMessage: un } = api;
	const { threadID: tid, messageID: mid, senderID: sid, args } = event;

	if (sid != $.author) {
		const msg = `⛔ Bahar jao`;
		return send(msg, tid, mid);
	}

	switch ($.case) {
		case 'infoGr': {
			var data = $.data[(+args[0]) - 1];
			if (data == undefined) {
				const txt = `❎ "${args[0]}" menu ke kramank mein nahi hai`;
				const msg = txt;
				return send(msg, tid, mid);
			}

			un($.messageID);
			var txt = `=== [ ${data.commandCategory} ] ===\n────────────────────\n`,
				count = 0;
			for (const name of data.commandsName) {
				const cmdInfo = global.client.commands.get(name).config;
				txt += `|› ${++count}. ${name} | ${cmdInfo.description}\n`;
			}
			txt += `────────────────────\n|› 🔎 1 se ${data.commandsName.length} tak reply karein chunne ke liye\n|› ⏳ Message khud se hatayega ${autoUnsend.timeOut}s ke baad\n|› 📝 ${prefix(tid)}help + command ka naam use karein command ke istemaal ka vivaran dekhne ke liye`;
			return send({ body: txt }, tid, (a, b) => {
				global.client.handleReply.push({ name: this.config.name, messageID: b.messageID, author: sid, 'case': 'infoCmds', data: data.commandsName });
				if (autoUnsend.status) setTimeout(v1 => un(v1), 5000 * autoUnsend.timeOut, b.messageID);
			});
		}
		case 'infoCmds': {
			var data = global.client.commands.get($.data[(+args[0]) - 1]);
			if (typeof data != 'object') {
				const txt = `⚠️ "${args[0]}" menu ke kramank mein nahi hai`;
				const msg = txt;
				return send(msg, tid, mid);
			}

			const { config = {} } = data || {};
			un($.messageID);
			const msg = infoCmds(config);
			return send(msg, tid, mid);
		}
		default:
	}
};

function commandsGroup() {
	const array = [],
		cmds = global.client.commands.values();
	for (const cmd of cmds) {
		const { name, commandCategory } = cmd.config;
		const find = array.find(i => i.commandCategory == commandCategory);
		!find ? array.push({ commandCategory, commandsName: [name] }) : find.commandsName.push(name);
	}
	array.sort(sortCompare('commandsName'));
	return array;
}

function infoCmds(a) {
	return `[ COMMAND KI JAANKARI ]\n────────────────────\n|› 📔 Command ka naam: ${a.name}\n|› 🌴 Version: ${a.version}\n|› 🔐 Permission: ${premssionTxt(a.hasPermssion)}\n|› 👤 Rachnakaar: ${a.credits}\n|› 🌾 Vivaran: ${a.description}\n|› 📎 Category: ${a.commandCategory}\n|› 📝 Istemaal ka tareeka: ${a.usages}\n|› ⏳ Cooldown time: ${a.cooldowns} second\n`;
}

function premssionTxt(a) {
	return a == 0 ? 'Sadasya' : a == 1 ? 'Group Admin' : a == 2 ? 'ADMINBOT' : 'Bot Operator';
}

function prefix(a) {
	const tidData = global.data.threadData.get(a) || {};
	return tidData.PREFIX || global.config.PREFIX;
}

function sortCompare(k) {
	return function (a, b) {
		return (a[k].length > b[k].length ? 1 : a[k].length < b[k].length ? -1 : 0) * -1;
	};
}
