exports.config = {
    name: 'bank',
    version: '0.0.1',
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: 'Banking se sambandhit kaam karne ka command',
    commandCategory: 'Uppayogita',
    usages: '[]',
    images: [],
    cooldowns: 0,
};

let fs = require('fs');

let folder = __dirname + '/data/banking_accounts/';
if (!fs.existsSync(folder)) fs.mkdirSync(folder);
let read = (id, path = folder + id + '.json') => fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : null;
let reads = _ => fs.readdirSync(folder).map($ => read($.replace('.json', ''))).filter($ => $ != null);
let del = (id, path = folder + id + '.json') => fs.unlinkSync(path);
let acc_my_login = id => reads().find($ => $.logins.some($ => $.uid == id)) || null;
let save = (data, path = folder + data.uid + '.json') => fs.writeFileSync(path, JSON.stringify(data, 0, 4));
let _0 = t => t < 10 ? '0' + t : t;
let convert_time = (time, format) => require('moment-timezone')(time).tz('Asia/Kolkata').format(format || 'HH:mm:ss DD/MM/YYYY');
let now = () => Date.now();
let random_number = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
let random_str = l => [...Array(l)].map($ => '0123456789'[Math.random() * 10 << 0]).join('');
let name = id => global.data.userName.get(id);
let _2fa_ = {};
let create_code_2fa = id => (_2fa_[id] = random_str(6), setTimeout(_ => delete _2fa_[id], 1000 * 60 * 3), `📝 Pramanikaran code: ${_2fa_[id]}\nYeh code 3 minute tak manya hai`);
let check_code_2fa = (id, code) => _2fa_[id] == code;
let interest = {
    debt: {
        rate: BigInt('5'),
        time: 1000 * 60 * 60,
    },
    balance: {
        rate: BigInt('1'),
        time: 1000 * 60 * 60 * 24 * 1,
    },
};
let _1th = 1000 * 60 * 60 * 24 * 30;
let ban_millis = _1th;
let due_millis = 1000 * 60 * 60 * 24 * 2;

exports.onLoad = o => {
    if (!global.set_interval_bankings_interest_p) global.set_interval_bankings_interest_p = setInterval((() => {
        for (let file of reads()) {
            let send = msg => new Promise(r => o.api.sendMessage(msg, file.uid, (err, res) => r(res || err)));

            if (typeof file.timestamp_due_repay != 'number' && BigInt(file.debt) > 0n) (file.timestamp_due_repay = now() + due_millis, save(file));
            if (typeof file.expired_ban.time == 'number' && now() > file.expired_ban.time) (file.expired_ban = {}, save(file));
            if (typeof file.expired_ban.time != 'number' && typeof file.timestamp_due_repay == 'number' && now() > file.timestamp_due_repay && BigInt(file.debt) > 0n) (file.expired_ban.time = now() + ban_millis, file.expired_ban.reason = ` ${due_millis / 1000 / 60 / 60 / 24 << 0} din se adhik samay tak karz nahi chukaya gaya`, save(file), send(`[ SAMAY SE ADHIK SAMAAPT SUCNA ]\n────────────────\n⚠️ ${due_millis / 1000 / 60 / 60 / 24 << 0} din se adhik samay tak karz na chukane ke karan aapka khata band kar diya gaya hai ${ban_millis / 1000 / 60 / 60 / 24 / 30 << 0} mahine ke liye, sampark admin se karein`));

            if (typeof file.expired_ban.time != 'number') for (let type of ['balance', 'debt']) {
                if (BigInt(file[type]) >= 100n && (typeof file.interest_period[type]) != 'number') (file.interest_period[type] = now() + interest[type].time, save(file));
                if (typeof file.interest_period[type] == 'number' && now() > file.interest_period[type] && BigInt(file[type]) >= 100n) (interest_money = BigInt(file[type]) * interest[type].rate / 100n, file[type] = (BigInt(file[type]) + interest_money).toString(), file.interest_period[type] = now() + interest[type].time, save(file), send(`[ BYAAJ SUCNA ]\n────────────────\n+ ${interest_money.toLocaleString()}$ byaaj ${ {
                    balance: 'baki rashi', debt: 'karz rashi'
                }[type]} mein joda gaya`));
            };
        };
    }), 1000);
};

exports.run = async o => {
    let tid = o.event.threadID;
    let send = (msg, tid_, typ = typeof tid_ == 'object') => new Promise(r => (o.api.sendMessage(msg, typ ? tid_.event.threadID : (tid_ || tid), (err, res) => r(res || err), typ ? tid_.event.messageID : (tid_ ? undefined : o.event.messageID))));
    let cmd = o.event.args[0];
    let sid = o.event.senderID;
    let target_id = o.event.messageReply?.senderID || Object.keys(o.event.mentions || {})[0];
    let data = read(sid);
    let {
        getData,
        increaseMoney,
        decreaseMoney,
    } = o.Currencies;

    if (convert_time(now(), 'd') == '0') return send('⛔ Ravivar ko banking band rehta hai, kal milte hain');
    if (acc_my_login(sid)) data = acc_my_login(sid);
    if (!!o.args[0] && !['-r', 'register', 'login', 'unban'].includes(o.args[0]) && data == null) return send(`❎ Aapke paas bank khata nahi hai, '${cmd} register' ka upyog karke khata banayein`);
    if (!!o.args[0] && !['unban', 'login', 'logout'].includes(o.args[0]) && typeof data?.expired_ban?.time == 'number') return send(`❎ Aapka khata band hai kyunki: ${data.expired_ban.reason}, band khulne ke baad: ${(d => `${_0(d / 1000 / 60 / 60 / 24 % 30 << 0)} din ${_0(d / 1000 / 60 / 60 % 24 << 0)}:${_0(d / 1000 / 60 % 60 << 0)}:${_0(d / 1000 % 60 << 0)}`)(data.expired_ban.time - now())}`);

    switch (o.args[0]) {
        case '-r':
        case 'register': {
            let account_number;
            let fee = 100000000n;
            if (data) return send('❎ Aapke paas pehle se khata hai');
            let create_account = pass => {
                if (read(sid) != null) return send('❎ Aapke paas pehle se khata hai', sid);

                let form = {
                    "account_number": account_number || random_str(6),
                    "uid": sid,
                    "balance": "0",
                    "created_at": now(),
                    "debt": "0",
                    "count_debt": 0,
                    "status": 0,
                    "history": [],
                    "logins": [],
                    "settings": {},
                    "expired_ban": {},
                    "interest_period": {},
                    pass,
                };

                save(form);
                return send(`✅ Bank khata safalta se banaya gaya, '${cmd} info' ka upyog karke khate ki jankari dekhein`, sid);
            };

            send(`🆕 Kya aap apna khata number khud se set karna chahte hain? Is message ka jawab dein apne pasand ka khata number (fee ${fee.toLocaleString()}$) ya 'n' likhkar skip karein`).then(res => (res.name = exports.config.name, res.callback = async o => {
                let stk = o.event.args[0];

                if (isFinite(stk)) {
                    if (reads().some($ => $.account_number == stk)) return send(`❎ Yeh khata number pehle se maujud hai`, o);
                    if (BigInt((await getData(sid)).money) < fee) return send('❎ Aapke paas itne paise nahi hain', o);

                    account_number = stk;
                    decreaseMoney(sid, fee.toString());
                };
                send(`📌 Kya aap apna password khud set karna chahte hain ya system random password banaye?\n\n'y' ka jawab dein khud set karne ke liye ya 'n' ka jawab dein system ke random password ke liye`, o).then(res => (res.name = exports.config.name, res.callback = async o => {
                    let call = {
                        y: _ => send('✅ System ne password daalne ka step alag message mein bheja hai', o).then(() => send('📌 Is message ka jawab dein apna pasandida password daal kar', o.event.senderID).then(res => (res.name = exports.config.name, res.callback = o => create_account(o.event.args[0]), res.o = o, global.client.handleReply.push(res)))),
                        n: _ => send('✅ System ne password alag message mein bheja hai', o).then(_ => create_account(random_str(4)).then(() => send(`📌 Aapka password hai ${read(sid).pass}`, sid))),
                    }[(o.event.args[0] || '').toLowerCase()];

                    if (read(sid) != null) return send('❎ Aapke paas pehle se khata hai', o);
                    if (!call) return send('❎ Kripya y/n ka jawab dein', o); else call();
                },
                    res.o = o,
                    global.client.handleReply.push(res)));
            }, res.o = o, global.client.handleReply.push(res)));
        };
            break;
        case '-i':
        case 'info': try {
            let acc = o.args[1]?.split(':') || [];
            let data_target = !!target_id ? read(target_id) : acc.length != 0 ? (acc[0] == 'uid' ? read(acc[1]) : acc[0] == 'stk' ? reads().find($ => $.account_number == acc[1]) || null : null) : data;

            if (data_target == null) return send('❎ Khata jankari ke liye khata nahi mila');
            if ((!!target_id || acc.length != 0) && !data_target.settings.public) return send('⚠️ Yeh khata jankari pradarshit nahi karta');

            send(`[ MIRAI BANK ]\n────────────────\n👤 Khata swami: ${name(data_target.uid)?.toUpperCase()}\n🏦 Khata Number: ${data_target.account_number}\n💵 Baki Rashi: ${BigInt(data_target.balance).toLocaleString()}$ ${!!data_target.interest_period.balance && BigInt(data_target.balance) > 100n ? `\n⬆️ Byaaj: +${(BigInt(data_target.balance) * interest.balance.rate / 100n).toLocaleString()}$ baad ${(f => `${_0(f / 1000 / 60 / 60 << 0)}:${_0(f / 1000 / 60 % 60 << 0)}:${_0(f / 1000 % 60 << 0)}`)(data_target.interest_period.balance - now())}` : ''}\n🔄 Suraksha Sthiti: ${data_target.pass.length <= 4 && !data_target.settings._2fa ? 'kamzor (chhota password, 2FA band)' : data_target.pass.length > 4 && !!data_target.settings._2fa ? `Majboot` : `Theek ( ${data_target.pass.length <= 4 ? 'chhota password' : '2FA band'})`}\n🔒 Global Ban: ${data_target.expired_ban.time ? `band kiya gaya tha ${convert_time(data_target.expired_ban.time - _1th)} ko, karan: ${data_target.expired_ban.reason}` : 'koi band nahi'}\n⏰ Banaya Gaya: ${convert_time(data_target.created_at)}\n⛔ Karz: ${BigInt(data_target.debt).toLocaleString()}$ ${!!data_target.interest_period.debt && BigInt(data_target.debt) > 100n ? `\n⬆️ Byaaj: +${(BigInt(data_target.debt) * interest.debt.rate / 100n).toLocaleString()}$ baad ${(f => `${_0(f / 1000 / 60 / 60 << 0)}:${_0(f / 1000 / 60 % 60 << 0)}:${_0(f / 1000 % 60 << 0)}`)(data_target.interest_period.debt - now())}` : ''}\n🌐 Jankari Pradarshit: ${!data_target.settings.public ? 'nahi' : 'hai'}\n🔢 Do Parikshan Pramanikaran: ${!data_target.settings._2fa ? 'band' : 'chalu'}\n────────────────\n📌 100$ se adhik baki rashi/karz par byaaj shuru hoga`);
        } catch (e) {
            console.log(e);
            send('⚠️ Kuch galat hua, developer se sampark karein');
        };
            break;
        case 'nạp':
        case 'gửi': {
            let money = o.args[1];
            let min = 100n;
            let userData = await getData(sid);

            if (/^all$/.test(money)) money = BigInt(userData.money);
            else if (/^[0-9]+%$/.test(money)) money = BigInt(userData.money) * BigInt(money.match(/^[0-9]+/)[0]) / 100n;
            if (!money || isNaN(money.toString())) return send(`❎ Kripya khate mein jama karne ke liye rashi daalain`); else money = BigInt(money);
            if (money < min) return send(`❎ Jama karne ki nynatam rashi hai ${min.toLocaleString()}$`);
            if (BigInt(userData.money) < money) return send(`❎ Aapke wallet mein itne paise nahi hain jama karne ke liye`);

            let newBalance = BigInt(data.balance) + money;

            await decreaseMoney(sid, money.toString());
            data.balance = newBalance.toString();
            data.history.push({
                type: 'send', amount: money.toString(), author: sid, time: now(),
            });
            save(data);
            send(`✅ ${money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}$ khate mein jama kar diya gaya`);
        };
            break;
        case 'rút':
        case 'lấy': {
            let money = o.args[1];
            let min = 1n;

            if (/^all$/.test(money)) money = BigInt(data.balance);
            else if (/^[0-9]+%$/.test(money)) money = BigInt(data.balance) * BigInt(money.match(/^[0-9]+/)[0]) / 100n;
            if (isNaN(money + '')) return send(`❎ Kripya khate se nikalne ke liye rashi daalain`); else money = BigInt(money);
            if (money < min) return send(`❎ Nikalne ki nynatam rashi hai ${min.toLocaleString()}$`);
            if (money > BigInt(data.balance)) return send(`❎ Aapke paas itne paise nahi hain`);

            let newBalance = BigInt(data.balance) - money;
            let userData = await getData(sid);
            let newMoney = BigInt(userData.money) + money;

            await increaseMoney(sid, money.toString());
            data.balance = newBalance.toString();
            data.history.push({
                type: 'withdraw', amount: money.toString(), author: sid, time: now()
            });
            save(data);
            send(`✅ ${money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}$ khate se nikala gaya`);
        };
            break;
        case '-t':
        case 'top': {
            if (BigInt(data.balance) < 100000) return send('❎ Banking ranking dekhne ke liye khate ki baki rashi 100,000$ se adhik honi chahiye');

            send('📌 Ranking dekhne ke liye -10% paise confirm karne ke liye emoji thok dein').then(res => (res.callback = () => (data.balance = (BigInt(data.balance) - BigInt(data.balance) * 10n / 100n).toString(), save(data), send(`[ TOP RANKING ]\n────────────────\n${reads().sort((a, b) => BigInt(b.balance) < BigInt(a.balance) ? -1 : 0).slice(0, 10).map(($, i) => `${i + 1}.\n👤 Naam: ${$.settings.public ? name($.uid)?.toUpperCase() : 'gupt'}\n💵 Paise: ${BigInt($.balance).toLocaleString()}$`).join('\n\n')}`)), res.name = exports.config.name, res.o = o, global.client.handleReaction.push(res)));
        };
            break;
        case '-p':
        case 'pay': {
            let type_pay = (o.args[1] || '').toLowerCase();

            if (!['stk', 'uid'].includes(type_pay)) return send(`❎ Kripya 'stk' ya 'uid' chunein\nUdaharan: ${cmd} pay stk`);

            send(`📌 Is message ka jawab dein aur ${ {
                stk: 'khata number', uid: 'Facebook UID'
            }[type_pay]} daalain jisko paise bhejne hain`).then(res => (res.name = exports.config.name, res.o = o, res.callback = async o => {
                let send = (msg, tid) => new Promise(r => (o.api.sendMessage(msg, tid || o.event.threadID, (err, res) => r(res || err), tid ? undefined : o.event.messageID)));
                let target_pay = o.event.args[0];
                let receiver = type_pay == 'stk' ? reads().find($ => $.account_number == target_pay) || null : read(target_pay);

                if (!receiver) return send(`⚠️ Jis khate mein paise bhejne hain woh nahi mila`);

                send(`👤 Naam: ${name(receiver.uid)?.toUpperCase()}\n🏦 Khata Number: ${receiver.account_number}\n\n📌 Bhejne ke liye rashi daalain`).then(res => (res.name = exports.config.name, res.o = o, res.callback = async o => {
                    data = read(data.uid);
                    let send = (msg, tid) => new Promise(r => (o.api.sendMessage(msg, tid || o.event.threadID, (err, res) => r(res || err), tid ? undefined : o.event.messageID)));
                    let money_pay = (o.event.args[0] || '').toLowerCase();

                    if (money_pay == 'all') money_pay = data.balance.toString();
                    else if (/^[0-9]+%$/.test(money_pay)) money_pay = BigInt(data.balance) * BigInt(money_pay.match(/^[0-9]+/)[0]) / 100n;
                    if (isNaN(money_pay.toString())) return send('❎ Rashi sahi nahi hai');
                    if (BigInt(money_pay) < 500n) return send(`❎ Transfer ke liye nynatam rashi 500$ hai`);
                    if (BigInt(money_pay) > BigInt(data.balance)) return send(`❎ Aapke paas itne paise nahi hain transfer ke liye`);

                    send('📌 Transfer ka vivaran daalain').then(res => (res.name = exports.config.name, res.o = o, res.callback = async o => {
                        let send = (msg, tid) => new Promise(r => (o.api.sendMessage(msg, tid || o.event.threadID, (err, res) => r(res || err), tid ? undefined : o.event.messageID)));
                        let content_pay = o.event.body;

                        send(`👤 Naam: ${name(receiver.uid)?.toUpperCase()}\n🏦 Khata Number: ${receiver.account_number}\n💵 Bhejne wali rashi: ${BigInt(money_pay).toLocaleString()}$\n📝 Vivaran: ${content_pay}\n\n📌 Paise transfer confirm karne ke liye emoji thok dein`).then(res => (res.name = exports.config.name, res.o = o, res.callback = async o => {
                            data = read(data.uid);
                            receiver = read(receiver.uid);
                            let newBalance = BigInt(data.balance) - BigInt(money_pay);
                            let newReceiverBalance = BigInt(receiver.balance) + BigInt(money_pay);

                            data.balance = newBalance.toString();
                            receiver.balance = newReceiverBalance.toString();
                            data.history.push({
                                type: 'pay', amount: money_pay.toString(), content: content_pay, author: sid, time: now(), to: receiver.account_number
                            });
                            receiver.history.push({
                                type: 'receive', amount: money_pay.toString(), content: content_pay, time: now(), from: data.account_number
                            });
                            save(data);
                            save(receiver);
                            await send(`[ PAISE PRAPT SUCNA ]\n────────────────\n👤 Naam: ${name(data.uid).toUpperCase()}\n🏦 Khata Number: ${data.account_number}\n💵 Rashi: ${BigInt(money_pay).toLocaleString()}$\n📝 Vivaran: ${content_pay}\n\n📌 Aapki baki rashi hai: ${newReceiverBalance.toLocaleString()}$`, receiver.uid);
                            send(`✅ ${name(receiver.uid)} ke liye ${BigInt(money_pay).toLocaleString()}$ transfer kiya gaya`, tid);
                        }, global.client.handleReaction.push(res)))
                    }, global.client.handleReply.push(res)))
                },
                    global.client.handleReply.push(res)))
            }, global.client.handleReply.push(res)));
        };
            break;
        case '-v':
        case 'vay': {
            let limit = 10000000n;
            let money = o.args[1];
            if (money === 'max') money = limit;
            if (isNaN(money + '')) return send(`❎ Kripya vay karne ke liye rashi daalain`);
            if (BigInt(money) < 500n) return send(`❎ Vay karne ki nynatam rashi 500$ hai`);
            if (data.count_debt >= 2) return send(`❎ Aapke paas pehle se chukaya nahi gaya karz hai, kripya pehle karz chukayein`);
            if (o.args[1] === 'max') money = limit - BigInt(data.debt);

            let newDebt = BigInt(data.debt) + BigInt(money); if (newDebt > limit || money == 0n) return send(`❎ Khate par vay ki seema ${limit.toLocaleString()}$ hai`);
            let newBalance = BigInt(data.balance) + BigInt(money);

            data.balance = newBalance.toString();
            data.debt = newDebt.toString();
            data.count_debt++;
            data.history.push({
                type: 'borrow', amount: money.toString(), author: sid, time: now()
            });
            if (!data.timestamp_due_repay) data.timestamp_due_repay = now() + due_millis;
            save(data);
            send(`✅ ${BigInt(money).toLocaleString()}$ vay kiya gaya, aapka karz ab ${newDebt.toLocaleString()}$ hai jisme ${interest.debt.rate}%/${interest.debt.time / 1000 / 60 / 60 << 0} ghante ka byaaj hai, ${due_millis / 1000 / 60 / 60 / 24 << 0} din mein karz na chukane par khata 1 mahine ke liye band ho jayega`);
        };
            break;
        case 'trả': {
            let money = o.args[1];

            if (data.debt == '0') return send('⚠️ Aapke paas koi karz nahi hai');
            if (/^all$/.test(money)) money = data.debt;
            if (isNaN(money + '')) return send(`❎ Kripya karz chukane ke liye rashi daalain`);
            if (BigInt(money) > BigInt(data.balance)) return send('⚠️ Baki rashi karz chukane ke liye kaafi nahi hai');
            if (BigInt(money) > BigInt(data.debt) || BigInt(money) < 1n) return send(`❎ Chukayi gayi rashi vartaman karz se badi nahi ho sakti ya 1$ se kam nahi ho sakti, ya aap '${cmd} trả all' ka upyog karke poora karz chuka sakte hain`);

            let newDebt = BigInt(data.debt) - BigInt(money);
            let newBalance = BigInt(data.balance) - BigInt(money);

            data.balance = newBalance.toString();
            data.debt = newDebt.toString();
            if (data.debt == '0') (data.count_debt = 0, delete data.timestamp_due_repay);
            data.history.push({
                type: 'repay', amount: money.toString(), author: sid, time: now()
            });
            save(data);
            send(`✅ ${BigInt(money).toLocaleString()}$ ka karz chukaya gaya, vartaman karz hai ${newDebt.toLocaleString()}$${newDebt != 0n ? `, karz chukane ki seema fir se ${due_millis / 1000 / 60 / 60 / 24 << 0} din ke liye set ki gayi hai` : ''}`);
        };
            break;
        case '-h':
        case 'history':
            send(`[ LEN DEN ITIHAAS ]\n────────────────\n${data.history.map(($, i) => (money_str = $.amount ? `${BigInt($.amount).toLocaleString()}$` : '', `${i + 1}. ${convert_time($.time)} - ${ {
                send: _ => `jama kiya ${money_str}`,
                withdraw: _ => `nikala ${money_str}`,
                pay: _ => `transfer kiya ${money_str} khata number ${$.to} ko`,
                receive: _ => `prapt kiya ${money_str} khata number ${$.from} se`,
                borrow: _ => `vay kiya ${money_str}`,
                repay: _ => `chukaya ${money_str}`,
                login: _ => `login kiya https://www.facebook.com/profile.php?id=${$.from} se`,
                setpass: _ => `https://www.facebook.com/profile.php?id=${$.author} ne password set kiya: ${$.pass}`,
                setstk: _ => `https://www.facebook.com/profile.php?id=${$.author} ne khata number badla: ${$.stk}`,
            }[$.type]()}`)).join('\n────────────────\n')}`);
            break;
        case 'setpass':
            await send('✅ System ne naya password daalne ka step alag message mein bheja hai');
            send('📌 Is message ka jawab dein aur naya password daalain', sid).then(res => (res.callback = o => {
                data.pass = o.event.args[0];
                data.history.push({
                    type: 'setpass', pass: data.pass, author: sid, time: now(),
                });
                save(data);
                send('✅ Khate ke liye password set kiya gaya\nIs password ka upyog doosre Facebook khate par banking khata login karne ke liye kiya ja sakta hai', o);
            }, res.name = exports.config.name, res.o = o, global.client.handleReply.push(res)));
            break;
        case 'setstk': {
            let fee = 100000000n;

            if (isNaN(o.args[1])) return send('❎ Khata number ek sankhya hona chahiye');
            if (BigInt(data.balance) < fee) return send(`❎ Aapke paas ${fee.toLocaleString()}$ ke liye kaafi paise nahi hain`);

            send(`📌 Khata number badalne ke liye ${fee.toLocaleString()}$ fee confirm karne ke liye emoji thok dein`).then(res => (res.callback = _ => {
                let newBalance = BigInt(data.balance) - fee;

                data.balance = newBalance.toString();
                data.account_number = o.args[1];
                data.history.push({
                    type: 'setstk', stk: o.args[1], author: sid, time: now(),
                });
                save(data);
                send(`✅ Khata number safalta se badla gaya\n${fee.toLocaleString()}$ kata gaya`);
            }, res.name = exports.config.name, res.o = o, global.client.handleReaction.push(res)));
        };
            break;
        case 'login': {
            let type = (o.args[1] || '').toLowerCase();

            if (!['uid', 'stk'].includes(type)) return send(`❎ Kripya 'stk' ya 'uid' chunein\nUdaharan: ${cmd} login stk`);

            await send('✅ System ne login ke steps alag message mein bheje hain');
            send(`📌 Is message ka jawab dein aur ${ {
                uid: 'Facebook UID', stk: 'khata number'
            }[type]} daalain`, sid).then(res => (res.callback = o => {
                let target_id = o.event.args[0];
                let data_target = type == 'uid' ? read(target_id) : type == 'stk' ? reads().find($ => $.account_number == target_id) || null : null;

                if (data_target == null) return send('⚠️ Aapke dwara daala gaya khata maujud nahi hai', o);
                if (data_target.uid == sid) return send('✅ Aapka Facebook is khate ka swami hai, isliye system ne pehle hi login kar diya tha', o);

                send('📌 Is message ka jawab dein aur password daalain', o).then(res => (res.callback = async o => {
                    data_target = read(data_target.uid);
                    let pass = o.event.args[0];

                    if (data_target.pass != pass) return send('⚠️ Password galat hai', o);

                    let login = async o => {
                        data_target.logins.push({
                            "uid": sid,
                            "time": now(),
                        });
                        data_target.history.push({
                            type: 'login', from: sid, time: now(),
                        });
                        save(data_target);
                        if (typeof data?.uid == 'string' && data?.uid != sid) (data.logins.splice(data.logins.findIndex($ => $.uid == sid), 1), save(data));
                        await send(`✅ Banking khate mein login ho gaya, '${cmd} info' ka upyog karke khate ki jankari dekhein`);
                        send(`[ Banking - Sucna ]\n────────────────\n⚠️ Aapka khata abhi https://www.facebook.com/profile.php?id=${sid} par login hua hai\n⛔ Agar aap is vyakti ko nahi jaante, toh password badlein aur is message par reaction dekar us Facebook se turant logout karein ya ${cmd} logloca ka upyog karke khate mein login kiye gaye sthan dekhein aur logout karein.`, data_target.uid).then(res => (res.callback = o => {
                            data_target = read(data_target.uid);
                            data_target.logins.splice(data_target.logins.findIndex($ => $.uid == sid), 1);
                            save(data_target);
                            send(`✅ https://www.facebook.com/profile.php?id=${sid} se logout kiya gaya`, o);
                        }, res.name = exports.config.name, res.o = o, global.client.handleReaction.push(res)));
                    };

                    if (!data_target.settings._2fa) login(o);
                    else send(`🔒 Login pramanikaran code asli Facebook khate par bheja gaya hai, is message ka jawab dekar code pramanit karein`, o).then(res => (send(create_code_2fa(sid), data_target.uid), res.callback = async o => {
                        let code = o.event.args[0];

                        if (!check_code_2fa(sid, code)) return send('❎ Login code sahi nahi hai');

                        login(o);
                    },
                        res.name = exports.config.name,
                        res.o = o,
                        global.client.handleReply.push(res)));
                },
                    res.name = exports.config.name,
                    res.o = o,
                    global.client.handleReply.push(res)));
            }, res.name = exports.config.name, res.o = o, global.client.handleReply.push(res)));
        };
            break;
        case 'logout': {
            if (data == null || data?.uid == sid) return send(`❎ Aap kisi khate mein login nahi hain`);

            data.logins.splice(data.logins.findIndex($ => $.uid == sid), 1);
            save(data);
            send(`✅ Khate se logout ho gaya`);
        };
            break;
        case 'logloca':
            send(`[ Banking - LOGIN KIYE GAYE STHAN ]\n────────────────\n${data.logins.map(($, i) => `${i + 1}. https://www.facebook.com/profile.php?id=${$.uid} (${convert_time($.time)})`).join('\n')}\n\nJawab dein (reply) aur stt ke anusaar us Facebook se khata logout karein`).then(res => (res.callback = o => {
                let stt = o.event.args;

                if (isNaN(stt.join(''))) return send(`❎ Stt ek sankhya honi chahiye`, o);

                data.logins = data.logins.filter((e, i) => !stt.includes('' + (i + 1)));
                save(data);
                send('✅ Upar ke FB se logout kiya gaya', o)
            },
                res.o = o,
                res.name = exports.config.name,
                global.client.handleReply.push(res)));
            break;
        case 'delete': {
            if (data == null) return send(`⚠️ Aapke paas khata nahi hai`);
            if (data.uid != sid) return send(`❎ Khata hataane ka adhikaar nahi hai`);
            if (BigInt(data.debt) > 0n) return send('⚠️ Aapka karz pura chukaya nahi gaya hai, isliye yeh request nahi kiya ja sakta');

            let callback = () => {
                del(sid);
                send('✅ Khata hata diya gaya');
            };
            send('📌 Khata hataane ke liye confirm karne ke liye emoji thok dein\n\n⚠️ Hataane ke baad khata wapas nahi kiya ja sakta').then(res => (res.name = exports.config.name, res.callback = callback, res.o = o, res.type = 'cofirm_delete_account', global.client.handleReaction.push(res)));
        };
            break;
        case 'public': {
            if (!['on', 'off'].includes(o.args[1])) return send(`⚠️ Kripya is tarah command ka upyog karein: ${cmd} public on ya off`);

            data.settings.public = o.args[1] == 'on' ? true : false;
            save(data);
            send(`✅ Khata jankari ko ${o.args[1] == 'on' ? 'pradarshit' : 'gupt'} kiya gaya`);
        };
            break;
        case '2fa': {
            if (!['on', 'off'].includes(o.args[1])) return send(`❎ Kripya ${cmd} 2fa on ya off daalain`);

            data.settings._2fa = o.args[1] == 'on' ? true : false;
            save(data);
            send(`✅ 2FA ${o.args[1] == 'on' ? 'chalu' : 'band'} kiya gaya`);
        };
            break;
        case 'unban': {
            if (!global.config.NDH.includes(sid) && !global.config.ADMINBOT.includes(sid)) return;

            let data_target = read(target_id || o.args[1] || sid);
            if (data_target == null) return send('⚠️ Khata nahi mila');
            if (!data_target.expired_ban.time) return send('❎ Yeh khata band nahi hai');

            data_target.expired_ban = {};
            delete data_target.timestamp_due_repay;
            data_target.balance = '0';
            data_target.debt = '0';
            save(data_target);
            send('✅ Is khate ka band khol diya gaya');
        };
            break;
        case 'admin':
            if (global.config.ADMINBOT.includes(sid)) send(`[ Banking - Admin Commands ]\n────────────────\n1: 55 66 (55 aur 66 ID ke sath file.json hatayein).\n2: 88 1000 (ID 88 ki baki rashi ko 1000$ mein badlein)\n3: 88 1000 (ID 88 ke karz ko 1000$ mein badlein)\n\n-> STT [data] ke sath jawab dein`).then(res => (res.callback = async o => {
                let call = {
                    1: _ => (o.event.args.map($ => del($)), send('done', o)),
                }[o.event.args[0]];

                call();
            }, res.name = exports.config.name, res.o = o, global.client.handleReply.push(res))); else break;
            break;
        default:
            send(`[ MIRAI BANK ]\n────────────────\n${cmd} register -> Bank khata banayein\n${cmd} info -> Apne khate ki jankari dekhein\n${cmd} history -> Poora len den itihas dekhein\n${cmd} nạp/gửi + rashi -> Bank khate mein paise jama karein\n${cmd} rút/lấy + rashi -> Bank khate se paise nikalein\n${cmd} top -> Sabse ameer users ka top dekhein\n${cmd} pay + stk -> Kisi khata number par paise bhejein\n${cmd} vay + rashi -> Bank se karz lein\n${cmd} trả + rashi -> Bank ko karz wapas karein\n${cmd} setpass + password -> Password set karein\n${cmd} setstk + khata number -> Khata number badlein\n${cmd} login -> Khate mein login karein\n${cmd} logout -> Khate se logout karein\n${cmd} delete -> Khata hataayein\n${cmd} public on/off -> Khata jankari pradarshit ya gupt karein\n${cmd} logloca -> Login kiye gaye sthan dekhein\n${cmd} 2fa -> 2FA chalu ya band karein\n\nTip: ${cmd} + '-' aur pehla akshar ka upyog karke chhota likhein\nUdaharan: ${cmd} -r`);
            break;
    };
};

exports.handleReaction = async o => {
    let f = o.handleReaction;

    o.api.unsendMessage(f.messageID);
    if (f.o.event.senderID == o.event.userID) f.callback(o);
};

exports.handleReply = async o => {
    let f = o.handleReply;

    if (f.o.event.senderID == o.event.senderID) (res = await f.callback(o), res == undefined ? o.api.unsendMessage(f.messageID) : '');
};
