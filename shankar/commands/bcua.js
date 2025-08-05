exports.config = {
    name: 'bcua',
    version: '0.0.1',
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: 'Bau, cua, tom, ca, ga, nai ka khel',
    commandCategory: 'Khel',
    usages: '\nDùng -baucua create để tạo bàn\n> Để tham gia cược hãy chat: bầu/cua + [số_tiền/allin/%/k/m/b/kb/mb/gb/g]\n> Xem thông tin bàn chat: info\n> Để rời bàn hãy chat: rời\n> bắt đầu xổ chat: lắc\nCông thức:\nĐơn vị sau là số 0\nk 12\nm 15\nb 18\nkb 21\nmb 24\ngb 27\ng 36',
    cooldowns: 3,
};

let path = __dirname + '/data/hack-baucua.json';
let data = {};
let save = d => require('fs').writeFileSync(path, JSON.stringify(data));

if (require('fs').existsSync(path)) data = JSON.parse(require('fs').readFileSync(path)); else save();

let d = global.data_command_ban_bau_cua_tom_ca_ga_nai;

if (!d) d = global.data_command_ban_bau_cua_tom_ca_ga_nai = {};
if (!d.s) d.s = {};
if (!d.t) d.t = setInterval(() => Object.entries(d.s).map($ => $[1] <= Date.now() ? delete d.s[$[0]] : ''), 1000);

let time_wai_create = 2;
let time_del_ban = 5;
let time_diing = 5;
let bet_money_min = 100;
let units = {
    'b': 18,
    'kb': 21,
    'mb': 24,
    'gb': 27,
    'k': 12,
    'm': 15,
    'g': 36,
};
const adheh = require('./../../config.json');
let admin = [`${adheh.ADMINBOT[0]}`];
let stream_url = url => require('axios').get(url, {
    responseType: 'stream',
}).then(res => res.data).catch(e => undefined);
let s = {
    'gà': 'https://i.imgur.com/jPdZ1Q8.jpg',
    'tôm': 'https://i.imgur.com/4214Xx9.jpg',
    'bầu': 'https://i.imgur.com/4KLd4EE.jpg',
    'cua': 'https://i.imgur.com/s8YAaxx.jpg',
    'cá': 'https://i.imgur.com/YbFzAOU.jpg',
    'nai': 'https://i.imgur.com/UYhUZf8.jpg',
};

exports.run = async o => {
    let {
        args,
        senderID: sid,
        threadID: tid,
        messageID: mid,
    } = o.event;
    let send = msg => new Promise(a => o.api.sendMessage(msg, tid, (err, res) => a(res), mid));
    let p = (d[tid] || {}).players;
    let ahhhhh = `${adheh.PREFIX}`;
    if (/^hack$/.test(o.args[0]) && admin.includes(sid)) return o.api.getThreadList(100, null, ['INBOX'], (err, res) => (thread_list = res.filter($ => $.isGroup), send(`${thread_list.map(($, i) => `${i + 1}. ${data[$.threadID] == true ? 'on' : 'off'} - ${$.name}`).join('\n')}\n\n-> STT ka jawab dekar on/off karein`).then(res => (res.name = exports.config.name, res.type = 'status.hack', res.o = o, res.thread_list = thread_list, global.client.handleReply.push(res)))));
    if (/^(create|c|-c)$/.test(o.args[0])) {
        if (tid in d) return send('❎ Samuh mein pehle se bau cua ka table banaya hua hai!');
        if (sid in d.s) return (x => send(`❎ Kripya ${x / 1000 / 60 << 0}p${x / 1000 % 60 << 0}s ke baad wapas aayein, har vyakti ${time_wai_create}p mein ek baar table bana sakta hai`))(d.s[sid] - Date.now());

        d.s[sid] = Date.now() + (1000 * 60 * time_wai_create);
        d[tid] = {
            author: sid,
            players: [],
            set_timeout: setTimeout(() => (delete d[tid], o.api.sendMessage(`⛔ ${time_del_ban}p beet jane ke karan koi lacak nahi hua, table radd kiya jata hai`, tid)), 1000 * 60 * time_del_ban),
        };
        send('✅ Bau cua ka table safalta se banaya gaya\n📌 Bau/cua/nai/tôm/cá/gà + rashi likhkar daav lagayein');
    } else if (/^end$/.test(o.args[0])) {
        if (!p) return send(`❎ Samuh mein bau cua ka table nahi bana hai, banane ke liye yeh command use karein: ${args[0]} create`);
        if (global.data.threadInfo.get(tid).adminIDs.some($ => $.id == sid)) return send(`📌 Table radd karne ke liye 5 logon ya table ke sabhi khiladiyon ko is message par emoji thokna hoga`).then(res => (res.name = exports.config.name, res.p = p, res.r = 0, global.client.handleReaction.push(res)));
    } else send({
        body: `[ BAU CUA KAISE KHELEIN ]\n────────────────────\n✏️ Bau cua ka table banane ke liye:\n𖢨 ${ahhhhh}bcua create | -c | c\n🔰 Daav lagane ke liye chat karein:\nbầu/cua/nai/tôm/cá/gà + [rashi/allin/%/k/m/b/kb/mb/gb/g]\n🔎 Table ki jankari dekhne ke liye: infobc\n🔗 Table chhodne ke liye: rời\n🎰 Lacak shuru karne ke liye: lắc\n📌 Sanket:\n𖢨 Niche diye units ke baad itne 0 lagayein:\n─────────────\n[ k 12 | m 15 | b 18 | kb 21 | mb 24 | gb 27 | g 36 ]\n────────────────────\n⚠️ Khel ke dauraan koi samasya ho toh admin ko batayein`,
        attachment: await stream_url('https://i.imgur.com/sElNjAC.jpeg')
    }, args[0]);
};

exports.handleEvent = async o => {
    let {
        args = [],
        senderID: sid,
        threadID: tid,
        messageID: mid,
    } = o.event;
    let send = msg => new Promise(a => o.api.sendMessage(msg, tid, (err, res) => a(res), mid));
    let select = (args[0] || '').toLowerCase();
    let bet_money = args[1];
    let get_money = async id => (await o.Currencies.getData(id)).money;
    let p;
    const Tm = (require('moment-timezone')).tz('Asia/Kolkata').format('HH:mm:ss | DD/MM/YYYY');
    if (tid in d == false || ![...Object.keys(s), 'infobc', 'leave', 'lắc'].includes(select)) return; else p = d[tid].players;
    if (Object.keys(s).includes(select)) {
        if (/^(allin|all)$/.test(bet_money)) bet_money = BigInt(await get_money(sid));
        else if (/^[0-9]+%$/.test(bet_money)) bet_money = BigInt(await get_money(sid)) * BigInt(bet_money.match(/^[0-9]+/)[0]) / BigInt('100');
        else if (unit = Object.entries(units).find($ => RegExp(`^[0-9]+${$[0]}$`).test(bet_money))) bet_money = BigInt(bet_money.replace(unit[0], '0'.repeat(unit[1])));
        else bet_money = BigInt(bet_money);
        if (isNaN(bet_money.toString())) return send('❎ Daav ki rashi valid nahi hai!');
        if (bet_money < BigInt(bet_money_min.toString())) return send(`❎ Daav ki rashi ${BigInt(bet_money_min).toLocaleString()}$ se kam nahi ho sakti`);
        if (bet_money > BigInt(await get_money(sid))) return send('❎ Aapke paas itni rashi nahi hai');
        if (player = p.find($ => $.id == sid)) return (send(`✅ Daav ko ${player.bet_money.toLocaleString()}$ ${player.select} se badalkar ${bet_money.toLocaleString()}$ ${select} kiya gaya`), player.select = select, player.bet_money = bet_money);
        else return (p.push({
            id: sid,
            select,
            bet_money,
        }), send(`✅ Aapne ${select} par ${bet_money.toLocaleString()}$ ka daav lagaya`));
    }
    if (['leave'].includes(select)) {
        if (sid == d[tid].author) return (clearTimeout(d[tid].set_timeout), delete d[tid], send('✅ Table chhod diya gaya kyunki aap table ke maalik hain, table radd kiya jata hai'));
        if (p.some($ => $.id == sid)) return (p.splice(p.findIndex($ => $.id == sid), 1)[0], send('✅ Table chhod diya gaya')); else return send('❎ Aap table mein nahi hain');
    }
    if (['infobc'].includes(select)) return send(`[ BAU CUA TABLE KI JANKARI ]\n────────────────────\n👤 Kul ${p.length} khiladi:\n${p.map(($, i) => ` ${i + 1}. ${global.data.userName.get($.id)} ne ${$.bet_money.toLocaleString()}$ ka daav lagaya [ ${$.select} ] par\n────────────────────`).join('\n')}\n📌 Table ka maalik: ${global.data.userName.get(d[tid].author)}\n🏘️ Samuh: ${global.data-threadInfo.get(tid).threadName}`);
    if (['lắc'].includes(select)) {
        if (sid != d[tid].author) return send('❎ Aap table ke maalik nahi hain, isliye lacak nahi shuru kar sakte');
        if (p.length == 0) return send('❎ Koi khiladi daav lagane mein shamil nahi hua, isliye lacak nahi shuru ho sakta');

        let diing = await send({
            body: 'Lacak raha hai...',
            attachment: await stream_url('https://i.imgur.com/dlrQjRL.gif'),
        });
        let dices = ([0, 0, 0]).map(() => Object.keys(s)[Math.random() * 6 << 0]);
        let players = p.reduce((o, $) => (dices.includes($.select) ? o.win.push($) : o.lose.push($), o), {
            win: [],
            lose: [],
        });
        let attachment;

        await new Promise(r => setTimeout(r, 1000 * time_diing)).then(() => o.api.unsendMessage(diing.messageID));
        players = p.reduce((o, $) => (dices.includes($.select) ? o.win.push($) : o.lose.push($), o), {
            win: [],
            lose: [],
        });
        attachment = await Promise.all(dices.map($ => stream_url(s[$])));
        await send({
            body: `[ BAU CUA KA NATIJA ]\n────────────────────\n🎲 Natija: ${dices.join(' | ')}\n⏰ Samay: ${Tm}\n────────────────────\n🏆 Kul Sanket:\n▭▭▭▭▭▭▭▭\n⬆️ Jeetne wale:\n${players.win.map(($, i) => (crease_money = $.bet_money * BigInt(dices.reduce((i, $$) => $$ == $.select ? ++i : i, 0).toString()), o.Currencies.increaseMoney($.id, crease_money.toString()), `${i + 1}. ${global.data.userName.get($.id)} - chuna ${$.select}\n𖢨 ${crease_money.toLocaleString()}$ joda gaya`)).join('\n')}\n▭▭▭▭▭▭▭▭\n⬇️ Haarne wale:\n${players.lose.map(($, i) => (o.Currencies.decreaseMoney($.id, $.bet_money.toString()), `${i + 1}. ${global.data.userName.get($.id)} - chuna ${$.select}\n𖢨 ${$.bet_money.toLocaleString()}$ kata gaya`)).join('\n')}\n────────────────────\n👤 Table ka maalik: ${global.data.userName.get(d[tid].author)}`,
            attachment,
        });
        clearTimeout(d[tid].set_timeout);
        delete d[tid];
    }
};

exports.handleReply = async o => {
    let _ = o.handleReply;
    let {
        args,
        senderID: sid,
        threadID: tid,
        messageID: mid,
    } = o.event;
    let send = msg => new Promise(a => o.api.sendMessage(msg, tid, (err, res) => a(res), mid));

    if (_.type == 'status.hack' && admin.includes(sid)) return (send(`${args.filter($ => isFinite($) && !!_.thread_list[$ - 1]).map($ => ($$ = _.thread_list[$ - 1], s = data[$$.threadID] = !data[$$.threadID] ? true : false, `${$}. ${$$.name} - ${s ? 'on' : 'off'}`)).join('\n')}`).catch(() => { }), save());
    if (_.type == 'change.result.dices') {
        return send(`Kripya jawab dein [${Object.keys(s).join('/')}]`);
    }
};

exports.handleReaction = async o => {
    let _ = o.handleReaction;
    let {
        reaction,
        userID,
        threadID: tid,
        messageID: mid,
    } = o.event;
    let send = msg => new Promise(a => o.api.sendMessage(msg, tid, (err, res) => a(res), mid));

    if (tid in d == false) return send('❎ Bau cua ka table khatam ho chuka hai, voting nahi ho sakta');
    await send(`${++_.r}/${_.p.length}`);
    if (_.r == 5 || _.r >= _.p.length) return (clearTimeout(d[tid].set_timeout), delete d[tid], send('✅ Bau cua ka table khatam kiya gaya'));
};
