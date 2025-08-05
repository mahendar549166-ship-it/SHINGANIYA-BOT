const axios = require("axios");

module.exports.config = {
  name: "bfl",
  version: "1.0.3",
  hasPermission: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Facebook par follow badhane ka tool",
  commandCategory: "Uppyogita",
  cooldowns: 5,
  images: [],
};

module.exports.run = async ({ event, api }) => {
  const tokens = [
    "EAAAAUaZA8jlABOyr8Ygo5Gy8FYykyZAwEMTDLuGoteO5PIhqsFSQURZACOvUCQuVGN6AnkGvjQvP8E2rZCkt3y8ZCMJCYHTMVJaGmG0LHD8VY0cze5fND4KMZAzgTNxDNwKLbxa5ZB9VchnSZC0Yp6TONwNnPnuZBReN6IcJzNp6TFNbrnqafgR2ojWoZD"
  ];

  api.sendMessage(
    `[ BUFF FOLLOW FACEBOOK ]\n────────────────────\n\n1. Tool shuru karein - jawab mein UID daalain jisko buff karna hai, agar nahi diya toh default admin ka UID hoga\n2. Tool band karein\n────────────────────\n🔐 Maujooda tokens ki sankhya: ${tokens.length}\n📌 Mode chunne ke liye STT ka jawab (reply) dein`,
    event.threadID,
    (error, info) => {
      global.client.handleReply.push({
        type: "choose",
        name: module.exports.config.name,
        author: event.senderID,
        messageID: info.messageID,
        tokens,
      });
    }
  );
};

module.exports.handleReply = async function ({
  args,
  event,
  Users,
  api,
  handleReply,
  Currencies,
  __GLOBAL,
}) {
  const tokens = handleReply.tokens || [];

  switch (handleReply.type) {
    case "choose": {
      const choose = parseInt(event.body);

      if (isNaN(choose) || choose < 1 || choose > 2) {
        return api.sendMessage(
          "⚠️ Kripya ek valid number daalain (1 ya 2)",
          event.threadID
        );
      }

      switch (choose) {
        case 1: {
          const uid = handleReply.author;
          api.sendMessage(
            `🔄 Follow buff karne ki prakriya shuru ho rahi hai!`,
            event.threadID,
            async (err, info) => {
              if (err) {
                console.error("Message bhejne mein error:", err);
                return;
              }

              setTimeout(async () => {
                await api.unsendMessage(info.messageID);
              }, 100000);

              api.unsendMessage(handleReply.messageID);

              let successCount = 0;
              let errorCount = 0;
              let currentIndex = 0;

              const makeRequest = async () => {
                if (currentIndex < tokens.length) {
                  const accessToken = tokens[currentIndex];

                  if (!accessToken) {
                    api.sendMessage("Access token valid nahi hai");
                    currentIndex++;
                    makeRequest();
                    return;
                  }

                  const headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36",
                    "Accept-Language": "hi-IN, en-US;q=0.9", // Bhasha preference ko Hindi mein set kiya
                  };

                  try {
                    const response = await axios.post(
                      `https://graph.facebook.com/${uid}/subscribers`,
                      null,
                      {
                        params: {
                          method: "POST",
                          access_token: accessToken,
                        },
                        headers,
                      }
                    );

                    if (response.data.error) {
                      errorCount++;
                    } else {
                      successCount++;
                    }
                  } catch (error) {
                    errorCount++;
                  }

                  // Upyog kiya gaya token hatao
                  tokens.splice(currentIndex, 1);

                  currentIndex++;
                  setTimeout(makeRequest, 30000); // Agle request ke liye 30 second ka wait
                } else {
                  // Loop khatam, natija bhejo
                  const resultMessage = `🎉 Facebook follow buff ka natija:\n👍 Safal: ${successCount} follow\n🚫 Asafal: ${errorCount} follow`;
                  api.sendMessage(resultMessage, event.threadID);
                }
              };

              makeRequest(); // Loop shuru karein
            }
          );
          break;
        }
        case 2: {
          api.unsendMessage(handleReply.messageID);
          break;
        }
      }
      break;
    }
  }
};
