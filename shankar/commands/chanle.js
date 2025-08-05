module.exports.config = {
  name: "chanle",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Chaan ya le ya vishesh sankhya par daav lagayein\nUdaharan: chanle C2 5000\nJismein:\n+ Agar chaan/le par daav lagate hain to jeetne par paisa 3 guna hoga, haarne par pura paisa jayega\n+ Agar C0|2|4|6|8/L1|3|5|7|9 par daav lagate hain to jeetne par paisa 6 guna hoga, haarne par dugna paisa jayega",
  commandCategory: "game",
  usages: " <chaan/le/C0/C2/C4/C6/C8/L1/L3/L5/L7/L9> <daav ki rashi>\nUdaharan: chanle C2 5000",
  cooldowns: 1
};

module.exports.run = async function ({ args, api, event, Currencies }) {
  function reply(msg) {
    return api.sendMessage(msg, event.threadID, event.messageID);
  }
  const { senderID } = event;
  const board = {
    C: ["C", "C0", "C2", "C4", "C6", "C8"],
    L: ["L", "L1", "L3", "L5", "L7", "L9"]
  };
  const betBox = args[0];
  
  if (!betBox || ![...board.C, ...board.L].includes(betBox)) return reply("Kripya sandesh ko is prakar bhejen: chanle <daav ka khana> <daav ki rashi>\nPura margdarshan dekhne ke liye /help chanle likhein");
  
  const moneyBet = parseInt(args[1]);
  const moneyUnit = "coins";
  if (isNaN(moneyBet)) return reply("Daav ki rashi ek sankhya honi chahiye, prakar: /chanle <daav ka khana> <daav ki rashi>");
  // Tỉ lệ thắng và bonus
  const random = Math.floor(Math.random()*10);
  const WIN = random < 3 ? true : false;
  const BONUS = WIN ? random < 2 ? true : false : false;
  
  const moneyUser = (await Currencies.getData(senderID)).money;
  if (moneyBet < 50) return reply("Daav ki rashi 50 " + moneyUnit + " se badi honi chahiye");
  if (moneyUser < moneyBet) return reply(`Aapke paas daav lagane ke liye paryapt paisa nahi hai\n» Aapka vartaman paisa: ${moneyUser}\n» Kami wala paisa: ${moneyBet-moneyUser} ${moneyUnit}`);
  
  let responseMoney;
  let result;
  const betBoxOfUser = betBox.slice(0, 1);
  let text;
  
  if (WIN) {
    responseMoney = moneyBet*3;
    const boardAfterFilter = board[betBoxOfUser].filter(i => i != betBox);
    console.log(boardAfterFilter);
    text = ["Badhai ho! Aapne jeet liya aur paisa mila", "x3"];
    
    result = betBox.length == 2 ? boardAfterFilter[Math.floor(Math.random()*boardAfterFilter.length)] : board[betBoxOfUser][Math.floor(Math.random()*board[betBoxOfUser].length)];
    if (BONUS && betBox.length ==2) {
      result = betBox;
      text[1] = "x6";
    }
  }
  else {
    text = ["Afsos, aap haar gaye aur paisa khoya", ""];
    const oppositeBetBox = betBoxOfUser == "L" ? "C" : "L";
    result = board[oppositeBetBox][Math.floor(Math.random()*board[oppositeBetBox].length)];
    if (betBox.length == 1) responseMoney = -moneyBet;
    else if (betBox.length == 2) responseMoney = -moneyBet*2;
  }
  
  reply(`» Natija hai: ${result}\n» ${text[0]} ${text[1]}: ${Math.abs(responseMoney)} ${moneyUnit}\n» Vartaman paisa: ${moneyUser+responseMoney} ${moneyUnit}`);
  await Currencies.increaseMoney(senderID, responseMoney);
}
