module.exports.config = {
	name: 'π',
	version: '1.0.1',
	hasPermission: 2,
	credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
	description: 'Galat command aur bot system ki jaankari',
	commandCategory: 'System',
	usages: '[]',
	cooldowns: 5,
	usePrefix: false,
	images: [],
};

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const moment = require('moment-timezone');
const os = require('os');

function getDependencyCount() {
	try {
		const packageJsonString = fs.readFileSync('package.json', 'utf8');
		const packageJson = JSON.parse(packageJsonString);
		const depCount = Object.keys(packageJson.dependencies || {}).length;
		const devDepCount = Object.keys(packageJson.devDependencies || {}).length;
		return { depCount, devDepCount };
	} catch (error) {
		console.error('package.json file nahi padh saka:', error);
		return { depCount: -1, devDepCount: -1 };
	}
}

function getStatusByPing(ping) {
	if (ping < 200) {
		return 'achha';
	} else if (ping < 800) {
		return 'samaanya';
	} else {
		return 'kharab';
	}
}

module.exports.run = async function ({ api, event, Threads, Users }) {
	const { threadID: tid, messageID: mid } = event;

	let totalSizeInBytes = 0;
	function calculateSize(filePath) {
		const stats = fs.statSync(filePath);
		totalSizeInBytes += stats.size;
	}

	function processFiles(dir) {
		const files = fs.readdirSync(dir);
		files.forEach(file => {
			const filePath = path.join(dir, file);
			if (fs.statSync(filePath).isDirectory()) {
				processFiles(filePath);
			} else {
				calculateSize(filePath);
			}
		});
	}
	processFiles('./');
	const totalSizeInMegabytes = totalSizeInBytes / (1024 * 1024);
	const percentageOfTotal = (totalSizeInMegabytes / 1024) * 100;

	const holidayDate = '10/02/2024';
	const timezone = 'Asia/Kolkata';
	const currentDate = moment().tz(timezone);
	const holiday = moment.tz(holidayDate, 'DD/MM/YYYY', timezone);
	const duration = moment.duration(holiday.diff(currentDate));
	const daysRemaining = Math.floor(duration.asDays());
	const hoursRemaining = duration.hours();
	const minutesRemaining = duration.minutes();
	var gio = moment.tz("Asia/Kolkata").format("HH:mm:ss || D/MM/YYYY");

	const { depCount, devDepCount } = await getDependencyCount();

	const botStatus = getStatusByPing(Date.now() - event.timestamp);

	const uptime = process.uptime() + global.config.UPTIME;
	const uptimeHours = Math.floor(uptime / (60 * 60));
	const uptimeMinutes = Math.floor((uptime % (60 * 60)) / 60);
	const uptimeSeconds = Math.floor(uptime % 60);
	const uptimeString = `${uptimeHours.toString().padStart(2, '0')}:${uptimeMinutes.toString().padStart(2, '0')}:${uptimeSeconds.toString().padStart(2, '0')}`;

	let name = await Users.getNameUser(event.senderID);

	api.sendMessage(`==== [ ${global.config.BOTNAME} ] ====\n──────────────────\n[⏳] → Bot online hai: ${uptimeString}\n[📌] → System prefix: ${global.config.PREFIX}\n[📝] → Total jeevit packages: ${depCount}\n[📜] → Total mrit packages: ${devDepCount}\n[👥] → Total users: ${global.data.allUserID.length}\n[🏘️] → Total groups: ${global.data.allThreadID.length}\n[🔎] → Bot ki sthiti: ${botStatus}\n[⚙️] → Ping: ${Date.now() - event.timestamp}ms\n[🗂️] → File size: ${totalSizeInMegabytes.toFixed(2)}/1024 MB (${percentageOfTotal.toFixed(2)}%)\n[🎇] → 2024 ke Nav Varsh ke liye ${daysRemaining} din ${hoursRemaining} ghante ${minutesRemaining} minute baki hain 🎉\n[👤] → Anurodh kiya: ${name}\n──────────────────\n[⏰] → Samay: ${gio}`, tid, mid);
};
