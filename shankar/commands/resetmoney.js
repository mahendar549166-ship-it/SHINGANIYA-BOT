module.exports.config = {
  name: "resetmoney",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Paisa group ya sabhi groups ka zero karen",
  commandCategory: "Utility",
  usages: "[cc], [del], [all]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, Currencies, args }) => {
  switch (args[0]) {
    case 'all':
      {
        const allUserID = global.data.allUserID;
        for (const singleUser of allUserID) {
          var currenciesData = await Currencies.getData(singleUser);
          if (currenciesData != false) {
            var money = currenciesData.money;
            if (typeof money != "undefined") {
              money -= money;
              await Currencies.setData(singleUser, { money });
            }
          }
        }
        api.sendMessage("Server ke sabhi users ka paisa zero ho gaya!", event.threadID);
      }
      break;
    default:
      {
        const data = event.participantIDs;
        for (const userID of data) {
          var currenciesData = await Currencies.getData(userID);
          if (currenciesData != false) {
            var money = currenciesData.money;
            if (typeof money != "undefined") {
              money -= money;
              await Currencies.setData(userID, { money });
            }
          }
        }
        api.sendMessage("Group ke sabhi members ka paisa zero ho gaya!", event.threadID);
      }
      break;
  }
};
