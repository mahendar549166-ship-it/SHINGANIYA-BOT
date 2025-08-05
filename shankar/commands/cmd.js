module.exports.config = {
    name: "cmd",
    version: "1.0.0",
    hasPermssion: 3,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Bot ke sabhi modules ko prabandhit aur niyantrit karen",
    commandCategory: "System",
    usages: "[load/unload/loadAll/unloadAll/info] [module ka naam]",
    cooldowns: 2,
    usePrefix: false,
    images: [],
    dependencies: {
        "fs-extra": "",
        "child_process": "",
        "path": ""
    }
};

const loadCommand = function ({ moduleList, threadID, messageID }) {
    const { execSync } = global.nodemodule['child_process'];
    const { writeFileSync, unlinkSync, readFileSync } = global.nodemodule['fs-extra'];
    const { join } = global.nodemodule['path'];
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
                throw new Error('Module sahi format mein nahi hai!');
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
                        logger.loader('Package ' + packageName + ' command ' + command.config.name + ' ke liye nahi mila, sthapna prarambh kar raha hai...', 'warn');
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
                        if (!loadSuccess || error) throw 'Package ' + packageName + ' command ' + command.config.name + ' ke liye load nahi kiya ja saka, error: ' + error + ' ' + error['stack'];
                    }
                }
                logger.loader('Command ' + command.config.name + ' ke liye sabhi package safalata se load kiye gaye');
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
                logger.loader('Config ' + command.config.name + ' load kiya gaya');
            } catch (error) {
                throw new Error('❎ Config module load nahi kiya ja saka, error: ' + JSON.stringify(error));
            }
            if (command['onLoad']) try {
                const onLoads = {};
                onLoads['configValue'] = configValue;
                command['onLoad'](onLoads);
            } catch (error) {
                throw new Error('❎ Module onLoad nahi kiya ja saka, error: ' + JSON.stringify(error), 'error');
            }
            if (command.handleEvent) global.client.eventRegistered.push(command.config.name);
            (global.config.commandDisabled.includes(nameModule + '.js') || configValue.commandDisabled.includes(nameModule + '.js')) 
            && (configValue.commandDisabled.splice(configValue.commandDisabled.indexOf(nameModule + '.js'), 1),
            global.config.commandDisabled.splice(global.config.commandDisabled.indexOf(nameModule + '.js'), 1))
            global.client.commands.set(command.config.name, command)
            logger.loader('Command ' + command.config.name + ' load kiya gaya!');
        } catch (error) {
            errorList.push('- ' + nameModule + ' karan: ' + error + ' at ' + error['stack']);
        };
    }
    if (errorList.length != 0) api.sendMessage('❎ In commands mein samasya hui: ' + errorList.join(' '), threadID, messageID);
    api.sendMessage('☑️ ' + (moduleList.length - errorList.length) + ' commands safalata se load kiye gaye ✨', threadID, messageID) 
    writeFileSync(configPath, JSON.stringify(configValue, null, 4), 'utf8')
    unlinkSync(configPath + '.temp');
    return;
}

const unloadModule = function ({ moduleList, threadID, messageID }) {
    const { writeFileSync, unlinkSync } = global.nodemodule["fs-extra"];
    const { configPath, mainPath, api } = global.client;
    const logger = require(mainPath + "/utils/log").loader;

    delete require.cache[require.resolve(configPath)];
    var configValue = require(configPath);
    writeFileSync(configPath + ".temp", JSON.stringify(configValue, null, 4), 'utf8');

    for (const nameModule of moduleList) {
        global.client.commands.delete(nameModule);
        global.client.eventRegistered = global.client.eventRegistered.filter(item => item !== nameModule);
        configValue["commandDisabled"].push(`${nameModule}.js`);
        global.config["commandDisabled"].push(`${nameModule}.js`);
        logger(`Command ${nameModule} unload kiya gaya!`);
    }

    writeFileSync(configPath, JSON.stringify(configValue, null, 4), 'utf8');
    unlinkSync(configPath + ".temp");

    return api.sendMessage(`☑️ ${moduleList.length} commands safalata se unload kiye gaye ✨`, threadID, messageID);
}

module.exports.run = function ({ event, args, api }) {    
    const { readdirSync } = global.nodemodule["fs-extra"];
    const { threadID, messageID } = event;

    var moduleList = args.splice(1, args.length);

    switch (args[0]) {
      case "c":
      case "count": {
        let commands = client.commands.values();
        let infoCommand = "";
        api.sendMessage("📝 Vartamaan mein " + client.commands.size + " commands upyog kiye ja sakte hain 💌" + infoCommand, event.threadID, event.messageID);
        break;
      }
      case "l":
      case "load": {
        if (moduleList.length == 0) return api.sendMessage("❎ Module ka naam khaali nahi ho sakta", threadID, messageID);
        else return loadCommand({ moduleList, threadID, messageID });
      }
      case "unload": {
        if (moduleList.length == 0) return api.sendMessage("❎ Module ka naam khaali nahi ho sakta", threadID, messageID);
        else return unloadModule({ moduleList, threadID, messageID });
      }
      case "loadAll": {
        moduleList = readdirSync(__dirname).filter((file) => file.endsWith(".js") && !file.includes('example'));
        moduleList = moduleList.map(item => item.replace(/\.js/g, ""));
        return loadCommand({ moduleList, threadID, messageID });
      }
      case "unloadAll": {
        moduleList = readdirSync(__dirname).filter((file) => file.endsWith(".js") && !file.includes('example') && !file.includes("command"));
        moduleList = moduleList.map(item => item.replace(/\.js/g, ""));
        return unloadModule({ moduleList, threadID, messageID });
      }
      case "info": {
        const command = global.client.commands.get(moduleList.join("") || "");

        if (!command) return api.sendMessage("❎ Aapke dwara diya gaya module maujood nahi hai", threadID, messageID);

        const { name, version, hasPermssion, credits, cooldowns, dependencies } = command.config;

        return api.sendMessage(
            "|› Command ka naam: " + name.toUpperCase() + "\n" +
            "|› Lekhak: " + credits + "\n" +
            "|› Sanskaran: " + version + "\n" +
            "|› Adhikaar: " + ((hasPermssion == 0) ? "Upyogkarta" : (hasPermssion == 1) ? "Prashasak" : "Bot Admin" ) + "\n" +
            "|› Pratiksha samay: " + cooldowns + " second(s)\n" +
            `|› Aavashyak packages: ${(Object.keys(dependencies || {})).join(", ") || "Koi nahi"}\n──────────────────`,
            threadID, messageID
        );
      }
      default: {
        return global.utils.throwError(this.config.name, threadID, messageID);
      }
    }
}
