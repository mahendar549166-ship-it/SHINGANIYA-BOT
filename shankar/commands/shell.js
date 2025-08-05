module.exports.config = {
    name: "shell",
    version: "7.3.1",
    hasPermssion: 3,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Shell chalaye",
    commandCategory: "Admin",
    usages: "[shell]",
    cooldowns: 0,
    images: [],
    dependencies: {
        "child_process": ""
    }
};

module.exports.run = async function({ api, event, args, Threads, Users, Currencies, models }) {    
    const { exec } = require("child_process");
    const permission = global.config.NDH;
    if (!permission.includes(event.senderID)) {
        api.sendMessage("Admin ko report kiya gaya kyunki aapne nishiddh command ka istemal kiya", event.threadID, event.messageID);
    }
    var idad = global.config.NDH;
    const permissions = global.config.NDH;
    var name = global.data.userName.get(event.senderID);
    var threadInfo = await api.getThreadInfo(event.threadID);
    var nameBox = threadInfo.threadName;
    var time = require("moment-timezone").tz("Asia/Kolkata").format("HH:mm:ss (D/MM/YYYY) (dddd)");
    if (!permissions.includes(event.senderID)) {
        return api.sendMessage("Box: " + nameBox + "\n" + name + " ne command ka istemal kiya: " + this.config.name + "\nLink Facebook: https://www.facebook.com/profile.php?id=" + event.senderID + "\nSamay: " + time, idad);
    }
    let text = args.join(" ");
    exec(`${text}`, (error, stdout, stderr) => {
        if (error) {
            api.sendMessage(`${error.message}`, event.threadID, event.messageID);
            return;
        }
        if (stderr) {
            api.sendMessage(`${stderr}`, event.threadID, event.messageID);
            return;
        }
        api.sendMessage(`${stdout}`, event.threadID, event.messageID);
    });
};
