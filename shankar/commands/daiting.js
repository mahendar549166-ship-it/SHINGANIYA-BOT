module.exports.config = {
    name: "dating",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Ek vyakti dhoondhen aur dekhen kya aapko unke saath dating karni chahiye?",
    commandCategory: "Khel",
    usages: "[info/breakup]",
    cooldowns: 5
};

function msgBreakup() {
    var msg = [
        'Kya sach mein dono log saath nahi reh sakte?', 
        'Kya aise hi ek doosre ka haath chhod denge?', 
        'Dard nahi hota? Hota hai na? To phir kyun chhodna chahte ho?', 
        'Kisi wajah se... kya dono log koshish kar sakte hain? ^^', 
        'Pyaar tab hota hai jab do log ek doosre ka khayal rakhte hain, dekhbhal karte hain. Ab dono ne samajh liya hai ki kya hua, kya aap dono wapas ek saath aa sakte hain?', 
        'Gussa isliye hota hai na ki ek doosre se pyaar aur badhe, dono milke sulah kar lo kyunki gusse mein hi pata chalta hai ki doosra vyakti bina nahi reh sakta'
    ];
    return msg[Math.floor(Math.random() * msg.length)];
}

function getMsg() {
    return `Sab log milkar in dono ke liye khushiyaan manaayein 🥰\n\nDhyan Dein:\n- Dono log agle 7 din tak alag nahi ho sakte jab se pyaar shuru hua\n- Ant mein, dono ko dher saari khushiyaan mubarak jab wo saath hain, bot ka istemaal aur vishwas karne ke liye shukriya\n- Sign: Phung Tuan Hai ❤️`
}

module.exports.handleReaction = async function({ api, event, Threads, Users, Currencies, handleReaction }) {
    var { threadID, userID, reaction, messageID } = event;
    var { turn } = handleReaction;
    switch (turn) {
        case "match":
            api.unsendMessage(handleReaction.messageID);
            var { senderID, coin, senderInfo, type } = handleReaction;
            if (senderID != userID) return;
            await Currencies.setData(senderID, { money: coin - 2000 });
            var data = await Threads.getInfo(threadID);
            var { userInfo } = data;
            var doituong = [];
            for (var i of userInfo) {
                var uif = await Users.getInfo(i.id);
                var gender = '';
                if (uif.gender == 1) gender = "Nari";
                if (uif.gender == 2) gender = "Purush"; 
                if (uif.dating && uif.dating.status == true) continue;
                if (gender == type) doituong.push({ ID: i.id, name: uif.name });
            }
            if (doituong.length == 0) return api.sendMessage(`Bahut afsos, aapko jo vyakti chahiye wo nahi mila ya wo kisi aur ke saath dating kar raha hai ^^`, threadID);
            var random = doituong[Math.floor(Math.random() * doituong.length)];
            var msg = {
                body: `[💏] ${senderInfo.name} - System ne aapke liye chuna hai: ${random.name}\n[💌] Sambhavna: ${Math.floor(Math.random() * (80 - 30) + 30)}%\n\nAgar dono log dating ke liye razi hain, to is message par dil ka emoji [❤] daalein aur aadhikarik roop se ek doosre ke saath dating shuru karen `,
                mentions: [ { tag: random.name, id: random.ID }, { tag: senderInfo.name, id: senderID } ]
            }
            return api.sendMessage(msg, threadID, (error, info) => {
                global.client.handleReaction.push({ name: this.config.name, messageID: info.messageID, turn: "accept", user_1: { ID: senderID, name: senderInfo.name, accept: false }, user_2: { ID: random.ID, name: random.name, accept: false } });
            });
        case "accept":
            var { user_1, user_2 } = handleReaction;
            if (reaction != '❤') return;
            if (userID == user_1.ID) user_1.accept = true;
            if (userID == user_2.ID) user_2.accept = true;
            if (user_1.accept == true && user_2.accept == true) {
                api.unsendMessage(handleReaction.messageID);
                var infoUser_1 = await Users.getData(user_1.ID);
                var infoUser_2 = await Users.getData(user_2.ID);
                infoUser_1.data.dating = { status: true, mates: user_2.ID, time: { origin: Date.now(), fullTime: global.client.getTime('fullTime') } };
                infoUser_2.data.dating = { status: true, mates: user_1.ID, time: { origin: Date.now(), fullTime: global.client.getTime('fullTime') } };
                return api.sendMessage(`Dono logon ne dil ka emoji daala, matlab dono dating ke liye razi hain 💓`, threadID, async (error, info) => {
                    await Users.setData(user_1.ID, infoUser_1);
                    await Users.setData(user_2.ID, infoUser_2);
                    api.changeNickname(`${user_2.name} - Dating with ${user_1.name}`, threadID, user_2.ID);
                    api.changeNickname(`${user_1.name} - Dating with ${user_2.name}`, threadID, user_1.ID);
                    api.sendMessage(getMsg(), threadID);
                });
            }
            break;
        case 'breakup':
            var { userInfo, userMates, user_1, user_2 } = handleReaction;
            if (userID == user_1.ID) user_1.accept = true;
            if (userID == user_2.ID) user_2.accept = true;
            if (user_1.accept == true && user_2.accept == true) {
                api.unsendMessage(handleReaction.messageID);
                userInfo.data.dating.status = false;
                userMates.data.dating.status = false;
                return api.sendMessage(`Saath mein toofan ke waqt rahe, lekin barish rukne par ek doosre ke nahi reh sake 🙁\nHausla rakhein, kabhi milna aur bichhadna hi insaan ko aur majboot banata hai`, threadID, async () => {
                    await Users.setData(user_1.ID, userInfo);
                    await Users.setData(user_2.ID, userMates);
                    api.changeNickname("", threadID, user_1.ID);
                    api.changeNickname("", threadID, user_2.ID);
                    // Jab breakup hota hai, dono ke nickname hataaye jaate hain //
                })
            }
            break;
        default:
            break;
    }
}

module.exports.run = async function({ api, event, args, Users, Currencies }) {
    var { threadID, messageID, senderID } = event;
    var senderInfo = await Users.getData(senderID);
    var type = '';
    switch (args[0]) {
        case "Nam":
        case "nam":
        case "trai":
            if (senderInfo.data.dating && senderInfo.data.dating.status == true) return api.sendMessage(`Kya kisi aur ko dhoka dena chahte ho? Ek zimmedar insaan bano. Aap pehle se hi dating ke status mein hain aur phir bhi doosre vyakti ke saath dating karna chahte hain 😈`, threadID, messageID);
            type = "Purush";
            break;
        case "Nữ":
        case "nữ":
        case "nu":
        case "Nu":
        case "gái":
        case "gai":
            if (senderInfo.data.dating && senderInfo.data.dating.status == true) return api.sendMessage(`Kya kisi aur ko dhoka dena chahte ho? Ek zimmedar insaan bano. Aap pehle se hi dating ke status mein hain aur phir bhi doosre vyakti ke saath dating karna chahte hain 😈`, threadID, messageID);
            type = "Nari";
            break;
        case "breakup":
        case "chiatay":
        case "ct":
            var userInfo = await Users.getData(senderID);
            if (!userInfo.data.dating || userInfo.data.dating.status == false) return api.sendMessage(`Aap kisi ke saath dating mein nahi hain, to breakup kya karenge?`, threadID, messageID);
            if (Date.now() - userInfo.data.dating.time.origin < 604800000) return api.sendMessage(`Abhi 7 din bhi nahi hue aur breakup karna chahte ho? 🥺\n\n${msgBreakup()}\n\nShant rahein, sab kuch dheere-dheere settle ho jaye, saath milkar samasya suljhaayein kyunki pyaar aisa nahi milta sabko jo ek doosre ko pa sake ^^`, threadID, messageID);
            var userMates = await Users.getData(userInfo.data.dating.mates);
            return api.sendMessage(`Kya dono sach mein aur saath nahi reh sakte?\nBot thodi si dakhalandaazi karta hai:\n\n${msgBreakup()}\n\nYadi yeh message dekha, to thodi shanti se sochen...thodi der shant ho jayein, acche se vichar karen...\nKuch cheezein...ek baar kho jayein to wapas nahi milti. ^^\n\nAur yadi...phir bhi saath nahi reh sakte...to dono is message par emoji daalein !`, threadID, (error, info) => {
                global.client.handleReaction.push({ name: this.config.name, messageID: info.messageID, userInfo: userInfo, userMates: userMates, turn: 'breakup', user_1: { ID: senderID, accept: false }, user_2: { ID: userInfo.data.dating.mates, accept: false } })
            }, messageID);
        case "info":
        case "-i":
            var userInfo = await Users.getData(senderID);
            if (!userInfo.data.dating || userInfo.data.dating.status == false) return api.sendMessage(`Aap single hain, info kya check karenge?`, threadID, messageID);
            var infoMates = await Users.getData(userInfo.data.dating.mates);
            var fullTime = userInfo.data.dating.time.fullTime;
            fullTime = fullTime.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/);
            fullTime = fullTime[0].replace(/\//g, " ").split(' ');
            var date = fullTime[0], month = fullTime[1] - 1, year = fullTime[2];
            var dateNow = global.client.getTime('date'), monthNow = global.client.getTime('month') - 1, yearNow = global.client.getTime('year');
            var date1 = new Date(year, month, date);
            var date2 = new Date(yearNow, monthNow, dateNow);
            var msg = `💓==『 Ek Saath 』==💓\n\n` +
                `» ❤️ Aapka naam: ${userInfo.name}\n` +
                `» 🤍 Partner ka naam: ${infoMates.name}\n` +
                `» 💌 Dating shuru hui: \n${userInfo.data.dating.time.fullTime}\n` +
                `» 📆 Pyaar ke din: ${parseInt((date2 - date1) / 86400000)} din\n`;
            return api.sendMessage({ body: msg, attachment: await this.canvas(senderID, userInfo.data.dating.mates)}, threadID, messageID);
        default:
            return api.sendMessage(`Aapko us vyakti ka ling batana hoga jiske saath aap dating karna chahte hain [Purush/Nari]`, threadID, messageID);
    }

    var { money } = await Currencies.getData(senderID);
    if (money < 2000) return api.sendMessage(`Ek dating ke liye aapko 2000 INR chahiye 💸`, threadID, messageID);
    return api.sendMessage(`Aapke account se 2000 INR kaat liye jayenge matchmaking ke liye\nYeh paisa wapas nahi hoga agar dono mein se koi ek dating ke liye razi na hua 🖤\n\nAgar aap matchmaking ke liye razi hain, to is message par emoji daalein.`, threadID, (error, info) => {
        global.client.handleReaction.push({ name: this.config.name, messageID: info.messageID, senderID: senderID, senderInfo: senderInfo, type: type, coin: money, turn: 'match' })
    }, messageID);
}

module.exports.circle = async (image) => {
    const jimp = require('jimp');
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}

module.exports.canvas = async function (idOne, idTwo) {
    const fs = require('fs');
    const axios = require('axios');
    const { loadImage, createCanvas } = require("canvas");
    let path = __dirname + "/cache/ghep.png";
    let pathAvata = __dirname + `/cache/avtghep2.png`;
    let pathAvataa = __dirname + `/cache/avtghep.png`;
    let getAvatarOne = (await axios.get(`https://graph.facebook.com/${idOne}/picture?height=250&width=250&access_token=1073911769817594|aa417da57f9e260d1ac1ec4530b417de`, { responseType: 'arraybuffer' })).data;
    let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${idTwo}/picture?height=250&width=250&access_token=1073911769817594|aa417da57f9e260d1ac1ec4530b417de`, { responseType: 'arraybuffer' })).data;
    let bg = (await axios.get(`https://i.imgur.com/dfuCwFS.jpg`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
    fs.writeFileSync(pathAvataa, Buffer.from(getAvatarTwo, 'utf-8'));
    fs.writeFileSync(path, Buffer.from(bg, "utf-8"));
    avataruser = await this.circle(pathAvata);
    avataruser2 = await this.circle(pathAvataa);
    let imgB = await loadImage(path);
    let baseAvata = await loadImage(avataruser);
    let baseAvataa = await loadImage(avataruser2);
    let canvas = createCanvas(imgB.width, imgB.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(imgB, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseAvata, 82, 95, 129, 129);
    ctx.drawImage(baseAvataa, 443, 95, 129, 129);
    ctx.beginPath();
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(path, imageBuffer);
    return fs.createReadStream(path);
};
