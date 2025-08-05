module.exports.config = {
  name: 'girls',
  version: '1.1.0',
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  hasPermission: 0,
  description: 'View random photos of girls',
  commandCategory: 'Utility',
  usages: 'girls',
  cooldowns: 10
};

module.exports.run = async ({ api, event, Users, Currencies }) => {
  try {
    const { threadID, messageID } = event;
    const axios = require('axios');
    const name = await Users.getNameUser(event.senderID);
    
    // Load image URLs from JSON file
    const imageData = require('./../../data_dongdev/datajson/gaivip.json');
    const imageCount = Math.floor(Math.random() * 10) + 1; // 1-10 random images
    const cost = 500; // Cost to view images
    
    // Check user's balance
    const userMoney = (await Currencies.getData(event.senderID)).money;
    if (userMoney < cost) {
      return api.sendMessage(
        `❎ ${name}, you need ${cost}$ to view these photos. Please earn more money and try again!`, 
        threadID, 
        messageID
      );
    }
    
    // Deduct money and get random images
    await Currencies.decreaseMoney(event.senderID, cost);
    
    const imageStreams = [];
    const usedIndices = new Set(); // To avoid duplicate images
    
    while (imageStreams.length < imageCount) {
      const randomIndex = Math.floor(Math.random() * imageData.length);
      
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        try {
          const stream = (await axios.get(imageData[randomIndex], {
            responseType: "stream",
            timeout: 10000 // 10 second timeout
          })).data;
          imageStreams.push(stream);
        } catch (error) {
          console.error('Error loading image:', error);
          // Skip failed images
        }
      }
    }
    
    if (imageStreams.length === 0) {
      // Refund if no images loaded
      await Currencies.increaseMoney(event.senderID, cost);
      return api.sendMessage(
        '❎ Failed to load images. Your money has been refunded.', 
        threadID, 
        messageID
      );
    }
    
    return api.sendMessage({
      body: `🌸 Here are ${imageStreams.length} random photos for you ${name} (Cost: ${cost}$)`,
      attachment: imageStreams
    }, threadID, messageID);
    
  } catch (error) {
    console.error('Girls command error:', error);
    return api.sendMessage(
      '❎ An error occurred while processing your request. Please try again later.', 
      event.threadID, 
      event.messageID
    );
  }
};
