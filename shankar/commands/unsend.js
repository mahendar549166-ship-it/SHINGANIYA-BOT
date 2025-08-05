const fs = require('fs');
module.exports.config = {
    name: "unsend",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Reaction se bot ke message unsend karne ka mode on/off karein",
    commandCategory: "Group Chat",
    usages: "[on/off]",
    cooldowns: 5,
};

module.exports.run = async({ api, event, args }) => {
    const { threadID, messageID } = event;
    let path = __dirname + "/cache/unsendReaction.json";
    if(!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
    let data = JSON.parse(fs.readFileSync(path));
    if(!data[threadID]) data[threadID] = { data: false };
    if (args.join() == "") { 
        return api.sendMessage(`Kripya [ on / off ] chunein`, event.threadID, event.messageID)} 
    if(args[0] == "on") { 
        data[threadID].data = true; 
        api.sendMessage("» [ MODE ] - UnsendReaction mode safalta se on kar diya gaya 🖤", threadID); 
    } else if(args[0] == "off") { 
        data[threadID].data = false; 
        api.sendMessage("» [ MODE ] - UnsendReaction mode safalta se off kar diya gaya 🖤", threadID);
    }
    fs.writeFileSync(path, JSON.stringify(data, null, 4));
}
