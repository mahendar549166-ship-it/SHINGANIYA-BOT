const axios = require('axios');
const fs = require('fs');
const path = require('path');
const clientId = 'nFddmw3ZibOug7XKUPPyXjYCElJCcGcv';
exports.config = {
  name: 'scl',
  version: '2.0.0',
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑", // Koi toh jealous hai, isliye pareshan hai
  description: 'SoundCloud par gaane khojein',
  commandCategory: 'Utility',
  usages: '[]',
  cooldowns: 5,
  images: [],
};
function formatDuration(d) {
  const h = Math.floor(d / 3600000);
  const m = Math.floor((d % 3600000) / 60000);
  const s = Math.floor((d % 60000) / 1000);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
async function search(url, params = {}) {
  const response = await axios.get(url, { params: { ...params, client_id: clientId } });
  return response.data;
}
async function download(url, filename) {
  const writer = fs.createWriteStream(filename);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}
exports.run = async function ({ api, event, args }) {
  const query = args.join(" ").trim();
  const { threadID: tid, messageID: mid } = event;
  if (!query) return api.sendMessage("⚠️ Kripya search keyword daalein", tid, mid);
  try {
    const { collection } = await search('https://api-v2.soundcloud.com/search', { q: query, limit: 20 });
    const data = (collection || []).filter(item => item.title && item.user?.username && item.permalink_url && item.duration).slice(0, 6).map(item => ({
        title: item.title,
        artist: item.user.username,
        permalink_url: item.permalink_url,
        duration: formatDuration(item.duration)
      }));
    if (!data.length) return api.sendMessage('Koi sambandhit result nahi mila', tid, mid);
    const messages = data.map((item, index) => `\n${index + 1}. 👤 Naam: ${item.artist}\n📜 Title: ${item.title}\n⏰ Samay: ${item.duration}`);
    api.sendMessage(`📝 Keyword ke liye search list: ${query}\n${messages.join("\n")}\n\n📌 Gaana download karne ke liye STT ke hisaab se reply karein`, tid, (error, info) => {
      if (!error) global.client.handleReply.push({ type: 'reply', name: exports.config.name, messageID: info.messageID, author: event.senderID, data });
    }, mid);
  } catch (error) {
    console.error("❎ Search ke dauraan error:", error);
    api.sendMessage(`❎ Search ke dauraan error ho gaya`, tid, mid);
  }
};
exports.handleReply = async function ({ event, api, handleReply }) {
  const { threadID: tid, messageID: mid, body, senderID } = event;
  if (handleReply.author !== senderID) return;
  const choose = parseInt(body.trim());
  if (isNaN(choose) || choose < 1 || choose > handleReply.data.length) return api.sendMessage('❎ Kripya list mein ek valid number daalein', tid, mid);
  api.unsendMessage(handleReply.messageID);
  const chosenItem = handleReply.data[choose - 1];
  try {
    const trackInfo = await search('https://api-v2.soundcloud.com/resolve', { url: chosenItem.permalink_url });
    const transcoding = trackInfo.media.transcodings.find(t => t.format.protocol === 'progressive');
    if (!transcoding) throw new Error('Koi upyukt data nahi mila');
    const streamUrl = await search(transcoding.url);
    const fileName = path.join(__dirname, `cache/${Date.now()}.mp3`);
    await download(streamUrl.url, fileName);
    api.sendMessage({ body: `⩺ Title: ${trackInfo.title}\n⩺ Samay: ${chosenItem.duration}\n⩺ Artist: ${chosenItem.artist}\n⩺ Genre: ${trackInfo.genre}\n⩺ Play Count: ${trackInfo.playback_count}\n⩺ Likes: ${trackInfo.likes_count}\n⩺ Comments: ${trackInfo.comment_count}\n⩺ Downloads: ${trackInfo.download_count}`, attachment: fs.createReadStream(fileName) }, tid, () => {
      fs.unlink(fileName, (err) => { if (err) console.error('❎ File delete karte waqt error:', err)});
    }, mid);
  } catch (error) {
    console.error('❎ Gaana download karte waqt error:', error);
    api.sendMessage(`❎ Gaana download karte waqt error ho gaya`, tid, mid);
  }
};
