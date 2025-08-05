const fs = require('fs-extra');
const axios = require('axios');
const moment = require("moment-timezone");

this.config = {
    naam: "sing2",
    upnaam: ["sing2"],
    version: "2.0.0",
    bhumika: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    vivaran: "YouTube par khoj ke shabd ke jariye gaana bajao",
    commandCategory: "Upyogita",
    upyog: "gaana [khoj shabd]",
    cd: 0,
    hasPrefix: true,
    tasveerein: [],
};

async function ytdlv2(url, prakar, gunvatta) {
    const header = {
      "accept": "*/*",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "hi-IN,hi;q=0.9,en-US;q=0.8,en;q=0.7",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "cookie": "PHPSESSID=eoddj1bqqgahnhac79rd8kq8lr",
      "origin": "https://iloveyt.net",
      "referer": "https://iloveyt.net/hi2",
      "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
      "x-requested-with": "XMLHttpRequest"
    };
  
    const { data } = await axios.post("https://iloveyt.net/proxy.php", {
      url: url
    }, { headers: header });
  
    var mediaId = [];
    for (const i of data.api.mediaItems) {
      if (i.type !== prakar) continue;
      mediaId.push(i.mediaId);
    }
    const randomMediaId = mediaId[Math.floor(Math.random() * mediaId.length)];
    let s = 1, mediaPrakriya, i = 0;
    while (i++ < 10) {
      const base_url = "s" + s + ".ytcontent.net";
      mediaPrakriya = await axios.get(`https://${base_url}/v3/${prakar.toLowerCase()}Process/${data.api.id}/${randomMediaId}/${gunvatta}`);
      if (!mediaPrakriya.data.error) break;
      s++;
    }
    return {
      fileUrl: mediaPrakriya.data.fileUrl,
      shirshak: data.api.title,
      channel: data.api.userInfo,
      videoJankari: data.api.mediaStats
    };
}

async function getdl(link, path) {
    var samayShuru = Date.now();
    const data = await ytdlv2(link, 'Audio', "128k");
    if (!data) return null;
    const dllink = data.fileUrl;

    const response = await axios.get(dllink, { responseType: 'arraybuffer' });
    fs.writeFileSync(path, response.data);

    return {
        shirshak: data.shirshak,
        samayShuru: samayShuru
    };
}

this.handleReply = async function ({ api, event, handleReply }) {
    const id = handleReply.link[event.body - 1];
    try {
        var path = `${__dirname}/cache/gaana-${event.senderID}.mp3`;
        var data = await getdl(`https://www.youtube.com/watch?v=${id}`, path);      
        if (fs.statSync(path).size > 26214400) {
            return api.sendMessage('❎ File bahut bada hai, kripya doosra gaana chunein!', event.threadID, () => fs.unlinkSync(path), event.messageID);
        }
        api.unsendMessage(handleReply.messageID, event.threadID);
        return api.sendMessage({
            body: `[ YouTube Sangeet ]\n──────────────────\n|› 🎬 Shirshak: ${data.shirshak}\n|› 📥 Download Link: https://www.youtubepp.com/watch?v=${id}\n|› ⏳ Processing Samay: ${Math.floor((Date.now() - data.samayShuru) / 1000)} second\n──────────────────\n|› ⏰ Samay: ${moment.tz("Asia/Kolkata").format("HH:mm:ss | DD/MM/YYYY")}`,
            attachment: fs.createReadStream(path)
        }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    } catch (e) {
        console.log(e);
    }
};

this.run = async function ({ api, event, args }) {
    if (args.length == 0 || !args) return api.sendMessage('❎ Khoj ka hissa khali nahi hona chahiye!', event.threadID, event.messageID);
    const keywordKhoj = args.join(" ");
    const path = `${__dirname}/cache/gaana-${event.senderID}.mp3`;
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
    try {
        const link = [];
        const Youtube = require('youtube-search-api');
        const data = (await Youtube.GetListByKeyword(keywordKhoj, false, 8)).items;
        const sandesh = data.map((value, index) => {
            link.push(value.id);
            const avadhi = value.length && value.length.simpleText ? value.length.simpleText : "koi jankari nahi";
            return `|› ${index + 1}. ${value.title}\n|› 👤 Channel: ${value.channelTitle || "Koi jankari nahi"}\n|› ⏱️ Avadhi: ${avadhi}\n──────────────────`;
        }).join('\n');

        return api.sendMessage(`📝 Aapke khoj ke shabd se ${link.length} parinaam mile:\n──────────────────\n${sandesh}\n\n📌 Gaana download karne ke liye STT ke saath jawab dein`, event.threadID, (error, info) => global.client.handleReply.push({
            type: 'jawab',
            naam: this.config.naam,
            messageID: info.messageID,
            lekhak: event.senderID,
            link
        }), event.messageID);
    } catch (e) {
        return api.sendMessage('❎ Error ho gaya, kripya baad mein dobara koshish karein!\n' + e, event.threadID, event.messageID);
    }
};
