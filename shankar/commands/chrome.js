const axios = require('axios');

module.exports.config = {
 name: "chrome",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
 description: "दिए गए प्रश्न के साथ Chrome पर खोज करें",
 commandCategory: "उपकरण",
 usages: "",
 cooldowns: 2,
};

module.exports.run = async function({ api, event, args }) {
 const query = args.join(' ');
 if (!query) {
 api.sendMessage("कृपया एक खोज प्रश्न प्रदान करें।", event.threadID);
 return;
 }

 const cx = "7514b16a62add47ae"; // अपनी कस्टम सर्च इंजन ID से बदलें
 const apiKey = "AIzaSyAqBaaYWktE14aDwDE8prVIbCH88zni12E"; // अपनी API कुंजी से बदलें
 const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${query}`;

 try {
 const response = await axios.get(url);
 const searchResults = response.data.items.slice(0, 5);
 let message = `'${query}' के लिए Chrome खोज के शीर्ष 5 परिणाम:\n\n`;
 searchResults.forEach((result, index) => {
 message += `${index + 1}. ${result.title}\n${result.link}\n${result.snippet}\n\n`;
 });
 api.sendMessage(message, event.threadID);
 } catch (error) {
 console.error(error);
 api.sendMessage("Chrome पर खोज करने में त्रुटि हुई।", event.threadID);
 }
};
