const axios = require('axios');
module.exports.config = {
    name: "sharepost",
    version: "1.0",
    hasPermission: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    commandCategory: "Upyogita",
    description: "Facebook Post Share Kare",
    usePrefix: false,
};

module.exports.run = async ({ api, event, args }) => {
    try {
        if (args.length !== 3) {
            api.sendMessage('⚠️ Arguments ki sankhya galat hai. Istemal kare: sharepost [token] [url] [sankhya]', event.threadID);
            return;
        }

        const accessToken = args[0];
        const shareUrl = args[1];
        const shareAmount = parseInt(args[2]);

        if (isNaN(shareAmount) || shareAmount <= 0) {
            api.sendMessage('⚠️ Share ki sankhya galat hai. Kripya ek valid positive number daale.', event.threadID);
            return;
        }

        const timeInterval = 1500;
        const deleteAfter = 60 * 60;

        let sharedCount = 0;
        let timer = null;

        async function sharePost() {
            try {
                const response = await axios.post(
                    `https://graph.facebook.com/me/feed?access_token=${accessToken}&fields=id&limit=1&published=0`,
                    {
                        link: shareUrl,
                        privacy: { value: 'SELF' },
                        no_story: true,
                    },
                    {
                        muteHttpExceptions: true,
                        headers: {
                            authority: 'graph.facebook.com',
                            'cache-control': 'max-age=0',
                            'sec-ch-ua-mobile': '?0',
                            'user-agent':
                                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36',
                        },
                        method: 'post',
                    }
                );

                sharedCount++;
                const postId = response?.data?.id;

                console.log(`Share ki sankhya: ${sharedCount}`);
                console.log(`Post ID: ${postId || 'Pata nahi'}`);

                if (sharedCount === shareAmount) {
                    clearInterval(timer);
                    console.log('Post share karna pura ho gaya.');

                    if (postId) {
                        setTimeout(() => {
                            deletePost(postId);
                        }, deleteAfter * 1000);
                    }

                    api.sendMessage('☑️ Share chalana pura ho gaya', event.threadID);
                }
            } catch (error) {
                console.error('Post share nahi kar saka:', error.response.data);
            }
        }

        async function deletePost(postId) {
            try {
                await axios.delete(`https://graph.facebook.com/${postId}?access_token=${accessToken}`);
                console.log(`Post hata diya gaya: ${postId}`);
            } catch (error) {
                console.error('Post hata nahi saka:', error.response.data);
            }
        }

        timer = setInterval(sharePost, timeInterval);

        setTimeout(() => {
            clearInterval(timer);
            console.log('Loop ruk gaya.');
        }, shareAmount * timeInterval);
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage('Error ho gaya: ' + error.message, event.threadID);
    }
};
