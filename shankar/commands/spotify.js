const axios = require("axios");
const moment = require('moment-timezone');
const qs = require('qs');
const fs = require('fs');

module.exports.config = {
  name: "spotify",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Spotify par gaana khojna",
  commandCategory: "Upyogita",
  usages: "[]",
  images: [],
  cooldowns: 2,
};

async function getDownload(link) {
  const randomUserAgent = () => {
    const versions = ["4.0.3", "4.1.1", "4.2.2", "4.3", "4.4", "5.0.2", "5.1", "6.0", "7.0", "8.0", "9.0", "10.0", "11.0"];
    const devices = ["M2004J19C", "S2020X3", "Xiaomi4S", "RedmiNote9", "SamsungS21", "GooglePixel5"];
    const builds = ["RP1A.200720.011", "RP1A.210505.003", "RP1A.210812.016", "QKQ1.200114.002", "RQ2A.210505.003"];
    const chromeVersion = `Chrome/${Math.floor(Math.random() * 80) + 1}.${Math.floor(Math.random() * 999) + 1}.${Math.floor(Math.random() * 9999) + 1}`;
    return `Mozilla/5.0 (Linux; Android ${versions[Math.floor(Math.random() * versions.length)]}; ${devices[Math.floor(Math.random() * devices.length)]} Build/${builds[Math.floor(Math.random() * builds.length)]}) AppleWebKit/537.36 (KHTML, like Gecko) ${chromeVersion} Mobile Safari/537.36 WhatsApp/1.${Math.floor(Math.random() * 9) + 1}.${Math.floor(Math.random() * 9) + 1}`;
  };
  const randomIP = () => `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  const headss = () => ({
    "User-Agent": randomUserAgent(),
    "X-Forwarded-For": randomIP(),
  });
  async function getCookies() {
    try {
      const response = await axios.get('https://spotmate.online', {
        headers: {
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Accept-Language': 'hi,en;q=0.9',
          ...headss(),
        }
      });
      const setCookieHeaders = response.headers['set-cookie'];
      const cookieString = setCookieHeaders.map(cookie => cookie.split(';')[0]).join('; ');
      const csrfTokenMatch = response.data.match(/<meta name="csrf-token" content="([^"]+)"/);
      const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : null;
      return {
        cookieString,
        csrfToken
      };
    } catch (error) {
      console.error('Cookies aur token lene mein galti:', error);
      throw error;
    }
  }
  try {
    const {
      cookieString,
      csrfToken
    } = await getCookies();
    const response = await axios.post('https://spotmate.online/convert', {
      urls: link
    }, {
      headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'hi,en;q=0.9',
        'Content-Type': 'application/json',
        'Cookie': cookieString,
        'Origin': 'https://spotmate.online',
        'Priority': 'u=1, i',
        'Referer': 'https://spotmate.online/',
        'Sec-Ch-Ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        ...headss(),
        'X-Csrf-Token': csrfToken
      }
    });
    return response.data.url;
  } catch (error) {
    console.error('POST request mein galti:', error);
  }
}

async function getStreamAndSize(url, path = "") {
  const response = await axios({
    method: "GET",
    url,
    responseType: "stream",
    headers: {
      'Range': 'bytes=0-'
    }
  });
  if (path)
    response.data.path = path;
  const totalLength = response.headers["content-length"];
  return {
    stream: response.data,
    size: totalLength
  };
}

function convertTime(a) {
  const second = Math.floor((a / 1000) % 60);
  const minute = Math.floor((a / (1000 * 60)) % 60);
  const hour = Math.floor(a / (1000 * 60 * 60));
  return `${hour}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
}

async function get_token(client_id, client_secret) {
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const data = qs.stringify({ grant_type: 'client_credentials' });
  const response = await axios.post(tokenUrl, data, {
    headers: {
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  return response.data.access_token;
}

async function search(keywords) {
  const data_audio = [];
  try {
    const client_id = 'b9d2557a2dd64105a37f413fa5ffcda4';
    const client_secret = '41bdf804974e4e70bfa0515bb3097fbb';
    const token = await get_token(client_id, client_secret);
    const res = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURI(keywords)}&limit=6&type=track&access_token=${token}`);
    for (const item of res.data.tracks.items) {
      const result = {
        id: item.id,
        title: item.name,
        author: item.album.artists[0].name,
        duration: item.duration_ms,
        link: item.external_urls.spotify,
        preview_url: item.preview_url,
      };
      data_audio.push(result);
    }
    return data_audio;
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports.run = async function ({ api, event, args }) {
  try {
    const keyword = args.join(" ");
    if (!keyword) {
      api.sendMessage("⚠️ Kripya Spotify par gaana khojne ke liye keyword daalein", event.threadID, event.messageID);
      return;
    }
    const dataSearch = await search(keyword);
    if (dataSearch.length === 0) {
      api.sendMessage(`❎ Keyword ke liye koi parinaam nahi mila: ${keyword}`, event.threadID, event.messageID);
      return;
    }
    const messages = dataSearch.map((item, index) => {
      const duration = convertTime(item.duration);
      return `\n${index + 1}. 👤 Naam: ${item.author}\n📜 Shironam: ${item.title}\n⏳ Samay: ${duration} second`;
    });
    api.sendMessage(`[ SPOTIFY - GAANA KHOJ ]\n────────────────────\n📝 Keyword ke liye khoj ki gayi list: ${keyword}\n${messages.join("\n")}\n\n📌 Gaana download karne ke liye STT ke hisaab se jawab dein`, event.threadID, (error, info) => {
      global.client.handleReply.push({
        type: "choose",
        name: module.exports.config.name,
        author: info.senderID,
        messageID: info.messageID,
        dataTrack: dataSearch,
      });
    });
  } catch (error) {
    console.error(error);
    api.sendMessage("Galti: " + error, event.threadID);
  }
};

module.exports.handleReply = async function ({ event, api, handleReply, args }) {
  const { threadID: tid, messageID: mid, body } = event;
  const send = (msg, callback) => api.sendMessage(msg, tid, callback, mid);
  switch (handleReply.type) {
    case 'choose':
      const choose = parseInt(body);
      api.unsendMessage(handleReply.messageID);
      if (isNaN(choose)) {
        return api.sendMessage('⚠️ Kripya ek number daalein', tid, mid);
      }
      if (choose > 6 || choose < 1) {
        return api.sendMessage('❎ Chunav list mein nahi hai', tid, mid);
      }
      const chosenItem = handleReply.dataTrack[choose - 1];
      const urlaudio = await getDownload(chosenItem.link);
      const time = convertTime(chosenItem.duration);
      const savePath = `${__dirname}/cache/spotify-${event.senderID}.mp3`;               
      const getStream = await getStreamAndSize(urlaudio, `${time}.mp3`);
      if (getStream.size > MAX_SIZE) {
        return send(`❎ 26MB se chhota koi audio nahi mila`);
      }     
      const writeStream = fs.createWriteStream(savePath);
      getStream.stream.pipe(writeStream);
      const contentLength = getStream.size;
      let downloaded = 0;
      let count = 0;
      getStream.stream.on("data", (chunk) => {
        downloaded += chunk.length;
        count++;
        if (count == 5) {
          const endTime = Date.now();
          const speed = downloaded / (endTime - startTime) * 1000;
          const timeLeft = (contentLength / downloaded * (endTime - startTime)) / 1000;
          const percent = downloaded / contentLength * 100;
          if (timeLeft > 30) send(`⬇️ Audio "${chosenItem.title}" download ho raha hai\n🔃 Speed: ${Math.floor(speed / 1000) / 1000}MB/s\n⏸️ Downloaded: ${Math.floor(downloaded / 1000) / 1000}/${Math.floor(contentLength / 1000) / 1000}MB (${Math.floor(percent)}%)\n⏳ Bacha hua samay: ${timeLeft.toFixed(2)} second`);
        }
      });
      writeStream.on("finish", () => {
        send({
          body: `🎬 Shironam: ${chosenItem.title}`,
          attachment: fs.createReadStream(savePath)
        }, async (err) => {
          if (err)
            return send(`❎ Galti ho gayi: ${err.message}`);
          fs.unlinkSync(savePath);
        });
      });
      break;
    default:
  }
};
