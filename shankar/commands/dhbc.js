const coinsup = 10000 // Sahi jawab dene par milne wale coins
const coinsdown = 3000 // Goyee mangne par khone wale coins
const timeUnsend = 1 // Sahi jawab ke baad message hataane ka samay (seconds mein)
const axios = global.nodemodule["axios"];
module.exports.config = {
    name: "dhbc",
    version: "1.2.0",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Apne messenger par hi đuổi hình bắt chữ khelen!!!",
    commandCategory: "khel",
    usages: "[1/2]",
    cooldowns: 10
};

// JAWAB KA HANDLING
module.exports.handleReply = async function ({
    args,
    event,
    Users,
    api,
    handleReply,
    Currencies
}) {
    var {
        tukhoa,
        suggestions
    } = handleReply;
    switch (handleReply.type) {
    case "choosee": {
        switch (event.body) {
        case "2": {
            api.unsendMessage(handleReply.messageID);
            const res = await axios.get(`https://raw.githubusercontent.com/TuanDeepTry-14072003/API/mainV2/data.json`);
            const length1 = res.data.doanhinh.length
            const dataGame = res.data.doanhinh[Math.floor(Math.random() * length1)]
            const tukhoadung = dataGame.tukhoa;
            const suggestions = dataGame.suggestions
            const fs = global.nodemodule["fs-extra"];
            const sokitu = dataGame.sokitu;
            const anh1 = dataGame.link1
            const anh2 = dataGame.link2


            let Avatar = (await axios.get(anh1, {
                responseType: "arraybuffer"
            })).data;
            fs.writeFileSync(__dirname + "/cache/anh1.png", Buffer.from(Avatar, "utf-8"));
            let Avatar2 = (await axios.get(anh2, {
                responseType: "arraybuffer"
            })).data;
            fs.writeFileSync(__dirname + "/cache/anh2.png", Buffer.from(Avatar2, "utf-8"));
            var imglove = [];
            imglove.push(fs.createReadStream(__dirname + "/cache/anh1.png"));
            imglove.push(fs.createReadStream(__dirname + "/cache/anh2.png"));

            var msg = {
                body: `🌸 Is message ka jawab dein aur shabd anuman karen:\nGoyee: ${sokitu}\n\n🌸 Is message ka jawab dein aur "Goyee" likhen - agar aap goyee 2 dekhna chahte hain (-${coinsdown}$)`,
                attachment: imglove
            }
            return api.sendMessage(msg, event.threadID, (error, info) => {
                global.client.handleReply.push({
                    type: "reply",
                    name: this.config.name,
                    author: event.senderID,
                    messageID: info.messageID,
                    tukhoa: tukhoadung,
                    suggestions: suggestions
                })
            })
        }
        case "1": {
            api.unsendMessage(handleReply.messageID);
            const res = await axios.get(`https://raw.githubusercontent.com/TuanDeepTry-14072003/API/mainV2/data2.json`);
            const length2 = res.data.doanhinh.length
            const dataGame = res.data.doanhinh[Math.floor(Math.random() * length2)]
            const tukhoadung = dataGame.tukhoa;
            const suggestions = dataGame.suggestions
            const fs = global.nodemodule["fs-extra"];
            const sokitu = dataGame.sokitu;
            const anh1 = dataGame.link


            let Avatar = (await axios.get(anh1, {
                responseType: "arraybuffer"
            })).data;
            fs.writeFileSync(__dirname + "/cache/anh1.png", Buffer.from(Avatar, "utf-8"));
            var imglove = [];
            imglove.push(fs.createReadStream(__dirname + "/cache/anh1.png"));

            var msg = {
                body: `🌸 Is message ka jawab dein aur shabd anuman karen:\nGoyee: ${sokitu}\n\n🌸 Is message ka jawab dein aur "Goyee" likhen - agar aap goyee 2 dekhna chahte hain (-${coinsdown}$)`,
                attachment: imglove
            }
            return api.sendMessage(msg, event.threadID, (error, info) => {
                global.client.handleReply.push({
                    type: "reply2",
                    name: this.config.name,
                    author: event.senderID,
                    messageID: info.messageID,
                    tukhoa: tukhoadung,
                    suggestions: suggestions
                })
            })
        }
        }
        const choose = parseInt(event.body);
        if (isNaN(event.body)) return api.sendMessage("🌸 Kripya ek sankhya (1 ya 2) chunen", event.threadID, event.messageID);
        if (choose > 2 || choose < 1) return api.sendMessage("🌸 Aapka chayan soochi mein nahi hai.", event.threadID, event.messageID)
    }


    case "reply": {
        const dapan = event.body
        if (dapan.toLowerCase() == "goyee" ) { 
            let balance = (await Currencies.getData(event.senderID)).money;
            if (coinsdown > balance) return api.sendMessage(`🌸 Aapke paas paryapt balance nahi hai, goyee ke liye ${coinsdown}$ chahiye`, event.threadID, event.messageID);
            await Currencies.decreaseMoney(event.senderID, parseInt(coinsdown))
            api.sendMessage(`🌸 Aapke liye goyee: \n${suggestions} (-${coinsdown}$)`, event.threadID, event.messageID) 
        }
        else { 
        if (dapan.toLowerCase() == tukhoa) {
            await Currencies.increaseMoney(event.senderID, parseInt(coinsup))
            var name1 = await Users.getData(event.senderID)
            setTimeout(function () {
                api.unsendMessage(handleReply.messageID);
            }, timeUnsend*1000);
            return api.sendMessage(`🌸 ${name1.name} ne sahi jawab diya!\n🌸 Parinam: ${tukhoa} (+${coinsup}$)`, event.threadID, event.messageID)
        } else
            return api.sendMessage(`🌸 Galat jawab!`, event.threadID, event.messageID)
    }
} ; break;
    case "reply2": {
        const dapan1 = event.body
        if (dapan1.toLowerCase() == "goyee") { 
            let balance = (await Currencies.getData(event.senderID)).money;
            if (coinsdown > balance) return api.sendMessage(`🌸 Aapke paas paryapt balance nahi hai, goyee ke liye ${coinsdown}$ chahiye`, event.threadID, event.messageID);
            await Currencies.decreaseMoney(event.senderID, parseInt(coinsdown))
            api.sendMessage(`🌸 Aapke liye goyee: \n${suggestions} (-${coinsdown}$)`, event.threadID, event.messageID) 
        }
            else {

        if (dapan1.toLowerCase() == tukhoa) {
            await Currencies.increaseMoney(event.senderID, parseInt(coinsup))
            var name1 = await Users.getData(event.senderID)
            setTimeout(function () {
                api.unsendMessage(handleReply.messageID);
            }, timeUnsend*1000);
            return api.sendMessage(`🌸 ${name1.name} ne sahi jawab diya!\n🌸 Parinam: ${tukhoa} (+${coinsup}$)`, event.threadID, event.messageID)
        } else
            return api.sendMessage(`🌸 Galat jawab!`, event.threadID, event.messageID)
}
}
default: break;

}
}

// KHEL KO SHURU KARNE WALA FUNCTION
module.exports.run = async function ({
    args,
    api,
    event,
    Users
}) {
    if ((this.config.credits) != "D-Jukie") { return api.sendMessage(`⚡️Credits mein badlav ka pata chala hai`, event.threadID, event.messageID)}
    if (!args[0]) {
    return api.sendMessage(`💮===== [ 𝗗𝗛𝗕𝗖 ] =====💮\n━━━━━━━━━━━━━\n\n🌸 Khel ka prakar chunen:\n\n𝟭: Ek tasveer\n𝟮: Do tasveeren\n\n🌸 Is message ka jawab dein aur chunen`, event.threadID, (error, info) => {

            global.client.handleReply.push({
                type: "choosee",
                name: this.config.name,
                author: event.senderID,
                messageID: info.messageID
            })
        })
    }
    if (args[0] == '1') {
    //api.unsendMessage(handleReply.messageID);
            const res = await axios.get(`https://raw.githubusercontent.com/TuanDeepTry-14072003/API/mainV2/data2.json`);
            const length2 = res.data.doanhinh.length
            const dataGame = res.data.doanhinh[Math.floor(Math.random() * length2)]
            const tukhoadung = dataGame.tukhoa;
            const suggestions = dataGame.suggestions
            const fs = global.nodemodule["fs-extra"];
            const sokitu = dataGame.sokitu;
            const anh1 = dataGame.link


            let Avatar = (await axios.get(anh1, {
                responseType: "arraybuffer"
            })).data;
            fs.writeFileSync(__dirname + "/cache/anh1.png", Buffer.from(Avatar, "utf-8"));
            var imglove = [];
            imglove.push(fs.createReadStream(__dirname + "/cache/anh1.png"));

            var msg = {
                body: `🌸 Is message ka jawab dein aur shabd anuman karen:\nGoyee: ${sokitu}\n\n🌸 Is message ka jawab dein aur "Goyee" likhen - agar aap goyee 2 dekhna chahte hain (-${coinsdown}$)`,
                attachment: imglove
            }
            return api.sendMessage(msg, event.threadID, (error, info) => {
                global.client.handleReply.push({
                    type: "reply2",
                    name: this.config.name,
                    author: event.senderID,
                    messageID: info.messageID,
                    tukhoa: tukhoadung,
                    suggestions: suggestions
                })
            })    
    }
    if (args[0] == '2') {
    //api.unsendMessage(handleReply.messageID);
            const res = await axios.get(`https://raw.githubusercontent.com/TuanDeepTry-14072003/API/mainV2/data2.json`);
            const length1 = res.data.doanhinh.length
            const dataGame = res.data.doanhinh[Math.floor(Math.random() * length1)]
            const tukhoadung = dataGame.tukhoa;
            const suggestions = dataGame.suggestions
            const fs = global.nodemodule["fs-extra"];
            const sokitu = dataGame.sokitu;
            const anh1 = dataGame.link1
            const anh2 = dataGame.link2


            let Avatar = (await axios.get(anh1, {
                responseType: "arraybuffer"
            })).data;
            fs.writeFileSync(__dirname + "/cache/anh1.png", Buffer.from(Avatar, "utf-8"));
            let Avatar2 = (await axios.get(anh2, {
                responseType: "arraybuffer"
            })).data;
            fs.writeFileSync(__dirname + "/cache/anh2.png", Buffer.from(Avatar2, "utf-8"));
            var imglove = [];
            imglove.push(fs.createReadStream(__dirname + "/cache/anh1.png"));
            imglove.push(fs.createReadStream(__dirname + "/cache/anh2.png"));

            var msg = {
                body: `🌸 Is message ka jawab dein aur shabd anuman karen:\nGoyee: ${sokitu}\n\n🌸 Is message ka jawab dein aur "Goyee" likhen - agar aap goyee 2 dekhna chahte hain (-${coinsdown}$)`,
                attachment: imglove
            }
            return api.sendMessage(msg, event.threadID, (error, info) => {
                global.client.handleReply.push({
                    type: "reply",
                    name: this.config.name,
                    author: event.senderID,
                    messageID: info.messageID,
                    tukhoa: tukhoadung,
                    suggestions: suggestions
                })
            })    
    }
}
