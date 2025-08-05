module.exports.config = {
    name: "admin",
    version: "1.0.5",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Sirf QTV ke liye command mode on/off karein",
    commandCategory: "Group Chat",
    usages: "Sirf admin aur QTV ke liye command mode on/off karein",
    cooldowns: 0,
    usePrefix: false,
    images: [],
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.languages = {
    "vi": {
        "notHavePermssion": '⚠️ Aapke paas "%1" function ka upyog karne ke liye paryapt adhikar nahi hai',
        "addedNewAdmin": '[ ADD NEW ADMIN ]\n────────────────────\n📝 %1 users ko safalta se admin banaya gaya\n\n%2\n────────────────────\n[⏰] → Samay: %3',
        "removedAdmin": '[ REMOVE ADMIN ]\n────────────────────\n📝 %1 users ko safalta se sadasya banaya gaya\n\n%2\n────────────────────\n[⏰] → Samay: %3'
    },
    "en": {
        "listAdmin": '[Admin] Admin ki list: \n\n%1',
        "notHavePermssion": '[Admin] Aapke paas "%1" ka upyog karne ka adhikar nahi hai',
        "addedNewAdmin": '[Admin] %1 Admin joda gaya:\n\n%2',
        "removedAdmin": '[Admin] %1 Admin hataya gaya:\n\n%2'
    }
};

module.exports.onLoad = function() {
    const { writeFileSync, existsSync } = require('fs-extra');
    const { resolve } = require("path");
    const path = resolve(__dirname, 'data', 'dataAdbox.json');
    if (!existsSync(path)) {
        const obj = {
            adminbox: {}
        };
        writeFileSync(path, JSON.stringify(obj, null, 4));
    } else {
        const data = require(path);
        if (!data.hasOwnProperty('adminbox')) data.adminbox = {};
        writeFileSync(path, JSON.stringify(data, null, 4));
    }
};

module.exports.run = async function ({ api, event, args, Users, permssion, getText, Currencies }) {
    const fs = require("fs-extra");
    const axios = require("axios");
    const moment = require("moment-timezone");
    const gio = moment.tz("Asia/Kolkata").format("DD/MM/YYYY || HH:mm:ss");
    const nd = await Users.getNameUser(event.senderID);
    const { PREFIX } = global.config;
    const { threadID, messageID, mentions, senderID } = event;
    const { configPath } = global.client;
    const { throwError } = global.utils;

    async function streamURL(url, mime = 'jpg') {
        const dest = `${__dirname}/cache/${Date.now()}.${mime}`;
        const downloader = require('image-downloader');
        const fse = require('fs-extra');
        await downloader.image({
            url, dest
        });
        setTimeout(j => fse.unlinkSync(j), 60 * 1000, dest);
        return fse.createReadStream(dest);
    }

    const allowedUserIDs = global.config.NDH.map(id => id.toString());
    const senderIDStr = senderID.toString();
    const threadSetting = global.data.threadData.get(threadID) || {};
    const pref = threadSetting.PREFIX || PREFIX;
    const content = args.slice(1, args.length);
    if (args.length == 0) {
        return api.sendMessage(`[ ADMIN CONFIG SETTING ]\n──────────────────\n${pref}admin add: User ko admin banayein\n${pref}admin remove: Admin ka role hatayein\n${pref}admin list: Admin ki list dekhein\n${pref}admin qtvonly: QTV mode on/off karein\n${pref}admin only: Anant mode on/off karein\n${pref}admin echo: Bot aapke kahe shabd wapas karega\n${pref}admin fast: Bot ki network speed dekhein\n${pref}admin create [mdl naam]: Commands mein nayi file banayein\n${pref}admin del [mdl naam]: Commands se file hatayein\n${pref}admin rename [mdl naam] => [naya naam]: Commands mein file ka naam badlein\n${pref}admin ping: Bot ka response speed dekhein\n${pref}admin offbot: Bot band karein\n${pref}admin reload [samay]: Bot system reset karein\n${pref}admin resetmoney: Bot system ke sabhi paise reset karein\n${pref}admin ship [mdl naam]: Group ke sadasya ko ek mdl bhejein\n──────────────────\n📝 Upyog: ${pref}admin + [text] command ka upyog karein`, event.threadID, event.messageID);
    }
    const { ADMINBOT } = global.config;
    const { NDH } = global.config;
    const { userName } = global.data;
    const { writeFileSync } = require("fs-extra");
    const mention = Object.keys(mentions);

    delete require.cache[require.resolve(configPath)];
    var config = require(configPath);
    switch (args[0]) {
        case "list": {
            var i = 1;
            var msg = [];
            listAdmin = ADMINBOT || config.ADMINBOT || [];
            let count = 1;
            for (const idAdmin of listAdmin) {
                if (parseInt(idAdmin)) {
                    const name = (await Users.getData(idAdmin)).name;
                    msg.push(`${count}. 👤: ${name}\n📎 Link: fb.com/${idAdmin}`);
                    count++;
                }
            }
            api.sendMessage(`[ Bot ke Sanchalak ]\n──────────────────\n👤 Naam: ${global.config.ADMIN_NAME}\n📎 Facebook: ${global.config.FACEBOOK_ADMIN}\n📩 Email: j237854@gmail.com\n──────────────────\n\n[ ADMIN BOT ]\n──────────────────\n${msg.join("\n")}\n──────────────────\n👤 User: ${nd}\n⏰ Samay: ${gio}`, event.threadID, event.messageID);
            break;
        }
        case "add": {
            if (permssion != 3) return api.sendMessage("❎ Aapke paas is command ko upyog karne ka adhikar nahi hai", event.threadID, event.messageID);
            if (event.type == "message_reply") { content[0] = event.messageReply.senderID }
            if (mention.length != 0 && isNaN(content[0])) {
                var listAdd = [];

                for (const id of mention) {
                    ADMINBOT.push(id);
                    config.ADMINBOT.push(id);
                    listAdd.push(`[👤] → Naam: ${event.mentions[id]}\n[🔰] → Uid: ${id}`);
                };
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage({ body: getText("addedNewAdmin", mention.length, listAdd.join("\n").replace(/\@/g, ""), moment.tz("Asia/Kolkata").format("DD/MM/YYYY || HH:mm:ss")), attachment: await streamURL(`https://graph.facebook.com/${mention}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`) }, event.threadID);
            } else if (content.length != 0 && !isNaN(content[0])) {
                ADMINBOT.push(content[0]);
                config.ADMINBOT.push(content[0]);
                const name = (await Users.getData(content[0])).name;
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage({ body: getText("addedNewAdmin", 1, `[👤] → Naam: ${name}\n[🔰] → Uid: ${content[0]}`, moment.tz("Asia/Kolkata").format("DD/MM/YYYY || HH:mm:ss")), attachment: await streamURL(`https://graph.facebook.com/${content[0]}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`) }, event.threadID);
            } else return throwError(this.config.name, threadID, messageID);
        }
        case "removeAdmin":
        case "rm":
        case "delete": {
            if (permssion != 3) return api.sendMessage("❎ Aapke paas is command ko upyog karne ka adhikar nahi hai", event.threadID, event.messageID);
            if (event.type == "message_reply") { content[0] = event.messageReply.senderID }
            if (mentions.length != 0 && isNaN(content[0])) {
                const mention = Object.keys(mentions);
                var listAdd = [];

                for (const id of mention) {
                    const index = config.ADMINBOT.findIndex(item => item == id);
                    ADMINBOT.splice(index, 1);
                    config.ADMINBOT.splice(index, 1);
                    listAdd.push(`[👤] → Naam: ${event.mentions[id]}\n[🔰] → Uid: ${id}`);
                };

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("removedAdmin", mention.length, listAdd.join("\n").replace(/\@/g, ""), moment.tz("Asia/Kolkata").format("DD/MM/YYYY || HH:mm:ss")), threadID, messageID);
            } else if (content.length != 0 && !isNaN(content[0])) {
                const index = config.ADMINBOT.findIndex(item => item.toString() == content[0]);
                ADMINBOT.splice(index, 1);
                config.ADMINBOT.splice(index, 1);
                const name = (await Users.getData(content[0])).name;
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("removedAdmin", 1, `[👤] → Naam: ${name}\n[🔰] → Uid: ${content[0]}`, moment.tz("Asia/Kolkata").format("DD/MM/YYYY || HH:mm:ss")), threadID, messageID);
            } else throwError(this.config.name, threadID, messageID);
        }
        case 'box':
        case 'qtvonly': {
            const { resolve } = require("path");
            const pathData = resolve(__dirname, 'data', 'dataAdbox.json');
            const database = require(pathData);
            const { adminbox } = database;
            if (permssion < 1) return api.sendMessage("⚠️ Iska upyog karne ke liye kam se kam QTV adhikar chahiye", threadID, messageID);
            if (adminbox[threadID] == true) {
                adminbox[threadID] = false;
                api.sendMessage("☑️ QTV mode safalta se band kiya gaya, ab sabhi sadasya bot ka upyog kar sakte hain", threadID, messageID);
            } else {
                adminbox[threadID] = true;
                api.sendMessage("☑️ QTV mode chalu kiya gaya, ab sirf group ke QTV hi bot ka upyog kar sakte hain", threadID, messageID);
            }
            writeFileSync(pathData, JSON.stringify(database, null, 4));
            break;
        }
        case 'only':
        case '-o': {
            if (permssion != 3) return api.sendMessage("⚠️ Aap admin nahi hain", threadID, messageID);
            if (config.adminOnly == false) {
                config.adminOnly = true;
                api.sendMessage(`☑️ Anant mode chalu kiya gaya, ab sirf admin hi bot ka upyog kar sakte hain`, threadID, messageID);
            } else {
                config.adminOnly = false;
                api.sendMessage(`☑️ Anant mode band kiya gaya, ab sabhi sadasya bot ka upyog kar sakte hain`, threadID, messageID);
            }
            writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
            break;
        }
        case 'echo': {
            const input = args.join(" ");
            const spaceIndex = input.indexOf(' ');

            if (spaceIndex !== -1) {
                const textAfterFirstWord = input.substring(spaceIndex + 1).trim();
                return api.sendMessage(textAfterFirstWord, event.threadID);
            }
            break;
        }
        case 'fast': {
            try {
                const fast = require("fast-speedtest-api");
                const speedTest = new fast({
                    token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
                    verbose: false,
                    timeout: 10000,
                    https: true,
                    urlCount: 5,
                    bufferSize: 8,
                    unit: fast.UNITS.Mbps
                });
                const result = await speedTest.getSpeed();
                return api.sendMessage(`🚀 Speed Test: ${result} Mbps`, event.threadID, event.messageID);
            } catch (error) {
                return api.sendMessage("⚠️ Is samay speed test nahi kiya ja sakta, baad mein koshish karein!", event.threadID, event.messageID);
            }
            break;
        }
        case 'create': {
            if (!allowedUserIDs.includes(senderIDStr)) {
                return api.sendMessage(`⚠️ Iska upyog karne ke liye admin adhikar chahiye`, event.threadID, event.messageID);
            }

            if (args.slice(1).length === 0) return api.sendMessage("⚠️ Apni file ka naam daalein", event.threadID);

            const commandName = args.slice(1).join(' ');
            const filePath = `${__dirname}/${commandName}.js`;

            if (fs.existsSync(filePath)) {
                return api.sendMessage(`⚠️ ${commandName}.js file pehle se maujood hai`, event.threadID, event.messageID);
            }

            fs.copySync(`${__dirname}/example.js`, filePath);
            return api.sendMessage(`☑️ "${commandName}.js" file safalta se banayi gayi`, event.threadID, event.messageID);
            break;
        }
        case 'del': {
            if (!allowedUserIDs.includes(senderIDStr)) {
                return api.sendMessage(`⚠️ Iska upyog karne ke liye admin adhikar chahiye`, event.threadID, event.messageID);
            }
            const commandName = args.slice(1).join(' ');
            if (!commandName) return api.sendMessage(`⚠️ Hataane ke liye command ka naam daalein`, event.threadID, event.messageID);

            fs.unlink(`${__dirname}/${commandName}.js`, (err) => {
                if (err) return api.sendMessage(`❎ ${commandName}.js file hataane mein asafal: ${err.message}`, event.threadID, event.messageID);
                return api.sendMessage(`☑️ ${commandName}.js file safalta se hatayi gayi`, event.threadID, event.messageID);
            });
            break;
        }
        case 'rename': {
            if (!allowedUserIDs.includes(senderIDStr)) {
                return api.sendMessage(`⚠️ Iska upyog karne ke liye admin adhikar chahiye`, event.threadID, event.messageID);
            }
            const renameArgs = args.slice(1).join(' ').split('=>');

            if (renameArgs.length !== 2) {
                return api.sendMessage(`⚠️ Sahi format mein daalein [mdl naam] => [naya naam]`, event.threadID, event.messageID);
            }

            const oldName = renameArgs[0].trim();
            const newName = renameArgs[1].trim();

            fs.rename(`${__dirname}/${oldName}.js`, `${__dirname}/${newName}.js`, function (err) {
                if (err) throw err;
                return api.sendMessage(
                    `☑️ ${oldName}.js file ka naam badalkar ${newName}.js kar diya gaya`,
                    event.threadID,
                    event.messageID
                );
            });
            break;
        }
        case 'ping': {
            const timeStart = Date.now();
            const pingrs = Date.now() - timeStart;
            api.sendMessage(`📶 Ping pratifal: ${pingrs} ms`, event.threadID, event.messageID);
            break;
        }
        case 'offbot': {
            if (!allowedUserIDs.includes(senderIDStr)) {
                return api.sendMessage(`⚠️ Iska upyog karne ke liye admin adhikar chahiye`, event.threadID, event.messageID);
            }
            api.sendMessage("☠️ Alvida", event.threadID, () => process.exit(0));
            break;
        }
        case 'reload': {
            if (!allowedUserIDs.includes(senderIDStr)) {
                return api.sendMessage(`⚠️ Iska upyog karne ke liye admin adhikar chahiye`, event.threadID, event.messageID);
            }

            const { commands } = global.client;
            const pidusage = await global.nodemodule["pidusage"](process.pid);
            const os = require("os");
            const cpus = os.cpus();
            let chips, speed;

            for (const cpu of cpus) {
                chips = cpu.model;
                speed = cpu.speed;
            }

            const timeStart = Date.now();
            const { threadID, messageID } = event;
            const time = args.join(" ");
            let rstime = "68";

            if (time) {
                rstime = time;
            }

            api.sendMessage(`[ SYSTEM RESET ]\n──────────────────\n[⚙️] → Bot ${rstime} second baad reset hoga\n[⏰] → Samay: ${gio}\n[📊] → Processing speed: ${speed}MHz\n[↪️] → CPU threads: ${os.cpus().length}\n[📶] → Delay: ${Date.now() - timeStart}ms`, event.threadID, event.messageID);

            setTimeout(() => {
                api.sendMessage("[💨] → Bot system reset kar raha hai!", event.threadID, () => process.exit(1));
            }, rstime * 1000);

            break;
        }
        case "resetmoney": {
            if (!allowedUserIDs.includes(senderIDStr)) {
                return api.sendMessage(`⚠️ Iska upyog karne ke liye admin adhikar chahiye`, event.threadID, event.messageID);
            }

            const mentionID = Object.keys(event.mentions);
            const message = [];
            const error = [];

            const resetMoneyForUser = async (userID) => {
                try {
                    await Currencies.setData(userID, { money: 0 });
                    message.push(userID);
                } catch (e) {
                    error.push(e);
                }
            };

            const allUserData = await Currencies.getAll(['userID']);

            for (const userData of allUserData) {
                await resetMoneyForUser(userData.userID);
            }

            api.sendMessage(`✅ ${message.length} logon ke paise ka data hata diya gaya`, event.threadID, async () => {
                if (error.length !== 0) {
                    await api.sendMessage(`❎ ${error.length} logon ke paise ka data hataane mein asafal`, event.threadID);
                }
            }, event.messageID);

            for (const singleID of mentionID) {
                await resetMoneyForUser(singleID);
            }

            api.sendMessage(`✅ ${message.length} logon ke paise ka data hata diya gaya`, event.threadID, async () => {
                if (error.length !== 0) {
                    await api.sendMessage(`❎ ${error.length} logon ke paise ka data hataane mein asafal`, event.threadID);
                }
            }, event.messageID);

            break;
        }
        case 'ship': {
            if (!allowedUserIDs.includes(senderIDStr)) {
                return api.sendMessage(`⚠️ Iska upyog karne ke liye admin adhikar chahiye`, event.threadID, event.messageID);
            }

            const { messageReply, type } = event;

            let name = args[1];
            const commandName = args.slice(1).join(' ');
            let text, uid;
            if (type === "message_reply") {
                text = messageReply.body;
                uid = messageReply.senderID;
            } else {
                uid = event.senderID;
            }

            if (!text && !name) {
                return api.sendMessage(`[⏰] → Abhi samay hai: ${gio}\n[📝] → Share karne ke liye reply ya tag karein`, event.threadID, event.messageID);
            }

            fs.readFile(`./shankar/commands/${commandName}.js`, "utf-8", async (err, data) => {
                if (err) {
                    return api.sendMessage(`[⏰] → Abhi samay hai: ${gio}\n[🔎] → Afsos, ${commandName} mdl abhi bot ${global.config.BOTNAME} ke system par nahi hai`, event.threadID, event.messageID);
                }

                const response = await axios.post("https://api.mocky.io/api/mock", {
                    "status": 200,
                    "content": data,
                    "content_type": "application/json",
                    "charset": "UTF-8",
                    "secret": "PhamMinhDong",
                    "expiration": "never"
                });

                const link = response.data.link;
                const use = await Users.getNameUser(uid);
                api.sendMessage(`[📜] → Group: ${global.data.threadInfo.get(event.threadID).threadName}\n[⏰] → Samay: ${gio}\n[💼] → Command naam: ${commandName}\n[👤] → Admin: ${nd}\n[📌] → Module bhej diya gaya ☑️\n[📝] → ${use} kripya message waiting ya spam check karein module lene ke liye`, event.threadID, event.messageID);
                api.sendMessage(`[⏰] → Samay: ${gio}\n[🔗] → Link: ${link}\n[🔰] → Command naam: ${commandName}\n[📜] → Group: ${global.data.threadInfo.get(event.threadID).threadName}\n[🔎] → Aapko admin ne ek module alag se share kiya hai`, uid);
            });

            break;
        }
        default: {
            return throwError(this.config.name, threadID, messageID);
        }
    }
};
