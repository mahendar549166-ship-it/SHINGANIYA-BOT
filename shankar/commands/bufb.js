const axios = require("axios");

module.exports.config = {
  name: "bfl",
  version: "1.0.3",
  hasPermission: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Facebook follow buff max speed",
  commandCategory: "Utility",
  cooldowns: 5,
  images: [],
};

// Main run function
module.exports.run = async ({ event, api }) => {
  const tokens = [
    "EAAD6V7os0gcBO118rXX4bR8MEidZB4j6MAd63EC7gZCElCZBuqZBtKkZC3VAVJyLOjFZCdBi1i2KoaSDZAhnvyqSCYxFveTW3DeX7UsD6613H6OhlY0TZC5TVBrk0OL6TUJibhnfmQQZBP8oRXiELlVmWwEHk40wZAjzcJSUVJWszW09mIX1YJDBoaVON6xhGMJoToqgZDZD"
  ];

  api.sendMessage(
    `[ FACEBOOK FOLLOW BUFF ]\n────────────────────\n\n1. Tool start karo - Reply mein UID daalo jisko buff karna hai, nahi toh default admin UID hoga\n2. Tool band karo\n────────────────────\n🔐 Abhi ke tokens: ${tokens.length}\n📌 Number ke saath reply karke mode chuno`,
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

// Reply handler for buff follow
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
          "⚠️ Sahi number daalo (1 ya 2)",
          event.threadID
        );
      }

      switch (choose) {
        case 1: {
          const uid = handleReply.author;
          api.sendMessage(
            `🔄 Follow buff shuru ho raha hai!`,
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

              // API request function
              const makeRequest = async () => {
                if (currentIndex < tokens.length) {
                  const accessToken = tokens[currentIndex];

                  if (!accessToken) {
                    api.sendMessage("Access token galat hai", event.threadID);
                    currentIndex++;
                    makeRequest();
                    return;
                  }

                  const headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36",
                    "Accept-Language": "hi-IN, en-US;q=0.9", // Language Hindi mein set
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

                  // Token hatao jo use ho chuka
                  tokens.splice(currentIndex, 1);

                  currentIndex++;
                  setTimeout(makeRequest, 30000); // 30 second wait for next request
                } else {
                  // Result message
                  const resultMessage = `🎉 Facebook follow buff ka result:\n👍 Safal: ${successCount} follow\n🚫 Asafal: ${errorCount} follow`;
                  api.sendMessage(resultMessage, event.threadID);
                }
              };

              makeRequest(); // Shuru karo loop
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
