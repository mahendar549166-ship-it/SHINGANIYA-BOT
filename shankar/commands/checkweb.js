this.config = {
 name: 'checkweb',
 version: '0.0.1',
 hasPermission: 0,
 credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
 description: 'Website ka scam check karen',
 commandCategory: 'Tool',
 usages: '.checkweb [domain]',
 cooldowns: 3,
 images: [],
};

let axios = require('axios');
let cheerio = require('cheerio');

this.run = function (o) {
 let send = msg => o.api.sendMessage(msg, o.event.threadID, o.event.messageID);

 axios.get('https://scam.vn/check-website?domain=' + encodeURIComponent(o.args[0])).then(res => {
 let dom = cheerio.load(res.data);
 let div = dom('.container.text-center');
 let date_register = div.find('div:eq(0) > div:eq(0) > h6').text().split(' ').pop();
 let [like, dis_like] = ['#improve_web', '#report_web'].map($ => div.find(`${$} > span`).text());
 let do_tin_cay = div.find('.col-md-12.bg-warning.p-3 > a').text();
 let warn = [0, 1].map($ => div.find('.col-md-6.mt-2').eq($).text().trim());

 send(`=== [ Website Scam Check ] ===\n──────────────────\n📝 Domain: ${o.args[0]}\n🗓️ Register Date: ${date_register}\n🔎 Rating:\n 👍: ${like}\n 👎: ${dis_like}\n📌 Vishwasniyata: ${do_tin_cay}\n📜 Rating Points:\n\n${warn.join('\n\n')}`);
 }).catch(err => send('Website check karne mein error: ' + err.toString()));
};
