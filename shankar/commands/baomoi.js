const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment-timezone');

module.exports.config = {
  name: "baomoi",
  version: "1.0.0",
  hasPermission: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Samachar padhne ka command",
  commandCategory: "Uppayogita",
  usages: "[]",
  cooldowns: 5,
  images: [],
};

module.exports.run = async function ({ api, event }) {
  try {
    const { data } = await axios.get(`https://baomoi.com/tin-moi.epi`);
    const $ = cheerio.load(data);
    const nextDataScript = $('script#__NEXT_DATA__').html();
    
    const jsonData = nextDataScript ? JSON.parse(nextDataScript) : null;
    const content = jsonData?.props?.pageProps?.resp?.data?.content?.items[0];
  
    if (content) {
      const postTimestamp = content.date;
      
      const timeAgo = (t) => {
        const duration = moment.duration(moment().tz('Asia/Kolkata') - moment(t * 1000));
        if (duration.asHours() >= 1) {
          return '⏰ Post ka samay: ' + duration.hours() + ' ghante pehle';
        } else if (duration.asMinutes() >= 1) {
          return '⏰ Post ka samay: ' + duration.minutes() + ' minute pehle';
        } else {
          return '⏰ Post ka samay: ' + duration.seconds() + ' second pehle';
        }
      };

      const originalUrl = content.url;
      const convertedUrl = originalUrl.replace(/#.*$/, '');
      const img = (await axios.get(content.thumbL, { responseType: "stream" })).data;

      const message = `[ Bao Moi - Taza Samachar ]\n──────────────────\n\n🌾 Shirsak: ${content.title}\n📝 Vivaran: ${content.description}\n──────────────────\n${timeAgo(postTimestamp)}\n👤 Post kiya: ${content.publisher.name}\n📎 Article ka link: https://baomoi.com${convertedUrl}\n\n📌 Agar aap aur samachar dekhna chahte hain toh website https://baomoi.com par jaayein`;

      api.sendMessage({ body: message, attachment: img }, event.threadID, event.messageID);  
    } else {
      console.log('❎ Data nahi mila');
    }
 } catch (error) {
  }
};
