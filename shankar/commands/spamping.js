module.exports.config = {
 name: "spamping",
 version: "2.0.0",
 hasPermssion: 3,
 credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
 description: "Ek content ko baar baar bhejkar spam karna",
 commandCategory: "DongDev",
 usages: "",
 cooldowns: 1,
 envConfig: {
 spamDelay: 2 
 }
};

const spamThreads = new Set(); 
function delay(ms) {
 return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports.run = async function ({ api, event, args }) { 
 const { threadID, messageID } = event;
 const botID = api.getCurrentUserID();
 const asliContent = (args.length != 0) ? args.join(" ") : "Le Nguyen bahut sundar hai";
 const listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);

 if (args[0] === "stop") {
 if (spamThreads.has(threadID)) {
 spamThreads.delete(threadID);
 return api.sendMessage('Spam band kar diya!', threadID, messageID);
 } 
 return api.sendMessage('Koi spam process nahi chal raha!', threadID, messageID);
 } 

 if (!spamThreads.has(threadID)) {
 spamThreads.add(threadID);
 api.sendMessage(`Spam shuru kar diya!`, threadID, messageID);
 while (spamThreads.has(threadID)) {
 await delay(this.config.envConfig.spamDelay * 1000);

 if (spamThreads.has(threadID)) {
 let content = "‎" + asliContent;
 let mentions = listUserID.map(idUser => ({ id: idUser, tag: content, fromIndex: 0 }));

 api.sendMessage({ body: content, mentions }, threadID);
 }
 }
 } else {
 api.sendMessage('Pehle se hi spam chal raha hai!', threadID, messageID);
 }
};
