module.exports.config = {
  name: "package",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Package ki jankari check karen",
  commandCategory: "Utility",
  usages: "package + package ka naam",
  images: [],
  cooldowns: 2,
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require('axios');
  const moment = require('moment-timezone');
  const npmRegistryURL = 'https://registry.npmjs.org/';

  var packageName = args.join(" ");

  if (!packageName) {
    api.sendMessage(`⚠️ Package ka naam daal do!`, event.threadID, event.messageID);
    return;
  }

  async function getPackageInfo(packageName) {
    try {
      const response = await axios.get(`${npmRegistryURL}${packageName}`);
      const packageData = response.data;

      if (packageData.error) {
        api.sendMessage(`❎ Package "${packageName}" npm par nahi hai.`, event.threadID, event.messageID);
        return;
      }

      const latestVersion = packageData['dist-tags'].latest;
      const versionData = packageData.versions[latestVersion];
      const publisher = versionData.maintainers[0];
      const filesize = versionData.dist.unpackedSize;
      const fileSizeInMB = (filesize / (1024 * 1024)).toFixed(2);
      const inputTimepub = packageData.time[packageData['dist-tags'].latest];
      const inputTimepubl = packageData.time[latestVersion];
      const outputTimeZone = 'Asia/Kolkata';
      const timepub = moment(inputTimepub).tz(outputTimeZone);
      const timepubl = moment(inputTimepubl).tz(outputTimeZone);

      api.sendMessage(
        `\n|› Package: ${packageName} ✅\n` +
        `|› Package ka Naam: ${packageData.name}\n` +
        `|› Version: ${latestVersion}\n` +
        `|› Publish ka Samay: ${timepub.format('HH:mm:ss - DD/MM/YYYY')}\n` +
        `|› Publisher ka Naam: ${publisher.name}\n` +
        `|› Publisher ka Email: ${packageData.maintainers[0].email}\n` +
        `────────────────────\n` +
        `|› Package Source Link: ${packageData.bugs.url}\n` +
        `|› Homepage: ${packageData.homepage}\n` +
        `|› Support karta hai: ${packageData.keywords}\n` +
        `────────────────────\n` +
        `|› Package ka Size: ${fileSizeInMB}MB\n` +
        `|› Total Files: ${versionData.dist.fileCount}\n` +
        `|› Last Publish: ${timepubl.format('HH:mm:ss - DD/MM/YYYY')}\n` +
        `────────────────────\n` +
        `|› Source Download: ${packageData.repository.url}\n` +
        `|› Install Package: npm i ${packageName}`,
        event.threadID,
        event.messageID
      );

    } catch (error) {
      api.sendMessage(
        `❎ Package ${packageName} ki jankari lene mein error.\n` +
        `------------------------------\n` +
        `${error.message}`,
        event.threadID,
        event.messageID
      );
    }
  }
  getPackageInfo(packageName);
};
