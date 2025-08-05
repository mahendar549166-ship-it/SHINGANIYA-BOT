const axios = require('axios');
module.exports.config = {
  name: "cardinfov3",
  version: "1.0.1",
  hasPermission: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Facebook user ka card info v3",
  commandCategory: "Edit-img",
  usages: "cardinfo fb",
  usePrefix: false,
  cooldowns: 20
};

module.exports.run = async ({ api, event, Users, Threads, args }) => {
  try {
    const token = global.config.ACCESSTOKEN;

    let id;
    if (Object.keys(event.mentions).length > 0) {
      id = Object.keys(event.mentions)[0].replace(/\&mibextid=ZbWKwL/g, '');
    } else {
      id = args[0] !== undefined ? (isNaN(args[0]) ? await global.utils.getUID(args[0]) : args[0]) : event.senderID;
      if (event.type === "message_reply") {
        id = event.messageReply.senderID;
      }
    }

    const resp = await axios.get(`https://graph.facebook.com/${id}?fields=id,is_verified,cover,updated_time,work,education,likes,created_time,work,posts,hometown,username,family,timezone,link,name,locale,location,about,website,birthday,gender,relationship_status,significant_other,quotes,first_name,subscribers.limit(0)&access_token=${token}`);
    const name = resp.data.name;
    const uid = resp.data.id;
    const gender = resp.data.gender;
    const relationship_status = resp.data.relationship_status || "Koi data nahi";
    const bday = resp.data.birthday || "Prakaashit nahi";
    const follower = resp.data.subscribers?.summary?.total_count || "❎";
    const hometown = resp.data.hometown?.name || "Koi data nahi";
    const res = await axios.get(`https://apibot.pmd06.repl.co/fbcover/v3?name=${name}&birthday=${bday}&love=${relationship_status}&location=${resp.data.location?.name || 'Koi data nahi'}&hometown=${hometown}&follow=${follower}&gender=${gender === 'male' ? 'Purush' : gender === 'female' ? 'Mahila' : 'Prakaashit nahi'}&uid=${uid}`, {
      responseType: 'stream'
    });
    const img = res.data;
    api.sendMessage({ body: ``, attachment: img }, event.threadID, event.messageID);
  } catch (error) {
    console.error('Error downloading image:', error);
    api.sendMessage(`Anurodh ke prakriya mein error hua. Kripya dobara prayas karen.`, event.threadID);
  }
};
