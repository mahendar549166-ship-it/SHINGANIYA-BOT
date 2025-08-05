module.exports.config = {
    name: "ve",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Text description se image banayein",
    commandCategory: "Upyogita",
    usages: "gái",
    cooldowns: 10,
    images: [],
};

module.exports.run = async ({ api, event, args }) => {
    const axios = require('axios');
    const FormData = require('form-data');
    const fs = require('fs');
    const path = require('path');
  
    const prompt = args.join(" ");
    if (!prompt) return api.sendMessage('❎ Image banane ke liye aapko ek text description dena hoga!', event.threadID, event.messageID);
  
    const form = new FormData();
    form.append('prompt', prompt);
  
    try {
        const response = await axios.post('https://clipdrop-api.co/text-to-image/v1', form, {
            headers: {
                'x-api-key': 'a66f0040beeb602195366759ea5e222188a3b2b26a675d8d8cba8016a0d8df8d51b6ab3d91f61d25d01a385a70b13f90',
                ...form.getHeaders(),
            },
            responseType: 'arraybuffer',
        });
  
        if (response.status === 200) {
            const imageBuffer = Buffer.from(response.data, 'binary');
            const filePath = path.join(__dirname, 'cache', 'texttoimg.jpg');
            fs.writeFileSync(filePath, imageBuffer);
            api.sendMessage({ body: '', attachment: fs.createReadStream(filePath) }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
        } else {
            api.sendMessage('❎ Bahari API se error', event.threadID, event.messageID);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage('❎ Internal server error', event.threadID, event.messageID);
    }
};
