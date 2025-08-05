module.exports.config = {
  name: "load",
  version: "1.1.1",
  hasPermssion: 3,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Lekin cmd ki tarah load karta hai, lekin isse tezi se",
  commandCategory: "Admin",
  usages: "[]",
  cooldowns: 0,
  usePrefix: false,
  dependencies: {
      "fs-extra": "",
      "child_process": "",
      "path": ""
  }
};
const { execSync } = require('child_process');
const { writeFileSync, unlinkSync, readFileSync } = require('fs-extra');
const { join } = require('path');

const loadCommand = function ({ moduleList, threadID, messageID }) {
    const { configPath, mainPath, api } = global.client;
    const logger = require(mainPath + '/utils/log');

    var errorList = [];
    delete require['resolve'][require['resolve'](configPath)];
    var configValue = require(configPath);
    writeFileSync(configPath + '.temp', JSON.stringify(configValue, null, 2), 'utf8');
    for (const nameModule of moduleList) {
        try {
            const dirModule = __dirname + '/' + nameModule + '.js';
            delete require['cache'][require['resolve'](dirModule)];
            const command = require(dirModule);
            global.client.commands.delete(nameModule);
            if (!command.config || !command.run || !command.config.commandCategory) 
                throw new Error('Module ka format sahi nahi hai!');
            global.client['eventRegistered'] = global.client['eventRegistered']['filter'](info => info != command.config.name);
            if (command.config.dependencies && typeof command.config.dependencies == 'object') {
                const listPackage = JSON.parse(readFileSync('./package.json')).dependencies,
                    listbuiltinModules = require('module')['builtinModules'];
                for (const packageName in command.config.dependencies) {
                    var tryLoadCount = 0,
                        loadSuccess = ![],
                        error;
                    const moduleDir = join(global.client.mainPath, 'nodeshankar', 'node_shankar', packageName);
                    try {
                        if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName)) global.nodemodule[packageName] = require(packageName);
                        else global.nodemodule[packageName] = require(moduleDir);
                    } catch {
                        logger.loader('Package ' + packageName + ' jo command ' + command.config.name + ' ke liye jaruri hai, nahi mila. Ab isse install karne ki koshish kar raha hoon...', 'warn');
                        const insPack = {};
                        insPack.stdio = 'inherit';
                        insPack.env = process.env ;
                        insPack.shell = !![];
                        insPack.cwd = join(global.client.mainPath,'nodeshankar')
                        execSync('npm --package-lock false --save install ' + packageName + (command.config.dependencies[packageName] == '*' || command.config.dependencies[packageName] == '' ? '' : '@' + command.config.dependencies[packageName]), insPack);
                        for (tryLoadCount = 1; tryLoadCount <= 3; tryLoadCount++) {
                            require['cache'] = {};
                            try {
                                if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName)) global.nodemodule[packageName] = require(packageName);
                                else global.nodemodule[packageName] = require(moduleDir);
                                loadSuccess = !![];
                                break;
                            } catch (erorr) {
                                error = erorr;
                            }
                            if (loadSuccess || !error) break;
                        }
                        if (!loadSuccess || error) throw 'Package ' + packageName + ' command ' + command.config.name + ' ke liye load nahi ho saka, error: ' + error + ' ' + error['stack'];
                    }
                }
                logger.loader('Command ' + command.config.name + ' ke liye sabhi packages safalta se load ho gaye');
            }
            if (command.config.envConfig && typeof command.config.envConfig == 'Object') try {
                for (const [key, value] of Object['entries'](command.config.envConfig)) {
                    if (typeof global.configModule[command.config.name] == undefined) 
                        global.configModule[command.config.name] = {};
                    if (typeof configValue[command.config.name] == undefined) 
                        configValue[command.config.name] = {};
                    if (typeof configValue[command.config.name][key] !== undefined) 
                        global.configModule[command.config.name][key] = configValue[command.config.name][key];
                    else global.configModule[command.config.name][key] = value || '';
                    if (typeof configValue[command.config.name][key] == undefined) 
                        configValue[command.config.name][key] = value || '';
                }
                logger.loader('Command ' + command.config.name + ' ka config load ho gaya');
            } catch (error) {
                throw new Error('⚠️ Config module load nahi ho saka, error: ' + JSON.stringify(error));
            }
            if (command['onLoad']) try {
                const onLoads = {};
                onLoads['configValue'] = configValue;
                command['onLoad'](onLoads);
            } catch (error) {
                throw new Error('⚠️ Module onload nahi ho saka, error: ' + JSON.stringify(error), 'error');
            }
            if (command.handleEvent) global.client.eventRegistered.push(command.config.name);
            (global.config.commandDisabled.includes(nameModule + '.js') || configValue.commandDisabled.includes(nameModule + '.js')) 
            && (configValue.commandDisabled.splice(configValue.commandDisabled.indexOf(nameModule + '.js'), 1),
            global.config.commandDisabled.splice(global.config.commandDisabled.indexOf(nameModule + '.js'), 1))
            global.client.commands.set(command.config.name, command)
            logger.loader('Command ' + command.config.name + ' safalta se load ho gaya!');
        } catch (error) {
            errorList.push('- ' + nameModule + ' karan: ' + error + ' at ' + error['stack']);
        };
    }
    if (errorList.length != 0) api.sendMessage('⚠️ Niche diye gaye commands ke sath system load karte waqt samasya hui: ' + errorList.join(' '), threadID, messageID);
    if (moduleList.length - errorList.length == 1) return api.setMessageReaction("✅", messageID, (err) => {}, true)
    if (moduleList.length - errorList.length == 0) return api.setMessageReaction("❎", messageID, (err) => {}, true)
    api.sendMessage((moduleList.length - errorList.length) + " ✅", threadID, messageID) 
    writeFileSync(configPath, JSON.stringify(configValue, null, 4), 'utf8')
    unlinkSync(configPath + '.temp');
    return;
}

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
  
    var moduleList = args.splice(0, args.length);
    if (moduleList.length === 0) return api.setMessageReaction("⚠️", event.messageID, (err) => {}, true)
    else return loadCommand({ moduleList, threadID, messageID });
}
