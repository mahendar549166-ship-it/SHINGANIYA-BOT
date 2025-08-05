/*
@credit ⚡️Shankar Singhaniya 
@कृपया क्रेडिट को संपादित न करें
*/
const fs = require("fs");
module.exports.config = {
    name: "boctham",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑", //संग Nguyễn द्वारा संपादित, डायन का कोड वर्किंग, सुहाओ ने केवल टेक्स्ट में बदलाव किया
    description: "💴लकी ड्रॉ 10k, 20k, 50k, 100k, 200k, 500k के पैकेज के साथ💎",
    commandCategory: "game",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 0 
    },
    denpendencies: {
        "fs": "",
        "request": ""
    }
};
module.exports.onLoad = () => {
    const fs = require("fs-extra");
    const request = require("request");
    const dirMaterial = __dirname + `/cache/`;
    if (!fs.existsSync(dirMaterial + "cache")) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(dirMaterial + "baolixi1.png")) request("https://i.imgur.com/luFyD1C.jpg").pipe(fs.createWriteStream(dirMaterial + "baolixi1.png"));
}
module.exports.handleReply = async ({ 
    event: e, 
    api, 
    handleReply, 
    Currencies }) => {
    const { threadID, messageID, senderID } = e;
    let data = (await Currencies.getData(senderID)).data || {};
    if (handleReply.author != e.senderID) 
        return api.sendMessage("🎋यह लकी ड्रॉ उस व्यक्ति के लिए है जिसने इसे शुरू किया, कृपया दूसरों की बारी न लें", e.threadID, e.messageID);

    var a = Math.floor(Math.random() * 1000) + 80; 
    var b = Math.floor(Math.random() * 100) + 80; 
    var c = Math.floor(Math.random() * 100) + 80; 
    var x = Math.floor(Math.random() * 100) + 80; 
    var y = Math.floor(Math.random() * 100) + 80; 
    var f = Math.floor(Math.random() * 100) + 50;
    var msg = "";
    switch(handleReply.type) {
        case "choosee": {
            var t = Date.parse("February 1, 2022 00:00:00") - Date.parse(new Date()),
            m = Math.floor((t/1000/60) % 60),
            h = Math.floor((t/(1000*60*60)) % 24),
            d = Math.floor(t/(1000*60*60*24)); 
           
            switch(e.body) {
                case "1": msg = `💷बधाई हो! आपके द्वारा खरीदा गया 10k पैकेज ${a}K दे रहा है। आपको नया साल मुबारक हो, सुख और समृद्धि मिले! <3🎐\n🎀लunar न्यू ईयर में अभी बाकी है » ${d} दिन ${h} घंटे ${m} मिनट🎋`; 
                await Currencies.increaseMoney(e.senderID, parseInt(a)); 
                break; 
                case "2": msg = `💷बधाई हो! आपके द्वारा खरीदा गया 20k पैकेज ${a}K दे रहा है। आपको नया साल मुबारक हो, सुख और समृद्धि मिले! <3🎐\n🎀लunar न्यू ईयर में अभी बाकी है » ${d} दिन ${h} घंटे ${m} मिनट🎋`; 
                await Currencies.increaseMoney(e.senderID, parseInt(x));  
                await Currencies.increaseMoney(e.senderID, parseInt(b)); 
                break;
                case "3": msg = `💷बधाई हो! आपके द्वारा खरीदा गया 50k पैकेज ${a}K दे रहा है। आपको नया साल मुबारक हो, सुख और समृद्धि मिले! <3🎐\n🎀लunar न्यू ईयर में अभी बाकी है » ${d} दिन ${h} घंटे ${m} मिनट🎋`; 
                await Currencies.increaseMoney(e.senderID, parseInt(c)); 
                break;
                case "4": msg = `💷बधाई हो! आपके द्वारा खरीदा गया 100k पैकेज ${a}K दे रहा है। आपको नया साल मुबारक हो, सुख और समृद्धि मिले! <3🎐\n🎀लunar न्यू ईयर में अभी बाकी है » ${d} दिन ${h} घंटे ${m} मिनट🎋`; 
                await Currencies.increaseMoney(e.senderID, parseInt(x)); 
                break;
                case "5": msg = `💷बधाई हो! आपके द्वारा खरीदा गया 200k पैकेज ${a}K दे रहा है। आपको नया साल मुबारक हो, सुख और समृद्धि मिले! <3🎐\n🎀लunar न्यू ईयर में अभी बाकी है » ${d} दिन ${h} घंटे ${m} मिनट🎋`; 
                await Currencies.increaseMoney(e.senderID, parseInt(y)); 
                break;
                case "6": msg = `💷बधाई हो! आपके द्वारा खरीदा गया 500k पैकेज ${a}K दे रहा है। आपको नया साल मुबारक हो, सुख और समृद्धि मिले! <3🎐\n🎀लunar न्यू ईयर में अभी बाकी है » ${d} दिन ${h} घंटे ${m} मिनट🎋`; 
                await Currencies.increaseMoney(e.senderID, parseInt(f)); 
                break;
                default: break;
            };
            const choose = parseInt(e.body);
            if (isNaN(e.body)) 
                return api.sendMessage("💶कृपया सूची में से एक पैकेज चुनें 🎀", e.threadID, e.messageID);
            if (choose > 6 || choose < 1) 
                return api.sendMessage("💶आपका चयन सूची में नहीं है🎀.", e.threadID, e.messageID); 
            api.unsendMessage(handleReply.messageID);
            if (msg == "🎋Chưa update...") {
                msg = "🎋जल्द ही अपडेट होगा...";
            };
            return api.sendMessage(`${msg}`, threadID, async () => {
                data.work2Time = Date.now();
                await Currencies.setData(senderID, { data });
            });
        };
    }
}

module.exports.run = async ({  
    event: e, 
    api, 
    handleReply, 
    Currencies }) => {
    const { threadID, messageID, senderID } = e;
    const cooldown = global.configModule[this.config.name].cooldownTime;
    let data = (await Currencies.getData(senderID)).data || {};
    var t = Date.parse("February 1, 2022") - Date.parse(new Date()),
        d = Math.floor(t/(1000*60*60*24)),
        h = Math.floor((t/(1000*60*60)) % 24),
        m = Math.floor((t/1000/60) % 60);

    if (typeof data !== "undefined" && cooldown - (Date.now() - data.work2Time) > 0) {
        var time = cooldown - (Date.now() - data.work2Time),
            hours = Math.floor((time / (60000 * 60000 ))/24),
            minutes = Math.floor(time / 60000),
            seconds = ((time % 60000) / 1000).toFixed(0); 
        return api.sendMessage(`💎आप पहले ही लकी ड्रॉ ले चुके हैं, कृपया कल फिर से आएं💴.\n🌸 Lunar न्यू ईयर में अभी बाकी है » ${d} दिन ${h} घंटे ${m} मिनट`, e.threadID, e.messageID);
    } else {    
        var msg = {
            body: "🎋लकी ड्रॉ पुरस्कार🎋" +
                `\n🌸Lunar न्यू ईयर में अभी बाकी है » ${d} दिन ${h} घंटे ${m} मिनट` +
                "\n𝟏.   10k पैकेज 💴 " +
                "\n𝟐.   20k पैकेज 💶 " +
                "\n𝟑.   50k पैकेज 💷 " +
                "\n𝟒.   100k पैकेज 💸 " +
                "\n𝟓.   200k पैकेज 💎 " +
                "\n𝟔.   500k पैकेज 💵 " +
                `\n\n🧨कृपया उस पैकेज का जवाब दें जिसे आप लकी ड्रॉ के लिए चुनना चाहते हैं।`,
                attachment: fs.createReadStream(__dirname + `/cache/baolixi1.png`)}
        return api.sendMessage(msg, e.threadID, (error, info) => {
            data.work2Time = Date.now();
            global.client.handleReply.push({
                type: "choosee",
                name: this.config.name,
                author: e.senderID,
                messageID: info.messageID
            })  
        })
    }
}
