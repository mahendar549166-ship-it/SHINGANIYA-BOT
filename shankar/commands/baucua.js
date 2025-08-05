var request = require("request");
const { readdirSync, readFileSync, writeFileSync, existsSync, copySync, createWriteStream, createReadStream } = require("fs-extra");

module.exports.config = {
    name: "baucua",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Daav ke sath bau cua khel",
    commandCategory: "Khel",
    usages: "<[ga/tom/bau/cua/ca/nai] ho ya [🐓/🦞/🍐/🦀/🐬/🦌]> <Daav ki rashi (100$ se upar)>",
    cooldowns: 2
};

module.exports.onLoad = async function () {
    if (!existsSync(__dirname + '/cache/ga.jpg')) {
        request('https://i.imgur.com/Vz17qhg.jpg').pipe(createWriteStream(__dirname + '/cache/ga.jpg'));
    }
    if (!existsSync(__dirname + '/cache/tom.jpg')) {
        request('https://i.imgur.com/Ep0MukF.jpg').pipe(createWriteStream(__dirname + '/cache/tom.jpg'));
    }
    if (!existsSync(__dirname + '/cache/bau.jpg')) {
        request('https://i.imgur.com/Qp3StfB.jpg').pipe(createWriteStream(__dirname + '/cache/bau.jpg'));
    }
    if (!existsSync(__dirname + '/cache/cua.jpg')) {
        request('https://i.imgur.com/J5MPPMW.jpg').pipe(createWriteStream(__dirname + '/cache/cua.jpg'));
    }
    if (!existsSync(__dirname + '/cache/ca.jpg')) {
        request('https://i.imgur.com/JNQr0qI.jpg').pipe(createWriteStream(__dirname + '/cache/ca.jpg'));
    }
    if (!existsSync(__dirname + '/cache/nai.jpg')) {
        request('https://i.imgur.com/UYhUZf8.jpg').pipe(createWriteStream(__dirname + '/cache/nai.jpg'));
    }
    if (!existsSync(__dirname + '/cache/baucua.gif')) {
        request('https://i.imgur.com/dlrQjRL.gif').pipe(createWriteStream(__dirname + '/cache/baucua.gif'));
    }
};

async function get(one, two, three) {
    var x1;
    switch (one) {
        case "ga": x1 = "🐓"; break;
        case "tom": x1 = '🦞'; break;
        case "bau": x1 = '🍐'; break;
        case "cua": x1 = '🦀'; break;
        case "ca": x1 = '🐬'; break;
        case "nai": x1 = '🦌'; break;
    }
    var x2;
    switch (two) {
        case "ga": x2 = "🐓"; break;
        case "tom": x2 = '🦞'; break;
        case "bau": x2 = '🍐'; break;
        case "cua": x2 = '🦀'; break;
        case "ca": x2 = '🐬'; break;
        case "nai": x2 = '🦌'; break;
    }
    var x3;
    switch (three) {
        case "ga": x3 = "🐓"; break;
        case "tom": x3 = '🦞'; break;
        case "bau": x3 = '🍐'; break;
        case "cua": x3 = '🦀'; break;
        case "ca": x3 = '🐬'; break;
        case "nai": x3 = '🦌'; break;
    }
    var all = [x1, x2, x3];
    return full = all;
}

var full = [];
module.exports.run = async function ({ api, event, args, Currencies }) {
    var out = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
    const slotItems = ["ga", "tom", "bau", "cua", "ca", "nai"];
    const moneyUser = (await Currencies.getData(event.senderID)).money;

    var moneyBet = parseInt(args[1]);
    if (!args[0] || !isNaN(args[0])) return api.sendMessage({
        body: "🦀==== [ 𝗕𝗔𝗨 𝗖𝗨𝗔 ] ====🦀\n━━━━━━━━━━━━━━━━━━\n🦞𝗡𝗶𝘆𝗮𝗺 𝗔𝘂𝗿 𝗨𝗽𝗮𝘆𝗼𝗴🦞\n\n𝟭. 𝗕𝗮𝘂𝗰𝘂𝗮 + 𝗰𝗮́ , 𝘁𝗼̂𝗺 , 𝗰𝘂𝗮 , 𝗴𝗮̀ , 𝗻𝗮𝗶 , 𝗯𝗮̂̀𝘂 + 𝗱𝗮𝗮𝘃 𝗸𝗶 𝗿𝗮𝘀𝗵𝗶 𝟭𝟬𝟬$ 𝘀𝗲 𝘂𝗽𝗮𝗿 (𝘂𝗱𝗮𝗵𝗮𝗿𝗮𝗻: ?𝗯𝗮𝘂𝗰𝘂𝗮 𝗴𝗮̀ 𝟮𝟬𝟬)\n\n⚠️𝗔𝗴𝗮𝗿 𝗮𝗮𝗽 𝗯𝗮𝘂𝗰𝘂𝗮 𝗸𝗮 𝘀𝗽𝗮𝗺 𝗸𝗮𝗿𝘁𝗲 𝗵𝗮𝗶𝗻 𝘁𝗼𝗵 𝘀𝗶𝘀𝘁𝗲𝗺 𝗮𝗮𝗽𝗸𝗼 𝗯𝗮𝗻 𝗸𝗮𝗿 𝗱𝗲𝗴𝗮!!!",
        attachment: (await global.nodemodule["axios"]({
            url: (await global.nodemodule["axios"]('https://Api-By-Nhhoang.vnhoang06.repl.co/baucua')).data.url,
            method: "GET",
            responseType: "stream"
        })).data
    }, event.threadID, event.messageID);
    if (isNaN(moneyBet) || moneyBet <= 0) return api.sendMessage("[𝗗𝗮𝘄𝗻🐧] → 𝗗𝗮𝗮𝘃 𝗸𝗶 𝗿𝗮𝘀𝗵𝗶 𝗸𝗵𝗮𝗹𝗶 𝗻𝗮𝗵𝗶𝗻 𝗵𝗼 𝘀𝗮𝗸𝘁𝗶 𝗵𝗮𝗶 𝘆𝗮 𝗻𝗲𝗴𝗮𝘁𝗶𝘃𝗲 𝗿𝗮𝘀𝗵𝗶 𝗻𝗮𝗵𝗶𝗻 𝗵𝗼 𝘀𝗮𝗸𝘁𝗶", event.threadID, event.messageID);
    if (moneyBet > moneyUser) return api.sendMessage("[�_D𝗮𝘄𝗻🐧] → 𝗔𝗮𝗽𝗸𝗲 𝗱𝗮𝗮𝘃 𝗸𝗶 𝗿𝗮𝘀𝗵𝗶 𝗮𝗮𝗽𝗸𝗲 𝘄𝗮𝗹𝗹𝗲𝘁 𝘀𝗲 𝗷𝘆𝗮𝗱𝗮 𝗵𝗮𝗶!", event.threadID, event.messageID);
    if (moneyBet < 100) return api.sendMessage("[𝗗𝗮𝘄𝗻🐧] → 𝗗𝗮𝗮𝘃 𝗸𝗶 𝗿𝗮𝘀𝗵𝗶 𝟭𝟬𝟬$ 𝘀𝗲 𝗸𝗮𝗺 𝗻𝗮𝗵𝗶𝗻 𝗵𝗼 𝘀𝗮𝗸𝘁𝗶!", event.threadID, event.messageID);
    var number = [], win = false;
    for (let i = 0; i < 3; i++) number[i] = slotItems[Math.floor(Math.random() * slotItems.length)];
    var itemm;
    var icon;
    switch (args[0]) {
        case "bầu":
        case "Bầu": itemm = "bau"; icon = '🍐'; break;
        case "cua":
        case "Cua": itemm = "cua"; icon = '🦀'; break;
        case "cá":
        case "Cá": itemm = "ca"; icon = '🐟'; break;
        case "nai":
        case "Nai": itemm = "nai"; icon = '🦌'; break;
        case "gà":
        case "Gà": itemm = "ga"; icon = '🐓'; break;
        case "tôm":
        case "Tôm": itemm = "tom"; icon = '🦞'; break;
        default: return api.sendMessage("[𝗗𝗮𝘄𝗻🐧] → 𝗜𝘀 𝘁𝗮𝗿𝗮𝗵 𝗸𝗮𝗿𝗲𝗶𝗻: /𝗯𝗮𝘂𝗰𝘂𝗮 [𝗯𝗮𝘂/𝗰𝘂𝗮/𝗰𝗮/𝗻𝗮𝗶/𝗴𝗮/𝘁𝗼𝗺] [𝗿𝗮𝘀𝗵𝗶]", event.threadID, event.messageID);
    }
    await get(number[0], number[1], number[2]);
    api.sendMessage({
        body: "=== 『 𝗕𝗔𝗨 𝗖𝗨𝗔 』 ====\n━━━━━━━━━━━━━━━━━━\n\n→ 𝗕𝗼𝘁 𝗽𝗮𝗹𝗮𝘁 𝗿𝗮𝗵𝗮 𝗵𝗮𝗶... 𝗣𝗮𝗹𝗮𝘁 𝗿𝗮𝗵𝗮 𝗵𝗮𝗶 🎇\n→ 𝗔𝗮𝗽𝗸𝗼 𝘀𝗵𝘂𝗯𝗵 𝗸𝗮𝗺𝗻𝗮 𝗵𝗮𝗶...🎆",
        attachment: createReadStream(__dirname + "/cache/baucua.gif")
    }, event.threadID, async (error, info) => {
        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
        api.unsendMessage(info.messageID);
        await new Promise(resolve => setTimeout(resolve, 100));
        var array = [number[0], number[1], number[2]];
        var listimg = [];
        for (let string of array) {
            listimg.push(createReadStream(__dirname + `/cache/${string}.jpg`));
        }
        if (array.includes(itemm)) {
            var i = 0;
            if (array[0] == itemm) i += 1;
            if (array[1] == itemm) i += 1;
            if (array[2] == itemm) i += 1;
            if (i == 1) {
                var mon = parseInt(args[1]) + 300;
                await Currencies.increaseMoney(event.senderID, mon); console.log("s1")
                return api.sendMessage({
                    body: `=== 『 𝗔𝗔𝗣 𝗝𝗘𝗘𝗧 𝗚𝗔𝗬𝗘 』 ====\n━━━━━━━━━━━━━━━━━━\n\n→ 𝗣𝗮𝗹𝗮𝘁 𝗸𝗮 𝗻𝗮𝘁𝗶𝗷𝗮: ${full.join(" | ")}\n→ 𝗔𝗮𝗽 𝗷𝗲𝗲𝘁 𝗴𝗮𝘆𝗲 𝗮𝘂𝗿 ${mon}$ 𝗽𝗿𝗮𝗽𝘁 𝗸𝗮𝗿𝗲 ${icon}\n→ 𝗕𝗼𝘁 𝗻𝗲 𝗲𝗸 ${icon} 𝗽𝗮𝗹𝗮𝘁𝗮`,
                    attachment: listimg
                }, event.threadID, event.messageID);
            } else if (i == 2) {
                var mon = parseInt(args[1]) * 2;
                await Currencies.increaseMoney(event.senderID, mon); console.log("s2")
                return api.sendMessage({
                    body: `=== 『 𝗔𝗔𝗣 𝗕𝗔𝗗𝗘 𝗝𝗘𝗘𝗧𝗘 』 ====\n━━━━━━━━━━━━━━━━━━\n\n→ 𝗣𝗮𝗹𝗮𝘁 𝗸𝗮 𝗻𝗮𝘁𝗶𝗷𝗮: ${full.join(" | ")}\n→ 𝗔𝗮𝗽 𝗯𝗮𝗱𝗶 𝗷𝗲𝗲𝘁 𝗸𝗲 𝗵𝗮𝗸𝗱𝗮𝗮𝗿 𝗯𝗮𝗻𝗲 𝗮𝘂𝗿 ${mon}$ 𝗽𝗿𝗮𝗽𝘁 𝗸𝗮𝗿𝗲 💸\n→ 𝗕𝗼𝘁 𝗻𝗲 𝗱𝗼 ${icon} 𝗽𝗮𝗹𝗮𝘁𝗲`,
                    attachment: listimg
                }, event.threadID, event.messageID);
            } else if (i == 3) {
                var mon = parseInt(args[1]) * 3;
                await Currencies.increaseMoney(event.senderID, mon); console.log('s3')
                return api.sendMessage({
                    body: `=== 『 𝗔𝗔𝗣 𝗕𝗔𝗛𝗨𝗧 𝗕𝗔𝗗𝗘 𝗝𝗘𝗘𝗧𝗘 』 ====\n━━━━━━━━━━━━━━━━━━\n\n→ 𝗣𝗮𝗹𝗮𝘁 𝗸𝗮 𝗻𝗮𝘁𝗶𝗷𝗮: ${full.join(" | ")}\n→ 𝗔𝗮𝗽 𝗯𝗮𝗵𝘂𝘁 𝗯𝗮𝗱𝗶 𝗷𝗲𝗲𝘁 𝗸𝗲 𝗵𝗮𝗸𝗱𝗮𝗮𝗿 𝗯𝗮𝗻𝗲 𝗮𝘂𝗿 ${mon}$ 𝗽𝗿𝗮𝗽𝘁 𝗸𝗮𝗿𝗲 💸\n→ 𝗕𝗼𝘁 𝗻𝗲 𝘁𝗶𝗻 ${icon} 𝗽𝗮𝗹𝗮𝘁𝗲`,
                    attachment: listimg
                }, event.threadID, event.messageID);
            } else return api.sendMessage("[𝗗𝗮𝘄𝗻🐧] → 𝗚𝗮𝗹𝘁𝗶 𝗵𝗼 𝗴𝗮𝘆𝗶, 𝗯𝗼𝘁 𝗸𝗲 𝗹𝗶𝗲 𝗰𝗵𝗼𝗼𝗿 𝗱𝗼!", event.threadID, event.messageID);
        } else {
            await Currencies.decreaseMoney(event.senderID, parseInt(args[1])); console.log('s4')
            return api.sendMessage({
                body: `=== 『 𝗔𝗔𝗣 𝗛𝗔𝗔𝗥 𝗚𝗔𝗬𝗘 』 ====\n━━━━━━━━━━━━━━━━━━\n\n→ 𝗣𝗮𝗹𝗮𝘁 𝗸𝗮 𝗻𝗮𝘁𝗶𝗷𝗮: ${full.join(" | ")}\n→ 𝗔𝗮𝗽 𝗵𝗮𝗮𝗿 𝗴𝗮𝘆𝗲 𝗮𝘂𝗿 ${args[1]}$ 𝗴𝗮𝘃𝗮 𝗱𝗶𝘆𝗲 💸\n→ 𝗔𝘂𝗿 𝗯𝗼𝘁 𝗻𝗲 ${icon} 𝗽𝗮𝗹𝗮𝘁 𝗸𝗶𝘆𝗮`,
                attachment: listimg
            }, event.threadID, event.messageID);
        }
    }, event.messageID);
};
