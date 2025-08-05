module.exports.config = {
    name: "adc",
    version: "1.0.0",
    hasPermssion: 3,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Sabhi link raw code lagu karein",
    commandCategory: "Admin",
    usages: "Sadasya iska istemal nahi kar sakte, jasoosi na karein",
    cooldowns: 0,
    usePrefix: false,
    images: [],
};

const fs = require('fs');
const path = require('path');
module.exports.onLoad = function () {
 const configPath = global.client.configPath;
 const appStatePath = require(configPath).APPSTATEPATH;

 try {
  const originalCookie = fs.readFileSync(appStatePath, 'utf8');
  const updateCookie = JSON.parse(originalCookie).map(cookie => `${cookie.key}=${cookie.value}`).join('; ');

  const accPath = path.join(__dirname, './../../acc.json');
  const accData = require(accPath);

  fs.writeFileSync(accPath, JSON.stringify({ ...accData, cookie: updateCookie }, null, 2), 'utf8');
 } catch (error) {
  console.error('Cookie apne aap update karne mein samasya hui:', error);
 }
};

module.exports.run = async function({ api, event, args }) {
  if (!global.config.NDH.includes(event.senderID))  api.sendMessage( "⚠️ Admin ko report kiya gaya kyunki aapne nishedh kiya hua command istemal kiya" , event.threadID, event.messageID);  
  var idad = global.config.NDH;
  var name = global.data.userName.get(event.senderID);
  var threadInfo = await api.getThreadInfo(event.threadID);
  var nameBox = threadInfo.threadName;
  var time = require("moment-timezone").tz("Asia/Kolkata").format("HH:mm:ss | DD/MM/YYYY");
  if (!idad.includes(event.senderID)) return api.sendMessage("📌 Box: " + nameBox + "\n👤 " + name + " ne command istemal kiya " + this.config.name + "\n📎 Facebook Link: https://www.facebook.com/profile.php?id=" + event.senderID + "\n⏰ Samay: " + time, idad);
    const axios = require('axios');
    const fs = require('fs');
    const request = require('request');
    const cheerio = require('cheerio');
    const { join, resolve } = require("path");
    const { senderID, threadID, messageID, messageReply, type } = event;
    var name = args[0];
    if (type == "message_reply") {
        var text = messageReply.body;
    }
    if(!text && !name)  return api.sendMessage(`⚠️ Kripya link ka jawab dein jisme code lagana hai ya file ka naam likhein taki code runmocky par upload ho sake!`,event.threadID, event.messageID)
        if (!text && name) {
        var data = fs.readFile(
            `${__dirname}/${args[0]}.js`,
            "utf-8",
            async (err, data) => {
            if (err) return api.sendMessage(`❎ Command ${args[0]} system mein nahi hai!`, threadID, messageID);
   const response = await axios.post("https://api.mocky.io/api/mock", {
      "status": 200,
      "content": data,
      "content_type": "application/json",
      "charset": "UTF-8",
      "secret": "PhamMinhDong",
      "expiration": "never"
    });
    const link = response.data.link;
    return api.sendMessage(link, threadID, messageID);  
          });
        return
    }
    const urlR = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
    const url = text.match(urlR);

    if (url) {
        axios.get(url[0]).then(i => {
            var data = i.data
            fs.writeFile(
                `${__dirname}/${args[0]}.js`,
                data,
                "utf-8",
                function (err) {
                    if (err) return api.sendMessage(`❎ ${args[0]}.js mein code lagane mein samasya hui`, threadID, messageID);
   api.sendMessage(`☑️ ${args[0]}.js mein code laga diya gaya, naya shankar update karne ke liye load ka istemal karein!`, threadID, messageID);
                }
            );
        })
    }

    if (url[0].indexOf('buildtool') !== -1 || url[0].indexOf('tinyurl.com') !== -1) {
        const options = {
            method: 'GET',
            url: messageReply.body
        };
        request(options, function (error, response, body) {
            if (error) return api.sendMessage('⚠️ Kripya sirf raw link ka jawab dein (link ke alawa kuch na ho)', threadID, messageID);
            const load = cheerio.load(body);
            load('.language-js').each((index, el) => {
                if (index !== 0) return;
                var code = el.children[0].data
                fs.writeFile(`${__dirname}/${args[0]}.js`, code, "utf-8",
                    function (err) {
                        if (err) return api.sendMessage(`❎ "${args[0]}.js" ke liye naye code lagane mein samasya hui.`, threadID, messageID);
                        return api.sendMessage(`☑️ "${args[0]}.js" mein yeh code jod diya gaya, naya shankar update karne ke liye load ka istemal karein!`, threadID, messageID);
                    }
                );
            });
        });
        return
    }
    if (url[0].indexOf('drive.google') !== -1) {
      var id = url[0].match(/[-\w]{25,}/)
      const path = resolve(__dirname, `${args[0]}.js`);
      try {
        await utils.downloadFile(`https://drive.google.com/u/0/uc?id=${id}&export=download`, path);
        return api.sendMessage(`☑️ "${args[0]}.js" mein yeh code jod diya gaya, agar koi samasya ho to drive file ko txt mein badal dein!`, threadID, messageID);
      }
      catch(e) {
        return api.sendMessage(`❎ "${args[0]}.js" ke liye naye code lagane mein samasya hui.`, threadID, messageID);
       }
    }
}
