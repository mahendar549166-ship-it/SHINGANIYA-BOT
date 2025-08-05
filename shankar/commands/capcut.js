const axios = require("axios");
const moment = require('moment-timezone');

exports.config = {
  name: 'capcut',
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
exports.run = async function ({ api, event, args }) {
  const { threadID: tid, messageID: mid, senderID: sid } = event;
  const command = args[0];
  const argument = args.slice(1).join(" ");

  switch (command) {
    case 'info':
      const url = argument;
      if (!url) {
        return api.sendMessage("Creator ka profile link daalo!", tid, mid);
      }
      if (!url.startsWith("https://mobile.capcutshare.com/")) {
        return api.sendMessage("❎ URL galat hai. URL aisa hona chahiye: https://mobile.capcutshare.com", tid, mid);
      }
      try {
        const getUrl = await axios.get(url);
        const get = getUrl.request.res.responseUrl;
        const urls = get.split("=")[1].split("&")[0];
        const data = {
          'public_id': urls
        };
        const options = {
          method: 'POST',
          url: 'http://feed-api.capcutapi.com/lv/v1/homepage/profile',
          data: data,
          headers: {
            'Connection': 'keep-alive',
            'Content-Length': '92',
            'Accept-Language': 'hi-IN,hi;q=0.9', // Changed to Hindi
            'Referer': 'https://mobile.capcutshare.com/',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
            'Origin': 'https://mobile.capcutshare.com',
            'Host': 'feed-api.capcutapi.com',
            'pf': '1',
            'app-sdk-version': '100.0.0',
            'sign': '279ff6779bd2bb1684e91d411499ee79',
            'loc': 'IN', // Changed to India
            'sign-ver': '1',
            'device-time': '1699453732',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site',
            'Sec-Fetch-Dest': 'empty'
          }
        };
        const response = await axios.request(options);
        const userData = response.data.data;
        const user = userData.user;
        const userStatistics = userData.user_statistics;
        const vipInfo = userData.vip_info;
        const tabEntrance = userData.tab_entrance;
        const tiktokInfo = user.is_display_tiktok_profile ? `Chalu\n│ Link: ${user.tiktok_user_info.deeplink}` : "Band";
        const certificationDesc = user.creator_info.certification_desc ? `${user.creator_info.certification_desc}` : "Koi nahi";

        api.sendMessage({
          body: `╭─────────────⭓
│ Naam: ${user.name}
│ CapcutID: ${user.unique_id}
│ Uid: ${user.uid}
│ Ling: ${user.gender === 1 ? "Purush" : user.gender === 2 ? "Mahila" : "Pata nahi"}
│ Following: ${user.relation_info.statistics.following_count}
│ Followers: ${user.relation_info.statistics.follower_count}
│ Total Likes: ${userStatistics.like_count}
│ Description: ${user.description}
│ Ban: ${user.ban ? "Haan" : "Nahi"}
│ Total Templates: ${userStatistics.template_count}
│ Role: ${user.role}
${vipInfo ? `│ VIP Plan: ${convertTime(vipInfo.start_time)} - ${convertTime(vipInfo.end_time)}` : "Koi VIP nahi"}
├─────────────⭔
│ Creator Info
│ Level: ${user.creator_info.level}
│ Score: ${user.creator_info.score_v2}
│ Level (v2): ${user.creator_info.level_v2}
│ Certification Description: ${certificationDesc}
│ Affiliation: ${user.creator_info.affiliation_biz_id}
├─────────────⭔
│ TikTok Profile Dikhaya: ${tiktokInfo}
╰─────────────⭓`, 
          attachment: await streamURL(user.avatar_url, 'jpg')
        }, tid, mid);
      } catch (error) {
        console.error(error);
        api.sendMessage("❎ User ka data nahi mila", tid, mid);
      }
      break;

    case 'search':
      try {
        const keyword = args.slice(1).join(" ");
        const data = await search(keyword);
        if (!data || !data.video_templates || data.video_templates.length === 0) {
          api.sendMessage("Koi result nahi mila.", tid, mid);
          return;
        }
        let streamURL = (url, ext = 'jpg') => require('axios').get(url, { responseType: 'stream', }).then(res => (res.data.path = `tmp.${ext}`, res.data)).catch(e => null);
        const searchData = getdata(data);
        const img = searchData.map(result => result.cover_url);
        const listMessage = searchData.map((result, index) => `|› ${index + 1}. Title: ${result.title}\n|› Creator: ${result.author.name}\n──────────────────`).join('\n');
        api.sendMessage({
          body: `[ Capcut Sample Search ]\n──────────────────\n${listMessage}\n\n📌 Number ke saath reply karke video download karo`, 
          attachment: await Promise.all(img.map(url => streamURL(url, 'jpg')))
        }, tid, (error, info) => {
          if (error) return console.error("Message bhejne mein error:", error);
          global.client.handleReply.push({
            type: "search",
            name: exports.config.name,
            author: sid,
            messageID: info.messageID,
            result: searchData,
          });
        });
      } catch (error) {
        console.error("Error:", error.message);
        api.sendMessage("Kuch toh gadbad hai, thodi der baad try karo.", tid, mid);
      }
      break;

    default:
      api.sendMessage("Iska istemal kaise karna hai:\n\n" + exports.config.usages.join("\n"), tid, mid);
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
module.exports.handleReply = async function ({ event, api, handleReply, args }) {
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
          body: `[ Capcut Video Info ]\n──────────────────\n|› Title: ${chosenVideo.title}\n|› Creator: ${chosenVideo.author.name} (${chosenVideo.author.unique_id})\n|› Duration: ${formatTime(chosenVideo.duration)} second\n|› Photos Needed: ${chosenVideo.fragment_count}\n|› Template Uses: ${chosenVideo.usage_amount}\n|› Views: ${chosenVideo.play_amount}\n|› Likes: ${chosenVideo.like_count}\n|› Comments: ${chosenVideo.interaction.comment_count}\n|› Saves: ${chosenVideo.favorite_count}\n|› Upload Date: ${moment.unix(chosenVideo.create_time).tz('Asia/Kolkata').format('HH:mm:ss - DD/MM/YYYY')}\n|› Template Link: https://www.capcut.com/template-detail/${chosenVideo.id}\n──────────────────\n|› Samay: ${moment.tz("Asia/Kolkata").format("DD/MM/YYYY || HH:mm:ss")}`,
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
async function search(keyword) {
  if (!keyword) throw new Error('Program chalane ke liye data chahiye');
  const options = {
    method: 'POST',
    url: 'https://edit-api-sg.capcut.com/lv/v1/cc_web/replicate/search_templates',
    headers: {
      'Host': 'edit-api-sg.capcut.com',
      'Content-Type': 'application/json',
      'accept-language': 'hi-IN,hi;q=0.9', // Changed to Hindi
      'app-sdk-version': '48.0.0',
      'appvr': '5.8.0',
      'cookie': '_ga=GA1.1.382841626.1704093538; _clck=udqiju%7C2%7Cfi1%7C0%7C1461; passport_csrf_token=01a7a2ffdee0c9c90c25c96c74c3c30a; passport_csrf_token_default=01a7a2ffdee0c9c90c25c96c74c3c30a; passport_auth_status=fa3fafccdbf54b72a5ae969153a8367c%2C; passport_auth_status_ss=fa3fafccdbf54b72a5ae969153a8367c%2C; sid_guard=d7a0d457a8ccbd28c80d9eb4c9da3a45%7C1704093581%7C34560000%7CTue%2C+04-Feb-2025+07%3A19%3A41+GMT; uid_tt=2911adf660e32d4908db5d59a794e00a60aafee969aff391ec0b4538fe56b680; uid_tt_ss=2911adf660e32d4908db5d59a794e00a60aafee969aff391ec0b4538fe56b680; sid_tt=d7a0d457a8ccbd28c80d9eb4c9da3a45; sessionid=d7a0d457a8ccbd28c80d9eb4c9da3a45; sessionid_ss=d7a0d457a8ccbd28c80d9eb4c9da3a45; sid_ucp_v1=1.0.0-KGMwZGQ2ZDc2YzQzNzBlZjNhYThmNWFjNGFlMGVmYzY5ODNiOTA2OGEKIAiCiK_K0u2ZyWUQjc_JrAYYnKAVIAwwjc_JrAY4CEASEAMaA3NnMSIgZDdhMGQ0NTdhOGNjYmQyOGM4MGQ5ZWI0YzlkYTNhNDU; ssid_ucp_v1=1.0.0-KGMwZGQ2ZDc2YzQzNzBlZjNhYThmNWFjNGFlMGVmYzY5ODNiOTA2OGEKIAiCiK_K0u2ZyWUQjc_JrAYYnKAVIAwwjc_JrAY4CEASEAMaA3NnMSIgZDdhMGQ0NTdhOGNjYmQyOGM4MGQ5ZWI0YzlkYTNhNDU; store-idc=alisg; store-country-code=vn; store-country-code-src=uid; odin_tt=f0f86a4fba8632aac92b736a20a51eea7b68464e0e6e8f36504001c2863c987d35e356093ad7c65cc41c4ee3d011a08d37b531eec47f6ada19a8bd0780acccd0; csrf_session_id=a837de9ddb8e5a4e263bad23c1453480; ttwid=1|2P_Y7hiaQHOgRN2dfMNzFES4MewtjPWkZKughSH8Sjs|1704116592|c038d929f11a4ce2bc34850c5e38f5957b008cbef30e5103a2fbef9cceb27f05; _uetsid=0830e720a87611ee9d58776762c93b1d; _uetvid=08345970a87611eebf7e650c56cc879e; _ga_F9J0QP63RB=GS1.1.1704116587.7.1.1704116598.0.0.0; _clsk=jq6pma%7C1704116600519%7C1%7C0%7Cy.clarity.ms%2Fcollect; msToken=sj6PJlGDkuSAJAkgVRcGlc_divtmWrAboGYd-zzn3ZN1O-rAksovTw4JTyBiNyvDLgpsAyIuAuQo8pZwpv2PhhBQqhMm9Bm3q3j0Mqt8NTLo',
      'device-time': '1704116611',
      'lan': 'hi-IN', // Changed to Hindi
      'loc': 'in', // Changed to India
      'origin': 'https://www.capcut.com',
      'pf': '7',
      'referer': 'https://www.capcut.com/',
      'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'sign': '6edde988911c68544a053e83f0e3b814',
      'sign-ver': '1',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    data: JSON.stringify({
      'sdk_version': '86.0.0',
      'count': 20,
      'cursor': '0',
      'enter_from': 'workspace',
      'query': keyword,
      'scene': 1,
      'search_version': 2,
      'cc_web_version': 1
    }),
  };
  try {
    const response = await axios.request(options);
    return response.data.data;
  } catch (error) {
    throw new Error('Toot gaya re baba...');
  }
}

// Get random data for search results
function getdata(data) {
  const results = data.video_templates;
  const randomIndexes = [];
  while (randomIndexes.length < 6) {
    const randomIndex = Math.floor(Math.random() * results.length);
    if (!randomIndexes.includes(randomIndex)) {
      randomIndexes.push(randomIndex);
    }
  }
  return randomIndexes.map(index => results[index]);
}
