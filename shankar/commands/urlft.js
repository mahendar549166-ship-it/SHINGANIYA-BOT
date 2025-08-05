const axios = require('axios');
module.exports.config = {
    name: 'urlft',
    version: '1.0.0',
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    hasPermission: 3,
    description: 'Die hue image links ko filter karein (imgur links ke liye nahi hai)',
    commandCategory: 'Admin',
    usages: 'url filter 404 <newUrl>',
    cooldowns: 10
};
module.exports.run = async ({ api, event, args }) => {
    const { threadID, messageID } = event;
    if (!args.length) {
        return api.sendMessage({ body: 'Kripya raw link ya URLs wala link daalein jo filter karna hai' }, threadID, messageID);
    }
    try {
        const apiUrl = args[0];
        const response = await axios.get(apiUrl);
        const allLinks = response.data;
        const validLinks = await Promise.all(allLinks.map(async (link) => {
            try {
                const linkResponse = await axios.head(link);
                if (linkResponse.status === 200) {
                    return link;
                }
            } catch (error) {
            }
            return null;
        }));

        const filteredLinks = validLinks.filter((link) => link !== null);
        const validLinksArray = filteredLinks.map(link => link.trim());
        const validLinksJson = JSON.stringify(validLinksArray, null, 2);

        const mockyResponse = await axios.post(`https://api.mocky.io/api/mock`, {
            "status": 200,
            "content": validLinksJson,
            "content_type": "application/json",
            "charset": "UTF-8",
            "secret": "DongDev",
            "expiration": "never"
        });
        const mockyLink = mockyResponse.data.link;
        api.sendMessage(`Filter kiye gaye links: ${mockyLink}`, threadID, messageID);
    } catch (error) {
        api.sendMessage(`Error ho gaya: ${error.message}`, threadID, messageID);
        console.error('Error ho gaya:', error.message);
    }
};
