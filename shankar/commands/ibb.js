const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const FormData = require('form-data');

module.exports.config = {
    name: 'imgbb',
    version: '2.0.0',
    hasPermssion: 0,
    credits: 'Shankar',
    description: 'Upload image/GIF/video to IMGBB',
    usePrefix: false,
    commandCategory: 'Tools',
    usages: 'Reply to an image, gif or short video',
    cooldowns: 2,
};

module.exports.run = async function({ api, event }) {
    try {
        if (event.type !== "message_reply") {
            return api.sendMessage("⚠️ | Reply to an image, gif or short video!", event.threadID, event.messageID);
        }

        const attachment = event.messageReply.attachments?.[0];
        if (!attachment) {
            return api.sendMessage("❌ | No attachment found in replied message.", event.threadID, event.messageID);
        }

        const supportedTypes = ['photo', 'animated_image', 'video'];
        if (!supportedTypes.includes(attachment.type)) {
            return api.sendMessage("❌ | Only image, GIF or video supported.", event.threadID, event.messageID);
        }

        const fileUrl = attachment.url;
        const ext = attachment.type === 'photo' ? 'png' :
                    attachment.type === 'animated_image' ? 'gif' :
                    attachment.type === 'video' ? 'mp4' : 'bin';

        const fileName = `upload_file.${ext}`;
        const filePath = path.join(__dirname, 'cache', fileName);

        const fileData = await axios.get(fileUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(filePath, fileData.data);

        const form = new FormData();
        form.append('image', fs.createReadStream(filePath));
        form.append('key', 'dae214c4ddd291514cae941e32ef8b71');

        const upload = await axios.post('https://api.imgbb.com/1/upload', form, {
            headers: form.getHeaders()
        });

        fs.unlinkSync(filePath);

        if (upload.data.success) {
            const uploadedUrl = upload.data.data.url;
            return api.sendMessage(`✅ Upload successful:\n${uploadedUrl}`, event.threadID, event.messageID);
        } else {
            return api.sendMessage("❌ Upload failed. Try again.", event.threadID, event.messageID);
        }

    } catch (err) {
        console.error("Upload Error:", err.message);
        return api.sendMessage("❌ Error occurred during upload. GIFs or videos may be unsupported or too large.", event.threadID, event.messageID);
    }
};
