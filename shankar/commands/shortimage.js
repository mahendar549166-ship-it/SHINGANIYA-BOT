module.exports.config = {
    name: "shortimage",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Ek sandesh ke liye shortimage banaye",
    commandCategory: "Upyogita",
    usages: "shortimage a => [tasveer reply kare/tasveer ka link (agar ek se zyada link hain to ' | ' se alag kare)]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.onLoad = () => {
    const fs = global.nodemodule["fs-extra"];
    if (!fs.existsSync(__dirname + "/cache/shortimage.json")) fs.writeFileSync(__dirname + "/cache/shortimage.json", JSON.stringify([]), 'utf-8');
};

module.exports.handleEvent = async function({ api, event }) {
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    if (event.type !== "message_unsend" && event.body.length !== -1) {
        let shortcut = JSON.parse(fs.readFileSync(__dirname + "/cache/shortimage.json"));
        if (shortcut.some(item => item.id == event.threadID)) {
            let getThread = shortcut.find(item => item.id == event.threadID).shorts;
            if (getThread.some(item => item.in == event.body)) {
                let shortOut = getThread.find(item => item.in == event.body).out;
                if (typeof shortOut == "string") {
                    var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
                    if (shortOut.indexOf(" | ") !== -1) {
                        var arrayOut = shortOut.split(" | ");
                        let shortlink = [];
                        for (let link of arrayOut) {
                            if (!regex.test(`${link}`)) return api.sendMessage(`Item ${link} ek URL nahi hai`, event.threadID);
                            shortlink.push(link);
                        }
                        var path = [];
                        for (let i = 0; i < shortlink.length; i++) {
                            let shortimage = (await axios.get(`${shortlink[i]}`, { responseType: "arraybuffer" })).data;
                            fs.writeFileSync(__dirname + `/cache/shortimage${i}.png`, Buffer.from(shortimage, "utf-8"));
                            path.push(fs.createReadStream(__dirname + `/cache/shortimage${i}.png`));
                        }
                        var mainpath = [...path];
                        api.sendMessage({ attachment: mainpath }, event.threadID);
                        for (let i = 0; i < mainpath.length; i++) {
                            fs.unlinkSync(__dirname + `/cache/shortimage${i}.png`);
                        }
                    } else {
                        if (!regex.test(`${shortOut}`)) return api.sendMessage(`Item ${shortOut} ek URL nahi hai`, event.threadID, () => fs.unlinkSync(__dirname + `/cache/shortimage.png`));
                        let shortimage = (await axios.get(`${shortOut}`, { responseType: "arraybuffer" })).data;
                        fs.writeFileSync(__dirname + `/cache/shortimage.png`, Buffer.from(shortimage, "utf-8"));
                        api.sendMessage({ attachment: fs.createReadStream(__dirname + `/cache/shortimage.png`) }, event.threadID);
                    }
                } else if (typeof shortOut == "object") {
                    var path = [], unlink = [];
                    for (let i = 0; i < shortOut.length; i++) {
                        let shortimage = (await axios.get(`${shortOut[i]}`, { responseType: "arraybuffer" })).data;
                        fs.writeFileSync(__dirname + `/cache/shortimage${i}.png`, Buffer.from(shortimage, "utf-8"));
                        path.push(fs.createReadStream(__dirname + `/cache/shortimage${i}.png`));
                    }
                    var mainpath = [...path];
                    api.sendMessage({ attachment: mainpath }, event.threadID);
                    for (let i = 0; i < mainpath.length; i++) {
                        fs.unlinkSync(__dirname + `/cache/shortimage${i}.png`);
                    }
                }
            }
        }
    }
};

module.exports.run = async function({ api, event, args }) {
    const fs = global.nodemodule["fs-extra"];
    var { threadID, messageID } = event;
    var content = args.join(" ");
    if (content.indexOf(`xóa`) == 0 || content.indexOf(`xoá`) == 0 || content.indexOf(`del`) == 0) {
        let delThis = content.slice(4, content.length);
        if (!delThis) return api.sendMessage("Shortimage jo aap hataana chahte hain woh nahi mila", threadID, messageID);
        return fs.readFile(__dirname + "/cache/shortimage.json", "utf-8", (err, data) => {
            if (err) throw err;
            var oldData = JSON.parse(data);
            var getThread = oldData.find(item => item.id == threadID).shorts;
            if (!getThread.some(item => item.in == delThis)) return api.sendMessage("Shortimage jo aap hataana chahte hain woh nahi mila", threadID, messageID);
            getThread.splice(getThread.findIndex(item => item.in === delThis), 1);
            fs.writeFile(__dirname + "/cache/shortimage.json", JSON.stringify(oldData), "utf-8", (err) => (err) ? console.error(err) : api.sendMessage("Shortimage safalta se hata diya gaya!", threadID, messageID));
        });
    }
    else if (content.indexOf(`all`) == 0) {
        return fs.readFile(__dirname + "/cache/shortimage.json", "utf-8", (err, data) => {
            if (err) throw err;
            let allData = JSON.parse(data);
            let msg = '';
            if (!allData.some(item => item.id == threadID)) return api.sendMessage("Abhi koi shortimage nahi hai", threadID, messageID);
            if (allData.some(item => item.id == threadID)) {
                let getThread = allData.find(item => item.id == threadID).shorts;
                getThread.forEach(item => msg = msg + item.in + ' -> ' + (typeof item.out == "object" ? `${item.out.length} Tasveer` : item.out.indexOf(" | ") !== -1 ? `${item.out.split(" | ").length} Tasveer` : "1 Tasveer") + '\n');
            }
            if (!msg) return api.sendMessage("Abhi koi shortimage nahi hai", threadID, messageID);
            api.sendMessage("Yeh hain group mein maujood shortimage: \n" + msg, threadID, messageID);
        });
    }
    else if (content.indexOf(`clear`) == 0) {
        return fs.readFile(__dirname + "/cache/shortimage.json", "utf-8", (err, data) => {
            if (err) throw err;
            let allData = JSON.parse(data);
            if (!allData.some(item => item.id == threadID)) return api.sendMessage("Abhi koi shortimage nahi hai", threadID, messageID);
            if (allData.some(item => item.id == threadID)) {
                let getThread = allData.find(item => item.id == threadID).shorts;
                getThread.splice(0, getThread.length);
                return fs.writeFile(__dirname + "/cache/shortimage.json", JSON.stringify(allData), "utf-8", (err) => (err) ? console.error(err) : api.sendMessage("Saare shortimage hata diye gaye", threadID, messageID));
            }
        });
    } else {
        const https = global.nodemodule["https"];
        var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
        var short = (url => new Promise((resolve, reject) => https.get('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(url), res => res.on('data', chunk => resolve(chunk.toString()))).on("error", err => reject(err))));
        let narrow = content.indexOf(" =>");
        if (narrow == -1) return api.sendMessage("Galat format", threadID, messageID);
        var shortin = content.slice(0, narrow);
        let shortout = content.slice(narrow + 4, content.length);
        if (shortin == shortout) return api.sendMessage("Input aur output ek samaan hain", threadID, messageID);
        if (!shortin) return api.sendMessage("Input nahi hai", threadID, messageID);
        if (!shortout) {
            if (event.type == "message_reply" && event.messageReply.attachments[0].type == "photo") {
                shortout = [];
                var att = Object.keys(event.messageReply.attachments);
                for (let i = 0; i < att.length; i++) {
                    let link = await short((event.messageReply.attachments[i] != "") ? (event.messageReply.attachments[i].type == "photo") ? event.messageReply.attachments[i].url : "" : "");
                    shortout.push(link);
                }
            } else return api.sendMessage("Output nahi hai", event.threadID, event.messageID);
        }
        return fs.readFile(__dirname + "/cache/shortimage.json", "utf-8", (err, data) => {
            if (err) throw err;
            var oldData = JSON.parse(data);
            if (!oldData.some(item => item.id == threadID)) {
                let addThis = {
                    id: threadID,
                    shorts: []
                };
                addThis.shorts.push({ in: shortin, out: shortout });
                oldData.push(addThis);
                return fs.writeFile(__dirname + "/cache/shortimage.json", JSON.stringify(oldData), "utf-8", (err) => (err) ? console.error(err) : api.sendMessage("Shortimage safalta se bana diya gaya", threadID, messageID));
            } else {
                let getShort = oldData.find(item => item.id == threadID);
                if (getShort.shorts.some(item => item.in == shortin)) {
                    let index = getShort.shorts.indexOf(getShort.shorts.find(item => item.in == shortin));
                    let output = getShort.shorts.find(item => item.in == shortin).out;
                    getShort.shorts[index].out = output + " | " + shortout;
                    
                    return api.sendMessage("Yeh shortimage is group mein pehle se maujood hai", threadID, messageID);
                }
                getShort.shorts.push({ in: shortin, out: shortout });
                return fs.writeFile(__dirname + "/cache/shortimage.json", JSON.stringify(oldData), "utf-8", (err) => (err) ? console.error(err) : api.sendMessage("Shortimage safalta se bana diya gaya", threadID, messageID));
            }
        });
    }
};
