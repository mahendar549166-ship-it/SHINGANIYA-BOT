const fs = require('fs-extra');
const path = require('path');
const moment = require('moment-timezone');

this.config = {
    name: "autosetname",
    eventType: ["log:subscribe"],
    version: "1.0.3",
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Naye sadasya ke liye swachalit roop se upnaam set karen",
};

this.run = async function({ api, event, Users }) {
    const samuhID = event.threadID;
    const pathData = path.join(__dirname, "../../shankar/commands/data", "autosetname.json");
    const dataJson = fs.readFileSync(pathData, "utf-8");
    const samuhData = JSON.parse(dataJson).find(item => item.threadID === samuhID);
    if (!samuhData || (!samuhData.nameUser && samuhData.timejoin === false)) return;
    const upnaamSet = samuhData.nameUser;
    for (const jankari of event.logMessageData.addedParticipants) {
        const userID = jankari.userFbId;
        await new Promise(resolve => setTimeout(resolve, 1000));
        const userJankari = await api.getUserInfo(userID);
        const naam = userJankari[userID].name;
        let formatKiyaNaam;
        if (samuhData.timejoin === true) {
            formatKiyaNaam = (upnaamSet ? upnaamSet + " " : "") + naam + " (" + moment().format("HH:mm:ss | DD/MM/YYYY") + ")";
        } else {
            formatKiyaNaam = upnaamSet ? upnaamSet + " " + naam : naam;
        }
        if (formatKiyaNaam !== naam) {
            await api.changeNickname(formatKiyaNaam, samuhID, userID);
        }
    }
    api.sendMessage("✅ Naye sadasya ke liye swachalit upnaam set kiya gaya!", samuhID, event.messageID);
};
