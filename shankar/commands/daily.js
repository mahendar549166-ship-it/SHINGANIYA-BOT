module.exports.config = {
    name: "daily",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Har din 1000000 coins prapt karen!",
    commandCategory: "Kamaai",
    cooldowns: 5,
    images: [],
};

module.exports.run = ({ event, api, Currencies }) => {
    const rewardCoin = 1000000;
    const cooldownTime = 12 * 60 * 60 * 1000;

    const { senderID, threadID, messageID } = event;

    return Currencies.getData(senderID)
        .then(data => {
            data = data.data || {};
            const timeRemaining = cooldownTime - (Date.now() - (data.dailyCoolDown || 0));

            if (timeRemaining > 0) {
                const seconds = Math.floor((timeRemaining / 1000) % 60);
                const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
                const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
                const formattedSeconds = (seconds < 10 ? "0" : "") + seconds;

                return api.sendMessage(`⏱️ Aap pratiksha samay mein hain\n🔄 Kripya ${hours} ghante ${minutes} minute ${formattedSeconds} second baad wapas aayen!`, threadID, messageID);
            } else {
                Currencies.increaseMoney(senderID, rewardCoin);
                data.dailyCoolDown = Date.now();
                return Currencies.setData(senderID, { data })
                    .then(() => api.sendMessage(`☑️ Aapne ${rewardCoin}$ prapt kiye, agle 12 ghante baad wapas aakar aur prapt karen`, threadID, messageID));
            }
        });
}
