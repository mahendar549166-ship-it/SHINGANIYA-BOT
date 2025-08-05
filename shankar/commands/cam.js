exports.config = {
  name: 'cam',
  version: '0.0.1',
  hasPermssion: 2,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: 'Messenger group mein command group ko band ya chalu karo',
  commandCategory: 'Admin',
  usages: '[]',
  cooldowns: 5
};

let fs = require('fs');
let path = __dirname + '/data/disable-command.json';
let data = {};
let save = () => fs.writeFileSync(path, JSON.stringify(data));

// Initialize data file if it doesn't exist
if (!fs.existsSync(path)) save();
data = JSON.parse(fs.readFileSync(path));

// Main run function
exports.run = o => {
  let {
    threadID: tid,
    messageID: mid,
  } = o.event;
  let send = (msg, callback) => o.api.sendMessage(msg, tid, callback, mid);
  let cmds = [...global.client.commands.values()];
  let cmd_categorys = Object.keys(cmds.reduce((o, $) => (o[$.config.commandCategory] = 0, o), {}));

  if (!data[tid]) data[tid] = {};

  send(`[ COMMAND GROUP BAN ]\n────────────────\n${cmd_categorys.map(($, i) => `${i + 1}. ${$}: ${!data[tid][$] ? 'band' : 'chalu'}`).join('\n')}\n\n📌 Is message ko reply karke number daalo taaki command group ko chalu ya band kar sako`, 
    (err, res) => (res.name = exports.config.name, res.cmd_categorys = cmd_categorys, res.o = o, global.client.handleReply.push(res)));
};

// Reply handler for enabling/disabling command groups
exports.handleReply = o => {
  let _ = o.handleReply;
  let {
    threadID: tid,
    messageID: mid,
    senderID: sid,
    args,
  } = o.event;
  let send = (msg, callback) => o.api.sendMessage(msg, tid, callback, mid);
  let category = _.cmd_categorys[args[0] - 1];
  let status = data[tid][category];

  if (_.o.event.senderID != sid) return;
  if (!category) return send(`❎ Yeh number mojood nahi hai`);

  data[tid][category] = !status ? true : false;
  save();
  send(`✅ ${category} command group ko ${!status ? 'chalu' : 'band'} kar diya gaya`);
};
