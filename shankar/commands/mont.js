module.exports.config = {
	name: "mont",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
	description: "Apne ya tag kiye gaye vyakti ke paise check karein",
	commandCategory: "Jaankari",
	usages: "[ Khali | Tag ]",
	cooldowns: 5,
	usePrefix: false
};

module.exports.run = async function({ api, event, args, Currencies, Users }) {
	const { threadID, messageID, senderID, mentions } = event;

	// Sadasya ka current aur previous balance lein
	const currentBalance = (await Currencies.getData(senderID)).money;
	const previousBalance = (await Currencies.getData(senderID, true)).money;

	if (!args[0]) {
		const moneyFormatted = currentBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
		const name = await Users.getNameUser(event.senderID);

		// Transaction history lein
		const transactionHistory = await getCurrenciesHistory(senderID);

		// Transaction history ko message mein dikhayein
		api.sendMessage(`[ Cash Wallet ]\n────────────────────\n👤 Naam: ${name}\n🎫 Rashi: ${moneyFormatted}$\n${transactionHistory}\n────────────────────\n✏️ Zyada aay ke liye work command ka use karein!`, threadID, messageID);

		// Balance mein badlaav check karein aur notify karein
		if (currentBalance !== previousBalance) {
			const change = currentBalance - previousBalance;
			const changeFormatted = change.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
			api.sendMessage(`📅 Balance mein badlaav: ${changeFormatted}$`, threadID);
		}

		// Previous balance update karein
		Currencies.setData(senderID, { money: currentBalance }, true);
	} else {
		// Anya cases ke liye handle karein
	}
};

// Currencies se transaction history lene ka function
async function getCurrenciesHistory(userId) {
	const data = await Currencies.getData(userId, true);
	if (data && data.history) {
		return data.history.map(entry => `📅 ${new Date(entry.timestamp).toLocaleString()}: ${entry.transactionType === 'add' ? 'Joda' : 'Ghata'} ${entry.amount}$`).join('\n');
	}
	return '📅 Koi transaction history nahi hai';
}
