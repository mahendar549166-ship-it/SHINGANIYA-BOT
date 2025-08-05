// JAWAB KA HANDLING
this.handleReply = async function ({ event, api, handleReply, args }) {
    const { threadID: tid, messageID: mid, body } = event;

    switch (handleReply.type) {
        case 'choosee':
            const choose = parseInt(body);
            api.unsendMessage(handleReply.messageID);

            // AGAR INPUT NUMBER NAHI HAI
            if (isNaN(choose)) {
                return api.sendMessage('⚠️ Kripya ek sankhya daalen', tid, mid);
            }

            const optionsCount = handleReply.dataaa.option.length;
            // AGAR CHUNAV SOOCHI KE BAHAR HAI
            if (choose < 1 || choose > optionsCount) {
                return api.sendMessage('❎ Chunav soochi mein nahi hai', tid, mid);
            }

            // CHUNE HUYE JAWAB KI JAANKARI LEN
            const chosenItem = handleReply.dataaa.option[choose - 1];
            const correctAnswer = handleReply.dataaa.correct;
            
            // JAANCH KAREN KI CHUNA HUYA JAWAB SAHI HAI YA NAHI
            if (chosenItem === correctAnswer) {
                return api.sendMessage('🎉 Sahi jawab! Aapne theek uttar diya!', tid, mid);
            } else {
                return api.sendMessage('❌ Galat jawab! Sahi jawab hai: ' + correctAnswer, tid, mid);
            }

        default:
            return;
    }
};

// MODULE CONFIGURATION
this.config = {
    name: "sawaal", // Komand ka naam
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Mazedar sawaal khel, maza na aaye toh chhod do", // Fun quiz game
    commandCategory: "Khel", // Game
    usages: "",
    cooldowns: 5
};

// KHEL SHURU KARNE WALA FUNCTION
this.run = async ({ api: { sendMessage: send }, event: { threadID: tid, messageID: mid } }) => {
    const axios = require('axios');

    try {
        // API SE DATA LEN
        const response = await axios.get(`https://hoanghao.me/api/game/dovui`);

        // DATA SE JAANKARI LEN
        const question = response.data.data.question;
        const options = response.data.data.option;

        // KHILADI KE LIYE MESSAGE BANAYEN
        let replyMessage = `📝 Sawaal: ${question}\n────────\n`;
        for (let i = 0; i < options.length; i++) {
            replyMessage += `  ${i + 1}. ${options[i]}\n`;
        }
        replyMessage += "\n📌 Sawaal ka jawab dene ke liye sankhya ke saath reply karen";

        // KHILADI KO MESSAGE BHEJEN AUR AGLE PROCESSING KE LIYE JAANKARI SAVE KAREN
        send(replyMessage, tid, async (error, info) => {
            if (!error) {
                // AGLE PROCESSING KE LIYE JAANKARI SAVE KAREN
                global.client.handleReply.push({
                    type: "choosee",
                    name: this.config.name,
                    author: info.senderID,
                    messageID: info.messageID,
                    dataaa: response.data.data,
                });
            } else {
                console.error("Message bhejne mein error hua:", error);
            }
        });
    } catch (error) {
        // AGAR API SE DATA NA MIL PAYE TOH ERROR HANDLE KAREN
        console.error("Error hua:", error);
        send("Bot mein samasya aa rahi hai, kripya thodi der baad koshish karen!", tid);
    }
};
