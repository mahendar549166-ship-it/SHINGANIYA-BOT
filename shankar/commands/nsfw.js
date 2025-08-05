module.exports.config = {
	name: "nsfw",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
	description: "NSFW commands ke istemal ki anumati on/off karein",
	commandCategory: "Admin",
	cooldowns: 5,
};

module.exports.languages = {
    "vi": {
        "returnSuccessEnable": "☑️ Đã cho phép thành viên sử dụng lệnh NSFW",
        "returnSuccessDisable": "⚠️ Đã cấm thành viên sử dụng lệnh NSFW",
        "error": "❎ Đã có lỗi xảy ra, vui lòng thử lại sau"
    },
    "en": {
        "returnSuccessEnable": "Success enable NSFW command for this group",
        "returnSuccessDisable": "Success disable NSFW command for this group",
        "error": "Error! An error occurred. Please try again later!"
    },
    "hi": {
        "returnSuccessEnable": "☑️ Is group ke liye NSFW command chalu kar diya gaya",
        "returnSuccessDisable": "⚠️ Is group ke liye NSFW command band kar diya gaya",
        "error": "❎ Ek error hua hai, kripya baad mein koshish karein"
    }
}

module.exports.run = async function ({ event, api, Threads, getText }) {
    const { threadID, messageID } = event;
    const { getData, setData } = Threads;
    var type;

    try {
        let data = (await getData(threadID)).data || {};
        if (typeof data == "undefined" || data.NSFW == false) {
            data.NSFW = true;
            global.data.threadAllowNSFW.push(threadID);
            type = "on"
        }
        else {
            data.NSFW = false;
            global.data.threadAllowNSFW = global.data.threadAllowNSFW.filter(item => item != threadID);
        }
        await setData(threadID, { data });
        return api.sendMessage((type == "on") ? getText("returnSuccessEnable", "hi") : getText("returnSuccessDisable", "hi"), threadID, messageID);
    } catch (e) { console.log(e); return api.sendMessage(getText("error", "hi"), threadID, messageID) }
}
