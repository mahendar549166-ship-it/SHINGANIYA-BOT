module.exports.config = {
    name: "offbot",
    version: "1.0.0",
    hasPermssion: 3,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑", /* कृपया क्रेडिट न बदलें :) */
    description: "बॉट को बंद करें",
    commandCategory: "सिस्टम",
    cooldowns: 0
};

module.exports.run = async ({ event, api }) => {
    const permission = ["100063470889361", ""];
    if (!permission.includes(event.senderID)) 
        return api.sendMessage("→ [❗] ऑफ करने के लिए उम्र चाहिए?", event.threadID, event.messageID);

    api.sendMessage("→ [✨] अलविदा", event.threadID, () => process.exit(0));
}
