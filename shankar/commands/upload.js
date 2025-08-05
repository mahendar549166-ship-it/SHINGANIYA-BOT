const axios = require('axios').default;

module.exports.config = {
    name: 'upload',
    version: '1.3.0',
    hasPermission: 2,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: 'Photo, video ya music ko filcatbox par upload karein',
    commandCategory: 'Upyogita',
    usages: 'reply',
    cooldowns: 5,
};

module.exports.run = async ({ api, event, Currencies, args }) => {
    try {
        const { type, messageReply, threadID, messageID } = event;
        if (type !== 'message_reply' || messageReply.attachments.length === 0)
            return api.sendMessage(
                'Aapko kisi video, photo ya audio ka reply karna hoga',
                threadID,
                messageID
            );

        const linkUp = args.join(' ') || messageReply.attachments[0]?.url;
        if (!linkUp || linkUp.match(/(http(s?):)([/|.|\w|\s|-])+/g) === null)
            return api.sendMessage(
                'Kripya ek image ka link reply karein ya enter karein',
                event.threadID,
                event.messageID
            );

        const userhash = '91f754bb7a38e06337fbe48d5';

        try {
            const res = await axios.post(
                'https://catbox.moe/user/api.php',
                new URLSearchParams({
                    reqtype: 'urlupload',
                    userhash: userhash,
                    url: linkUp,
                }).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Userhash': userhash,
                    },
                }
            );

            api.sendMessage(
                `=== 『 UPFILE SUCCESS 』 ===\n━━━━━━━━━━━━━━━━\n[🐧] ➜ Aapka file ka link yahan hai:\n${res.data}`,
                threadID,
                messageID
            );
        } catch (error) {
            api.sendMessage(
                `Function execute karne mein error: ${error.message}`,
                threadID,
                messageID
            );
            // Handle error if needed
        }
    } catch (error) {
        api.sendMessage(
            `Function execute karne mein error: ${error.message}`,
            threadID,
            messageID
        );
        // Handle error if needed
    }
};
