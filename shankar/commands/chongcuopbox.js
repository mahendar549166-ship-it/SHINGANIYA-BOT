module.exports.config = {
 name: "chongcuopbox",
 version: "1.0.0",
 credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
 hasPermssion: 1,
 description: "Group admin badalne se rokein",
 usages: "",
 commandCategory: "Upyogita",
 cooldowns: 0
};

module.exports.run = async({ api, event, Threads}) => {
    const info = await api.getThreadInfo(event.threadID);
    if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) 
      return api.sendMessage('» Group mein prashasak adhikar chahiye, kripya jodkar phir se koshish karen!', event.threadID, event.messageID);
    const data = (await Threads.getData(event.threadID)).data || {};
    if (typeof data["guard"] == "guard" || data["guard"] == false) data["guard"] = true;
    else data["guard"] = false;
    await Threads.setData(event.threadID, { data });
      global.data.threadData.set(parseInt(event.threadID), data);
    return api.sendMessage(`» Anti-group loot ko ${(data["guard"] == true) ? "chalu" : "band"} kar diya gaya hai, ab koi anadhikrit badlav nahi hoga 😼!`, event.threadID, event.messageID);
}
