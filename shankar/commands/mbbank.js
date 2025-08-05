module.exports.config = {
    name: "mbbank",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "MBBank ka fake bill banayein",
    commandCategory: "Tool",
    usages: "",
    cooldowns: 5,
    images: [],
};

module.exports.handleReply = async ({ api, event, handleReply, Users }) => {
    const { threadID, messageID, senderID, body } = event;
    if (handleReply.content.id != senderID) return;
    const input = body.trim();
    const sendC = (msg, step, content) => api.sendMessage(msg, threadID, (err, info) => {
        global.client.handleReply.splice(global.client.handleReply.indexOf(handleReply), 1);
        api.unsendMessage(handleReply.messageID);
        global.client.handleReply.push({
            step: step,
            name: this.config.name,
            messageID: info.messageID,
            content: content
        });
    }, messageID);
    const send = async (msg) => api.sendMessage(msg, threadID, messageID);

    let content = handleReply.content;
    switch (handleReply.step) {
        case 1:
            content.namegui = input;
            sendC("Is message ko reply karke apna STK (account number) daalein!", 2, content);
            break;
        case 2:
            content.stk_gui = input;
            sendC("Is message ko reply karke naam (receiver ka, capital letters mein) daalein!", 3, content);
            break;
        case 3:
            content.namenhan = input;
            sendC("Is message ko reply karke transfer ki rashi daalein!", 4, content);
            break;
        case 4:
            content.amount = input;
            sendC("Is message ko reply karke receiver ka STK daalein!", 5, content);
            break;
        case 5:
            content.stk = input;
            sendC("Is message ko reply karke transfer ka content daalein!", 6, content);
            break;
        case 6:
            content.noidung = input;
            const axios = require("axios");
            const fs = require("fs");
            send("Bill banaya ja raha hai!");
            global.client.handleReply.splice(global.client.handleReply.indexOf(handleReply), 1);
            api.unsendMessage(handleReply.messageID);
            let c = content;
            let magiaodich = TransactionCode();
            let moment = require('moment-timezone');
            let time = moment.tz("Asia/Kolkata").format("HH:mm:ss, DD/MM/YYYY");
            let timehientai = moment.tz("Asia/Kolkata").format("HH:mm");
            let res = await axios.get(encodeURI(`https://sumiproject.io.vn/fakebill?forbank=mbbank&name_gui=${c.namegui}&stk_gui=${c.stk_gui}&bank=Quân Đội (MB)&code1=Quân Đội (MB)&code=MB&stk=${c.stk}&name_nhan=${c.namenhan}&amount=${c.amount}&noidung=${c.noidung}&magiaodich=${magiaodich}&time1=${time}&hinhthucck=Trong MB&thoigianhientai=${timehientai}&apikey=apikeysumi`), { responseType: "arraybuffer" })
                .catch(e => { return send("Koi error aa gaya, kripya admin se fix karne ke liye kahein!") });
            if (res.status != 200) return send("Koi error aa gaya, kripya baad mein koshish karein!");
            let path = __dirname + `/cache/fakebillmbbank__${Date.now()}.png`;
            fs.writeFileSync(path, Buffer.from(res.data, "utf-8"));
            send({
                body: '',
                attachment: fs.createReadStream(path)
            }).then(fs.unlinkSync(path));
            break;
        default:
            break;
    }
};

module.exports.run = ({ api, event, args }) => {
    const { threadID, messageID, senderID } = event;
    return api.sendMessage("Is message ko reply karke apna naam (capital letters mein) daalein!", event.threadID, (err, info) => {
        global.client.handleReply.push({
            step: 1,
            name: this.config.name,
            messageID: info.messageID,
            content: {
                id: senderID,
                namegui: "",
                stk_gui: "",
                namenhan: "",
                amount: "",
                stk: "",
                noidung: ""
            }
        });
    }, event.messageID);
};

function TransactionCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const length = 12;
    let transactionCode = '';
    for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        transactionCode += characters.charAt(randomIndex);
    }
    for (let i = 0; i < length - 2; i++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        transactionCode += numbers.charAt(randomIndex);
    }
    return transactionCode;
}
