module.exports.config = {
  name: "locmemdie",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Facebook ke inactive ya deleted accounts ko filter karta hai",
  commandCategory: "Group Chat",
  usages: "",
  cooldowns: 150
};

module.exports.run = async function({ api, event }) {
    var { userInfo, adminIDs } = await api.getThreadInfo(event.threadID);    
    var success = 0, fail = 0;
    var arr = [];
    for (const e of userInfo) {
        if (e.gender == undefined) {
            arr.push(e.id);
        }
    };
    adminIDs = adminIDs.map(e => e.id).some(e => e == api.getCurrentUserID());
    if (arr.length == 0) {
        return api.sendMessage(`⚠️ Aapke group mein koi bhi inactive ya deleted account nahi hai`, event.threadID);
    }
    else {
        api.sendMessage(`⚠️ Aapke group mein ${arr.length} Facebook users ke inactive accounts mile, filter karne ja raha hai`, event.threadID, function () {
            if (!adminIDs) {
                api.sendMessage(`⚠️ Bot ko admin permission chahiye, kripya add karke dobara try karein`, event.threadID);
            } else {
                api.sendMessage(`⚠️ Filter shuru kar raha hai...`, event.threadID, async function() {
                    for (const e of arr) {
                        try {
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            await api.removeUserFromGroup(parseInt(e), event.threadID);   
                            success++;
                        }
                        catch {
                            fail++;
                        }
                    }
                    api.sendMessage(`⚠️ ${success} Facebook users ke accounts filter kar diye gaye`, event.threadID, function() {
                        if (fail != 0) return api.sendMessage(`⚠️ ${fail} Facebook users ke accounts filter karne mein asafal`, event.threadID);
                    });
                })
            }
        })
    }
}
