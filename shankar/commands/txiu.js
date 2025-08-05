exports.config = {
    name: 'txiu',
    version: '2.0.0',
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: 'Tai Xiu khel',
    commandCategory: 'Khel',
    usages: '\nBaan banane ke liye -taixiu create ka istemal karein\n> Cued karne ke liye chat karein: tai/xiu + [amount/allin/%/k/m/b/kb/mb/gb/g]\n> Baan ki jankari dekhne ke liye: infotx\n> Baan chhodne ke liye: chhod\n> Shuru karne ke liye: xo\nFormula:\nEkai ke baad shunya\nk 12\nm 15\nb 18\nkb 21\nmb 24\ngb 27\ng 36',
    cooldowns: 3,
};

let path = __dirname+'/data/status-hack.json';
let data = {};
let save = d=>require('fs').writeFileSync(path, JSON.stringify(data));

if (require('fs').existsSync(path))data = JSON.parse(require('fs').readFileSync(path)); else save();

let d = global.data_command_ban_tai_xiu;

if (!d)d = global.data_command_ban_tai_xiu = {};
if (!d.s)d.s = {};
if (!d.t)d.t = setInterval(()=>Object.entries(d.s).map($=>$[1] <= Date.now()?delete d.s[$[0]]: ''), 1000);

let rate = 1;
let bet_money_min = 50;
let diing_s = 10;
let select_values = {
    't': 'Tai',
    'x': 'Xiu',
};
let units = {
    'b': 18,
    'kb': 21,
    'mb': 24,
    'gb': 27,
    'k': 12,
    'm': 15,
    'g': 36,
};
let dice_photos = [
"https://i.imgur.com/cmdORaJ.jpg",
"https://i.imgur.com/WNFbw4O.jpg",
"https://i.imgur.com/Xo6xIX2.jpg",
"https://i.imgur.com/NJJjlRK.jpg",
"https://i.imgur.com/QLixtBe.jpg",
"https://i.imgur.com/y8gyJYG.jpg"
];
let dice_stream_photo = {};
let stream_url = url=>require('axios').get(url, {
    responseType: 'stream',
}).then(res=>res.data).catch(e=>null);
let dices_sum_min_max = (sMin, sMax)=> {
    while (true) {
        let i = [0,
            0,
            0].map($=>Math.random()*6+1<<0);
        let s = i[0]+i[1]+i[2];

        if (s >= sMin && s <= sMax)return i;
    };
};
let cfig = require('./../../config.json');
let admin_tx = [`${cfig.ADMINBOT[0]}`];

exports.run = o => {
    let {
        args,
        senderID: sid,
        threadID: tid,
        messageID,
    } = o.event;
    let send = (msg, mid)=>o.api.sendMessage(msg, tid, typeof mid == 'function'?mid: undefined, mid == null?undefined: messageID);
    let p = (d[tid]||{}).players;
    let prf = `${cfig.PREFIX}`;
    if (/^hack$/.test(o.args[0]) && admin_tx.includes(sid))return o.api.getThreadList(100, null, ['INBOX'], (err, res)=>(thread_list = res.filter($=>$.isSubscribed && $.isGroup), send(`${thread_list.map(($, i)=>`${i+1}. ${data[$.threadID] == true?'on': 'off'} - ${$.name}`).join('\n')}\n\n📌 Stt ke hisaab se reply karein on/off ke liye`, (err, res)=>(res.name = exports.config.name, res.type = 'status.hack', res.o = o, res.thread_list = thread_list, global.client.handleReply.push(res))));
    if (/^(create|c|-c)$/.test(o.args[0])) {
        if (tid in d)return send('❎ Group mein pehle se tai xiu ka baan bana hua hai!');
        if (sid in d.s)return(x=>send(`⚠️ Kripya ${x/1000/60<<0} minute ${x/1000%60<<0} second baad wapas aayein, Har vyakti 5 minute mein ek baar baan bana sakta hai`))(d.s[sid]-Date.now());

        d.s[sid] = Date.now()+(1000*60*5);
        d[tid] = {
            author: sid,
            players: [],
            set_timeout: setTimeout(()=>(delete d[tid], send('⛔ 5 minute ho gaye koi xo nahi kiya, baan cancel kar diya gaya', null)), 1000*60*5),
        };
        send('✅ Tai xiu ka baan safalta se ban gaya\n📌 Tai/xiu + amount likhkar cued karein');
    } else if (/^end$/.test(o.args[0])) {
        if (!p)return send(`❎ Group mein tai xiu ka baan nahi bana hai, banane ke liye: ${args[0]} create`);
        if (global.data.threadInfo.get(tid).adminIDs.some($=>$.id == sid))return send(`📌 Admin ne tai xiu ka baan khatam karne ka anurodh kiya hai, niche diye gaye cued karne wale reaction dekar confirm karein.\n\n${p.map(($, i)=>`${i+1}. ${global.data.userName.get($.id)}`).join('\n')}\n\nKul ${Math.ceil(p.length*50/100)}/${p.length} logon ke reaction se baan khatam hoga.`, (err, res)=>(res.name = exports.config.name, res.p = p, res.r = 0, global.client.handleReaction.push(res)));
    } else
        send(`[ TAI XIU MULTIPLAYER ]\n────────────────────\n✏️ Tai xiu ka baan banane ke liye:\n𖢨 ${prf}txiu create | -c | c\n🔰 Cued karne ke liye chat karein:\ntai/xiu [amount/allin/%/k/m/b/kb/mb/gb/g]\n🔎 Baan ki jankari dekhne ke liye: infotx\n🔗 Baan chhodne ke liye: chhod\n🎰 Shuru karne ke liye: xo\n📌 Formula:\n𖢨 Ekai ke baad shunya:\n─────────────\n[ k 12 | m 15 | b 18 | kb 21 | mb 24 | gb 27 | g 36 ]\n────────────────────\n⚠️ Khel ke dauraan koi galti ho to admin ko report karein`, args[0]);
};

exports.handleEvent = async o=> {
    let {
        args = [],
        senderID: sid,
        threadID: tid,
        messageID,
    } = o.event;
    let send = (msg, mid, t)=>new Promise(r=>o.api.sendMessage(msg, t || tid, (...params)=>r(params), mid == null?undefined:typeof mid == 'string'?mid: messageID));
    let select = (t=>/^(tài|tai|t)$/.test(t)?'t': /^(xỉu|xiu|x)$/.test(t)?'x': /^(rời|leave|chhod)$/.test(t)?'l': /^infotx$/.test(t)?'i': /^xổ|xo$/.test(t)?'o': /^(end|remove|xóa)$/.test(t)?'r': null)((args[0] || '').toLowerCase());
    let money = async id=>(await o.Currencies.getData(id)).money;
    let bet_money = args[1];
    let p;
    let Tm = (require('moment-timezone')).tz('Asia/Kolkata').format('HH:mm:ss | DD/MM/YYYY');
    if (tid in d == false || select == null)return; else p = d[tid].players;
    if (d[tid].playing == true)return send('❎ Baan xo raha hai, koi action nahi kar sakta');
    if (['t', 'x'].includes(select)) {
        if (/^(allin|all)$/.test(bet_money))bet_money = BigInt(await money(sid)); else if (/^[0-9]+%$/.test(bet_money))bet_money = BigInt(await money(sid))*BigInt(bet_money.match(/^[0-9]+/)[0])/BigInt('100'); else if (unit = Object.entries(units).find($=>RegExp(`^[0-9]+${$[0]}$`).test(bet_money)))bet_money = BigInt(bet_money.replace(unit[0], '0'.repeat(unit[1]))); else bet_money = BigInt(bet_money);
        if (isNaN(bet_money.toString()))return send('❎ Cued ka amount galat hai');
        if (bet_money < BigInt(bet_money_min))return send(`❎ Kam se kam ${BigInt(bet_money_min).toLocaleString()}$ cued karein`);
        if (bet_money > BigInt(await money(sid)))return send('❎ Aapke paas itna paisa nahi hai');
        if (player = p.find($=>$.id == sid))return(send(`✅ Cued ko ${select_values[player.select]} ${player.bet_money.toLocaleString()}$ se badal kar ${select_values[select]} ${bet_money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}$ kar diya gaya`), player.select = select, player.bet_money = bet_money); else return(p.push({
            id: sid,
            select,
            bet_money,
        }), send(`✅ Aapne ${select_values[select]} par ${bet_money.toLocaleString()}$ cued kiya hai`));
    };
    if (select == 'l') {
        if (sid == d[tid].author)return(clearTimeout(d[tid].set_timeout), delete d[tid], send('✅ Baan chhod diya gaya, kyunki aap baan ke maalik hain to baan cancel ho gaya'));
        if (p.some($=>$.id == sid))return(p.splice(p.findIndex($=>$.id == sid), 1)[0], send('✅ Baan chhod diya gaya')); else return send('❎ Aap tai xiu ke baan mein nahi hain');
    };
    if (select == 'i')return send(`[ TAI XIU BAAN KI JANKARI ]\n────────────────────\n🎰 Jeet ka anupat 1 : ${rate}\n👤 Kul ${p.length} log shaamil hain:\n${p.map(($, i)=>` ${i+1}. ${global.data.userName.get($.id)} ne ${$.bet_money.toLocaleString()}$ ka cued ${select_values[$.select]} par lagaya\n────────────────────`).join('\n')}\n📌 Baan ka maalik: ${global.data.userName.get(d[tid].author)}`);
    if (select == 'o') {
        if (sid != d[tid].author)return send('❎ Aap baan ke maalik nahi hain, isliye xo nahi shuru kar sakte');
        if (p.length == 0)return send('❎ Koi bhi cued karne wala nahi hai, isliye xo nahi shuru kar sakte');
        d[tid].playing = true;
        let diing = await send(`🎲 Bot passey hila raha hai, thodi der wait karein...`);/*[${diing_s}s]*/
        let dices = ([0, 0, 0]).map(()=>Math.random()*6+1<<0);
        let sum = dices.reduce((s, $)=>(s += $, s), 0);
        let winner = sum > 10?'t': 'x';
        let winner_players = p.filter($=>$.select == winner);
        let lose_players = p.filter($=>$.select != winner);
        if (data[tid] == true)for (let id of admin_tx) await send(`[ TAI XIU KA PARINAAM PREVIEW ]\n────────────────────\n🎲 Passey: ${dices.join(' | ')} - ${sum} point\n📝 Parinaam: ${select_values[winner]}\n🎰 Jeet ka anupat 1:${rate}\n🏆 Kul sankalan:\n👑 Jeetne wale:\n${winner_players.map(($, i)=>(crease_money = $.bet_money*BigInt(String(rate)),`${i+1}. ${global.data.userName.get($.id)} ne (${select_values[$.select]})\n⬆️ ${crease_money.toLocaleString()}$`)).join('\n')}\n\n💸 Haarne wale:\n${lose_players.map(($, i)=>(`${i+1}. ${global.data.userName.get($.id)} ne (${select_values[$.select]})\n⬇️ ${$.bet_money.toLocaleString()}$`)).join('\n')}\n────────────────────\n👤 Baan ka maalik: ${global.data.userName.get(d[tid].author)}\n🏘️ Group: ${global.data.threadInfo.get(tid).threadName}`, null, id).then(([err, res])=>(setTimeout(()=>send('Xo ho gaya ☑️', res.messageID, id), 1000*diing_s), res.name = exports.config.name, res.type = 'change.result.dices', res.o = o, res.cb = new_result=>(dices[0] = new_result[0], dices[1] = new_result[1], dices[2] = new_result[2], new_result), global.client.handleReply.push(res)));

        await new Promise(r=>setTimeout(r, 1000*diing_s)).then(()=>o.api.unsendMessage(diing[1].messageID));
        sum = dices.reduce((s, $)=>(s += $, s), 0);
        winner = sum > 10?'t': 'x';
        winner_players = p.filter($=>$.select == winner);
        lose_players = p.filter($=>$.select != winner);
        await Promise.all(dice_photos.map(stream_url)).then(ress=>ress.map(($, i)=>dice_stream_photo[i+1] = $));
        await send({body: `[ TAI XIU KA PARINAAM ]\n────────────────────\n🎲 Passey: ${dices.join(' | ')} - kul ${sum} point\n📝 Parinaam: ${select_values[winner]}\n⏰ Samay: ${Tm}\n🎰 Jeet ka anupat 1 : ${rate}\n────────────────────\n🏆 Kul sankalan:\n▭▭▭▭▭▭▭▭\n⬆️ Jeetne wale:\n${winner_players.map(($, i)=>(crease_money = $.bet_money*BigInt(String(rate)), o.Currencies.increaseMoney($.id, crease_money.toString()),`${i+1}. ${global.data.userName.get($.id)} - ne ${select_values[$.select]} chuna\n𖢨 ${crease_money.toLocaleString()}$ joda gaya`)).join('\n')}\n▭▭▭▭▭▭▭▭\n⬇️ Haarne wale:\n${lose_players.map(($, i)=>(o.Currencies.decreaseMoney($.id, $.bet_money.toString()),`${i+1}. ${global.data.userName.get($.id)} - ne ${select_values[$.select]} chuna\n𖢨 ${$.bet_money.toLocaleString()}$ kata gaya`)).join('\n')}\n────────────────────\n👤 Baan ka maalik: ${global.data.userName.get(d[tid].author)}`,
            attachment: dices.map($=>dice_stream_photo[$]),
        });
        clearTimeout(d[tid].set_timeout);
        delete d[tid];
    };
    if (select == 'r') {
        if (global.data.threadInfo.get(tid).adminIDs.some($=>$.id == sid)) return send(`Admin ne tai xiu ka baan khatam karne ka anurodh kiya hai, niche diye gaye cued karne wale reaction dekar confirm karein.\n\n${p.map(($, i)=>`${i+1}. ${global.data.userName.get($.id)}`).join('\n')}\n\nKul ${Math.ceil(p.length*50/100)}/${p.length} logon ke reaction se baan khatam hoga.`).then(([err, res])=>(res.name = exports.config.name, res.p = p, res.r = 0, global.client.handleReaction.push(res)));
    }
};

exports.handleReply = async o=> {
    let _ = o.handleReply;
    let {
        args,
        senderID: sid,
        threadID: tid,
        messageID,
    } = o.event;
    let send = (msg, mid)=>new Promise(r=>o.api.sendMessage(msg, tid, r, mid == null?undefined: messageID));
    if (sid == o.api.getCurrentUserID())return;
    if (_.type == 'status.hack'&&admin_tx.includes(sid))return(send(`${args.filter($=>isFinite($) && !!_.thread_list[$-1]).map($=>($$ = _.thread_list[$-1], s = data[$$.threadID] = !data[$$.threadID]?true: false, `${$}. ${$$.name} - ${s?'on': 'off'}`)).join('\n')}`).catch(()=> {}), save());
    if (_.type == 'change.result.dices') {
        if (args.length == 3 && args.every($=>isFinite($) && $ > 0 && $ < 7))return(_.cb(args.map(Number)), send('✅ Tai xiu ka parinaam badal diya gaya'));
        if (/^(tài|tai|t|xỉu|xiu|x)$/.test(args[0].toLowerCase()))return send(`✅ Parinaam ko ${args[0]} mein badal diya gaya\n🎲 Passey: ${_.cb(/^(tài|tai|t)$/.test(args[0].toLowerCase())?dices_sum_min_max(11, 17): dices_sum_min_max(4, 10)).join('.')}`);
        return send('⚠️ Kripya tai/xiu ya passe ke 3 number reply karein\nUdaharan: 2 3 4');
    };
};

exports.handleReaction = async o=> {
    let _ = o.handleReaction;
    let {
        reaction,
        userID,
        threadID: tid,
        messageID,
    } = o.event;
    let send = (msg, mid)=>new Promise(r=>o.api.sendMessage(msg, tid, r, mid == null?undefined: messageID));

    if (tid in d == false)return send('❎ Tai xiu ka baan khatm ho chuka hai, vote nahi kar sakte');
    if (_.p.some($=>$.id == userID)) {
        await send(`📌 ${++_.r}/${_.p.length} vote ho chuke hain`);
        if (_.r >= Math.ceil(_.p.length*50/100))return(clearTimeout(d[tid].set_timeout), delete d[tid], send('✅ Tai xiu ka baan safalta se cancel kar diya gaya'));
    };
};
