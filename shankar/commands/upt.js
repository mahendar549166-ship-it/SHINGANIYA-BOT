const os = require('os');
const moment = require('moment-timezone');
const fs = require('fs').promises;
const nodeDiskInfo = require('node-disk-info');

module.exports = {
  config: {
    name: "upt",
    version: "2.1.4",
    hasPermission: 2,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Display bot system information!",
    commandCategory: "System",
    usages: "",
    cooldowns: 5,
    usePrefix: false,
  },
  run: async ({ api, event, Users }) => {
    const ping = Date.now();
    
    async function getDependencyCount() {
      try {
        const packageJsonString = await fs.readFile('package.json', 'utf8');
        const packageJson = JSON.parse(packageJsonString);
        const depCount = Object.keys(packageJson.dependencies).length;
        return depCount;
      } catch (error) {
        console.error('❎ Failed to read package.json:', error);
        return -1;
      }
    }
    
    function getStatusByPing(pingReal) {
      if (pingReal < 200) {
        return 'smooth';
      } else if (pingReal < 800) {
        return 'average';
      } else {
        return 'laggy';
      }
    }
    
    function getPrimaryIP() {
      const interfaces = os.networkInterfaces();
      for (let iface of Object.values(interfaces)) {
        for (let alias of iface) {
          if (alias.family === 'IPv4' && !alias.internal) {
            return alias.address;
          }
        }
      }
      return '127.0.0.1';
    }
    
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const uptime = process.uptime();
    const uptimeHours = Math.floor(uptime / (60 * 60));
    const uptimeMinutes = Math.floor((uptime % (60 * 60)) / 60);
    const uptimeSeconds = Math.floor(uptime % 60);
    let name = await Users.getNameUser(event.senderID);
    const dependencyCount = await getDependencyCount();
    const primaryIp = getPrimaryIP();
    
    try {
      const disks = await nodeDiskInfo.getDiskInfo();
      const firstDisk = disks[0] || {};
      const usedSpace = firstDisk.blocks - firstDisk.available;
      
      function convertToGB(bytes) {
        if (bytes === undefined) return 'N/A';
        const GB = bytes / (1024 * 1024 * 1024);
        return GB.toFixed(2) + 'GB';
      }
      
      const pingReal = ping - event.timestamp;
      const botStatus = getStatusByPing(pingReal);
      
      const replyMsg = `⏰ Current time: ${moment().tz('Asia/Kolkata').format('HH:mm:ss')} | ${moment().tz('Asia/Kolkata').format('DD/MM/YYYY')}
⏱️ Uptime: ${uptimeHours.toString().padStart(2, '0')}:${uptimeMinutes.toString().padStart(2, '0')}:${uptimeSeconds.toString().padStart(2, '0')}
📝 Default prefix: ${global.config.PREFIX}
🗂️ Package count: ${dependencyCount >= 0 ? dependencyCount : "Unknown"}
🔣 Bot status: ${botStatus}
📋 OS: ${os.type()} ${os.release()} (${os.arch()})
💾 CPU: ${os.cpus().length} core(s) - ${os.cpus()[0].model} @ ${Math.round(os.cpus()[0].speed)}MHz
📊 RAM: ${(usedMemory / 1024 / 1024 / 1024).toFixed(2)}GB/${(totalMemory / 1024 / 1024 / 1024).toFixed(2)}GB (used)
🛢️ Free RAM: ${(freeMemory / 1024 / 1024 / 1024).toFixed(2)}GB
🗄️ Storage: ${convertToGB(firstDisk.used)}/${convertToGB(firstDisk.blocks)} (used)
📑 Free storage: ${convertToGB(firstDisk.available)}
🛜 Ping: ${pingReal}ms
👤 Requested by: ${name}`.trim();
      
      api.sendMessage(replyMsg, event.threadID, event.messageID);
    } catch (error) {
      console.error('❎ Error getting disk information:', error.message);
    }
  }
};
