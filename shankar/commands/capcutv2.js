const axios = require("axios");
const moment = require('moment-timezone');

this.config = {
  name: 'capcutv2',
  version: '1.1.1',
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: 'Capcut platform se jankari lo',
  commandCategory: 'Box chat',
  usages: '[]',
  cooldowns: 5,
  images: [],
};

// Main run function
this.run = async function ({ api, event, args }) {
  const { threadID: tid, messageID: mid, senderID: sid } = event;
  const send = (content, tid, mid) => api.sendMessage(content, tid, mid);
  const argument = args.slice(1).join(" ");

  switch (args[0]) {
    case 'search':
      try {
        const keyword = args.slice(1).join(" ");
        const searchData = await getdata(keyword);
        if (!searchData || searchData.length === 0) {
          send("Koi result nahi mila.", tid, mid);
          return;
        }
        const img = searchData.map(result => result.cover_url);
        const listMessage = searchData.map((result, index) => `|› ${index + 1}. Title: ${result.title}\n|› Creator: ${result.author.name}\n──────────────────`).join('\n');
        send({
          body: `[ Capcut Sample Search ]\n──────────────────\n${listMessage}\n\n📌 Number ke saath reply karke video download karo`,
          attachment: await Promise.all(img.map(url => streamURL(url, 'jpg')))
        }, tid, (error, info) => {
          if (error) return console.error("Message bhejne mein error:", error);
          global.client.handleReply.push({
            type: "search",
            name: this.config.name,
            author: sid,
            messageID: info.messageID,
            result: searchData,
          });
        });
      } catch (error) {
        console.error("Error:", error.message);
        send("Kuch toh gadbad hai, thodi der baad try karo.", tid, mid);
      }
      break;

    default:
      api.sendMessage("📝 capcut search <keyword>", tid, mid);
      break;
  }
};

// Convert timestamp to date
function convertTime(timestamp) {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${day}/${month}/${year}`;
}

// Stream URL for attachments
let streamURL = (url, ext = 'jpg') => require('axios').get(url, { responseType: 'stream' }).then(res => (res.data.path = `tmp.${ext}`, res.data)).catch(e => null);

// Reply handler for search results
this.handleReply = async function ({ event, api, handleReply, args }) {
  const { threadID: tid, messageID: mid, body } = event;
  switch (handleReply.type) {
    case 'search':
      const choose = parseInt(body);
      api.unsendMessage(handleReply.messageID);
      if (isNaN(choose)) {
        return api.sendMessage('⚠️ Ek number daalo', tid, mid);
      }
      if (choose > 6 || choose < 1) {
        return api.sendMessage('❎ Yeh number list mein nahi hai', tid, mid);
      }
      try {
        const chosenVideo = handleReply.result[choose - 1];
        const videoResponse = await axios.get(chosenVideo.video_url, { responseType: 'stream' });
        const videoData = videoResponse.data;
        api.sendMessage({
          body: `[ Capcut Video Info ]\n──────────────────\n|› Title: ${chosenVideo.title}\n|› Creator: ${chosenVideo.author.name} (${chosenVideo.author.unique_id})\n|› Duration: ${formatTime(chosenVideo.duration)} second\n|› Photos Needed: ${chosenVideo.fragment_count}\n|› Template Uses: ${chosenVideo.usage_amount}\n|› Views: ${chosenVideo.play_amount}\n|› Likes: ${chosenVideo.like_count}\n|› Comments: ${chosenVideo.interaction.comment_count}\n|› Saves: ${chosenVideo.favorite_count}\n|› Upload Date: ${moment.unix(chosenVideo.create_time).tz('Asia/Kolkata').format('HH:mm:ss - DD/MM/YYYY')}`,
          attachment: videoData
        }, tid, mid);
      } catch (error) {
        console.error("Error:", error.message);
        api.sendMessage("Video download karne mein error aaya.", tid, mid);
      }
      break;
    default:
      break;
  }
};

// Format time in seconds
function formatTime(time) {
  const totalSeconds = Math.floor(time / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Search function for Capcut templates
async function getdata(keyword) {
  const res = await axios.get(`https://hoanghao.me/api/capcut/search?keyword=${keyword}`);
  const results = res.data.data.video_templates;
  const randomIndexes = [];
  while (randomIndexes.length < 6) {
    const randomIndex = Math.floor(Math.random() * results.length);
    if (!randomIndexes.includes(randomIndex)) {
      randomIndexes.push(randomIndex);
    }
  }
  return randomIndexes.map(index => results[index]);
}
