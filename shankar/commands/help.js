const request = require("request");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "help",
  version: "1.0.3",
  hasPermission: 0,
  credits: "SHANKAR",
  description: "Beginner's Guide",
  commandCategory: "guide",
  usePrefix: false,
  usages: "[Shows Commands]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 60
  }
};

module.exports.languages = {
  en: {
    moduleInfo:
      "「 %1 」\n%2\n\n❯ Usage: %3\n❯ Category: %4\n❯ Waiting time: %5 seconds(s)\n❯ Permission: %6\n\n» Module code by %7 ",
    helpList: `◖There are %1 commands and %2 categories on this bot.`,
    guideList: `◖Use: "%1help ‹command›" to know how to use that command!\n◖Type: "%1help ‹page_number›" to show that page contents!`,
    user: "User",
    adminGroup: "Admin group",
    adminBot: "Admin bot",
  },
};

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;

  if (!body || typeof body == "undefined" || body.indexOf("help") != 0)
    return;
  const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
  if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = threadSetting.hasOwnProperty("PREFIX")
    ? threadSetting.PREFIX
    : global.config.PREFIX;
  return api.sendMessage(
    getText(
      "moduleInfo",
      command.config.name,
      command.config.description,
      `${prefix}${command.config.name} ${command.config.usages || ""}`,
      command.config.commandCategory,
      command.config.cooldowns,
      command.config.hasPermission === 0
        ? getText("user")
        : command.config.hasPermission === 1
        ? getText("adminGroup")
        : getText("adminBot"),
      command.config.credits
    ),
    threadID,
    messageID
  );
};

module.exports.run = async function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = threadSetting.hasOwnProperty("PREFIX")
    ? threadSetting.PREFIX
    : global.config.PREFIX;

  if (!command) {
    const commandList = Array.from(commands.values());
    const categories = new Set(commandList.map((cmd) => cmd.config.commandCategory.toLowerCase()));
    const categoryCount = categories.size;

    const categoryNames = Array.from(categories);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(categoryNames.length / itemsPerPage);

    let currentPage = 1;
    if (args[0]) {
      const parsedPage = parseInt(args[0]);
      if (!isNaN(parsedPage) && parsedPage >= 1 && parsedPage <= totalPages) {
        currentPage = parsedPage;
      } else {
        return api.sendMessage(`◖Oops! You went too far! Please choose a page between 1 and ${totalPages}◗`, threadID, messageID);
      }
    }

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const visibleCategories = categoryNames.slice(startIdx, endIdx);

    let msg = "";
    const numberFont = ["❶", "❷", "❸", "❹", "❺", "❻", "❼", "❽", "❾", "❿"];
    for (let i = 0; i < visibleCategories.length; i++) {
      const category = visibleCategories[i];
      const categoryCommands = commandList.filter(
        (cmd) => cmd.config.commandCategory.toLowerCase() === category
      );
      const commandNames = categoryCommands.map((cmd) => cmd.config.name);
      msg += `╭[ ${numberFont[i]} ]─❍ ${
        category.charAt(0).toUpperCase() + category.slice(1)
      }\n╰─◗ ${commandNames.join(", ")}\n\n`;
    }

    const numberFontPage = [
      "❶","❷","❸","❹","❺","❻","❼","❽","❾","❿",
      "⓫","⓬","⓭","⓮","⓯","⓰","⓱","⓲","⓳","⓴"
    ];
    msg += `╭ ──────── ╮\n│ Page ${numberFontPage[currentPage - 1]} of ${numberFontPage[totalPages - 1]} │\n╰ ──────── ╯\n`;
    msg += getText("helpList", commands.size, categoryCount, prefix);

    // ✅ Use multiple rotating Imgur images
    const imgLinks = [
      "https://i.ibb.co/xt39pMgd/imgbb-upload.jpg",
      "https://i.ibb.co/TDWsz5pj/imgbb-upload.jpg",
      "https://i.ibb.co/ymSDqFgL/imgbb-upload.jpg",
      "https://i.ibb.co/QLSPhZV/imgbb-upload.jpg"
    ];
    const chosenImg = imgLinks[Math.floor(Math.random() * imgLinks.length)];
    const imagePath = path.join(__dirname, "cache", "menu.jpg");

    request(chosenImg).pipe(fs.createWriteStream(imagePath)).on("close", () => {
      const msgg = {
        body: `╭──────────────╮\n│𝐒𝐇𝐀𝐍𝐊𝐀𝐑 𝐁𝐎𝐓 𝐌𝐄𝐍𝐔│\n╰──────────────╯\n‣ Bot Owner: SHANKAR-SUMAN\n\n${msg}\n◖Total pages available: ${totalPages}.\n\n╭ ──── ╮\n│ GUIDE │\n╰ ──── ╯\n${getText("guideList", prefix)}`,
        attachment: fs.createReadStream(imagePath),
      };

      api.sendMessage(msgg, threadID, async (err, info) => {
        if (autoUnsend && info) {
          setTimeout(() => {
            api.unsendMessage(info.messageID);
          }, delayUnsend * 1000);
        }
      }, messageID);
    });
  } else {
    return api.sendMessage(
      getText(
        "moduleInfo",
        command.config.name,
        command.config.description,
        `${prefix}${command.config.name} ${command.config.usages || ""}`,
        command.config.commandCategory,
        command.config.cooldowns,
        command.config.hasPermission === 0
          ? getText("user")
          : command.config.hasPermission === 1
          ? getText("adminGroup")
          : getText("adminBot"),
        command.config.credits
      ),
      threadID,
      messageID
    );
  }
};
