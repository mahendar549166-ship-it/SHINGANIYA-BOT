const path = require("path");
const { mkdirSync, writeFileSync, existsSync, createReadStream, readdirSync } = require("fs-extra");
const axios = require("axios");

module.exports.config = {
    name: "dragon",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Dragon Island game khelen",
    commandCategory: "Khel",
    usages: "[]",
    cooldowns: 0
};

module.exports.onLoad = async () => {
    const dir = __dirname + `/game/dragon/datauser/`;
    const _dir = __dirname + `/game/dragon/datauser/`;
    const __dir = __dirname + `/game/dragon/cache/`;
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    if (!existsSync(_dir)) mkdirSync(_dir, { recursive: true });
    if (!existsSync(__dir)) mkdirSync(__dir, { recursive: true });
    return;
};

module.exports.checkPath = function (type, senderID) {
    const pathGame = path.join(__dirname, 'game', 'dragon', 'datauser', `${senderID}.json`);
    const pathGame_1 = require(`./game/dragon/datauser/${senderID}.json`);
    if (type == 1) return pathGame;
    if (type == 2) return pathGame_1;
};

module.exports.image = async function(link) {
    var images = [];
    let download = (await axios.get(link, { responseType: "arraybuffer" })).data; 
    writeFileSync(__dirname + `/game/dragon/cache/dragon.png`, Buffer.from(download, "utf-8"));
    images.push(createReadStream(__dirname + `/game/dragon/cache/dragon.png`));
    return images;
};

module.exports.run = async function ({ api, event, args, client, Threads, __GLOBAL, Users, Currencies, getText }) {
    const { senderID, messageID, threadID } = event;
    const axios = require('axios');
    const request = require('request');
    const fs = require('fs-extra');
    const pathData = path.join(__dirname, 'game', 'dragon', 'datauser', `${senderID}.json`);
    switch (args[0]) {
        case 'register':
        case '-r': {
            const nDate = new Date().toLocaleString('hi-IN', {
                timeZone: 'Asia/Kolkata'
            });
            if (!existsSync(pathData)) {
                var obj = {};
                obj.name = (await Users.getData(senderID)).name;
                obj.ID = senderID;
                obj.shield = 3;
                obj.coins = 20000;
                obj.Island = {};
                obj.Island.level = 1;
                obj.Island.coinsLV = 200;
                obj.Island.data = {};
                obj.Island.data.tower = 0;
                obj.Island.data.tree = 0;
                obj.Island.data.pool = 0;
                obj.Island.data.pet = 0;
                obj.spin = 20;
                obj.timeRegister = nDate;
                writeFileSync(pathData, JSON.stringify(obj, null, 4));
                return api.sendMessage("🔱 Safalta se register karke khel mein pravesh karen", threadID, messageID);
            } else return api.sendMessage("⚔🔱 Aap pehle se hi database mein hain", threadID, messageID);
        }
        case 'spin': {
            if (!existsSync(pathData)) {
                return api.sendMessage({body: `Aapne abhi tak game ke liye register nahi kiya!`, attachment: await this.image('https://imgur.com/ZhrgXGJ.gif')}, threadID, messageID);
            }
            if (this.checkPath(2, senderID).spin == 0) return api.sendMessage('» Aapke spin khatam ho gaye hain, kripya aur spins kharidein ya 5 minute wait karen taaki system aapko aur spins de', threadID, messageID);
            this.checkPath(2, senderID).spin = parseInt(this.checkPath(2, senderID).spin) - 1;
            writeFileSync(this.checkPath(1, senderID), JSON.stringify(this.checkPath(2, senderID), null, 4));
            var items = [
                `${this.checkPath(2, senderID).Island.level * 1000} coins`, 
                `${this.checkPath(2, senderID).Island.level * 3000} coins`, 
                `${this.checkPath(2, senderID).Island.level * 5000} coins`, 
                'Tiger Dragon', 
                'Purple Snake Dragon', 
                'Big Star', 
                '1 spin', 
                '2 spins', 
                '7 spins', 
                '5 spins', 
                'Black Dragon 30 stars'
            ];
            var getItem = items[Math.floor(Math.random() * items.length)];
            var i = this.getSpin(items, getItem, senderID);
            api.sendMessage({body: `Badhai ho, aapne spin karke jeeta: ${getItem}`, attachment: await this.image('https://imgur.com/0Z0parX.jpg')}, threadID, messageID);
            await new Promise(resolve => setTimeout(resolve, 1000));
            const data = readdirSync(__dirname + `/game/dragon/datauser`);
            if (i == 3) {
                if (data.length < 4) return api.sendMessage(`Dragon churana ke liye server par kam se kam 3 khiladi chahiye :3`, threadID, messageID);
                const dem = [];
                for (let i of data) { 
                    if (i != `${senderID}.json`) {
                        dem.push(require(`./game/dragon/datauser/${i}`));
                    }
                }
                dem.sort((a, b) => a.coins + b.coins);
                var msg = `Sabse zyada paisa hai: ${dem[0].coins / 2}\n`;
                const randomIndex = dem.sort(function() { return .5 - Math.random() });
                for (var i = 0; i < 3; i++) {
                    msg += `${i+1}. ${randomIndex[i].name} - Dragon level ${randomIndex[i].Island.level}\n`;
                }
                msg += 'Kripya reply karke chunen ki aap kiske dragon churana chahte hain';
                return api.sendMessage(`==========\n${msg}`, threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "steal",
                        dem,
                        randomIndex
                    });
                }, messageID);
            } else if (i == 5) {
                if (data.length < 4) return api.sendMessage(`Doosre khiladi par hamla karne ke liye server par kam se kam 3 khiladi chahiye`, threadID, messageID);
                var msgf = `[====HAMLA====]\n`, number = 1, p = [];
                for (let i of data) { 
                    if (i != `${senderID}.json`) {
                        var o = require(`./game/dragon/datauser/${i}`);
                        p.push(o);
                        msgf += `${number++}. ${o.name} - Island level ${o.Island.level}\n`;
                    }
                }
                return api.sendMessage(msgf, threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "attack",
                        p
                    });
                }, messageID);
            }
            break;
        }
        case 'build': 
        case 'xaydung': {
            if (!existsSync(pathData)) {
                return api.sendMessage({body: "Aapne abhi tak game ke liye register nahi kiya!", attachment: await this.image('https://imgur.com/nFGX42pt.jpg')}, threadID, messageID);
            }
            var a = require(`./game/dragon/datauser/${senderID}.json`);
            return api.sendMessage(`» Island ko upgrade karen\n1. Chuong palan - ${a.Island.coinsLV * (a.Island.data.tower + 1)} coins (${a.Island.data.tower}/50)\n2. Chuong apan - ${a.Island.coinsLV * (a.Island.data.tree + 1)} coins (${a.Island.data.tree}/50)\n3. Chuong lai - ${a.Island.coinsLV * (a.Island.data.pool + 1)} coins (${a.Island.data.pool}/50)\n4. Jeevan sthal - ${a.Island.coinsLV * (a.Island.data.pet + 1)} coins (${a.Island.data.pet}/50)\n==============`, threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "build"
                });
            }, messageID);
        }
        case 'shop': {
            if (!existsSync(pathData)) {
                return api.sendMessage({body: "Aapne abhi tak game ke liye register nahi kiya!", attachment: await this.image('https://imgur.com/bZqS5tx.jpg')}, threadID, messageID);
            }
            return api.sendMessage({body: `── [ Dukaan ] ──  \n\n🔱Aapke liye dragon ki list\n[🔱1].Han Phi Snow\n[🔱2].Amar Bird\n[🔱3].Dragon Turtle\n[🔱4].Panchrang\n[🔱5].Black Dragon 35 stars\n[🔱6].Huyen Vu Dragon\n[🔱7].Viet Hai Dragon King\n[🔱8].Kylin Dragon\n[🔱9].Divine Dragon\n[⭐️] Kripya bot ke message ka reply karen aur number daalein`, attachment: await this.image('https://imgur.com/ULwGlLx.jpg')}, threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "shop"
                });
            }, messageID);
        }
        case 'battle': {
            if (!existsSync(pathData)) {
                return api.sendMessage({body: "Aapne abhi tak game ke liye register nahi kiya!", attachment: await this.image('https://imgur.com/DDx1Emo.jpg')}, threadID, messageID);
            }
            return api.sendMessage({body: `── [ ISLAND CHUNEN ] ──  \n\n❤️ Khelne ke liye island chunen\n[🗺1].Lava Island\n[🗺2].Snow Island\n[🗺3].Fairy Island\n`, attachment: await this.image('https://imgur.com/varoTlL.jpg')}, threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "battle"
                });
            }, messageID);
        }
        case 'me':
        case 'info': {
            if (!existsSync(pathData)) {
                return api.sendMessage({body: "Aapne abhi tak game ke liye register nahi kiya!", attachment: await this.image('https://imgur.com/gWuh3JT.jpg')}, threadID, messageID);
            }
            var a = require(`./game/dragon/datauser/${senderID}.json`);
            return api.sendMessage(`⭐️ INVENTORY UPGRADE ⭐️\n- Island Level: ${a.Island.level}\n- Bache hue spins: ${a.spin}\n- Coins: ${a.coins}\n- Island:\n• Chuong palan (${a.Island.data.tower}/50)\n• Chuong apan (${a.Island.data.tree}/50)\n• Chuong lai (${a.Island.data.pool}/50)\n• Jeevan sthal (${a.Island.data.pet}/50)`, threadID, messageID);
        }
        case 'top': {
            if (!existsSync(pathData)) {
                return api.sendMessage({body: "Aapne abhi tak game ke liye register nahi kiya!", attachment: await this.image('https://imgur.com/k3JyZfJ.jpg')}, threadID, messageID);
            }
            const data = readdirSync(__dirname + `/game/dragon/datauser`);
            if (data.length < 3) return api.sendMessage(`Top dekhne ke liye server par kam se kam 3 khiladi chahiye`, threadID, messageID);
            var p = [];
            for (let i of data) { 
                var o = require(`./game/dragon/datauser/${i}`);
                p.push(o);
            }
            p.sort((a, b) => b.Island.level - a.Island.level);
            var msg = '===TOP 3 UCHCHTAM ISLAND LEVEL===\n';
            for (var i = 0; i < 3; i++) {
                msg += `${i+1}. ${p[i].name} ke saath island level ${p[i].Island.level}\n`;
            }
            return api.sendMessage(msg, threadID, messageID);
        }
        default: {
            return api.sendMessage({body: `===[ DRAGON ISLAND ]===\n» R: Register karen\n» SPIN: Game ka spin\n» BUILD: Island ko upgrade karen\n» SHOP: Dragon kharidne ki dukaan\n» INFO: Apne baare mein jaankari\n» TOP: Server par top level dekhen\n» CHANGE: Bot ke paise ko game ke paise mein badlen aur ulta\nBATTLE\n------------\nSENBOT`, attachment: await this.image('https://imgur.com/02aVCzn.jpg')}, threadID, messageID);
        }
    }
};

module.exports.handleReply = async ({ event, api, Currencies, handleReply, Users, getText }) => {
    const { body, threadID, messageID, senderID } = event;
    const axios = require('axios');
    const request = require('request');
    const fs = require("fs");
    switch (handleReply.type) {
        case 'build': {
            var a = require(`./game/dragon/datauser/${senderID}.json`);
            var l = ['tower', 'tree', 'pool', 'pet'];
            if (a.coins < a.Island.coinsLV * (a.Island.data[l[parseInt(body) - 1]] + 1)) return api.sendMessage(`Nirman ke liye aapke paas game mein kaafi coins nahi hain!`, threadID, messageID);
            a.coins = a.Island.coinsLV * (a.Island.data[l[parseInt(body) - 1]] + 1);
            await Currencies.decreaseMoney(senderID, a.Island.coinsLV * (a.Island.data[l[parseInt(body) - 1]] + 1));
            api.unsendMessage(handleReply.messageID);
            if (body == 1) {
                if (a.Island.data.tower == 50) return api.sendMessage('Is kshetra ka level uchchtam hai, isliye nirman nahi kiya ja sakta', threadID, messageID);
                a.Island.data.tower = a.Island.data.tower + 10;
                api.sendMessage(`Nirman safal: ${a.Island.data.tower}/50`, threadID, messageID);
            }
            if (body == 2) {
                if (a.Island.data.tree == 50) return api.sendMessage('Is kshetra ka level uchchtam hai, isliye nirman nahi kiya ja sakta', threadID, messageID);
                a.Island.data.tree = a.Island.data.tree + 10;
                api.sendMessage(`Nirman safal: ${a.Island.data.tree}/50`, threadID, messageID);
            }
            if (body == 3) {
                if (a.Island.data.pool == 50) return api.sendMessage('Is kshetra ka level uchchtam hai, isliye nirman nahi kiya ja sakta', threadID, messageID);
                a.Island.data.pool = a.Island.data.pool + 10;
                api.sendMessage(`Nirman safal: ${a.Island.data.pool}/50`, threadID, messageID);
            }
            if (body == 4) {
                if (a.Island.data.pet == 50) return api.sendMessage('Is kshetra ka level uchchtam hai, isliye nirman nahi kiya ja sakta', threadID, messageID);
                a.Island.data.pet = a.Island.data.pet + 10;
                api.sendMessage(`Upgrade safal: ${a.Island.data.pet}/50`, threadID, messageID);
            }
            if (a.Island.data.tower == 50 && a.Island.data.tree == 50 && a.Island.data.pool == 50 && a.Island.data.pet == 50) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                api.sendMessage(`Aapka upgrade uchchtam level tak pahunch gaya hai!\nAapka island ${(a.Island.level) + 1} tak upgrade hoga`, threadID, messageID);
                a.Island.level = a.Island.level + 1;
                a.Island.coinsLV = a.Island.coinsLV + 100;
                a.Island.data.tower = 0;
                a.Island.data.tree = 0;
                a.Island.data.pool = 0;
                a.Island.data.pet = 0;
            }
            return writeFileSync(this.checkPath(1, senderID), JSON.stringify(a, null, 4));
        }
        case 'shop': {
            if (body == 1) {
                return api.sendMessage({body: `⭐️ KHARIDI SAFAL ⭐️\n[🚘]Naam: Han Phi Snow\n[⚜️]Jankari: Snow system`, attachment: await this.image('https://imgur.com/21h9GjC.gif')}, threadID, messageID);
            }
            else if (body == 2) {
                return api.sendMessage({body: `⭐️ KHARIDI SAFAL ⭐️\n[🚘]Naam: Amar Bird\n[⚜️]Jankari: Fire system`, attachment: await this.image('https://imgur.com/ibKdCxZ.gif')}, threadID, messageID);
            }
            else if (body == 3) {
                return api.sendMessage({body: `⭐️ KHARIDI SAFAL ⭐️\n[🚘]Naam: Dragon Turtle\n[⚜️]Jankari: Fire/Water system`, attachment: await this.image('https://imgur.com/u5A54FB.gif')}, threadID, messageID);
            }
            else if (body == 4) {
                return api.sendMessage({body: `⭐️ KHARIDI SAFAL ⭐️\n[🚘]Naam: Panchrang\n[⚜️]Jankari: Spiritual system`, attachment: await this.image('https://imgur.com/AmA2F7f.gif')}, threadID, messageID);
            }
            else if (body == 5) {
                return api.sendMessage({body: `⭐️ KHARIDI SAFAL ⭐️\n[🚘]Naam: Black Dragon 35 stars\n[⚜️]Jankari: Darkness system`, attachment: await this.image('https://imgur.com/0gj6SaM.gif')}, threadID, messageID);
            }
            else if (body == 6) {
                return api.sendMessage({body: `⭐️ KHARIDI SAFAL ⭐️\n[🚘]Naam: Huyen Vu Dragon\n[⚜️]Jankari: Wood system`, attachment: await this.image('https://imgur.com/75F61Cd.gif')}, threadID, messageID);
            }
            else if (body == 7) {
                return api.sendMessage({body: `⭐️ KHARIDI SAFAL ⭐️\n[🚘]Naam: Viet Hai Dragon\n[⚜️]Jankari: Water system`, attachment: await this.image('https://imgur.com/6ls6O2A.gif')}, threadID, messageID);
            }
            else if (body == 8) {
                return api.sendMessage({body: `⭐️ KHARIDI SAFAL ⭐️\n[🚘]Naam: Kylin Dragon\n[⚜️]Jankari: Spiritual system`, attachment: await this.image('https://imgur.com/EDpNf25.gif')}, threadID, messageID);
            }
            else if (body == 9) {
                return api.sendMessage({body: `⭐️ KHARIDI SAFAL ⭐️\n[🚘]Naam: Divine Dragon\n[⚜️]Jankari: Spiritual system`, attachment: await this.image('https://imgur.com/8l5FXH7.gif')}, threadID, messageID);
            }
            else {
                return api.sendMessage('Vikalp avaidh hai!', threadID, messageID);
            }
        }
        case 'mua': {
            if (body == 1) {
                return api.sendMessage('Kripya is message ka reply karen aur wo paisa daalein jo aap badalna chahte hain! Chhoti 0%', threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "botcoins"
                    });
                }, messageID);
            }
            else if (body == 2) {
                return api.sendMessage('Kripya is message ka reply karen aur wo paisa daalein jo aap badalna chahte hain! Chhoti 0%', threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "coinsbot"
                    });
                }, messageID);
            }
            else if (body == 3) {
                return api.sendMessage('Kripya is message ka reply karen aur wo spins daalein jo aap kharidna chahte hain! (10 spins 2000$)', threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "spinn"
                    });
                }, messageID);
            }
            else {
                return api.sendMessage('Vikalp avaidh hai!', threadID, messageID);
            }
        }
        case 'battle': {
            if (body == 1) {
                var coindragon = Math.floor(Math.random() * 80000) + 10000;
                var huhong = Math.floor(Math.random() * 90) + 20;
                return api.sendMessage({body: `⭐️ KHEL ⭐️\n[🗺] MAPS: Lava Island.\n[🏆] Badhai ho, aapne pratidwandi ko hara diya\n» Inam: ${coindragon}$\n» Haar: ${huhong}%`, attachment: await this.image('https://imgur.com/PUCFwqp.jpg')}, threadID, messageID);
            }
            else if (body == 2) {
                var coindragon = Math.floor(Math.random() * 80000) + 10000;
                var huhong = Math.floor(Math.random() * 90) + 20;
                return api.sendMessage({body: `⭐️ KHEL ⭐️\n[🗺] MAPS: Snow Island.\n[🏆] Badhai ho, aapne pratidwandi ko hara diya\n» Inam: ${coindragon}$\n» Haar: ${huhong}%`, attachment: await this.image('https://imgur.com/FLMkCGK.jpg')}, threadID, messageID);
            }
            else if (body == 3) {
                var coindragon = Math.floor(Math.random() * 80000) + 10000;
                var huhong = Math.floor(Math.random() * 90) + 20;
                return api.sendMessage({body: `⭐️ KHEL ⭐️\n[🗺] MAPS: Fairy Island.\n[🏆] Badhai ho, aapne pratidwandi ko hara diya\n» Inam: ${coindragon}$\n» Haar: ${huhong}%`, attachment: await this.image('https://imgur.com/k3JyZfJ.jpg')}, threadID, messageID);
            }
        }        
        case 'spinn': {
            await checkMoney(senderID, parseInt(body));
            api.unsendMessage(handleReply.messageID);
            await Currencies.decreaseMoney(senderID, parseInt(body));
            a.spin = a.spin + parseInt(body);
            writeFileSync(this.checkPath(1, senderID), JSON.stringify(a, null, 4));
            return api.sendMessage(`Safalta se ${body} spins kharide (${parseInt(body) * 200}$`, threadID, messageID);
        }
        case 'botcoins': {
            var a = require(`./game/dragon/datauser/${senderID}.json`);
            await checkMoney(senderID, parseInt(body));
            api.unsendMessage(handleReply.messageID);
            await Currencies.decreaseMoney(senderID, parseInt(body));
            a.coins = a.coins + parseInt(body);
            writeFileSync(this.checkPath(1, senderID), JSON.stringify(a, null, 4));
            return api.sendMessage(`Safalta se ${body} coins game mein jode gaye!`, threadID, messageID);
        }
        case 'coinsbot': {
            var a = require(`./game/dragon/datauser/${senderID}.json`);
            if (a.coins < parseInt(body)) return api.sendMessage('Is vyapar ke liye aapke paas kaafi paisa nahi hai!', threadID, messageID);
            api.unsendMessage(handleReply.messageID);
            await Currencies.increaseMoney(senderID, parseInt(body));
            a.coins = a.coins - parseInt(body);
            writeFileSync(this.checkPath(1, senderID), JSON.stringify(a, null, 4));
            return api.sendMessage(`Safalta se ${body} coins bot ke account mein nikale gaye!`, threadID, messageID);
        }
    }
    async function checkMoney(senderID, maxMoney) {
        var i, w;
        i = (await Currencies.getData(senderID)) || {};
        w = i.money || 0;
        if (w < parseInt(maxMoney)) return api.sendMessage('Is vyapar ke liye aapke paas kaafi paisa nahi hai!', threadID, messageID);
    }
};

module.exports.getSpin = function (items, getItem, senderID) {
    const path = this.checkPath(1, senderID);
    var pathData = this.checkPath(2, senderID);
    var i = items.findIndex(index => index == getItem);
    if (i == 0) pathData.coins = parseInt(pathData.coins) + pathData.Island.level * 1000;
    if (i == 1) pathData.coins = parseInt(pathData.coins) + pathData.Island.level * 3000;
    if (i == 2) pathData.coins = parseInt(pathData.coins) + pathData.Island.level * 5000;
    if (i == 4) {
        if (pathData.shield != 3) {
            pathData.spin = parseInt(pathData.spin) + 1;
            pathData.shield = parseInt(pathData.shield) + 1;
        }
    }
    if (i == 6) pathData.spin = parseInt(pathData.spin) + 1;
    if (i == 7) pathData.spin = parseInt(pathData.spin) + 2;
    if (i == 8) pathData.spin = parseInt(pathData.spin) + 5;
    writeFileSync(path, JSON.stringify(pathData, null, 4));
    return i;
};
