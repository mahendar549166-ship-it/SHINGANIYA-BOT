module.exports.config = {
    name: "updateQtv",
    eventType: ["log:thread-admins"],
    version: "1.0.1",
    author: "DongDev",
    info: "Samuh ke prashasakon ki suchi ko swatalit roop se naya karen",
};

module.exports.run = async function({ event: { samuhID, logMessageType }, api, Threads }) {
    try {
        console.log("Ghatna prapt hui:", logMessageType); // Ghatna ki jaanch

        switch (logMessageType) {
            case "log:thread-admins": {
                console.log("Samuh ki jankari lene ki shuruaat..."); // Shuruaat ki suchna
                const samuhJankari = await api.getThreadInfo(samuhID);
                console.log("Samuh ki jankari:", samuhJankari); // Samuh ki jankari prakaashit karen

                if (samuhJankari && samuhJankari.adminIDs) {
                    const prashasakSankhya = samuhJankari.adminIDs.length;

                    // Samuh ke data ko naya karen
                    await Threads.setData(samuhID, { samuhJankari });
                    global.data.threadInfo.set(samuhID, samuhJankari);

                    // Suchna sandesh bhejen aur messageID prapt karen
                    api.sendMessage(`✅ Swatalit roop se ${prashasakSankhya} Prashasakon ka update kiya gaya!`, samuhID, (err, info) => {
                        if (err) return console.error(err);

                        // 3 second baad sandesh wapas lo
                        setTimeout(() => {
                            api.unsendMessage(info.messageID, (err) => {
                                if (err) console.error(`Sandesh wapas lene mein asamarth: ${err}`);
                            });
                        }, 3000); // 3000ms = 3 second
                    });
                } else {
                    api.sendMessage(`⚠️ Samuh ki jankari ya prashasak prapt nahi kiye ja sake.`, samuhID, (err, info) => {
                        if (err) return console.error(err);

                        // 3 second baad sandesh wapas lo
                        setTimeout(() => {
                            api.unsendMessage(info.messageID, (err) => {
                                if (err) console.error(`Sandesh wapas lene mein asamarth: ${err}`);
                            });
                        }, 3000);
                    });
                }
                break; // Switch case se bahar niklo
            }
            default:
                console.log("Ghatna prakar ka prabandhan nahi hua:", logMessageType); // Aprabandhit ghatna prakar ki suchna
                break; // Anavashyak ghatna prakaron ko chhod do
        }
    } catch (error) {
        console.error(`❌ Prashasakon ko update karte samay truti hui: ${error}`);
        api.sendMessage(`❌ Prashasakon ko update karte samay truti hui.`, samuhID, (err, info) => {
            if (err) return console.error(err);

            // 3 second baad sandesh wapas lo
            setTimeout(() => {
                api.unsendMessage(info.messageID, (err) => {
                    if (err) console.error(`Sandesh wapas lene mein asamarth: ${err}`);
                });
            }, 3000);
        });
    }
};
