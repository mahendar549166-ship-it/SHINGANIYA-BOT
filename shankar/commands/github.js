const moment = require('moment');
const axios = require('axios');

module.exports.config = {
  name: "github",
  version: "1.0.0",
  hasPermission: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "GitHub khate ki jankari",
  commandCategory: "Upyogita",
  usages: "[upayogkarta naam]",
  cooldowns: 5,
  images: [],
};

module.exports.run = async ({ api, event, args }) => {
  if (!args[0]) {
    api.sendMessage(
      '⚠️ Kripaya GitHub upayogkarta naam daalein\nIstemaal: `github [upayogkarta naam]`',
      event.threadID,
      event.messageID
    );
    return;
  }

  const username = args.join(" ");

  try {
    const { data } = await axios.get(`https://api.github.com/users/${username}`);
    const {
      login,
      avatar_url,
      name,
      id,
      html_url,
      public_repos,
      followers,
      following,
      location,
      created_at,
      bio,
    } = data;

    const createdDate = moment(created_at).format('DD/MM/YYYY');
    const createdTime = moment(created_at).format('HH:mm:ss');

    const message = `[ GITHUB UPYOGKARTA JANKARI ]\n────────────────────\n|› Upayogkarta Naam: ${login}\n|› Naam: ${name || 'Nahi hai'}\n|› ID: ${id}\n|› Profile: ${html_url}\n|› Repository ki sankhya: ${public_repos}\n|› Anusarankarta: ${followers}\n|› Anusaran kar rahe hain: ${following}\n|› Sthaan: ${location || 'Nahi hai'}\n|› Banane ki tareekh: ${createdDate} - ${createdTime}\n|› Bio: ${bio || 'Nahi hai'}\n────────────────────`;

    api.sendMessage(
      { body: message, attachment: (await axios.get(avatar_url, { responseType: "stream" })).data },
      event.threadID,
      event.messageID
    );
  } catch (error) {
    console.error('GitHub data prapt karne mein error:', error);
    api.sendMessage(
      '❎ GitHub data prapt karne mein error hua ya upayogkarta maujood nahi hai.',
      event.threadID
    );
  }
};
