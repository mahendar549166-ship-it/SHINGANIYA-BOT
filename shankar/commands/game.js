module.exports.config = {
    name: "game",
    version: "1.1.0",
    hasPermission: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Multiple mini-games with currency system",
    commandCategory: "Games",
    usages: "[game] [options]",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Currencies }) {
    const { senderID, messageID, threadID } = event;
    const axios = require('axios');
    const fs = require("fs-extra");
    const dataMoney = await Currencies.getData(senderID);
    const moneyUser = dataMoney.money;

    // Game 1: Tai Xiu (High Low)
    if (args[0] == "txcl") {
        if (!args[1]) return api.sendMessage("Please choose 'high' or 'low'...", threadID, messageID);
        
        const choose = args[1].toLowerCase();
        if (choose != 'high' && choose != 'low') return api.sendMessage("Only bet 'high' or 'low'!", threadID, messageID);
        
        const money = parseInt(args[2]);
        if (money < 50 || isNaN(money)) return api.sendMessage("Minimum bet is 50$!", threadID, messageID);
        if (moneyUser < money) return api.sendMessage(`You don't have enough ${money}$ to play`, threadID, messageID);
        
        try {
            const results = ['high', 'low'];
            const random = results[Math.floor(Math.random() * results.length)];  
            
            if (choose == random) {
                await Currencies.increaseMoney(senderID, money * 2);
                api.sendMessage({
                    body: `🎉 You won!\n💰 Won: ${money*2}$\n🎲 Result: ${random}`
                }, threadID, messageID);
            } else {
                await Currencies.decreaseMoney(senderID, money);
                api.sendMessage({
                    body: `😢 You lost\n💸 Lost: ${money}$\n🎲 Result: ${random}`
                }, threadID, messageID);
            }
        } catch (err) {
            console.error(err);
            return api.sendMessage("Error occurred", threadID);
        }
    }

    // Game 2: Bau Cua (Dice Game)
    if (args[0] == "baucua" || args[0] == "bc") {  
        const slotItems = ["🍐", "🦀", "🐟", "🦌", "🐓", "🦞"];
        const moneyBet = parseInt(args[2]);
        
        if (!args[1] || !isNaN(args[1])) return api.sendMessage("Usage: /baucua [pear/crab/fish/deer/chicken/shrimp] [amount]", threadID, messageID);
        if (isNaN(moneyBet) || moneyBet <= 0) return api.sendMessage("Invalid bet amount", threadID, messageID);
        if (moneyBet > moneyUser) return api.sendMessage("You don't have enough money!", threadID, messageID);
        if (moneyBet < 1000) return api.sendMessage("Minimum bet is 1000$!", threadID, messageID);
        
        let itemm;
        switch (args[1].toLowerCase()) {
            case "pear": case "bầu": itemm = "🍐"; break;
            case "crab": case "cua": itemm = "🦀"; break;
            case "fish": case "cá": itemm = "🐟"; break;
            case "deer": case "nai": itemm = "🦌"; break;
            case "chicken": case "gà": itemm = "🐓"; break;
            case "shrimp": case "tôm": itemm = "🦞"; break;
            default: return api.sendMessage("Invalid choice. Options: pear/crab/fish/deer/chicken/shrimp", threadID, messageID);
        }
        
        api.sendMessage("Rolling the dice...", threadID, messageID);
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const diceResults = [
            slotItems[Math.floor(Math.random() * slotItems.length)],
            slotItems[Math.floor(Math.random() * slotItems.length)],
            slotItems[Math.floor(Math.random() * slotItems.length)]
        ];
        
        const count = diceResults.filter(x => x === itemm).length;
        
        if (count > 0) {
            const winAmount = count === 1 ? moneyBet + 300 : 
                             count === 2 ? moneyBet * 2 : 
                             moneyBet * 3;
            
            await Currencies.increaseMoney(senderID, winAmount);
            return api.sendMessage(
                `🎲 Results: ${diceResults.join("|")}\n` +
                `💰 You won ${winAmount}$ with ${count} ${itemm}!`,
                threadID, messageID
            );
        } else {
            await Currencies.decreaseMoney(senderID, moneyBet);
            return api.sendMessage(
                `🎲 Results: ${diceResults.join("|")}\n` +
                `💸 You lost ${moneyBet}$ (0 ${itemm})`,
                threadID, messageID
            );
        }
    }

    // Game 3: Slot Machine
    if (args[0] == "slot") {   
        const slotItems = ["🍇", "🍉", "🍊", "🍏", "7⃣", "🍓", "🍒", "🍌", "🥝", "🥑", "🌽"];
        const moneyBet = parseInt(args[1]);
        
        if (isNaN(moneyBet) || moneyBet <= 0) return api.sendMessage("Invalid bet amount", threadID, messageID);
        if (moneyBet > moneyUser) return api.sendMessage("You don't have enough money!", threadID, messageID);
        if (moneyBet < 50) return api.sendMessage("Minimum bet is 50$", threadID, messageID);
        
        const slots = [
            slotItems[Math.floor(Math.random() * slotItems.length)],
            slotItems[Math.floor(Math.random() * slotItems.length)],
            slotItems[Math.floor(Math.random() * slotItems.length)]
        ];
        
        let winAmount = 0;
        if (slots[0] === slots[1] && slots[1] === slots[2]) {
            winAmount = moneyBet * 9;
        } else if (slots[0] === slots[1] || slots[0] === slots[2] || slots[1] === slots[2]) {
            winAmount = moneyBet * 2;
        }
        
        if (winAmount > 0) {
            await Currencies.increaseMoney(senderID, winAmount);
            api.sendMessage(
                `🎰 ${slots.join(" | ")} 🎰\n` +
                `🎉 You won ${winAmount}$!`,
                threadID, messageID
            );
        } else {
            await Currencies.decreaseMoney(senderID, moneyBet);
            api.sendMessage(
                `🎰 ${slots.join(" | ")} 🎰\n` +
                `💸 You lost ${moneyBet}$`,
                threadID, messageID
            );
        }
    }

    // Game 4: Rock Paper Scissors
    if (args[0] == "rps" || args[0] == "kbb") { 
        const choices = ["✌️", "👊", "✋"]; // scissors, rock, paper
        const botChoice = choices[Math.floor(Math.random() * choices.length)];
        const userChoice = args[1]?.toLowerCase();
        
        if (!userChoice) return api.sendMessage("Please choose: scissors/rock/paper", threadID, messageID);
        
        let userEmoji;
        switch(userChoice) {
            case "scissors": case "kéo": userEmoji = "✌️"; break;
            case "rock": case "búa": userEmoji = "👊"; break;
            case "paper": case "bao": userEmoji = "✋"; break;
            default: return api.sendMessage("Invalid choice. Options: scissors/rock/paper", threadID, messageID);
        }
        
        if (userEmoji === botChoice) {
            return api.sendMessage(
                `🤝 It's a tie!\n` +
                `You: ${userEmoji} | Bot: ${botChoice}\n` +
                `No money changed`,
                threadID, messageID
            );
        }
        
        const winConditions = {
            "✌️": "✋", // scissors beats paper
            "👊": "✌️", // rock beats scissors
            "✋": "👊"  // paper beats rock
        };
        
        if (winConditions[userEmoji] === botChoice) {
            return api.sendMessage(
                `🎉 You won!\n` +
                `You: ${userEmoji} | Bot: ${botChoice}`,
                threadID, messageID
            );
        } else {
            return api.sendMessage(
                `😢 You lost\n` +
                `You: ${userEmoji} | Bot: ${botChoice}`,
                threadID, messageID
            );
        }
    }

    // Help Menu
    if (!args[0]) { 
        return api.sendMessage(
            `🎮 Available Games:\n` +
            `1. /baucua [item] [amount] - Dice game\n` +
            `2. /slot [amount] - Slot machine\n` +
            `3. /rps [choice] - Rock Paper Scissors\n` +
            `4. /txcl [high/low] [amount] - High Low game`,
            threadID, messageID
        );
    }
};
