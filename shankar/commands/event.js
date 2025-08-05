module.exports.config = {
    name: "event",
    version: "1.0.1",
    hasPermission: 3,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Bot ke sabhi modules ko manage/control karta hai",
    commandCategory: "Admin",
    usages: "[load/unload/loadAll/unloadAll/info] [module ka naam]",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "child_process": "",
        "path": ""
    }
};

module.exports.loadCommand = function ({ moduleList, threadID, messageID }) {
    const { execSync } = global.nodemodule["child_process"];
    const { writeFileSync, unlinkSync, readFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const logger = require(process.cwd()+ "/utils/log");
    const listPackage = JSON.parse(readFileSync(process.cwd()+ '/package.json')).dependencies;
    const listbuiltinModules = require("module").builtinModules;
    var errorList = [];

    delete require.cache[require.resolve(global.client.configPath)];
    var configValue = require(global.client.configPath);
    writeFileSync(global.client.configPath + ".temp", JSON.stringify(configValue, null, 4), 'utf8');

    for (const nameModule of moduleList) {
        try {
            const dirModule = join(__dirname, "..", "events", `${nameModule}.js`);
            delete require.cache[require.resolve(dirModule)];
            var event = require(dirModule);
            if (!event.config || !event.run) throw new Error("❎ Galat format");

            if (event.config.dependencies && typeof event.config.dependencies == "object") {        
                for (const packageName in event.config.dependencies) {
                    const moduleDir = join(global.client.mainPath, "nodeshankar", "node_shankar", packageName);
                    try {
                        if (!global.nodemodule.hasOwnProperty(packageName)) {
                            if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName)) 
                                global.nodemodule[packageName] = require(packageName);
                            else 
                                global.nodemodule[packageName] = require(moduleDir);
                        }
                    }
                    catch {
                        var tryLoadCount = 0, loadSuccess = false, error;
                        logger.loader(`${packageName} package nahi mila (module: ${event.config.name})`, "warn");
                        execSync(`npm --package-lock false --save install ${packageName}${(event.config.dependencies[packageName] == "*" || event.config.dependencies[packageName] == "") ? "" : `@${event.config.dependencies[packageName]}`}`,
                        {
                            stdio: "inherit",
                            env: process.env,
                            shell: true,
                            cwd: join(global.client.mainPath, "nodeshankar")
                        });

                        for (tryLoadCount = 1; tryLoadCount <= 3; tryLoadCount++) {
                            require.cache = {}
                            try {
                                if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName)) 
                                    global.nodemodule[packageName] = require(packageName);
                                else 
                                    global.nodemodule[packageName] = require(moduleDir);
                                loadSuccess = true;
                                break;
                            }
                            catch (e) { error = e }
                        }
                        if (!loadSuccess) throw new Error(`${packageName} package install nahi ho paya (module: ${event.config.name}), error: ${error}`);
                    }
                }
                logger.loader(`${event.config.name} module ke liye packages load hue`);
            }

            if (event.config.envConfig && typeof event.config.envConfig == "object") {
                try {
                    for (const key in event.config.envConfig) {
                        if (typeof global.configModule[event.config.name] == "undefined") 
                            global.configModule[event.config.name] = {};
                        if (typeof global.config[event.config.name] == "undefined") 
                            global.config[event.config.name] = {};
                        if (typeof global.config[event.config.name][key] !== "undefined") 
                            global.configModule[event.config.name][key] = global.config[event.config.name][key];
                        else 
                            global.configModule[event.config.name][key] = event.config.envConfig[key] || "";
                        if (typeof global.config[event.config.name][key] == "undefined") 
                            global.config[event.config.name][key] = event.config.envConfig[key] || "";
                    }
                    logger.loader(`${event.config.name} module ka config load hua`);
                }
                catch (error) { throw new Error(`${event.config.name} module ka config load nahi hua, error: ${JSON.stringify(error)}`) }
            }

            if (event.onLoad) {
                try { event.onLoad({ api: global.client.api }) }
                catch (error) { throw new Error(`${event.config.name} module ka setup nahi chal paya, error: ${JSON.stringify(error)}`, "error") }
            }

            if (global.config["eventDisabled"].includes(`${nameModule}.js`) || configValue["eventDisabled"].includes(`${nameModule}.js`)) {
                configValue["eventDisabled"].splice(configValue["eventDisabled"].indexOf(`${nameModule}.js`), 1);
                global.config["eventDisabled"].splice(global.config["eventDisabled"].indexOf(`${nameModule}.js`), 1);
            }

            global.client.events.delete(nameModule);
            global.client.events.set(event.config.name, event);
            logger.loader(`${event.config.name} event load ho gaya!`);
        } catch (error) { errorList.push(`${nameModule} module load nahi hua, error: ${error}`) };
    }
    if (errorList.length != 0) global.client.api.sendMessage(errorList.join("\n\n"), threadID, messageID);
    global.client.api.sendMessage(`✅ ${moduleList.length - errorList.length} events successfully loaded`, threadID, messageID);
    writeFileSync(global.client.configPath, JSON.stringify(configValue, null, 4), 'utf8');
    unlinkSync(global.client.configPath + ".temp");
    return;
}

module.exports.unloadModule = function ({ moduleList, threadID, messageID }) {
    const { writeFileSync, unlinkSync } = global.nodemodule["fs-extra"];
    const logger = require(process.cwd()+"/utils/log").loader;

    delete require.cache[require.resolve(global.client.configPath)];
    var configValue = require(global.client.configPath);
    writeFileSync(global.client.configPath + ".temp", JSON.stringify(configValue, null, 4), 'utf8');

    for (const nameModule of moduleList) {
        global.client.events.delete(nameModule);
        configValue["eventDisabled"].push(`${nameModule}.js`);
        global.config["eventDisabled"].push(`${nameModule}.js`);
        logger(`${nameModule} module unload ho gaya`);
    }

    writeFileSync(global.client.configPath, JSON.stringify(configValue, null, 4), 'utf8');
    unlinkSync(global.client.configPath + ".temp");

    return global.client.api.sendMessage(`✅ ${moduleList.length} events successfully unloaded`, threadID, messageID);
}

module.exports.run = function ({ event, args }) {
    const { readdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const { threadID, messageID } = event;
    var moduleList = args.splice(1, args.length);

    switch (args[0]) {
        case "l":
        case "load": {
            if (moduleList.length == 0) 
                return global.client.api.sendMessage("❎ Module ka naam khali nahi ho sakta!", threadID, messageID);
            else 
                return this.loadCommand({ moduleList, threadID, messageID });
        }
        case "unload": {
            if (moduleList.length == 0) 
                return global.client.api.sendMessage("❎ Module ka naam khali nahi ho sakta!", threadID, messageID);
            else 
                return this.unloadModule({ moduleList, threadID, messageID });
        }
        case "loadAll": {
            moduleList = readdirSync(join(global.client.mainPath, "shankar", "events"))
                .filter((file) => file.endsWith(".js") && !file.includes('example'));
            moduleList = moduleList.map(item => item.replace(/\.js/g, ""));
            return this.loadCommand({ moduleList, threadID, messageID });
        }
        case "unloadAll": {
            moduleList = readdirSync(join(global.client.mainPath, "shankar", "events"))
                .filter((file) => file.endsWith(".js") && !file.includes('example'));
            moduleList = moduleList.map(item => item.replace(/\.js/g, ""));
            return this.unloadModule({ moduleList, threadID, messageID });
        }
        case "info": {
            const event = global.client.events.get(moduleList.join("") || "");
            if (!event) 
                return global.client.api.sendMessage("❎ Ye module exist nahi karta!", threadID, messageID);
            const { name, version, credits, dependencies } = event.config;
            return global.client.api.sendMessage(
                `|› ${name.toUpperCase()}\n|› Author: ${credits}\n|› Version: ${version}\n|› Required packages: ${((Object.keys(dependencies || {})).join(", ") || "Koi nahi")}\n──────────────────`, 
                threadID, 
                messageID
            );
        }
        default: {
            return global.utils.throwError(this.config.name, threadID, messageID);
        }
    }
}
