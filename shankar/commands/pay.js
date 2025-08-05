module.exports.config = {
  name: "pay",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Apne coins kisi aur ko transfer karen",
  commandCategory: "Utility",
  usages: "transfer @tag coins",
  cooldowns: 5,
};

module.exports.run = async ({ event, api, Currencies, args, Users }) => {
  let { threadID, messageID, senderID } = event;
  const mention = Object.keys(event.mentions)[0];
  if (!mention && event.messageReply) {
    if (isNaN(args[0])) return api.sendMessage(`Aapne jo daala wo ek sahi number nahi hai!`, threadID, messageID);
    const coins = parseInt(args[0]);
    let balance = (await Currencies.getData(senderID)).money;
    const namePay = await Users.getNameUser(event.messageReply.senderID);
    if (coins > balance) return api.sendMessage(`Aapke paas itne coins nahi hain jitne aap transfer karna chahte hain!`, threadID, messageID);
    return api.sendMessage({ body: namePay + ` ko ${args[0]} coins transfer kar diye` }, threadID, async () => {
      await Currencies.increaseMoney(event.messageReply.senderID, coins);
      await Currencies.decreaseMoney(senderID, coins);
    }, messageID);
  }
  let name = event.mentions[mention]?.split(" ").length;
  if (!mention || !event.messageReply) return api.sendMessage('Kisi ko tag ya reply karen jisko coins transfer karne hain!', threadID, messageID);
  else {
    if (!isNaN(args[0 + name])) {
      const coins = parseInt(args[0 + name]);
      let balance = (await Currencies.getData(senderID)).money;
      if (event.type == "message_reply") { mention[0] = event.messageReply.senderID; }
      if (coins <= 0) return api.sendMessage('Transfer karne wale coins sahi nahi hain', threadID, messageID);
      if (coins > balance) return api.sendMessage('Aapke paas itne coins nahi hain jitne aap transfer karna chahte hain!', threadID, messageID);
      else {
        return api.sendMessage({ body: event.mentions[mention].replace(/@/g, "") + ` ko ${args[0 + name]} coins transfer kar diye` }, threadID, async () => {
          await Currencies.increaseMoney(mention, coins);
          await Currencies.decreaseMoney(senderID, coins);
        }, messageID);
      }
    } else return api.sendMessage('Transfer karne ke liye coins ki sankhya daalen', threadID, messageID);
  }
};
