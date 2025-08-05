module.exports.config = {
  name: "acp",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Facebook ID ke jariye dosti karna",
  commandCategory: "Admin",
  usages: "uid",
  images: [],
  cooldowns: 0
};  

module.exports.handleReply = async ({ handleReply, event, api }) => {
  const { author, listRequest } = handleReply;
  api.unsendMessage(handleReply.messageID);
  if (author != event.senderID) return;
  const args = event.body.replace(/ +/g, " ").toLowerCase().split(" ");
  
  const form = {
    av: api.getCurrentUserID(),
    fb_api_caller_class: "RelayModern",
    variables: {
      input: {
        source: "friends_tab",
        actor_id: api.getCurrentUserID(),
        client_mutation_id: Math.round(Math.random() * 19).toString()
      },
      scale: 3,
      refresh_num: 0
    }
  };
  
  const success = [];
  const failed = [];
  
  if (args[0] == "add") {
    form.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
    form.doc_id = "3147613905362928";
  }
  else if (args[0] == "del") {
    form.fb_api_req_friendly_name = "FriendingCometFriendRequestDeleteMutation";
    form.doc_id = "4108254489275063";
  }
  else return api.sendMessage("⚠️ Galat command syntax. Istemal karein: add|del all dosti ke anurodh ko sweekar ya hataane ke liye.", event.threadID, event.messageID);
  
  let targetIDs = args.slice(1);
  
  if (args[1] == "all") {
    targetIDs = [];
    const lengthList = listRequest.length;
    for (let i = 1; i <= lengthList; i++) targetIDs.push(i);
  }
  
  const newTargetIDs = [];
  const promiseFriends = [];
  
  for (const stt of targetIDs) {
    const u = listRequest[parseInt(stt) - 1];
    if (!u) {
      failed.push(`❎ Sankhya ${stt} ke user list mein nahi mile`);
      continue;
    }
    form.variables.input.friend_requester_id = u.node.id;
    const formString = JSON.stringify(form.variables);
    form.variables = formString;
    newTargetIDs.push(u);
    promiseFriends.push(api.httpPost("https://www.facebook.com/api/graphql/", form));
    form.variables = JSON.parse(formString);
  }
  
  const lengthTarget = newTargetIDs.length;
  for (let i = 0; i < lengthTarget; i++) {
    try {
      const friendRequest = await promiseFriends[i];
      if (JSON.parse(friendRequest).errors) failed.push(newTargetIDs[i].node.name);
      else success.push(newTargetIDs[i].node);
    }
    catch(e) {
      failed.push(newTargetIDs[i].node.name);
    }
  }
  
  const successCount = success.length;
  const failedCount = failed.length;
  const successMsg = successCount > 0 ? ` ${args[0] == 'add' ? 'sweekar kiya' : 'hataya'}` : '';
  let successInfo = '';
  for (let i = 0; i < successCount; i++) {
    const user = success[i];
    const stt = targetIDs[i];
    successInfo += `\n${stt}. ${user.name} | ${user.url.replace("www.facebook", "fb")}`;
  }
  api.sendMessage(`☑️ ${successMsg} ${successCount} dosti ke anurodh safal:\n${successInfo}\n${failedCount > 0 ? `\n❎ ${failedCount} dosti ke anurodh asafal` : ''}`, event.threadID, event.messageID);
};

module.exports.run = async ({ event, api }) => {
  const moment = require("moment-timezone");
  const form = {
    av: api.getCurrentUserID(),
    fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
    fb_api_caller_class: "RelayModern",
    doc_id: "4499164963466303",
    variables: JSON.stringify({input: {scale: 3}})
  };
  const response = await api.httpPost("https://www.facebook.com/api/graphql/", form);
  const data = JSON.parse(response).data;
  if (!data || !data.viewer || !data.viewer.friending_possibilities || !data.viewer.friending_possibilities.edges || data.viewer.friending_possibilities.edges.length === 0) {
    return api.sendMessage("❎ Abhi koi dosti ka anurodh nahi hai", event.threadID, event.messageID);
  }
  
  const listRequest = data.viewer.friending_possibilities.edges;
  let msg = "";
  let i = 0;
  for (const user of listRequest) {
    i++;
    msg += (`\n|› ${i}. Naam: ${user.node.name} | ${user.node.url.replace("www.facebook", "fb")}\n|› Samay: ${moment(user.time*1000).tz("Asia/Kolkata").format("DD/MM/YYYY HH:mm:ss")}\n──────────────────\n`);
  }
  api.sendMessage(`${msg}\n\n📌 Jawab dein (reply) STT ke saath <add | del> action ke attributes ke liye`, event.threadID, (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        listRequest,
        author: event.senderID
      });
    }, event.messageID);
};
