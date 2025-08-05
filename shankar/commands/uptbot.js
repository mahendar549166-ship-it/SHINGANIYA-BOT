module.exports.config = {
    name: "uptbot",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Bot ko uptimerobot.com par treo karein",
    commandCategory: "Tool",
    usages: "[text/reply]",
    cooldowns: 5
};
//////////////////////////////
//////// Khai báo ///////////
////////////////////////////
module.exports.onLoad = () => {
    const fs = require("fs-extra");
    const request = require("request");
    const lvb = __dirname + `/noprefix/`;
    if (!fs.existsSync(lvb + "noprefix")) fs.mkdirSync(lvb, { recursive: true });
    if (!fs.existsSync(lvb + "upt.png")) request("https://i.imgur.com/ib2Iw0e.jpg").pipe(fs.createWriteStream(lvb + "upt.png"));
}
module.exports.run = async function({ api, event, args, client }) {
    const fs = require('fs-extra');
    let time = process.uptime();
    let hours = Math.floor(time / (60 * 60));
    let minutes = Math.floor((time % (60 * 60)) / 60);
    let seconds = Math.floor(time % 60);
    const timeStart = Date.now();
    var name = Date.now();
    var url = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");
    var lvbang = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    if(url.match(lvbang) == null) return api.sendMessage({body:`===「 UPTIME ROBOT 」===\n\nBot ka online samay kul ${hours} ghante ${minutes} minute ${seconds} second hai 👾\n──────────────\nKripya Uptime Robot par treo karne ke liye URL reply karein ya daalein!`, attachment: fs.createReadStream(__dirname + `/noprefix/upt.png`)}, event.threadID, event.messageID);
    var request = require("request");
    var options = { method: 'POST',
        url: 'https://api.uptimerobot.com/v2/newMonitor',
        headers:
        { 'content-type': 'application/x-www-form-urlencoded',
            'noprefix-control': 'no-noprefix' },
        form:
        { api_key: 'u1521429-e69780eb556948775b151917',
            format: 'json',
            type: '1',
            url: url,
            friendly_name: name } };
    /////////////////////////////////////////  //////Phần điều kiện và gửi tin nhắn//// ///////////////////////////////////////        
    request(options, function (error, response, body) {
        if (error) return api.sendMessage(`Error ho gaya huhu :((`, event.threadID, event.messageID );
        if(JSON.parse(body).stat == 'fail') return api.sendMessage({body:`===「 UPTIME ROBOT 」===\n\nBot ka online samay kul ${hours} ghante ${minutes} minute ${seconds} second hai 👾\n──────────────\n[ ERROR ] - Yeh server pehle se Uptime Robot par mojood hai 🌸\n🔗 Link: ${url}`, attachment: fs.createReadStream(__dirname + `/noprefix/upt.png`)}, event.threadID, event.messageID);
        if(JSON.parse(body).stat == 'success')
            return api.sendMessage({body: `===「 UPTIME ROBOT 」===\n\nBot ka online samay kul ${hours} ghante ${minutes} minute ${seconds} second hai 👾\n──────────────\n[ SUCCESS ] - Server Uptime Robot par safalta se banaya gaya 🌸\n🔗 Link: ${url}`, attachment: fs.createReadStream(__dirname + `/noprefix/upt.png`)}, event.threadID, event.messageID );
    });
}
