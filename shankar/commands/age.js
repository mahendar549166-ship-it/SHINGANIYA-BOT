module.exports.config = {
    name: "age",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Umra calculate karein bina API ke =))",
    commandCategory: "Upyogita",
    usages: "[din/maheena/saal janm ka]",
    cooldowns: 0
};

module.exports.run = function ({ event, args, api, getText }) {
    const moment = require("moment-timezone");
    var date = new Date();
    var yearin = moment.tz("Asia/Kolkata").format("YYYY");
    var dayin = moment.tz("Asia/Kolkata").format("DD");
    var monthin = moment.tz("Asia/Kolkata").format("MM");
    var input = args[0];
    if (!input) return api.sendMessage("❌ Galat format daala gaya", event.threadID);
    var content = input.split("/");
    var dayout = parseInt(content[0]);
    if (!dayout || isNaN(dayout) || dayout > 31 || dayout < 1) { return api.sendMessage("❌ Janm ka din sahi nahi hai!", event.threadID); }
    var monthout = parseInt(content[1]);
    if (!monthout || isNaN(monthout) || monthout > 12 || monthout < 1) { return api.sendMessage("❌ Janm ka maheena sahi nahi hai!", event.threadID); }
    var yearout = parseInt(content[2]);
    if (!yearout || isNaN(yearout) || yearout > yearin || yearout < 1) { return api.sendMessage("❌ Janm ka saal sahi nahi hai!", event.threadID); }
    var tuoi = yearin - yearout;
    var msg = `Is saal aapki umra ${tuoi} saal hai`;
    if (monthout > monthin) {
        var tuoi = tuoi - 1;
        var aftermonth = monthout - monthin;
        var msg = `Is saal aapki umra ${tuoi} saal hai. Abhi ${aftermonth} maheene baad aap ${tuoi + 1} saal ke ho jayenge`;
    }
    if (monthin == monthout && dayin < dayout) {
        var tuoi = tuoi - 1;
        var afterday = dayout - dayin;
        var msg = `Is saal aapki umra ${tuoi} saal hai. Abhi ${afterday} din baad aap ${tuoi + 1} saal ke ho jayenge`;
    }
    return api.sendMessage(msg, event.threadID);
};
