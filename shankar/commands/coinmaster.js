const path = require("path");
const { mkdirSync, writeFileSync, existsSync, createReadStream, readdirSync } = require("fs-extra");
const axios = require("axios");

module.exports.config = {
    name: "coinmaster",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑", //mod tnt
    description: "Coin Master khel",
    commandCategory: "Khel",
    usages: "[coinmaster khel bot par]",
    cooldowns: 5,
    usePrefix: false
};

module.exports.onLoad = async () => {
    const dir = __dirname + `/game/coinmaster/datauser/`;
    const _dir = __dirname + `/game/coinmaster/datauser/`;
    const __dir = __dirname + `/game/coinmaster/cache/`;
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    if (!existsSync(_dir)) mkdirSync(_dir, { recursive: true });
    if (!existsSync(__dir)) mkdirSync(__dir, { recursive: true });
    return;
}

module.exports.checkPath = function (type, senderID) {
    const pathGame = path.join(__dirname, 'game', 'coilmaster', 'datauser', `${senderID}.json`);
    const pathGame_1 = require("./game/coinmaster/datauser/" + senderID + '.json');
    if (type == 1) return pathGame
    if (type == 2) return pathGame_1
}

module.exports.image = async function(link) {
    var images = [];
    let download = (await axios.get(link, { responseType: "arraybuffer" } )).data; 
        writeFileSync( __dirname + `/game/coinmaster/cache/coinmaster.png`, Buffer.from(download, "utf-8"));
        images.push(createReadStream(__dirname + `/game/coinmaster/cache/coinmaster.png`));
    return images
}

module.exports.run = async function ({ api, event, args, Users, Currencies }) {
    const { threadID, messageID, senderID } = event;
    const pathData = path.join(__dirname, 'game', 'coinmaster', 'datauser', `${senderID}.json`);
    switch (args[0]) {
        case 'dangki':
        case 'register':
        case '-r':
        case '-dk': {
            const nDate = new Date().toLocaleString('hi-IN', {
                timeZone: 'Asia/Kolkata'
            });
            if (!existsSync(pathData)) {
                var obj = {};
                obj.name = (await Users.getData(senderID)).name;
                obj.ID = senderID;
                obj.shield = 3
                obj.coins = 20000
                obj.Island = {};
                obj.Island.level = 1
                obj.Island.coinsLV = 200
                obj.Island.data = {};
                obj.Island.data.tower = 0
                obj.Island.data.tree = 0
                obj.Island.data.pool = 0
                obj.Island.data.pet = 0
                obj.spin = 20
                obj.timeRegister = nDate
                writeFileSync(pathData, JSON.stringify(obj, null, 4));
                return api.sendMessage("[ 🐖 ] - Aapne safalata se register kiya hai ☑️", threadID, messageID);
            } else return api.sendMessage("[ 🐷 ] - Aap pehle se hi database mein hain ❎", threadID, messageID);
        }
        case '-s': {
            if (!existsSync(pathData)) {
                return api.sendMessage({body: "[ 🐖 ] - Aapne khel ke liye register nahi kiya hai!", attachment: await this.image('https://i.imgur.com/pgrZG5K.jpeg')}, threadID, messageID);
            }
            if(this.checkPath(2, senderID).spin == 0) return api.sendMessage('[ 🐖 ] - Aapke spin khatam ho gaye hain, kripya aur kharidne ya 5 minute wait karen, system aapko 5 spin dega', threadID, messageID);
            this.checkPath(2, senderID).spin = parseInt(this.checkPath(2, senderID).spin) - 1;
            writeFileSync(this.checkPath(1, senderID), JSON.stringify(this.checkPath(2, senderID), null, 4));
            var items = [`${this.checkPath(2, senderID).Island.level * 1000} coins`, `${this.checkPath(2, senderID).Island.level * 3000} coins`, `${this.checkPath(2, senderID).Island.level * 5000} coins`, 'super chor', 'dhaal', 'hamla', '1 spin', '2 spin', '5 spin'];
            var getItem = items[Math.floor(Math.random() * items.length)];
            var i = this.getSpin(items, getItem, senderID);
            api.sendMessage(`[ 🐖 ] - Badhai ho, aapne spin karke jeeta: ${getItem}`, threadID, messageID);
            await new Promise(resolve => setTimeout(resolve, 1000));
            const data = readdirSync(__dirname + `/game/coinmaster/datauser`);
            if(i == 3) {
                if(data.length < 4) return api.sendMessage(`[ 🐖 ] - Chori ke liye server par kam se kam 3 khiladi hone chahiye`, threadID, messageID);
                const dem = [];
                for (let i of data) { 
                    if(i != `${senderID}.json`) {
                        dem.push(require(`./game/coinmaster/datauser/${i}`));
                    }
                }
                dem.sort((a, b) => a.coins + b.coins);
                var msg = `🪙 Sabse zyada coins hain: ${dem[0].coins / 2}\n`
                const randomIndex = dem.sort(function() { return .5 - Math.random() });
                for(var i = 0; i < 3; i ++) {
                    msg += `${i+1}. ${randomIndex[i].name} - Dweep level ${randomIndex[i].Island.level}\n`
                }
                msg += '➩ Kripya reply karke chunav karen jisko aap chori karna chahte hain!!'
                return api.sendMessage(`==========\n${msg}`, threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "steal",
                        dem,
                        randomIndex
                    })
                }, messageID);
            }
            else if(i == 5) {
                if(data.length < 4) return api.sendMessage(`[ 🐖 ] - Hamla karne ke liye server par kam se kam 3 khiladi hone chahiye`, threadID, messageID);
                var msgf = `[ COINMASTER - HAMLA ]\n────────────────────\n`, number = 1, p = [];
                for (let i of data) { 
                    if(i != `${senderID}.json`) {
                        var o = require(`./game/coinmaster/datauser/${i}`);
                        p.push(o)
                        msgf += `${number++}. ${o.name} - Dweep level ${o.Island.level}\n`
                    }
                }
                return api.sendMessage(msgf, threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "attack",
                        p
                    })
                }, messageID);
            }
            break;
        }
        case 'build': 
        case 'xd': {
            if (!existsSync(pathData)) {
                return api.sendMessage({body: "[ 🐖 ] - Aapne khel ke liye register nahi kiya hai!", attachment: await this.image('https://i.imgur.com/pgrZG5K.jpeg')}, threadID, messageID);
            }
            var a = require(`./game/coinmaster/datauser/${senderID}.json`);
            return api.sendMessage(`➩ Aap apne dweep par kahan nirman karna chahte hain!\n1. Tower - ${a.Island.coinsLV * (a.Island.data.tower + 1)} coins (${a.Island.data.tower}/50)\n2. Hariyali - ${a.Island.coinsLV * (a.Island.data.tree + 1)} coins(${a.Island.data.tree}/50)\n3. Talab - ${a.Island.coinsLV * (a.Island.data.pool + 1)} coins (${a.Island.data.pool}/50)\n4. Paltu Janwar - ${a.Island.coinsLV * (a.Island.data.pet + 1)} coins (${a.Island.data.pet}/50)\n`, threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "build"
                })
            }, messageID);
        }
        case 'shop': {
            if (!existsSync(pathData)) {
                return api.sendMessage({body: "[ 🐖 ] - Aapne khel ke liye register nahi kiya hai!", attachment: await this.image('https://i.imgur.com/pgrZG5K.jpeg')}, threadID, messageID);
            }
            return api.sendMessage(`➩ Kripya apna chunav karen.\n1. Game ke coins se paisa badlen!\n2. Game ke coins mein paisa badlen\n3. Spin khariden!`, threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "shop"
                })
            }, messageID);
        }
        case 'me':
        case 'info': {
            if (!existsSync(pathData)) {
                return api.sendMessage({body: "Aapne khel ke Prudhvi ke liye register nahi kiya hai!", attachment: await this.image('https://i.imgur.com/pgrZG5K.jpeg')}, threadID, messageID);
            }
            var a = require(`./game/coinmaster/datauser/${senderID}.json`);
            return api.sendMessage(`[ COINMASTER - JAANKARI ]\n────────────────────\n➩ Aap dweep level ${a.Island.level} par hain\n➩ Baaki spin: ${a.spin}\n➩ Baaki dhaal: ${a.shield}\n- Coins: ${a.coins}\n➩ Dweep ki jaankari:\n • Tower (${a.Island.data.tower}/50)\n • Hariyali (${a.Island.data.tree}/50)\n • Talab (${a.Island.data.pool}/50)\n • Paltu Janwar (${a.Island.data.pet}/50)`, threadID, messageID);
        }
        case 'top': {
            if (!existsSync(pathData)) {
                return api.sendMessage({body: "Aapne khel ke liye register nahi kiya hai!", attachment: await this.image('https://i.imgur.com/pgrZG5K.jpeg')}, threadID, messageID);
            }
            const data = readdirSync(__dirname + `/game/coinmaster/datauser`);
            if(data.length < 3) return api.sendMessage(`[ 🐖 ] - Top dekhne ke liye server par kam se kam 3 khiladi hone chahiye`, threadID, messageID);
            var p = []
            for (let i of data) { 
                var o = require(`./game/coinmaster/datauser/${i}`);
                p.push(o)
            }
            p.sort((a, b) => b.Island.level - a.Island.level);
            var msg = '[ COINMASTER - TOP LEVEL ]\n────────────────────\n'
            for(var i = 0; i < 3; i++) {
                msg += `${i+1}. ${p[i].name} dweep level ${p[i].Island.level} ke saath\n`
            }
            return api.sendMessage(msg, threadID, messageID);
        }
        default: {
            return api.sendMessage({body: `[ COINMASTER KHEL ]\n────────────────────\n➩ coinmaster -dk: Register karen\n➩ coinmaster -s: Khel ka spin\n➩ coinmaster (build/xd): Dweep ka nirman\n➩ coinmaster shop: Paisa-coins badlen, spin khariden\n➩ coinmaster (me/info): Apni jaankari dekhen\n➩ coinmaster top: Server ke top level dekhen\n`, attachment: await this.image('https://i.imgur.com/pgrZG5K.jpeg')}, threadID, messageID);
        }
    }
}

module.exports.handleReply = async ({ event, api, Currencies, handleReply, Users }) => {
    const { body, threadID, messageID, senderID } = event;
    switch (handleReply.type) {
        case 'steal': {
            if(body != 1 && body != 2 && body != 3) return
            api.unsendMessage(handleReply.messageID)
            var dem = handleReply.dem
            var dataUser = require(`./game/coinmaster/datauser/${senderID}`);
            var f = dem.findIndex(i => i.ID == (handleReply.randomIndex[parseInt(body) - 1]).ID)
            dataUser.coins = dataUser.coins + dem[parseInt(body) -1].coins / 2;
            writeFileSync(this.checkPath(1, senderID), JSON.stringify(dataUser, null, 4));
            dem[parseInt(body) -1].coins = dem[parseInt(body) -1].coins / 2;
            writeFileSync(this.checkPath(1, (handleReply.randomIndex[parseInt(body) - 1]).ID), JSON.stringify(dem[parseInt(body) -1], null, 4));
            if(f == 0) return api.sendMessage(`[ 🐖 ] - Badhai ho, aapne sabse zyada coins wale vyakti ko chuna!\n➩ Aapko ${dem[parseInt(body) -1].coins / 2} coins mile`, threadID, messageID);
            return api.sendMessage(`[ 🐖 ] - Aapne ${dem[parseInt(body) -1].name} se chori ki!\n➩ Aapko ${dem[parseInt(body) -1].coins / 2} coins mile`, threadID, messageID);
        }
        case 'attack': {
            api.unsendMessage(handleReply.messageID)
            var u = handleReply.p[parseInt(body) - 1]
            return api.sendMessage(`[ COINMASTER - HAMLA ]\n────────────────────\n➩ Aap dweep ke kis hisse par hamla karna chahte hain!\n1. Tower (${u.Island.data.tower}/50)\n2. Hariyali (${u.Island.data.tree}/50)\n3. Talab (${u.Island.data.pool}/50)\n4. Paltu Janwar (${u.Island.data.pet}/50)\n`, threadID, (error, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "chosseAttack",
                    p: handleReply.p[parseInt(body) - 1]
                })
            }, messageID);
        }
        case 'build': {
            var a = require(`./game/coinmaster/datauser/${senderID}.json`);
            var l = ['tower', 'tree', 'pool', 'pet']
            if(a.coins < a.Island.coinsLV * (a.Island.data[l[parseInt(body) - 1]] + 1)) return api.sendMessage(`🪙 Nirman ke liye aapke paas khel mein kaafi coins nahi hain!`, threadID, messageID);
            a.coins = a.Island.coinsLV * (a.Island.data[l[parseInt(body) - 1]] + 1);
            await Currencies.decreaseMoney(senderID, parseInt(a.Island.coinsLV * (a.Island.data.tower + 1)));
            api.unsendMessage(handleReply.messageID)
            if(body == 1) {
                if(a.Island.data.tower == 50) return api.sendMessage('⚠️ Is kshetra ka level adhiktam hai, isliye nirman nahi kiya ja sakta', threadID, messageID);
                a.Island.data.tower = a.Island.data.tower + 10;
                api.sendMessage(`🚧 Nirman safal: ${a.Island.data.tower}/50`, threadID, messageID);
            }
            if(body == 2) {
                if(a.Island.data.tree == 50) return api.sendMessage('⚠️ Is kshetra ka level adhiktam hai, isliye nirman nahi kiya ja sakta', threadID, messageID);
                a.Island.data.tree = a.Island.data.tree + 10;
                api.sendMessage(`🚧 Nirman safal: ${a.Island.data.tree}/50`, threadID, messageID);
            }
            if(body == 3) {
                if(a.Island.data.pool == 50) return api.sendMessage('⚠️ Is kshetra ka level adhiktam hai, isliye nirman nahi kiya ja sakta', threadID, messageID);
                a.Island.data.pool = a.Island.data.pool + 10;
                api.sendMessage(`🚧 Nirman safal: ${a.Island.data.pool}/50`, threadID, messageID);
            }
            if(body == 4) {
                if(a.Island.data.pet == 50) return api.sendMessage('⚠️ Is kshetra ka level adhiktam hai, isliye nirman nahi kiya ja sakta', threadID, messageID);
                a.Island.data.pet = a.Island.data.pet + 10;
                api.sendMessage(`🚧 Nirman safal: ${a.Island.data.pet}/50`, threadID, messageID);
            }
            if(a.Island.data.tower == 50 && a.Island.data.tree == 50 && a.Island.data.pool == 50 && a.Island.data.pet == 50) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                api.sendMessage(`🚧 Aapke dweep par nirman adhiktam level tak pahunch gaya hai!\n➩ Aapka dweep LV ${(a.Island.level) + 1} tak upgrade kiya jayega`, threadID, messageID);
                a.Island.level = a.Island.level + 1;
                a.Island.coinsLV = a.Island.coinsLV + 100;
                a.Island.data.tower = 0;
                a.Island.data.tree = 0;
                a.Island.data.pool = 0;
                a.Island.data.pet = 0;
            }
            return writeFileSync(this.checkPath(1, senderID), JSON.stringify(a, null, 4));
        }
        case 'chosseAttack': {
            var msg 
            api.unsendMessage(handleReply.messageID)
            var j = ['tower', 'hariyali', 'talab', 'paltu janwar']
            if(handleReply.p.shield != 0) {
                handleReply.p.shield = handleReply.p.shield - 1
                writeFileSync(this.checkPath(1, handleReply.p.ID), JSON.stringify(handleReply.p, null, 4));
                return api.sendMessage('🔰 Hamla dhaal dwara rok diya gaya!', threadID, messageID);
            }
            if(body == 1) {
                if(handleReply.p.Island.data.tower == 0) return api.sendMessage('⚠️ Hamla asafal. Is kshetra ka score shunya hai', threadID, messageID);
                handleReply.p.Island.data.tower = handleReply.p.Island.data.tower - 10
                msg = '🔫 Aapne ' + `${handleReply.p.name} ke dweep par tower par safal hamla kiya!`
            }
            if(body == 2) {
                if(handleReply.p.Island.data.tree == 0) return api.sendMessage('⚠️ Hamla asafal. Is kshetra ka score shunya hai', threadID, messageID);
                handleReply.p.Island.data.tree = handleReply.p.Island.data.tree - 10
                msg = '🔫 Aapne ' + `${handleReply.p.name} ke dweep par hariyali par safal hamla kiya!`
            }
            if(body == 3) {
                if(handleReply.p.Island.data.pool == 0) return api.sendMessage('⚠️ Hamla asafal. Is kshetra ka score shunya hai', threadID, messageID);
                handleReply.p.Island.data.pool = handleReply.p.Island.data.pool - 10
                msg = '🔫 Aapne ' + `${handleReply.p.name} ke dweep par talab par safal hamla kiya!`
            }
            if(body == 4) {
                if(handleReply.p.Island.data.pet == 0) return api.sendMessage('⚠️ Hamla asafal. Is kshetra ka score shunya hai', threadID, messageID);
                handleReply.p.Island.data.pet = handleReply.p.Island.data.pet - 10
                msg = '🔫 Aapne ' + `${handleReply.p.name} ke dweep par paltu janwar par safal hamla kiya!`
            }
            writeFileSync(this.checkPath(1, handleReply.p.ID), JSON.stringify(handleReply.p, null, 4));
            api.sendMessage(`⚠️ Aap par ${(this.checkPath(2, senderID)).name} ne ${j[parseInt(body) - 1]} par hamla kiya!`, handleReply.p.ID);
            return api.sendMessage(msg, threadID, messageID);
        }
        case 'shop': {
            if(body == 1) {
                return api.sendMessage('➩ Kripya is message ka jawab dein aur batayein kitna paisa badalna chahte hain! 0% chhoot', threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "botcoins"
                    })
                }, messageID);
            }
            else if(body == 2) {
                return api.sendMessage('➩ Kripya is message ka jawab dein aur batayein kitna paisa badalna chahte hain! 0% chhoot', threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "coinsbot"
                    })
                }, messageID);
            }
            else if(body == 3) {
                return api.sendMessage('➩ Kripya is message ka jawab dein aur batayein kitne spin kharidna chahte hain! (10 spin 2000$)', threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "spinn"
                    })
                }, messageID);
            }
            else {
                return api.sendMessage('⚠️ Chunav valid nahi hai!', threadID, messageID);
            }
        }
        case 'spinn': {
            await checkMoney(senderID, parseInt(body));
            api.unsendMessage(handleReply.messageID)
            await Currencies.decreaseMoney(senderID, parseInt(body));
            a.spin = a.spin + parseInt(body)
            writeFileSync(this.checkPath(1, senderID), JSON.stringify(a, null, 4));
            return api.sendMessage(`☑️ ${body} spin safalata se kharide gaye (${parseInt(body) * 200}$`, threadID, messageID);
        }
        case 'botcoins': {
            var a = require(`./game/coinmaster/datauser/${senderID}.json`);
            await checkMoney(senderID, parseInt(body));
            api.unsendMessage(handleReply.messageID)
            await Currencies.decreaseMoney(senderID, parseInt(body));
            a.coins = a.coins + parseInt(body)
            writeFileSync(this.checkPath(1, senderID), JSON.stringify(a, null, 4));
            return api.sendMessage(`☑️ ${body} coins khel mein safalata se jama kiye gaye!`, threadID, messageID);
        }
        case 'coinsbot': {
            var a = require(`./game/coinmaster/datauser/${senderID}.json`);
            if(a.coins < parseInt(body)) return api.sendMessage('⚠️ Is vyapaar ke liye aapke paas kaafi paisa nahi hai!', threadID, messageID);
            api.unsendMessage(handleReply.messageID)
            await Currencies.increaseMoney(senderID, parseInt(body));
            a.coins = a.coins - parseInt(body)
            writeFileSync(this.checkPath(1, senderID), JSON.stringify(a, null, 4));
            return api.sendMessage(`☑️ ${body} coins bot account mein safalata se nikaale gaye!`, threadID, messageID);
        }
    }
    async function checkMoney(senderID, maxMoney) {
        var i, w;
        i = (await Currencies.getData(senderID)) || {};
        w = i.money || 0
        if (w < parseInt(maxMoney)) return api.sendMessage('⚠️ Is vyapaar ke liye aapke paas kaafi paisa nahi hai!', threadID, messageID);
    }
}

module.exports.getSpin = function (items, getItem, senderID) {
    const path = this.checkPath(1, senderID)
    var pathData = this.checkPath(2, senderID)
    var i = items.findIndex(index => index == getItem);
    if(i == 0) pathData.coins = parseInt(pathData.coins) + pathData.Island.level * 1000
    if(i == 1) pathData.coins = parseInt(pathData.coins) + pathData.Island.level * 3000
    if(i == 2) pathData.coins = parseInt(pathData.coins) + pathData.Island.level * 5000
    if(i == 4) {
        if(pathData.shield != 3) {
            pathData.spin = parseInt(pathData.spin) + 1
            pathData.shield = parseInt(pathData.shield) + 1;
        }
    }
    if(i == 6) pathData.spin = parseInt(pathData.spin) + 1
    if(i == 7) pathData.spin = parseInt(pathData.spin) + 2
    if(i == 8) pathData.spin = parseInt(pathData.spin) + 5
    writeFileSync(path, JSON.stringify(pathData, null, 4));
    return i
}
