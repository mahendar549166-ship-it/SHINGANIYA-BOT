const fs = require("fs");
const { resolve } = require("path");

module.exports.config = {
    name: "antiqtv",
    eventType: ["log:thread-admins"],
    version: "1.0.0",
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Prashasak ke parivartan ko rokne ke liye",
};

module.exports.run = async function ({ event, api }) {
    const { logMessageType, logMessageData, author, threadID } = event;
    const botID = api.getCurrentUserID();
    // Check karo ki kya event bhejne wala bot khud hai
    if (author === botID) return;

    const path = resolve(__dirname, '../commands', 'data', 'antiqtv.json');

    try {
        const dataA = JSON.parse(fs.readFileSync(path));

        const samuhMila = Object.keys(dataA).find(samuhID => samuhID === threadID);

        // Check karo ki dataA maujood hai aur samuhMila undefined nahi hai
        if (dataA && samuhMila !== undefined && dataA[samuhMila] === true) {
            switch (logMessageType) {
                case "log:thread-admins": {
                    if (logMessageData.ADMIN_EVENT === "add_admin" || logMessageData.ADMIN_EVENT === "remove_admin") {
                        if (logMessageData.TARGET_ID === botID) return; // Bot par koi asar nahi

                        if (logMessageData.ADMIN_EVENT === "remove_admin") {
                            // Jo vyakti prashasak ko hata raha hai, uske prashasak adhikar hatao
                            api.changeAdminStatus(threadID, author, false);
                            // Jis vyakti ke prashasak adhikar hataye gaye, unhe wapas do
                            api.changeAdminStatus(threadID, logMessageData.TARGET_ID, true);
                        } else if (logMessageData.ADMIN_EVENT === "add_admin") {
                            // Jo vyakti prashasak jod raha hai aur jise joda gaya, dono ke adhikar hatao
                            api.changeAdminStatus(threadID, author, false);
                            api.changeAdminStatus(threadID, logMessageData.TARGET_ID, false);
                        }

                        function prashasakSampadanCallback(err) {
                            if (err) return api.sendMessage("» Hihihihih! ", threadID, event.messageID);
                            return api.sendMessage("» Box chori ke virudh sanrakshan mod chalu", threadID, event.messageID);
                        }
                    }
                    break;
                }
            }
        } else {
            // Jab samuh ID data mein nahi hai ya false hai, toh uska prabandhan karo (yadi jaruri ho)
        }
    } catch (error) {
        
    }
};
