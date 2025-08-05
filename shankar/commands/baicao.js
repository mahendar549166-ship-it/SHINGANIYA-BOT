module.exports.config = {
    name: "baicao",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Group ke liye teen patte ka khel jisme daav lagaya ja sakta hai (patte ki tasveer ke sath)",
    commandCategory: "Khel",
    usages: "[start/join/info/leave]",
    cooldowns: 1
};

const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const suits = ["spades", "hearts", "diamonds", "clubs"];
const deck = [];

for (let i = 0; i < values.length; i++) {
    for (let x = 0; x < suits.length; x++) {
        let weight = parseInt(values[i]);
        if (["J", "Q", "K"].includes(values[i])) weight = 10;
        else if (values[i] == "A") weight = 11;
        const card = {
            Value: values[i],
            Suit: suits[x],
            Weight: weight,
            Icon: suits[x] == "spades" ? "♠️" : suits[x] == "hearts" ? "♥️" : suits[x] == "diamonds" ? "♦️" : "♣️"
        };
        deck.push(card);
    }
}

function createDeck() {
    // 1000 baar tasallon ko shuffle karein
    const deckShuffel = [...deck];
    for (let i = 0; i < 1000; i++) {
        const location1 = Math.floor((Math.random() * deckShuffel.length));
        const location2 = Math.floor((Math.random() * deckShuffel.length));
        const tmp = deckShuffel[location1];
        deckShuffel[location1] = deckShuffel[location2];
        deckShuffel[location2] = tmp;
    }
    return deckShuffel;
}

function getLinkCard(Value, Suit) {
    return `https://raw.githubusercontent.com/ntkhang03/poker-cards/main/cards/${Value == "J" ? "jack" : Value == "Q" ? "queen" : Value == "K" ? "king" : Value == "A" ? "ace" : Value}_of_${Suit}.png`;
}

async function drawCard(cards) {
    // 500 x 726
    const Canvas = require("canvas");
    const canvas = Canvas.createCanvas(500 * cards.length, 726);
    const ctx = canvas.getContext("2d");
    let x = 0;
    for (const card of cards) {
        const loadImgCard = await Canvas.loadImage(card);
        ctx.drawImage(loadImgCard, x, 0);
        x += 500;
    }
    return canvas.toBuffer();
}

module.exports.handleEvent = async ({ Currencies, event, api, Users }) => {
    const Canvas = require("canvas");
    const fs = require("fs-extra");

    const { senderID, threadID, body, messageID } = event;

    if (typeof body == "undefined") return;
    if (!global.moduleData.baicao) global.moduleData.baicao = new Map();
    if (!global.moduleData.baicao.has(threadID)) return;
    var values = global.moduleData.baicao.get(threadID);
    if (values.start != 1) return;

    const deckShuffel = values.deckShuffel; // Tasallon ka deck

    if (body.indexOf("Chia bài") == 0 || body.indexOf("chia bài") == 0) {
        if (values.chiabai == 1) return;
        for (const key in values.player) {
            const card1 = deckShuffel.shift();
            const card2 = deckShuffel.shift();
            const card3 = deckShuffel.shift();
            var tong = (card1.Weight + card2.Weight + card3.Weight);
            if (tong >= 20) tong -= 20;
            if (tong >= 10) tong -= 10;
            values.player[key].card1 = card1;
            values.player[key].card2 = card2;
            values.player[key].card3 = card3;
            values.player[key].tong = tong;

            const linkCards = [];

            for (let i = 1; i < 4; i++) {
                const Card = values.player[key]["card" + i];
                linkCards.push(getLinkCard(Card.Value, Card.Suit));
            }

            const pathSave = __dirname + `/cache/card${values.player[key].id}.png`;
            fs.writeFileSync(pathSave, await drawCard(linkCards));

            api.sendMessage({
                body: `🃏 𝐀𝐚𝐩𝐤𝐞 𝐩𝐚𝐭𝐭𝐞 🎲: ${card1.Value}${card1.Icon} | ${card2.Value}${card2.Icon} | ${card3.Value}${card3.Icon} \n\n𝐀𝐚𝐩𝐤𝐚 𝐣𝐨𝐝: ${tong}`,
                attachment: fs.createReadStream(pathSave)
            }, values.player[key].id, (error, info) => {
                if (error) return api.sendMessage(`𝐊𝐢𝐬𝐢 𝐤𝐡𝐢𝐥𝐚𝐝𝐢 𝐤𝐨 𝐩𝐚𝐭𝐭𝐞 𝐛𝐚𝐧𝐭 𝐧𝐚𝐡𝐢 𝐤𝐢𝐲𝐚 𝐣𝐚 𝐬𝐚𝐤𝐭𝐚: ${values.player[key].id}`, threadID);
                fs.unlinkSync(pathSave);
            });
        }
        values.chiabai = 1;
        global.moduleData.baicao.set(threadID, values);
        return api.sendMessage("💦 𝐏𝐚𝐭𝐭𝐞 𝐛𝐚𝐧𝐭 𝐝𝐢𝐲𝐞 𝐠𝐚𝐲𝐞! 𝐒𝐚𝐛𝐡𝐢 𝐤𝐡𝐢𝐥𝐚𝐝𝐢𝐲𝐨𝐧 𝐤𝐨 𝟐 𝐦𝐨𝐤𝐞 𝐦𝐢𝐥𝐞𝐧𝐠𝐞 𝐩𝐚𝐭𝐭𝐞 𝐛𝐚𝐝𝐚𝐥𝐧𝐞 𝐤𝐞 𝐥𝐢𝐲𝐞, 𝐚𝐠𝐚𝐫 𝐩𝐚𝐭𝐭𝐞 𝐧𝐚𝐡𝐢 𝐝𝐢𝐤𝐡𝐞 𝐭𝐨 𝐚𝐩𝐧𝐞 𝐦𝐞𝐬𝐬𝐚𝐠𝐞𝐬 𝐜𝐡𝐞𝐜𝐤 𝐤𝐚𝐫𝐞𝐢𝐧 💌", threadID);
    }

    if (body.indexOf("Đổi bài") == 0 || body.indexOf("đổi bài") == 0) {
        if (values.chiabai != 1) return;
        var player = values.player.find(item => item.id == senderID);
        if (player.doibai == 0) return api.sendMessage("𝐀𝐚𝐩 𝐧𝐞 𝐚𝐩𝐧𝐞 𝐬𝐚𝐛𝐡𝐢 𝐦𝐨𝐤𝐞 𝐛𝐚𝐝𝐚𝐥𝐧𝐞 𝐤𝐞 𝐥𝐢𝐲𝐞 𝐢𝐬𝐭𝐞𝐦𝐚𝐥 𝐤𝐚𝐫 𝐥𝐢𝐲𝐞", threadID, messageID);
        if (player.ready == true) return api.sendMessage("𝐀𝐚𝐩 𝐧𝐞 𝐫𝐞𝐚𝐝𝐲 𝐤𝐚𝐫 𝐥𝐢𝐲𝐚 𝐡𝐚𝐢, 𝐚𝐛 𝐚𝐚𝐩 𝐩𝐚𝐭𝐭𝐞 𝐧𝐚𝐡𝐢 𝐛𝐚𝐝𝐚𝐥 𝐬𝐚𝐤𝐭𝐞!", threadID, messageID);
        const card = ["card1", "card2", "card3"];
        player[card[(Math.floor(Math.random() * card.length))]] = deckShuffel.shift();
        player.tong = (player.card1.Weight + player.card2.Weight + player.card3.Weight);
        if (player.tong >= 20) player.tong -= 20;
        if (player.tong >= 10) player.tong -= 10;
        player.doibai -= 1;
        global.moduleData.baicao.set(threadID, values);

        const linkCards = [];

        for (let i = 1; i < 4; i++) {
            const Card = player["card" + i];
            linkCards.push(getLinkCard(Card.Value, Card.Suit));
        }

        const pathSave = __dirname + `/cache/card${player.id}.png`;
        fs.writeFileSync(pathSave, await drawCard(linkCards));

        return api.sendMessage({
            body: `🃏 𝐁𝐨𝐭 𝐧𝐞 𝐛𝐚𝐝𝐥𝐞 𝐤𝐞 𝐛𝐚𝐚𝐝 𝐚𝐚𝐩𝐤𝐞 𝐩𝐚𝐭𝐭𝐞: ${player.card1.Value}${player.card1.Icon} | ${player.card2.Value}${player.card2.Icon} | ${player.card3.Value}${player.card3.Icon}\n\n⚡️ 𝐀𝐚𝐩𝐤𝐚 𝐣𝐨𝐝: ${player.tong}`,
            attachment: fs.createReadStream(pathSave)
        }, player.id, (error, info) => {
            if (error) return api.sendMessage(`𝐊𝐢𝐬𝐢 𝐤𝐡𝐢𝐥𝐚𝐝𝐢 𝐤𝐞 𝐥𝐢𝐲𝐞 𝐩𝐚𝐭𝐭𝐞 𝐧𝐚𝐡𝐢 𝐛𝐚𝐝𝐥𝐞 𝐣𝐚 𝐬𝐚𝐤𝐭𝐞: ${player.id}`, threadID);
            fs.unlinkSync(pathSave);
        });
    }

    if (body.indexOf("ready") == 0 || body.indexOf("Ready") == 0) {
        if (values.chiabai != 1) return;
        var player = values.player.find(item => item.id == senderID);
        if (player.ready == true) return;
        const name = await Users.getNameUser(player.id);
        values.ready += 1;
        player.ready = true;
        if (values.player.length == values.ready) {
            const player = values.player;
            player.sort(function (a, b) { return b.tong - a.tong });

            var ranking = [], num = 1;

            for (const info of player) {
                const name = await Users.getNameUser(info.id);
                ranking.push(`${num++} • ${name} 𝐤𝐞 𝐬𝐚𝐭𝐡 ${info.card1.Value}${info.card1.Icon} | ${info.card2.Value}${info.card2.Icon} | ${info.card3.Value}${info.card3.Icon} => ${info.tong} 𝐧𝐮𝐤𝐭𝐞 💸\n`);
            }

            try {
                await Currencies.increaseMoney(player[0].id, values.rateBet * player.length);
            } catch (e) {};
            global.moduleData.baicao.delete(threadID);

            return api.sendMessage(`[⚡️] 𝐍𝐚𝐭𝐢𝐣𝐚:\n\n ${ranking.join("\n")}\n\n𝐒𝐢𝐫𝐟 𝐭𝐨𝐩 𝟏 𝐤𝐡𝐢𝐥𝐚𝐝𝐢 𝐤𝐨 ${values.rateBet * player.length} 𝐫𝐮𝐩𝐚𝐲𝐞 𝐦𝐢𝐥𝐞𝐧𝐠𝐞 💵`, threadID);
        }
        else return api.sendMessage(`[😻] 𝐊𝐡𝐢𝐥𝐚𝐝𝐢: ${name} 𝐚𝐛 𝐭𝐚𝐲𝐚𝐚𝐫 𝐡𝐚𝐢 𝐩𝐚𝐭𝐭𝐞 𝐤𝐡𝐨𝐥𝐧𝐞 𝐤𝐞 𝐥𝐢𝐲𝐞, 𝐛𝐚𝐚𝐤𝐢 𝐡𝐚𝐢𝐧: ${values.player.length - values.ready} 𝐤𝐡𝐢𝐥𝐚𝐝𝐢 𝐣𝐨 𝐚𝐛𝐡𝐢 𝐭𝐚𝐲𝐚𝐚𝐫 𝐧𝐚𝐡𝐢 𝐡𝐚𝐢𝐧`, event.threadID);
    }

    if (body.indexOf("nonready") == 0 || body.indexOf("Nonready") == 0) {
        const data = values.player.filter(item => item.ready == false);
        var msg = [];

        for (const info of data) {
            const name = global.data.userName.get(info.id) || await Users.getNameUser(info.id);
            msg.push(name);
        }
        if (msg.length != 0) return api.sendMessage("[😿] 𝐖𝐨 𝐤𝐡𝐢𝐥𝐚𝐝𝐢 𝐣𝐨 𝐚𝐛𝐡𝐢 𝐭𝐚𝐲𝐚𝐚𝐫 𝐧𝐚𝐡𝐢 𝐡𝐚𝐢𝐧: " + msg.join(", "), threadID);
        else return;
    }
}

module.exports.run = async ({ api, event, args, Currencies }) => {
    var { senderID, threadID, messageID } = event;
    const { readdirSync, readFileSync, writeFileSync, existsSync, copySync, createWriteStream, createReadStream } = require("fs-extra");
    const request = require("request");
    threadID = String(threadID);
    senderID = String(senderID);
    if (!existsSync(__dirname + '/cache/3cay2.png')) {
        request('https://i.imgur.com/ixYeOs8.jpg').pipe(createWriteStream(__dirname + '/cache/3cay2.png'));
    }
    if (!global.moduleData.baicao) global.moduleData.baicao = new Map();
    var values = global.moduleData.baicao.get(threadID) || {};
    var data = await Currencies.getData(event.senderID);
    var money = data.money;
    if (!args[0]) {
        var msg = {
            body: `🃏====[ 𝐓𝐄𝐄𝐍 𝐏𝐀𝐓𝐓𝐈 𝐊𝐀 𝐊𝐇𝐄𝐋 ]====🃏\n\n𝗦𝗪𝗔𝗚𝗔𝗧 𝗛𝗔𝗜 𝗔𝗔𝗣𝗞𝗔 𝗗𝗨𝗕𝗔𝗜 𝗞𝗘 𝗧𝗘𝗘𝗡 𝗣𝗔𝗧𝗧𝗜 𝗦𝗢𝗡𝗚 𝗠𝗘𝗜𝗡\n�_K𝗸𝗵𝗲𝗹𝗻𝗲 𝗸𝗲 𝗹𝗶𝗬𝗲 𝗻𝗶𝗰𝗵𝗲 𝗱𝗶𝗬𝗲 𝗴𝗮𝗬𝗲 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀 𝗸𝗮 𝗶𝘀𝘁𝗲𝗺𝗮𝗹 𝗸𝗮𝗿𝗲𝗶𝗻:\n» /𝗯𝗮𝗶𝗰𝗮𝗼 𝗰𝗿𝗲𝗮𝘁𝗲 [ 𝐃𝐚𝐚𝐯 𝐤𝐢 𝐫𝐚𝐤𝐚𝐦 ]\n» /𝗯𝗮𝗶𝗰𝗚𝗮𝗼 𝘀𝘁𝗮𝗿𝘁 [ 𝐓𝐞𝐞𝐧 𝐏𝐚𝐭𝐭𝐢 𝐤𝐚 𝐤𝐡𝐞𝐥 𝐬𝐡𝐮𝐫𝐮 𝐤𝐚𝐫𝐞𝐢𝐧 ]\n» /𝗯𝗮𝗶𝗰𝗮𝗼 𝗶𝗻𝗳𝗼 [ 𝐓𝐞𝐞𝐧 𝐏𝐚𝐭𝐭𝐢 𝐤𝐢 𝐣𝐚𝐧𝐤𝐚𝐫𝐢 𝐝𝐞𝐤𝐡𝐞𝐢𝐧 ]\n» /𝗯𝗮𝗶𝗰𝗮𝗼 𝗷𝗼𝗶𝗻 [ 𝐊𝐡𝐞𝐥 𝐦𝐞𝐢𝐧 𝐬𝐡𝐚𝐦𝐢𝐥 𝐡𝐨𝐧𝐞 𝐤𝐞 𝐥𝐢𝐲𝐞 ]\n» /�_b𝗮𝗶𝗰𝗮𝗼 𝗹𝗲𝗮𝘃𝗲 [ 𝐓𝐞𝐞𝐧 𝐏𝐚𝐭𝐭𝐢 𝐤𝐡𝐞𝐥 𝐜𝐡𝐡𝐨𝐝𝐧𝐞 𝐤𝐞 𝐥𝐢𝐲𝐞 ]\n» 𝗖𝗵𝗶𝗮 𝗯𝗮̀𝗶 [ 𝐊𝐡𝐢𝐥𝐚𝐝𝐢𝐲𝐨𝐧 𝐤𝐨 𝐩𝐚𝐭𝐭𝐞 𝐛𝐚𝐧𝐭𝐧𝐞 𝐤𝐞 𝐥𝐢𝐲𝐞, 𝐬𝐢𝐫𝐟 𝐤𝐡𝐞𝐥 𝐤𝐚 𝐦𝐚𝐥𝐢𝐤 𝐲𝐞𝐡 𝐜𝐨𝐦𝐦𝗮𝐧𝐝 𝐝𝐚𝐥 𝐬𝐚𝐤𝐭𝐚 𝐡𝐚𝐢 ]\n» Đ𝗼̂̉𝗶 𝗕𝗮̀𝗶 [ 𝐏𝐚𝐭𝐭𝐞 𝐛𝐚𝐝𝐚𝐥𝐧𝐞 𝐤𝐞 𝐥𝐢𝐲𝐲𝐞, 𝐡𝐚𝐫 𝐤𝐡𝐢𝐥𝐚𝐝𝐢 𝐤𝐞 𝐩𝐚𝐬 𝟐 𝐦𝐨𝐤𝐞 𝐡𝐨𝐧𝐠𝐞 ]\n» 𝗥𝗲𝗮𝗱𝘆 [ 𝐏𝐚𝐭𝐭𝐞 𝐤𝐡𝐨𝐥𝐧𝐞 𝐤𝐞 𝐥𝐢𝐲𝐞 𝐭𝐚𝐲𝐚𝐚𝐫 ]\n» 𝗡𝗼𝗻𝗿𝗲𝗮𝗱𝘆 [ 𝐔𝐧 𝐤𝐡𝐢𝐥𝐚𝐝𝐢𝐲𝐨𝐧 𝐤𝐨 𝐝𝐞𝐤𝐡𝐞𝐢𝐧 𝐣𝐨 𝐚𝐛𝐡𝐢 𝐭𝐚𝐲𝐚𝐚𝐫 𝐧𝐚𝐡𝐢 𝐡𝐚𝐢𝐧 ]`,
            attachment: [
                createReadStream(__dirname + "/cache/3cay2.png")
            ]
        };
        return api.sendMessage(msg, threadID, messageID);
    }
    switch (args[0]) {
        case "create":
        case "-c": {
            if (global.moduleData.baicao.has(threadID)) return api.sendMessage("[🃏] 𝐈𝐬 𝐠𝐫𝐨𝐮𝐩 𝐦𝐞𝐢𝐧 𝐩𝐞𝐡𝐥𝐞 𝐬𝐞 𝐭𝐞𝐞𝐧 𝐩𝐚𝐭𝐭𝐢 𝐤𝐚 𝐤𝐡𝐞𝐥 𝐜𝐡𝐚𝐥 𝐫𝐚𝐡𝐚 𝐡𝐚𝐢", threadID, messageID);
            if (!args[1] || isNaN(args[1]) || parseInt(args[1]) <= 1) return api.sendMessage("⚡️ 𝐀𝐚𝐩𝐤𝐚 𝐝𝐚𝐚𝐯 𝐞𝐤 𝐬𝐚𝐧𝐤𝐡𝐲𝐚 𝐡𝐨𝐧𝐚 𝐜𝐡𝐚𝐡𝐢𝐲𝐞 𝐚𝐮𝐫 𝟏 𝐫𝐮𝐩𝐚𝐲𝐞 𝐬𝐞 𝐳𝐲𝐚𝐝𝐚 𝐡𝐨𝐧𝐚 𝐜𝐡𝐚𝐡𝐢𝐲𝐞 💵", threadID, messageID);
            if (money < args[1]) return api.sendMessage(`[⚡️] 𝐀𝐚𝐩 𝐤𝐞 𝐩𝐚𝐬 𝐢𝐭𝐧𝐞 𝐩𝐚𝐢𝐬𝐞 𝐧𝐚𝐡𝐢 𝐡𝐚𝐢𝐧 𝐤𝐢 𝐚𝐚𝐩 ${args[1]} 𝐫𝐮𝐩𝐚𝐲𝐞 𝐤𝐚 𝐤𝐡𝐞𝐥 𝐬𝐡𝐮𝐫𝐮 𝐤𝐚𝐫 𝐬𝐚𝐤𝐞𝐧 💵`, event.threadID, event.messageID);
            await Currencies.decreaseMoney(event.senderID, Number(args[1]));
            global.moduleData.baicao.set(event.threadID, { "author": senderID, "start": 0, "chiabai": 0, "ready": 0, player: [{ "id": senderID, "card1": 0, "card2": 0, "card3": 0, "doibai": 2, "ready": false }], rateBet: Number(args[1]) });
            return api.sendMessage(`🎲 𝐓𝐞𝐞𝐧 𝐏𝐚𝐭𝐭𝐢 𝐤𝐚 𝐤𝐡𝐞𝐥 ${args[1]} 𝐫𝐮𝐩𝐚𝐲𝐞 𝐤𝐞 𝐝𝐚𝐚𝐯 𝐤𝐞 𝐬𝐚𝐭𝐡 𝐬𝐡𝐮𝐫𝐮 𝐤𝐢𝐲𝐚 𝐠𝐚𝐲𝐚! 𝐒𝐡𝐚𝐦𝐢𝐥 𝐡𝐨𝐧𝐞 𝐤𝐞 𝐥𝐢𝐲𝐞 /𝐛𝐚𝐢𝐜𝐚𝐨 𝐣𝐨𝐢𝐧 𝐤𝐚 𝐢𝐬𝐭𝐞𝐦𝐚𝐥 𝐤𝐚𝐫𝐞𝐢𝐧\n[⚡️] 𝐊𝐡𝐞𝐥 𝐬𝐡𝐮𝐫𝐮 𝐤𝐚𝐫𝐧𝐞 𝐰𝐚𝐥𝐞 𝐤𝐨 𝐣𝐨𝐢𝐧 𝐧𝐚𝐡𝐢 𝐤𝐚𝐫𝐧𝐚 𝐩𝐚𝐝𝐞𝐠𝐚`, event.threadID, event.messageID);
        }

        case "join":
        case "-j": {
            if (!values) return api.sendMessage("[🃏] 𝐀𝐛𝐡𝐢 𝐤𝐨𝐢 𝐭𝐞𝐞𝐧 𝐩𝐚𝐭𝐭𝐢 𝐤𝐚 𝐤𝐡𝐞𝐥 𝐬𝐡𝐮𝐫𝐮 𝐧𝐚𝐡𝐢 𝐡𝐮𝐚, 𝐚𝐚𝐩 /𝐛𝐚𝐢𝐜𝐚𝐨 𝐜𝐫𝐞𝐚𝐭𝐞 𝐬𝐞 𝐤𝐡𝐞𝐥 𝐬𝐡𝐮𝐫𝐮 𝐤𝐚𝐫 𝐬𝐚𝐤𝐭𝐞 𝐡𝐚𝐢𝐧", threadID, messageID);
            if (values.start == 1) return api.sendMessage("𝐀𝐛 𝐤𝐡𝐞𝐥 𝐬𝐡𝐮𝐫𝐮 𝐡𝐨 𝐜𝐡𝐮𝐤𝐚 𝐡𝐚𝐢 🙈", threadID, messageID);
            if (money < values.rateBet) return api.sendMessage(`𝐀𝐚𝐩 𝐤𝐞 𝐩𝐚𝐬 𝐢𝐭𝐧𝐞 𝐩𝐚𝐢𝐬𝐞 𝐧𝐚𝐡𝐢 𝐡𝐚𝐢𝐧 𝐤𝐢 𝐚𝐚𝐩 ${values.rateBet} 𝐫𝐮𝐩𝐚𝐲𝐞 𝐤𝐞 𝐝𝐚𝐚𝐯 𝐰𝐚𝐥𝐞 𝐤𝐡𝐞𝐥 𝐦𝐞𝐢𝐧 𝐬𝐡𝐚𝐦𝐢𝐥 𝐡𝐨 𝐬𝐚𝐤𝐞𝐧`, event.threadID, event.messageID);
            if (values.player.find(item => item.id == senderID)) return api.sendMessage("[🃏] 𝐀𝐚𝐩 𝐩𝐞𝐡𝐥𝐞 𝐬𝐞 𝐤𝐡𝐞𝐥 𝐦𝐞𝐢𝐧 𝐬𝐡𝐚𝐦𝐢𝐥 𝐡𝐚𝐢𝐧!", threadID, messageID);
            values.player.push({ "id": senderID, "card1": 0, "card2": 0, "card3": 0, "tong": 0, "doibai": 2, "ready": false });
            await Currencies.decreaseMoney(event.senderID, values.rateBet);
            global.moduleData.baicao.set(threadID, values);
            return api.sendMessage("𝐓𝐞𝐞𝐧 𝐏𝐚𝐭𝐭𝐢 𝐤𝐞 𝐤𝐡𝐞𝐥 𝐦𝐞𝐢𝐧 𝐬𝐡𝐚𝐦𝐢𝐥 𝐡𝐨 𝐠𝐚𝐲𝐞!", threadID, messageID);
        }

        case "leave":
        case "-l": {
            if (typeof values.player == "undefined") return api.sendMessage("[🃏] 𝐀𝐛𝐡𝐢 𝐤𝐨𝐢 𝐭𝐞𝐞𝐧 𝐩𝐚𝐭𝐭𝐢 𝐤𝐚 𝐤𝐡𝐞𝐲𝐥 𝐬𝐡𝐮𝐫𝐮 𝐧𝐚𝐡𝐢 𝐡𝐮𝐚, 𝐚𝐚𝐩 /𝐛𝐚𝐢𝐜𝐚𝐨 𝐜𝐫𝐞𝐚𝐭𝐞 𝐬𝐞 𝐤𝐡𝐞𝐥 𝐬𝐡𝐮𝐫𝐮 𝐤𝐚𝐫 𝐬𝐚𝐤𝐭𝐞 𝐡𝐚𝐢𝐧", threadID, messageID);
            if (!values.player.some(item => item.id == senderID)) return api.sendMessage("⚡️ 𝐀𝐚𝐩 𝐢𝐬 𝐠𝐫𝐨𝐮𝐩 𝐦𝐞𝐢𝐧 𝐭𝐞𝐞𝐧 𝐩𝐚𝐭𝐭𝐢 𝐤𝐞 𝐤𝐡𝐞𝐥 𝐦𝐞𝐢𝐧 𝐬𝐡𝐚𝐦𝐢𝐥 𝐧𝐚𝐡𝐢 𝐡𝐚𝐢𝐧!", threadID, messageID);
            if (values.start == 1) return api.sendMessage("⚡️ 𝐀𝐛 𝐤𝐡𝐞𝐲𝐥 𝐬𝐡𝐮𝐫𝐮 𝐡𝐨 𝐜𝐡𝐮𝐤𝐢 𝐡𝐚𝐢 𝐚𝐮𝐫 𝐩𝐚𝐭𝐭𝐞 𝐛𝐚𝐧𝐭 𝐝𝐢𝐲𝐞 𝐠𝐚𝐲𝐞 𝐡𝐚𝐢𝐧 😿", threadID, messageID);
            if (values.author == senderID) {
                global.moduleData.baicao.delete(threadID);
                api.sendMessage("𝐊𝐡𝐞𝐥 𝐤𝐚 𝐦𝐚𝐥𝐢𝐤 𝐤𝐡𝐞𝐥 𝐜𝐡𝐡𝐨𝐝 𝐜𝐡𝐮𝐤𝐚 𝐡𝐚𝐢, 𝐢𝐬𝐥𝐢𝐲𝐞 𝐤𝐡𝐞𝐲𝐥 𝐭𝐨𝐝 𝐝𝐢𝐲𝐚 𝐠𝐚𝐲𝐚 𝐡𝐚𝐢 🃏", threadID, messageID);
            } else {
                values.player.splice(values.player.findIndex(item => item.id === senderID), 1);
                api.sendMessage("𝐀𝐚𝐩 𝐧𝐞 𝐭𝐞𝐞𝐧 𝐩𝐚𝐭𝐭𝐢 𝐤𝐚 𝐤𝐡𝐞𝐥 𝐜𝐡𝐡𝐨𝐝 𝐝𝐢𝐲𝐚 𝐡𝐚𝐢!", threadID, messageID);
                global.moduleData.baicao.set(threadID, values);
            }
            return;
        }

        case "start":
        case "-s": {
            if (!values) return api.sendMessage("[🃏] 𝐀𝐛𝐡𝐢 𝐤𝐨𝐢 𝐭𝐞𝐞𝐧 𝐩𝐚𝐭𝐭𝐢 𝐤𝐚 𝐤𝐡𝐞𝐲𝐥 𝐬𝐡𝐮𝐫𝐮 𝐧𝐚𝐡𝐢 𝐡𝐮𝐚, 𝐚𝐚𝐩 /𝐛𝐚𝐢𝐜𝐚𝐨 𝐜𝐫𝐞𝐚𝐭𝐞 𝐬𝐞 𝐤𝐡𝐞𝐥 𝐬�{h𝐮𝐫𝐮 𝐤𝐚𝐫 𝐬𝐚𝐤𝐭𝐞 𝐡𝐚𝐢𝐧", threadID, messageID);
            if (values.author !== senderID) return api.sendMessage("[🃏] 𝐀𝐚𝐩 𝐤𝐡𝐞𝐥 𝐤𝐞 𝐦𝐚𝐥𝐢𝐤 𝐧𝐚𝐡𝐢 𝐡𝐚𝐢𝐧, 𝐢𝐬𝐥𝐢𝐲𝐞 𝐤𝐡𝐞𝐲𝐥 𝐬𝐡𝐮𝐫𝐮 𝐧𝐚𝐡𝐢 𝐤𝐚𝐫 𝐬𝐚𝐤𝐭𝐞", threadID, messageID);
            if (values.player.length <= 1) return api.sendMessage("[🃏] 𝐀𝐛𝐡𝐢 𝐚𝐚𝐩𝐤𝐞 𝐤𝐡𝐞𝐥 𝐦𝐞𝐢𝐧 𝐤𝐨𝐢 𝐝𝐨𝐨𝐬𝐫𝐚 𝐤𝐡𝐢𝐥𝐚𝐝𝐢 𝐬𝐡𝐚𝐦𝐢𝐥 𝐧𝐚𝐡𝐢 𝐡𝐮𝐚, 𝐛𝐚𝐤𝐢 𝐤𝐡𝐢𝐥𝐚𝐝𝐢𝐲𝐨𝐨𝐧 𝐤𝐨 /𝐛𝐚𝐢𝐜𝐚𝐨 𝐣𝐨𝐢𝐧 𝐤𝐚𝐫𝐧𝐞 𝐤𝐞 𝐥𝐢𝐲𝐞 𝐛𝐮𝐥𝐚𝐲𝐞𝐢𝐧", threadID, messageID);
            if (values.start == 1) return api.sendMessage("[🃏] 𝐀𝐛 𝐤𝐡𝐞𝐲𝐥 𝐤𝐞 𝐦𝐚𝐥𝐢𝐤 𝐧𝐞 𝐩𝐚𝐭𝐭𝐞 𝐛𝐚𝐧𝐭𝐧𝐚 𝐬𝐡𝐮𝐫𝐮 𝐤𝐚𝐫 𝐝𝐢𝐲𝐚 𝐡𝐚𝐢", threadID, messageID);
            values.deckShuffel = createDeck(); // Tasallon ka deck
            values.start = 1;
            return api.sendMessage("⚡️ 𝐀𝐚𝐩𝐤𝐚 𝐭𝐞𝐞𝐧 𝐩𝐚𝐭𝐭𝐢 𝐤𝐚 𝐤𝐡𝐞𝐲𝐥 𝐬𝐡𝐮𝐫𝐮 𝐡𝐨 𝐠𝐚𝐲𝐚 𝐡𝐚𝐢", threadID, messageID);
        }

        case "info":
        case "-i": {
            if (typeof values.player == "undefined") return api.sendMessage("[🃏] 𝐀𝐛𝐡𝐢 𝐤𝐨𝐢 𝐭𝐞𝐞𝐧 𝐩𝐚𝐭𝐭𝐢 𝐤𝐚 𝐤𝐡𝐞𝐲𝐥 𝐬𝐡𝐮𝐫𝐮 𝐧𝐚𝐡𝐢 𝐡𝐮𝐚, 𝐚𝐚𝐩 /𝐛𝐚𝐢𝐜𝐚𝐨 𝐜𝐫𝐞𝐚𝐭𝐞 𝐬𝐞 𝐤𝐡𝐞𝐲𝐥 𝐬𝐡𝐮𝐫𝐮 𝐤𝐚𝐫 𝐬𝐚𝐤𝐭𝐞 𝐡𝐚𝐢𝐧", threadID, messageID);
            return api.sendMessage(
                "🎰== 𝐓𝐄𝐄𝐍 𝐏𝐀𝐓𝐓𝐈 𝐊𝐀 𝐊𝐇𝐄𝐋 ==🎰" +
                "\n- 𝐊𝐡𝐞𝐥 𝐊𝐚 𝐌𝐚𝐥𝐢𝐤: " + values.author +
                "\n- 𝐊𝐮𝐥 𝐊𝐡𝐢𝐥𝐚𝐝𝐢: " + values.player.length + " 𝐥𝐨𝐠" +
                "\n- 𝐃𝐚𝐚𝐯 𝐊𝐢 𝐑𝐚𝐤𝐚𝐦: " + values.rateBet + " 𝐫𝐮𝐩𝐚𝐲𝐞"
            , threadID, messageID);
        }

        default: {
            return global.utils.throwError(this.config.name, threadID, messageID);
        }
    }
}
