module.exports.config = {
    name: "antijoin",
    version: "1.0.0",
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    hasPermssion: 1,
    description: "Naye sadasya ko group mein shamil hone se rokna",
    usages: "",
    commandCategory: "System",
    cooldowns: 0
};

module.exports.run = async({ api, event, Threads }) => {
    const info = await api.getThreadInfo(event.threadID);
    if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) 
        return api.sendMessage('[ ANTI JOIN ] » Group ke admin adhikar chahiye, kripya bot ko admin banayein aur dobara koshish karein', event.threadID, event.messageID);
    const data = (await Threads.getData(event.threadID)).data || {};
    if (typeof data.newMember == "undefined" || data.newMember == false) data.newMember = true;
    else data.newMember = false;
    await Threads.setData(event.threadID, { data });
    global.data.threadData.set(parseInt(event.threadID), data);
    return api.sendMessage(`[ ANTI JOIN ] » Anti join ${(data.newMember == true) ? "chalu" : "band"} kiya gaya ✅`, event.threadID, event.messageID);
};
