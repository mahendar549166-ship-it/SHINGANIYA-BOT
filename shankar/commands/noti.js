const fs = require("fs-extra");

module.exports.config = {
  name: "noti",
  version: "1.4.3",
  hasPermssion: 1,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Join/Leave Noti ko on ya off karein",
  commandCategory: "Box chat",
  usages: "noti ka istemal on/off ke liye",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
  },
};

module.exports.handleReply = async function ({ api, event, args, handleReply }) {
  const { senderID, threadID, messageID, messageReply } = event;
  const { author, permssion } = handleReply;
  const tm = process.uptime(),
    Tm = require("moment-timezone").tz("Asia/Kolkata").format("HH:mm:ss || DD/MM/YYYY"),
    h = Math.floor(tm / (60 * 60)),
    H = h < 10 ? "0" + h : h,
    m = Math.floor((tm % (60 * 60)) / 60),
    M = m < 10 ? "0" + m : m,
    s = Math.floor(tm % 60),
    S = s < 10 ? "0" + s : s;
  const path = __dirname + "/data/dataEvent.json";
  let data = fs.readJSONSync(path);

  if (author !== senderID) return api.sendMessage(`❎ Aap is command ko use karne wale nahi hain`, threadID);

  var number = args.filter((i) => !isNaN(i));
  for (const num of number) {
    switch (num) {
      case "1": {
        //---> CODE JOIN NOTI <---//
        if (permssion < 1)
          return api.sendMessage(
            "⚠️ Aapke paas is command ko istemal karne ka adhikar nahi hai",
            threadID,
            messageID
          );

        if (!data.join) data.join = [];
        let find = data.join.find((i) => i.threadID == threadID);

        if (find) find.status = !find.status ? true : false;
        else
          find = data.join.push({
            threadID,
            status: true,
          });
        fs.writeJSONSync(path, data, { spaces: 4 });
        return api.sendMessage(
          `${!find.status ? "off" : "on"} safalta se set kiya gaya`,
          threadID,
          messageID
        );
      }
      break;

      case "2": {
        //---> CODE LEAVE NOTI <---//
        if (permssion < 1)
          return api.sendMessage(
            "⚠️ Aapke paas is command ko istemal karne ka adhikar nahi hai",
            threadID,
            messageID
          );
        if (!data.leave) data.leave = [];
        let findDataLeave = data.leave.find((i) => i.threadID == threadID);

        if (findDataLeave) findDataLeave.status = !findDataLeave.status ? true : false;
        else
          findDataLeave = data.leave.push({
            threadID,
            status: true,
          });
        fs.writeJSONSync(path, data, { spaces: 4 });
        return api.sendMessage(
          `${!findDataLeave.status ? "off" : "on"} safalta se set kiya gaya`,
          threadID,
          messageID
        );
      }
      break;

      case "4": {
        const joinNoti = data.join.find((item) => item.threadID === threadID);
        const leaveNoti = data.leave.find((item) => item.threadID === threadID);
        return api.sendMessage(
          `[ NOTI BOX KI JAANCH ]\n────────────────────\n1. joinNoti box: ${
            joinNoti ? "Chalu hai" : "Band hai"
          }\n2. leaveNoti box: ${leaveNoti ? "Chalu hai" : "Band hai" }\n────────────────────\n⏳ Uptime: ${H + ":" + M + ":" + S}\n⏰ Time: ${Tm}\n⛔ Upar diye gaye hain noti ke mode jo chalu ya band hain`,
          threadID
        );
        break;
      }

      default: {
        return api.sendMessage(`Aapne jo number chuna hai, woh command mein nahi hai`, threadID);
      }
    }
  }
};

module.exports.run = async ({ api, event, args, permssion, Threads }) => {
  const { threadID, messageID, senderID } = event;
  const tm = process.uptime(),
    Tm = require("moment-timezone").tz("Asia/Kolkata").format("HH:mm:ss || DD/MM/YYYY"),
    h = Math.floor(tm / (60 * 60)),
    H = h < 10 ? "0" + h : h,
    m = Math.floor((tm % (60 * 60)) / 60),
    M = m < 10 ? "0" + m : m,
    s = Math.floor(tm % 60),
    S = s < 10 ? "0" + s : s;
  const threadSetting = (await Threads.getData(String(threadID))).data || {};
  const prefix = threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : global.config.PREFIX;

  return api.sendMessage(
    `[ NOTI CONFIG SETTING ]\n────────────────────\n1. joinNoti ko on/off karein\n2. leaveNoti ko on/off karein\n3. Status check karein\n────────────────────\n⏳ Uptime: ${H + ":" + M + ":" + S}\n⏰ Time: ${Tm}\n⛔ Reply (jawab) ke zariye stt chunein taki aap noti ko on ya off kar sakein`,
    threadID,
    (error, info) => {
      if (error) {
        return api.sendMessage("Ek error hua hai!", threadID);
      } else {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          permssion,
        });
      }
    }
  );
};
