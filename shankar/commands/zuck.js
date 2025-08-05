module.exports.config = {
    name: "zuck",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Tippani board par ( ͡° ͜ʖ ͡°)",
    commandCategory: "Chitra-Sampadan",
    usages: "zuck [matn]",
    cooldowns: 10,
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": ""
    }
};

module.exports.wrapText = (ctx, text, maxWidth) => {
    return new Promise(resolve => {
        if (ctx.measureText(text).width < maxWidth) return resolve([text]);
        if (ctx.measureText('W').width > maxWidth) return resolve(null);
        const shabd = text.split(' ');
        const panktiyan = [];
        let pankti = '';
        while (shabd.length > 0) {
            let vibhajan = false;
            while (ctx.measureText(shabd[0]).width >= maxWidth) {
                const temp = shabd[0];
                shabd[0] = temp.slice(0, -1);
                if (vibhajan) shabd[1] = `${temp.slice(-1)}${shabd[1]}`;
                else {
                    vibhajan = true;
                    shabd.splice(1, 0, temp.slice(-1));
                }
            }
            if (ctx.measureText(`${pankti}${shabd[0]}`).width < maxWidth) pankti += `${shabd.shift()} `;
            else {
                panktiyan.push(pankti.trim());
                pankti = '';
            }
            if (shabd.length === 0) panktiyan.push(pankti.trim());
        }
        return resolve(panktiyan);
    });
}

module.exports.run = async function({ api, event, args }) {
    let { senderID, threadID, messageID } = event;
    const { loadImage, createCanvas } = require("canvas");
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    let pathImg = __dirname + '/cache/trump.png';
    var matn = args.join(" ");
    if (!matn) return api.sendMessage("Board par tippani ke liye matn daal", threadID, messageID);
    let getPorn = (await axios.get(`https://i.postimg.cc/gJCXgKv4/zucc.jpg`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(pathImg, Buffer.from(getPorn, 'utf-8'));
    let baseImage = await loadImage(pathImg);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.font = "400 18px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "start";
    let fontSize = 50;
    while (ctx.measureText(matn).width > 1200) {
        fontSize--;
        ctx.font = `400 ${fontSize}px Arial`;
    }
    const panktiyan = await this.wrapText(ctx, matn, 470);
    ctx.fillText(panktiyan.join('\n'), 15, 75); //tippani
    ctx.beginPath();
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);
}
