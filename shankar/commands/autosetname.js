const { join } = require("path");
const { existsSync, writeFileSync, readFileSync } = require("fs-extra");

module.exports.config = {
    "name": "autosetname",
    "version": "1.0.1",
    "hasPermssion": 1,
    "credits": "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    "description": "Naye sadasya ke liye swat: naam set karein",
    "commandCategory": "Box chat",
    "usages": "[add <name> /remove] ",
    "cooldowns": 5,
    "images": [],
}

module.exports.onLoad = () => {
    const pathData = join(__dirname, "data", "autosetname.json");
    if (!existsSync(pathData)) return writeFileSync(pathData, "[]", "utf-8"); 
}

module.exports.run = async function ({ event, api, args, Users }) {
    const { threadID, messageID } = event;
    const pathData = join(__dirname, "data", "autosetname.json");
    var dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
    var name = await Users.getNameUser(event.senderID);
    var thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, nameUser: "", timejoin: false };

    const action = args[args.length - 1];

    switch (args[0]) {
        case "add": {
            let content = args.slice(1).join(" ");
            let timejoinStatus = false;

            if (content === "timeon") {
                timejoinStatus = true;
                content = "";
            }

            if (thisThread.nameUser) {
                return api.sendMessage(`❎ Group mein pehle se naam ka configuration maujud hai, naye naam jodne se pehle purana configuration hataein!`, threadID, messageID);
            }

            thisThread.nameUser = content;
            thisThread.timejoin = timejoinStatus;

            api.sendMessage(`✅ Naye sadasya ke naam ka configuration jod diya gaya!\n📝 Preview: \n› Content: ${content || "Koi nahi"} ${name} (Samay judne ka: ${timejoinStatus ? 'Chalu' : 'Band'} )`, threadID, messageID);
            break;
        }
        case "delete": {
            if (thisThread.nameUser || thisThread.timejoin) {
                thisThread.timejoin = false;
                thisThread.nameUser = "";
                api.sendMessage(`✅ Naye sadasya ke naam ka configuration hata diya gaya!`, threadID, messageID);
            } else {
                api.sendMessage(`❎ Group ka naam configuration abhi set nahi kiya gaya!`, threadID, messageID);
            }
            break;
        }
        default: {
            return api.sendMessage(`📝 Istemal karein:\n» autosetname add <name> naye sadasya ke liye upnaam configure karne ke liye\n» autosetname delete naye sadasya ke upnaam configuration ko hatane ke liye`, threadID, messageID);
        }
    }

    if (!dataJson.some(item => item.threadID == threadID)) dataJson.push(thisThread);
    writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
}
