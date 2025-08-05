module.exports.config = {
    name: "coverfb",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Facebook ke seva shaili mein card coverfb banayein",
    commandCategory: "Edit-img",
    usages: "",
    cooldowns: 5
};

module.exports.handleReply = async ({ api, event, handleReply }) => {
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
        })
    }, messageID);
    const send = async (msg) => api.sendMessage(msg, threadID, messageID);

    let content = handleReply.content;
    switch (handleReply.step) {
        case 1:
            content.name = input;
            sendC("Is message ka jawab dein aur apna madhya naam daalein!", 2, content);
            break;
        case 2:
            content.subname = input;
            sendC("Is message ka jawab dein aur apna mobile number daalein!", 3, content);
            break;
        case 3:
            content.number = input;
            sendC("Is message ka jawab dein aur apna email daalein!", 4, content);
            break;
        case 4:
            content.email = input;
            sendC("Is message ka jawab dein aur apna pata daalein!", 5, content);
            break;
        case 5:
            content.address = input;
            sendC("Is message ka jawab dein aur apna pasandida rang English mein chunein\n('no' daalein agar rang nahi chunna chahte)!", 6, content);
            break;
        case 6:
            content.color = input;
            const axios = require("axios");
            const fs = require("fs");
            send("Jaankari prapt ho gayi hai, kripya thodi der pratiksha karein!");
            global.client.handleReply.splice(global.client.handleReply.indexOf(handleReply), 1);
            api.unsendMessage(handleReply.messageID);
            let c = content;
            let res = await axios.get(encodeURI(`https://docs-api.nguyenhaidang.ml/fbcover/v1?name=${c.name}&color=${c.color}&address=${c.address}&email=${c.email}&subname=${c.subname}&sdt=${c.number}&uid=${c.id}`), { responseType: "arraybuffer" })
                .catch(e => { return send("Koi error hua hai, kripya admin se sampark karein!") });
            if (res.status != 200) return send("Koi error hua hai, kripya baad mein koshish karein!");
            let path = __dirname + `/cache/fbcoverv1__${senderID}.png`;
            fs.writeFileSync(path, Buffer.from(res.data, "utf-8"));
            send({
                body: '',
                attachment: fs.createReadStream(path)
            }).then(fs.unlinkSync(path));
            break;
        default:
            break;
    }
}

module.exports.run = ({ api, event, args }) => {
    const { threadID, messageID, senderID } = event;
    return api.sendMessage("Is message ka jawab dein aur apna mukhya naam daalein!", event.threadID, (err, info) => {
        global.client.handleReply.push({
            step: 1,
            name: this.config.name,
            messageID: info.messageID,
            content: {
                id: senderID,
                name: "",
                subname: "",
                number: "",
                email: "",
                address: "",
                color: ""
            }
        })
        console.log(global.client.handleReply)
    }, event.messageID);
}
