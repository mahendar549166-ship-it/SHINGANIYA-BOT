const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "cookie",
    version: "1.0.1",
    hasPermission: 3,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Cookie ko tezi se badlen",
    commandCategory: "Admin",
    usages: "[]",
    cooldowns: 5,
    images: [],
};

module.exports.run = async ({ api: a, event: e, args: q }) => {
    const { threadID: tid, messageID: mid } = e;
    const filePath = path.join(__dirname, './../../acc.json');

    if (!q.length) {
        a.sendMessage('⚠️ Kripya badalne ke liye cookie daalein', tid, mid);
        return;
    }

    try {
        const jsonData = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(jsonData);
        data.cookie = q.join(" ");
        const updatedJsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, updatedJsonData);

        a.sendMessage('☑️ Cookie safalata se badal diya gaya', tid, mid);
    } catch (error) {
        console.error('Error:', error);
        a.sendMessage('❎ Cookie badalte waqt error hua', tid, mid);
    }
};
