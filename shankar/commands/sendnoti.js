const request = require("request");
const fse = require("fs-extra");
const imageDownload = require("image-downloader");
const moment = require("moment-timezone");
const fullTime = () => moment.tz("Asia/Kolkata").format("HH:mm:ss || DD/MM/YYYY");

module.exports.config = {
    name: "sandeshabhej",
    version: "1.2.8",
    hasPermssion: 2,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Sabhi group mein sandesh bheje aur jawab ke liye reply kare",
    commandCategory: "Admin",
    usages: "text",
    cooldowns: 2
};

module.exports.run = async ({ api, event, Users }) => {
    const { threadID: tid, messageID: mid, senderID: sid, attachments: atms, messageReply: mR, type, body, args } = event;
    const allTid = global.data.allThreadID || [];
    const atm = await type == "message_reply" ? mR.attachments : atms.length != 0 ? atms : "koiFileNahi";
    const content = !args[1] ? "sirf file hai" : body.slice(body.indexOf(args[1]));

    if (!args[1] && atm == "koiFileNahi") return api.sendMessage(`❎ Kripya sandesh daale`, tid, mid);

    const msg = `[ ADMIN KA SANDESH ]\n───────────────────\n[👤] →⁠ Admin: ${(await Users.getData(sid)).name}\n[🌐] →⁠ Link Fb: https://www.facebook.com/profile.php?id=${event.senderID}\n[🗺️] →⁠ Se: ${event.isGroup == true ? 'Group ' + global.data.threadInfo.get(event.threadID).threadName : 'Bot ke saath private chat'}\n───────────────────\n\n[💬] →⁠ Sandesh: ${content}\n───────────────────\n[⏰] →⁠ Samay: ${fullTime()}\n[👉] →⁠ Is sandesh ka jawab dekar admin ko bheje`;

    const uwu = atm == "koiFileNahi" ? msg : {
        body: msg,
        attachment: await downloadAttachments(atm)
    };

    let c1 = 0,
        c2 = 0;

    for (const idT of allTid) {
        const promise = new Promise(async (resolve1, reject1) => {
            await api.sendMessage(uwu, idT, async (e, i) => {
                if (e) reject1(++c2);
                else resolve1(++c1);

                return global.client.handleReply.push({
                    name: module.exports.config.name,
                    messageID: i.messageID,
                    author: sid,
                    type: "userJawab"
                });
            });
        });
    }

    promise.then(async (r) => api.sendMessage(`☑️ ${r} group mein sandesh safalta se bheja gaya`, tid, mid)).catch(async (err) => api.sendMessage(`❎ ${err} group mein sandesh nahi bhej saka`, tid, mid));
};

module.exports.handleReply = async ({ api, event, handleReply: h, Users, Threads }) => {
    const { threadID: tid, messageID: mid, senderID: sid, attachments: atms, body, type } = event;
    const { ADMINBOT } = global.config;

    switch (h.type) {
        case "userJawab": {
            const atm = atms.length != 0 ? atms : "koiFileNahi";
            const msg = `[ USER KA JAWAB ]\n───────────────────\n[👤] →⁠ User: ${(await Users.getData(sid)).name}\n[🏘️] →⁠ Group: ${(await Threads.getData(tid)).threadInfo.threadName}\n[⏰] →⁠ Samay: ${fullTime()}\n\n[📝] →⁠ Sandesh: ${atm == "koiFileNahi" ? body : "Sirf file aapke liye"}\n\n───────────────────\n[👉] →⁠ Admin ko jawab dene ke liye is sandesh ka reply kare`;
            const uwu = atm == "koiFileNahi" ? msg : {
                body: msg,
                attachment: await downloadAttachments(atm)
            };

            let c1 = 0,
                c2 = 0;

            for (const idA of ADMINBOT) {
                const promise = new Promise(async (resolve1, reject1) => {
                    await api.sendMessage(uwu, idA, async (e, i) => {
                        if (e) reject1(++c2);
                        else resolve1(++c1);

                        return global.client.handleReply.push({
                            name: module.exports.config.name,
                            messageID: i.messageID,
                            author: h.author,
                            idThread: tid,
                            idMessage: mid,
                            idUser: sid,
                            type: "adminJawab"
                        });
                    });
                });
            }

            promise.then(async (r1) => api.sendMessage(`[📨] →⁠ Admin ${(await Users.getData(h.author)).name} aur ${+r1 - 1} doosre admins ko jawab safalta se bheja`, tid, mid)).catch(async (err) => api.sendMessage(`❎ ${err} admins ko jawab nahi bhej saka`, tid, mid));

            break;
        }

        case "adminJawab": {
            const atm = atms.length != 0 ? atms : "koiFileNahi";
            const msg = `[ ADMIN KA JAWAB ]\n───────────────────\n[👤] →⁠ Admin: ${(await Users.getData(sid)).name}\n[⏰] →⁠ Samay: ${fullTime()}\n\n[📝] →⁠ Sandesh: ${atm == "koiFileNahi" ? body : "Sirf file aapke liye"}\n───────────────────\n[👉] →⁠ Admin ko jawab dene ke liye is sandesh ka reply kare`;
            const uwu = atm == "koiFileNahi" ? msg : {
                body: msg,
                attachment: await downloadAttachments(atm)
            };

            await api.sendMessage(uwu, h.idThread, async (e, i) => {
                if (e) return api.sendMessage(`Error`, tid, mid);
                else api.sendMessage(`[📨] →⁠ User ${(await Users.getData(h.idUser)).name} ko group ${(await Threads.getData(h.idThread)).threadInfo.threadName} mein jawab safalta se bheja`, tid, mid);

                return global.client.handleReply.push({
                    name: module.exports.config.name,
                    messageID: i.messageID,
                    author: sid,
                    type: "userJawab"
                });
            }, h.idMessage);

            break;
        }
    }
};

const downloadAttachments = async (attachments) => {
    const arr = [];

    for (let i = 0; i < attachments.length; i++) {
        const nameUrl = request.get(attachments[i].url).uri.pathname;
        const namefile = attachments[i].type !== "audio" ? nameUrl : nameUrl.replace(/\.mp4/g, ".m4a");
        const path = __dirname + "/cache/" + namefile.slice(namefile.lastIndexOf("/") + 1);

        await imageDownload.image({
            url: attachments[i].url,
            dest: path
        });

        arr.push(fse.createReadStream(path));
        fse.unlinkSync(path);
    }

    return arr;
};
