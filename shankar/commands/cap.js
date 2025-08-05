const fs = require("fs-extra");
const puppeteer = require('puppeteer');

module.exports.config = {
  name: 'cap',
  version: '1.0.1',
  hasPermssion: 3,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: 'Wall ya kisi website ka screenshot lo',
  usages: [
    'cap : Apna wall ka screenshot',
    'cap <reply>: Reply kiye hue user ka wall screenshot',
    'cap <tag>: Tag kiye hue user ka wall screenshot',
    'cap <link>: Website ka screenshot',
  ],
  cooldowns: 5,
  commandCategory: 'Utility',
};

// Main run function
module.exports.run = async function ({ api, event, args, Users }) {
  const { createReadStream, unlinkSync } = require('fs-extra');
  const { resolve } = require('path');
  var path = resolve(__dirname, 'cache', `cap${event.threadID}_${event.senderID}.png`);
  try {
    // Handle user ID for wall screenshot
    if (!args[0] || event.type == 'message_reply' || Object.keys(event.mentions).length !== 0) {
      if (!args[0]) uid = event.senderID;
      if (event.type == 'message_reply') uid = event.messageReply.senderID;
      if (Object.keys(event.mentions).length !== 0) uid = Object.keys(event.mentions)[0];
      var browser = await puppeteer.launch({ args: ['--no-sandbox'] });
      var page = await browser.newPage();
      page.setViewport({ width: 1920, height: 1080 });
      api.sendMessage(`🔄 Thoda rukiye, load ho raha hai...`, event.threadID, event.messageID);

      // Set cookies for Facebook login
      var getAppState = api.getAppState();
      var cookies = [];
      getAppState.forEach(function (a) {
        cookies.push({
          name: a.key,
          value: a.value,
          domain: `.${a.domain}`,
          path: a.path,
          httpOnly: a.hostOnly,
          sameSite: 'None',
          secure: true,
          sameParty: false,
          sourceScheme: 'Secure',
          sourcePort: 443,
        });
      });
      await page.setCookie(...cookies);
      await page.goto(`https://www.facebook.com/profile.php?id=${uid}`, { waitUntil: ['networkidle2'] });
      await page.waitForSelector('body');
      await page.screenshot({ path: path });
      await browser.close();
      return api.sendMessage(
        {
          body: `✅ Ho gaya ${(await Users.getData(event.senderID)).name}`,
          mentions: [
            {
              tag: (await Users.getData(event.senderID)).name,
              id: event.senderID,
            },
          ],
          attachment: createReadStream(path),
        },
        event.threadID,
        () => unlinkSync(path),
        event.messageID
      );
    }

    // Handle website screenshot
    if (args[0].indexOf('https://') != -1) {
      if (args[0].includes('facebook.com')) {
        var browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        var page = await browser.newPage();
        page.setViewport({ width: 1920, height: 1080 });
        api.sendMessage(`🔄 Thoda rukiye, load ho raha hai...`, event.threadID, event.messageID);

        // Set cookies for Facebook
        var getAppState = api.getAppState();
        var cookies = [];
        getAppState.forEach(function (a) {
          cookies.push({
            name: a.key,
            value: a.value,
            domain: `.${a.domain}`,
            path: a.path,
            httpOnly: a.hostOnly,
            sameSite: 'None',
            secure: true,
            sameParty: false,
            sourceScheme: 'Secure',
            sourcePort: 443,
          });
        });
        await page.setCookie(...cookies);
        await page.goto(args[0], { waitUntil: ['networkidle2'] });
        await page.waitForSelector('body');
        await page.screenshot({ path: path });
        await browser.close();
        return api.sendMessage(
          {
            body: `✅ Ho gaya ${(await Users.getData(event.senderID)).name}`,
            mentions: [
              {
                tag: (await Users.getData(event.senderID)).name,
                id: event.senderID,
              },
            ],
            attachment: createReadStream(path),
          },
          event.threadID,
          () => unlinkSync(path),
          event.messageID
        );
      } else {
        var browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        var page = await browser.newPage();
        page.setViewport({ width: 1920, height: 1080 });
        api.sendMessage(`🔄 Thoda rukiye, load ho raha hai...`, event.threadID, event.messageID);
        await page.goto(args[0], { waitUntil: ['networkidle2'] });
        await page.waitForSelector('body');
        await page.screenshot({ path: path });
        await browser.close();
        return api.sendMessage(
          {
            body: `✅ Ho gaya ${(await Users.getData(event.senderID)).name}`,
            mentions: [
              {
                tag: (await Users.getData(event.senderID)).name,
                id: event.senderID,
              },
            ],
            attachment: createReadStream(path),
          },
          event.threadID,
          () => unlinkSync(path),
          event.messageID
        );
      }
    }
  } catch (e) {
    console.log(e);
    api.sendMessage(`❎ Kuch toh gadbad hai: ${e.message}`, event.threadID, event.messageID);
  }
};
