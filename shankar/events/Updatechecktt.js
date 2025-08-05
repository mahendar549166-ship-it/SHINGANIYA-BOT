module.exports.config = {
    name: "Updatechecktt",
    eventType: ["log:unsubscribe"],
    version: "1.0.0",
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "User ke tathya ko hatao jab woh group se bahar jaye",
};

module.exports.run = async ({ event, api, Threads }) => { 
    if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
    const fs = require("fs");
    const pathA = require('path');
    const thread = require('../commands/kiemtra/');
    const path = pathA.resolve(__dirname, '../', 'commands', 'kiemtra', '/');
    var samuhData = thread.find(i => i.threadID == event.threadID);
    const sthan = samuhData.data.findIndex(item => item.id == event.logMessageData.leftParticipantFbId);
    samuhData.data.splice(sthan, 1);
    fs.writeFileSync(path, JSON.stringify(thread, null, 2), 'utf-8');
}
