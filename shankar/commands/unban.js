exports.config = {
    name: 'unban',
    version: '0.0.1',
    hasPermssion: 1,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: '',
    commandCategory: 'Admin',
    usages: '[]',
    cooldowns: 5
};

let fs = require('fs');

let path = __dirname+'/data/commands-banned.json';
let data = {};
let save = ()=>fs.writeFileSync(path, JSON.stringify(data));

exports.run = o=> {
    if (fs.existsSync(path))data = JSON.parse(fs.readFileSync(path)); else save();
    let {
        senderID: sid,
        threadID: tid,
        messageID,
        mentions,
    } = o.event;
    let send = msg=>o.api.sendMessage(msg, tid, messageID);
    let tag = Object.entries(mentions)[0];
    let user_ban;
    let cmds_ad_ban = [];

    if (!data[tid])data[tid] = {
        cmds: [],
        users: {},
    };
    if (!!tag) {
        let user_ban = data[tid].users[tag[0]];
        let cmds_input = o.args.join(' ').replace(tag[1], '').split(' ').filter($=>!!$);

        if (!user_ban)user_ban = data[tid].users[tag[0]] = {
            all: {},
            cmds: [],
        };
        if (cmds_input.length == 0) {
            if (!user_ban.all.status)return send('❎ Yeh user pehle se banned nahi hai');
            let x = global.config.ADMINBOT.includes(user_ban.all.author),
            z = global.config.ADMINBOT.includes(sid);
            if (x && !z)return send('❎ Is user ko admin bot ne ban kiya hai, aapke paas unban ka adhikar nahi hai');
            return(user_ban.all.status = false, save(), send('✅ User ka unban safalta se kar diya gaya'));
        };
        if ((nothas = user_ban.cmds.filter($=>cmds_input.includes($.cmd)), nothas.length == 0))return send(`❎ Is user par koi command ban nahi hai`);

        data[tid].users[tag[0]].cmds = user_ban.cmds.filter($=> {
            let x = global.config.ADMINBOT.includes($.author), z = global.config.ADMINBOT.includes(sid);
            if (!cmds_input.includes($.cmd))return true;
            if (x&&!z)return(cmds_ad_ban.push($.cmd), true); else return false;
        });
        save();
        return send(`✅ Is user ke liye command unban kar diya gaya ${cmds_ad_ban.length > 0?`. Ye commands admin bot ne ban kiye hain, isliye aap unban nahi kar sakte: ${cmds_ad_ban.join(', ')}`: ''}`);
    };

    if (o.args.length == 0)return send('❎ Unban karne ke liye command ka naam daalein');

    data[tid].cmds = data[tid].cmds.filter($=> {
        let x = global.config.ADMINBOT.includes($.author), z = global.config.ADMINBOT.includes(sid);
        if (!o.args.includes($.cmd))return true;
        if (x&&!z)return(cmds_ad_ban.push($.cmd), true); else return false;
    });
    save();
    send(`${cmds_ad_ban.length>0?`❎ Ye commands admin bot ne ban kiye hain, isliye aap unban nahi kar sakte: ${cmds_ad_ban.join(', ')}`:'✅ Unban safalta se kar diya gaya'}`);
};
