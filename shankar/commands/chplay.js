const axios = require('axios');
const cheerio = require('cheerio');

module.exports.config = {
 name: 'chplay',
 version: '1.1.1',
 hasPermssion: 0,
 credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
 description: 'Google Play Store par app ki jankari dekhein',
 commandCategory: 'Upyogita',
 usages: '[]',
 cooldowns: 5,
 images: [],
};

module.exports.run = async function ({ api, event, args }) {
 try {
 const query = args.join(' ');

 if (!query) {
 api.sendMessage('⚠️ Google Play par jankari dekhne ke liye app ka naam daalein!', event.threadID, event.messageID);
 return;
 }

 const res = await axios.get(`https://play.google.com/store/search?q=${encodeURIComponent(query)}&c=apps`);

 const $ = cheerio.load(res.data);
 const appName = $('.vWM94c').text().trim();
 const developer = $('.LbQbAe').text().trim();
 const inAppPurchases = $('.SH9oqb .UIuSk').text().trim();
 const description = $('.RuAVU .omXQ6c').text().trim();
 const rating = $('.w7Iutd .TT9eCd').text().trim();
 const reviews = $('.w7Iutd .g1rdde').eq(0).text().trim();
 const contentRating = $('.g1rdde [itemprop="contentRating"] span').text().trim();
 const appLink = 'https://play.google.com' + $('.Qfxief').attr('href');
 const thumb = $('.T75of.bzqKMd').attr('src');
 const screenshot = $('.ClM7O img').attr('src');
 const img = [
 thumb,
 screenshot
 ];
 let image = [];

 for (let i = 0; i < img.length; i++) {
 const a = img[i];
 const stream = (await axios.get(a, {
 responseType: 'stream'
 })).data;
 image.push(stream);
 }

 api.sendMessage({ body: `[ INFO - Google Play Store App ]\n──────────────────\n|› App ka Naam: ${appName}\n|› Developer: ${developer}\n|› App mein Kharidari: ${inAppPurchases}\n|› Vivran: ${description}\n|› Rating: ${rating}\n|› Rating ke Liye Votes: ${reviews}\n|› Content Rating: ${contentRating}\n|› Download Link: ${appLink}`, attachment: image }, event.threadID, event.messageID);
 } catch (error) {
 api.sendMessage(`❎ App ki jankari lene mein error: ${error.message}`, event.threadID, event.messageID);
 }
};
