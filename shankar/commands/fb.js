module.exports.config = {
  name: "fb",
  version: "1.0.1",
  hasPermission: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Download Facebook videos",
  commandCategory: "Utility",
  usages: "[Facebook video URL]",
  cooldowns: 5
};

const axios = require('axios');

module.exports.run = async ({ api, event, args }) => {
  const link = args.join(" ");
  const { threadID, messageID } = event;

  if (!link) {
    return api.sendMessage("⚠️ Please provide a valid Facebook video URL", threadID, messageID);
  }

  // Improved URL validation
  if (!link.includes('facebook.com') && !link.includes('fb.watch')) {
    return api.sendMessage("❌ Invalid Facebook video URL", threadID, messageID);
  }

  const streamURL = async (url, ext = 'mp4') => {
    try {
      const response = await axios.get(url, {
        responseType: 'stream',
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });
      response.data.path = `fb_video.${ext}`;
      return response.data;
    } catch (e) {
      console.error('Stream error:', e);
      return null;
    }
  };

  try {
    api.sendMessage("⏳ Downloading video...", threadID, messageID);
    
    const apiUrl = `https://fbdl-api.ngojchaan.repl.co/fbdl?url=${encodeURIComponent(link)}`;
    const res = await axios.get(apiUrl, {
      timeout: 30000,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!res.data.success || !res.data.videoUrl) {
      throw new Error('No video found');
    }

    const videoStream = await streamURL(res.data.videoUrl);
    if (!videoStream) {
      throw new Error('Failed to get video stream');
    }

    await api.sendMessage({
      body: `✅ Successfully downloaded Facebook video\n📌 Quality: HD`,
      attachment: videoStream
    }, threadID, messageID);

  } catch (error) {
    console.error('Download error:', error);
    api.sendMessage("❌ Failed to download video. Please check the URL and try again.", threadID, messageID);
  }
};
