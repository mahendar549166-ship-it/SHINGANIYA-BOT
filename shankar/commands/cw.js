const puppeteer = require('puppeteer-core');
const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

module.exports.config = {
    name: "cw",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Facebook profile ka screenshot len",
    commandCategory: "Upyogita",
    usages: ["cw"],
    usePrefix: false,
    cooldowns: 5,
    dependencies: {"puppeteer-core": "", "sharp": ""}
};

module.exports.run = async function({ api, event }) {
    let facebookId;

    if (event.type === 'message_reply') {
        facebookId = event.messageReply.senderID;
    } else {
        facebookId = event.senderID;
    }

    if (!facebookId) return api.sendMessage("Koi error hua hai!", event.threadID);

    const account = "";
    const password = "";

    api.sendMessage("Load ho raha hai, thodi der wait karen...", event.threadID, async () => {
        try {
            const browser = await puppeteer.launch({
                executablePath: 'C:/bin/chrome/chrome.exe',
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            console.log("Browser shuru kiya gaya");

            const page = await browser.newPage();
            console.log("Naya page banaya gaya");

            await page.goto('https://www.facebook.com/login');
            console.log("Login page par gaya");

            await page.type('#email', account);
            await page.type('#pass', password);
            await page.click('#loginbutton');
            console.log("Credentials daale gaye");

            await page.waitForNavigation();
            console.log("Login kiya aur navigate kiya");

            await page.goto(`https://www.facebook.com/${facebookId}`);
            console.log(`Profile par gaya: https://www.facebook.com/${facebookId}`);

            await page.setViewport({ width: 1920, height: 1080 });

            const screenshotPath = path.join(__dirname, 'screenshot.png');
            await page.screenshot({ path: screenshotPath });
            console.log("Screenshot liya gaya");

            await browser.close();
            console.log("Browser band kiya gaya");

            const editedScreenshotPath = path.join(__dirname, 'edited_screenshot.png');
            await sharp(screenshotPath)
                .modulate({ brightness: 3.6, saturation: 4.5 })
                .toFile(editedScreenshotPath);
            console.log("Screenshot mein badlav kiya gaya");

            const readStream = fs.createReadStream(editedScreenshotPath);

            api.sendMessage({
                body: "[ CAP WALL ]",
                attachment: readStream
            }, event.threadID, (error, info) => {
                if (error) {
                    console.error("Message bhejne mein error:", error);
                    api.sendMessage("Message bhejne mein error hua!", event.threadID);
                } else {
                    console.log("Message bheja gaya:", info);
                    fs.unlinkSync(screenshotPath);
                    fs.unlinkSync(editedScreenshotPath);
                    console.log("Screenshot files hataaye gaye");
                }
            });

        } catch (error) {
            console.error('Screenshot lete waqt error:', error);
            api.sendMessage("Koi error hua hai!", event.threadID);
        }
    });
};
