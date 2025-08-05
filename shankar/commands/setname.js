const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: 'setname',
    version: '4.0.0',
    hasPermssion: 0,
    Rent: 1,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: 'Apke group mein apka ya kisi tagged vyakti ka nickname badle',
    commandCategory: 'Upyogi',
    usages: '[khali/reply/tag] + [naam]',
    usePrefix: false,
    cooldowns: 0
};

module.exports.run = async ({ api, event, args, Users }) => {
    const filePath = path.join(__dirname, './../../shankar/commands/data/naamset.json');
    const mention = Object.keys(event.mentions)[0];
    let { threadID, messageReply, senderID, mentions, type } = event;
  
    if (!fs.existsSync(filePath)) {
        fs.writeJsonSync(filePath, []);
        api.sendMessage('Data banaya gaya. Kripya dobara command ka use kare!', threadID);
        return;
    }

    const jsonData = fs.readJsonSync(filePath);
    const existingData = jsonData.find(data => data.id_Nhóm === threadID);

    if (args.length > 0 && args[0].toLowerCase() === 'add') {
        if (args.length < 2) {
            api.sendMessage('Kripya koi character daale.', threadID);
            return;
        }
        const newData = { id_Nhóm: threadID, kí_tự: args.slice(1).join(' ') || '' };
        if (existingData) {
            existingData.kí_tự = newData.kí_tự;
        } else {
            jsonData.push(newData);
        }
        fs.writeJsonSync(filePath, jsonData);
        api.sendMessage('Naamset ke liye character update kiya gaya.', threadID);
        return;
    }

    if (args.length > 0 && args[0].toLowerCase() === 'help') {
        api.sendMessage('📑Istemal ka tarika:\n- naamset add [character]: Naamset ke liye character jode\n- naamset + naam: Nickname badle\n- naamset check: Group mein jin logon ka nickname nahi hai unhe dekhe', threadID);
        return;
    }

    if (args.length > 0 && args[0].toLowerCase() === 'check') {
        try {
            let threadInfo = await api.getThreadInfo(event.threadID);
            let u = threadInfo.nicknames || {};
            let participantIDs = threadInfo.participantIDs;
            let listbd = participantIDs.filter(userID => !u[userID]);

            if (listbd.length > 0) {
                let listNames = [];
                let listMentions = [];

                for (let [index, userID] of listbd.entries()) {
                    try {
                        let userInfo = await Users.getInfo(userID);
                        let name = userInfo.name || "Naam nahi hai";
                        listNames.push(`${index + 1}. ${name}`);
                        listMentions.push({ tag: `@${name}`, id: userID });
                    } catch (error) {
                        console.error(`ID wale user ki jankari lene mein error: ${userID}`);
                    }
                }
                if (listNames.length > 0) {
                    let message = `😌- Jin logon ka nickname nahi hai unki list:\n${listNames.join("\n")}`;
                    if (event.body.includes("call")) {
                        message += "\n\nApna nickname set kare!";
                        api.sendMessage({ body: `Utho aur nickname set karo :<`, mentions: listMentions }, event.threadID);
                    } else if (event.body.includes("del")) {
                        let isAdmin = threadInfo.adminIDs.some(item => item.id == event.senderID);
                        if (isAdmin) {
                            for (let userID of listbd) {
                                api.removeUserFromGroup(userID, event.threadID);
                            }
                            message += "\n\nJin logon ka nickname nahi tha unhe group se hata diya gaya.";
                            api.sendMessage(message, event.threadID);
                        } else {
                            message += "\n\nAapko doosre logon ko group se hatane ka adhikar nahi hai.";
                            api.sendMessage(message, event.threadID);
                        }
                    } else if (event.body.includes("help")) {
                        message = `📔~ Check command group ke un sadasyon ko check karne ke liye hai jinka nickname nahi hai.\nIstemal ka tarika: check [call | del | help]\n\n- checksn: Sirf un logon ki list dikhata hai jinka nickname nahi hai.\n- check call: Jin logon ka nickname nahi hai unhe tag karta hai aur sandesh bhejta hai ki nickname set kare.\n- check del: Jin logon ka nickname nahi hai unhe group se hata deta hai (sirf admin ke liye).\n- checksn help: Is command ka pura istemal batata hai.`;
                        api.sendMessage(message, event.threadID);
                    } else {
                        message += "\n\n- Pura istemal dekhne ke liye check help ka use kare.";
                        api.sendMessage(message, event.threadID);
                    }
                } else {
                    api.sendMessage(`✅Koi bhi vyakti bina nickname ke nahi hai.`, event.threadID);
                }
            } else {
                api.sendMessage(`✅Sabhi sadasyon ka nickname set hai.`, event.threadID);
            }
        } catch (error) {
            console.error(error);
            api.sendMessage('❌Nickname check karne mein error hua.', event.threadID);
        }
        return;
    }

    if (args.length > 0 && args[0].toLowerCase() === 'all') {
        const threadInfo = await api.getThreadInfo(event.threadID);
        const idtv = threadInfo.participantIDs;
        const nameToChange = args.slice(1).join(" ");

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        };

        for (let setname of idtv) {
            let newName = nameToChange;

            if (existingData) {
                const senderName = await Users.getNameUser(event.senderID);
                const kt = existingData.kí_tự;
                newName = kt + ' ' + senderName;
            }

            await delay(100);
            await api.changeNickname(newName, event.threadID, setname);
        }

        api.sendMessage('✅Group ke sabhi sadasyon ka nickname badal diya gaya.', event.threadID);
        return;
    }
  
    if (existingData) {
        const kt = existingData.kí_tự;
        let name = await Users.getNameUser(event.senderID);
        const names = args.length > 0 ? args.join(' ') : `${name}`;
        if (names.indexOf('@') !== -1) {
            api.changeNickname(`${kt} ${names.replace(mentions[mention], "")}`, threadID, mention, e => !e ? api.sendMessage(`${!args[0] ? 'Hata' : 'Badal'} nickname pura hua!\nSabhi features dekhne ke liye naamset help ka use kare`, event.threadID) : api.sendMessage(`[ ! ] - Group mein invite link chalu hai isliye bot user ka nickname set nahi kar saka, is feature ko use karne ke liye invite link band kare!`, event.threadID));
        } else {
            api.changeNickname(`${kt} ${names}`, threadID, event.type == 'message_reply' ? event.messageReply.senderID : event.senderID, e => !e ? api.sendMessage(`${!args[0] ? 'Hata' : 'Badal'} nickname pura hua!\nSabhi features dekhne ke liye naamset help ka use kare`, event.threadID) : api.sendMessage(`[ ❌ ] - Group mein invite link chalu hai isliye bot user ka nickname set nahi kar saka, is feature ko use karne ke liye invite link band kare!`, event.threadID));
        }
    } else {
        if (args.join().indexOf('@') !== -1) {
            const name = args.join(' ');
            api.changeNickname(`${name.replace(mentions[mention], "")}`, threadID, mention, e => !e ? api.sendMessage(`${!args[0] ? 'Hata' : 'Badal'} nickname pura hua!\nSabhi features dekhne ke liye naamset help ka use kare`, event.threadID) : api.sendMessage(`[ ! ] - Group mein invite link chalu hai isliye bot user ka nickname set nahi kar saka, is feature ko use karne ke liye invite link band kare!`, event.threadID));
        } else {
            api.changeNickname(args.join(' '), event.threadID, event.type == 'message_reply' ? event.messageReply.senderID : event.senderID, e => !e ? api.sendMessage(`${!args[0] ? 'Hata' : 'Badal'} nickname pura hua!\nSabhi features dekhne ke liye naamset help ka use kare`, event.threadID) : api.sendMessage(`[ ! ] - Group mein invite link chalu hai isliye bot user ka nickname set nahi kar saka, is feature ko use karne ke liye invite link band kare!`, event.threadID));
        }
    }
};
