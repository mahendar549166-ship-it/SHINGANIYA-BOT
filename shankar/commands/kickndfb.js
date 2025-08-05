module.exports.config = {
  name: "kickndfb",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Facebook users ko filter karein",
  commandCategory: "Prashasak",
  usages: "",
  cooldowns: 20
};

module.exports.run = async function ({ api, event }) {
  var { userInfo, adminIDs } = await api.getThreadInfo(event.threadID);
  var success = 0, fail = 0;
  var arr = [];
  for (const e of userInfo) {
    if (e.gender == undefined) {
      arr.push(e.id);
    }
  }

  adminIDs = adminIDs.map(e => e.id).some(e => e == api.getCurrentUserID());
  if (arr.length == 0) {
    return api.sendMessage("Aapke samuh mein koi 'Facebook User' nahi hai.", event.threadID);
  } else {
    api.sendMessage("Aapke samuh mein abhi " + arr.length + " 'Facebook Users' hain.", event.threadID, function () {
      if (!adminIDs) {
        api.sendMessage("Lekin bot prashasak nahi hai, isliye filter nahi kar sakta.", event.threadID);
      } else {
        api.sendMessage("Filter shuru ho raha hai...", event.threadID, async function () {
          for (const e of arr) {
            try {
              await new Promise(resolve => setTimeout(resolve, 1000));
              await api.removeUserFromGroup(parseInt(e), event.threadID);
              success++;
            } catch {
              fail++;
            }
          }

          api.sendMessage("Safalta se " + success + " logon ko filter kiya gaya.", event.threadID, function () {
            if (fail != 0) return api.sendMessage(fail + " logon ko filter karne mein asafal raha.", event.threadID);
          });
        });
      }
    });
  }
};
