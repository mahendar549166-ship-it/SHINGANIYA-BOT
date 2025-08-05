const axios = require("axios");

// लिंक चेक करने का फंक्शन
function sahiUrlHai(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports.config = {
  name: 'down',
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "लिंक से फाइल डाउनलोड करें",
  commandCategory: "टूल्स",
  usages: "#down + लिंक",
  cooldowns: 0,
  images: [],
};

module.exports.run = async function({ api, event, args }) {
  const downloadKaro = (url) => axios.get(url, { responseType: "stream" }).then((r) => r.data);

  // मैसेज या रिप्लाई से लिंक निकालें
  const links = event.type === 'message_reply' 
    ? event.messageReply.body.split('\n') 
    : args.join(' ').split('\n');
  
  const sahiLinks = [];
  const galatLinks = [];
  const audioLinks = [];
  const videoLinks = [];
  const imageLinks = [];

  // हर लिंक को चेक करें
  links.forEach((link, index) => {
    if (!sahiUrlHai(link)) {
      galatLinks.push(index + 1);
    } else {
      sahiLinks.push(link);

      if (link.endsWith('.mp3')) audioLinks.push(link);
      else if (link.endsWith('.mp4')) videoLinks.push(link);
      else if (link.endsWith('.gif') || link.endsWith('.jpg') || link.endsWith('.jpeg') || link.endsWith('.png')) 
        imageLinks.push(link);
      else galatLinks.push(index + 1);
    }
  });

  // गलत लिंक के लिए मैसेज
  if (galatLinks.length > 0) {
    const errorMessage = `निम्न लिंक गलत हैं (${galatLinks.join(', ')}... हटा दिए गए हैं।`;
    api.sendMessage({ body: errorMessage, attachment: [] }, event.threadID);
  }

  // सभी लिंक्स को डाउनलोड करें
  const downloadSab = async (links) => Promise.all(links.map(async link => await downloadKaro(link)));
  
  const [audioFiles, videoFiles, imageFiles] = await Promise.all([
    downloadSab(audioLinks),
    downloadSab(videoLinks),
    downloadSab(imageLinks)
  ]);

  const totalDownloads = audioFiles.filter(Boolean).length + videoFiles.filter(Boolean).length + imageFiles.filter(Boolean).length;

  // प्रोग्रेस मैसेज
  api.sendMessage({
    body: `डाउनलोड हो रहा है: ${totalDownloads} फाइल...`,
    attachment: []
  }, event.threadID);

  // फाइल्स को भेजें
  const bhejoFiles = async (files, message) => {
    for (const file of files) {
      api.sendMessage({ body: message, attachment: [file] }, event.threadID);
    }
  };

  bhejoFiles(audioFiles, '✅ ऑडियो डाउनलोड हुआ!');
  bhejoFiles(videoFiles, '✅ वीडियो डाउनलोड हुआ!');
  
  if (imageFiles.length > 0) {
    let message = `✅ ${imageFiles.length} इमेज/गिफ डाउनलोड हुए!`;
    api.sendMessage({ body: message, attachment: imageFiles }, event.threadID);
  }
};
