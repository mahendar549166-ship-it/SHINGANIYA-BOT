/**
 * Command cardinfo - User ka info card banaye
 * 
 * Yeh module ek sundar info card banata hai user ke liye
 * jisme naam, ID, profile picture aur doosri details hoti hain
 * Alag-alag backgrounds (anime, girls, scenery) aur colors ke saath
 * 
 * @author Shankar Singhaniya
 * @version 1.0
 */

module.exports.config = {
  name: "cardinfo",
  version: "1.0",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "User ka info card banaye alag-alag backgrounds aur border colors ke saath",
  commandCategory: "Jankari",
  usages: "Command use karo aur background aur color chuno",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "axios": "",
    "canvas": "",
    "jimp": ""
  }
};

// Handle user replies for background and color selection
module.exports.handleReply = async function ({ api, event, handleReply }) {
  const { threadID, senderID } = event;
  const userInput = event.body.trim();

  // Check if the replier is the command initiator
  if (senderID !== handleReply.author) return;

  // Process reply based on type
  switch (handleReply.type) {
    // User is choosing background
    case "chooseBackground":
      const bgChoice = parseInt(userInput);
      if (bgChoice >= 1 && bgChoice <= 6) {
        // Map choice to background type
        const bgTypes = ["anime", "congnghe", "den", "cute", "love", "sexy"];
        const bgType = bgTypes[bgChoice - 1];

        // Send color selection menu
        const colorMenu = "🎨 BORDER KA COLOR CHUNO 🎨\n" +
          "1. Laal 🔴\n" +
          "2. Neela 🔵\n" +
          "3. Hara 🟢\n" +
          "4. Peela 🟡\n" +
          "5. Baingani 🟣\n" +
          "6. Gulabi 🌸\n" +
          "7. Narangi 🟠\n" +
          "8. Kala ⚫\n" +
          "9. Safed ⚪\n" +
          "10. Gehra Baingani 💜\n" +
          "11. Chandi 💎\n" +
          "12. Sunehra 🏆\n" +
          "13. Bina Color\n" +
          "➤ Number ke saath reply karo";

        return api.sendMessage(colorMenu, threadID, (error, info) => {
          if (error) return api.sendMessage("❌ Color menu bhejne mein error aaya.", threadID);

          // Store info in handleReply
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "chooseColor",
            bgType: bgType
          });
        });
      } else {
        return api.sendMessage("❌ 1 se 6 tak ka number chuno.", threadID);
      }
      break;

    // User is choosing color
    case "chooseColor":
      const colorChoice = parseInt(userInput);
      if (colorChoice >= 1 && colorChoice <= 13) {
        // List of border colors
        const colors = [
          "#f70000", // Laal - 1
          "#0073e6", // Neela - 2
          "#00a651", // Hara - 3
          "#ffcc00", // Peela - 4
          "#9c27b0", // Baingani - 5
          "#e91e63", // Gulabi - 6
          "#ff5722", // Narangi - 7
          "#212121", // Kala - 8
          "#ffffff", // Safed - 9
          "#6a0dad", // Gehra Baingani - 10
          "#c0c0c0", // Chandi - 11
          "#ffd700", // Sunehra - 12
          "#100000"  // Bina Color - 13
        ];

        const borderColor = colors[colorChoice - 1];

        // Notify processing
        api.sendMessage(`⏳ ${handleReply.bgType} background aur chune hue color ke saath card ban raha hai...`, threadID);

        // Create info card
        createCard(api, event, handleReply.bgType, borderColor);
      } else {
        return api.sendMessage("❌ 1 se 13 tak ka number chuno.", threadID);
      }
      break;
  }
};

// Main run function
module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  // Send background selection menu
  const bgMenu = "BACKGROUND KA TYPE CHUNO \n\n" +
    "Reply karke number chuno:\n\n" +
    "1-Anime\n" +
    "2-Technology\n" +
    "3-Dark Masculine\n" +
    "4-Cute\n" +
    "5-Romantic\n" +
    "6-Sexy Girl\n\n" +
    "👉 Number ke saath reply karo";

  return api.sendMessage(bgMenu, threadID, (error, info) => {
    if (error) return api.sendMessage("❌ Menu bhejne mein error aaya.", threadID, messageID);

    // Store in global for reply handling
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      author: senderID,
      type: "chooseBackground"
    });
  });
};

// Function to create info card
async function createCard(api, event, bgType, borderColor) {
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const { threadID, senderID } = event;

  try {
    // Determine user ID for info
    let targetID = senderID;

    // Ensure cache directory exists
    if (!fs.existsSync("/cache")) {
      fs.mkdirSync("/cache", { recursive: true });
    }

    // Fetch user info from Facebook API
    const userInfo = await api.getUserInfo(targetID);
    const user = userInfo[targetID];

    if (!user) {
      return api.sendMessage("❌ User ki jankari nahi mil saki.", threadID);
    }

    // Fetch thread info if in a group
    const threadInfo = await api.getThreadInfo(threadID);

    // Basic user info
    const userName = user.name || "Pata nahi";
    const userGender = user.gender === "MALE" ? "Purush" : user.gender === "FEMALE" ? "Mahila" : "Pata nahi";
    const userBirthday = user.birthday || "Pata nahi";

    // Find nickname in group
    const nickname = threadInfo.nicknames && threadInfo.nicknames[targetID] || "Koi nahi";

    // Determine role in group
    let role = "Member";
    if (threadInfo.adminIDs && threadInfo.adminIDs.some(item => item.id === targetID)) {
      role = "Admin";
    }
    if (targetID === api.getCurrentUserID()) {
      role = "BOT";
    }

    // Select background based on type
    const bgImages = {
      anime: ["https://files.catbox.moe/9iq0h1.jpeg"],
      congnghe: ["https://files.catbox.moe/8yiftk.jpeg"],
      den: ["https://files.catbox.moe/93w2eq.jpeg"],
      cute: ["https://files.catbox.moe/vkil77.jpeg"],
      love: ["https://files.catbox.moe/0su28i.jpeg"],
      sexy: ["https://files.catbox.moe/xsvz99.jpeg"]
    };

    // Pick random background image
    const backgroundImages = bgImages[bgType] || bgImages.anime;
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    const backgroundUrl = backgroundImages[randomIndex];

    // Create temporary file paths
    const random = Math.floor(Math.random() * 99999);
    const avatarPath = `/cache/avatar_${random}.png`;

    // Fetch avatar
    let avatarUrl = user.thumbSrc;
    if (!avatarUrl) {
      return api.sendMessage("❌ Profile picture nahi mil saka.", threadID);
    }

    // Download avatar
    const avatarResponse = await axios.get(avatarUrl, {
      responseType: "arraybuffer",
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        'Referer': 'https://www.facebook.com/'
      }
    });

    // Save avatar to cache
    fs.writeFileSync(avatarPath, Buffer.from(avatarResponse.data));

    // Check if canvas and jimp are available
    const canvas = global.nodemodule["canvas"];
    const jimp = global.nodemodule["jimp"];

    if (canvas && jimp) {
      try {
        const { registerFont, createCanvas } = canvas;

        // Create canvas
        const card = createCanvas(900, 500);
        const ctx = card.getContext('2d');

        // Load background image
        try {
          console.log("Background image load ho rahi hai...");
          const backgroundImg = await canvas.loadImage(backgroundUrl);
          console.log("Background image load ho gayi");

          // Calculate ratio to fill canvas without cropping important content
          const imgRatio = backgroundImg.width / backgroundImg.height;
          const canvasRatio = 900 / 500;
          let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

          // Prioritize filling width
          drawWidth = 920;
          drawHeight = drawWidth / imgRatio;

          // Adjust if height exceeds canvas
          if (drawHeight > 500) {
            offsetY = (500 - drawHeight) / 2;
          } else {
            drawHeight = 500;
            drawWidth = 500 * imgRatio;
            offsetX = (900 - drawWidth) / 2;
          }

          // Draw background keeping aspect ratio
          ctx.drawImage(backgroundImg, offsetX, offsetY, drawWidth, drawHeight);

          // Add overlay for text readability
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fillRect(0, 0, 900, 500);
        } catch (bgError) {
          // Fallback to simple background if image fails
          ctx.fillStyle = '#1a1a2e';
          ctx.fillRect(0, 0, 900, 500);
          console.error("Background load karne mein error:", bgError.message);
        }

        // Draw border with embossed effect
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;

        // Draw border with selected color
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 8;

        // Draw border in segments for gaps and notched corners
        ctx.beginPath();
        ctx.moveTo(25, 20);
        ctx.lineTo(875, 20);
        ctx.moveTo(875, 20);
        ctx.lineTo(875, 480);
        ctx.moveTo(875, 480);
        ctx.lineTo(25, 480);
        ctx.moveTo(25, 480);
        ctx.lineTo(25, 20);
        ctx.stroke();

        // Disable shadow for subsequent elements
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw circular avatar
        try {
          const avatarImage = await canvas.loadImage(avatarPath);

          // Avatar position and size
          const avatarSize = 140;
          const avatarX = 120;
          const avatarY = 110 + avatarSize / 2;

          // Add glow effect for avatar
          ctx.shadowColor = borderColor;
          ctx.shadowBlur = 15;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          // Draw outer circle with glow
          ctx.beginPath();
          ctx.arc(avatarX, avatarY, avatarSize / 2 + 10, 0, Math.PI * 2);
          ctx.fillStyle = 'white';
          ctx.fill();

          // Draw colored border for avatar
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 5;
          ctx.stroke();

          // Disable glow effect
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;

          // Clip and draw avatar
          ctx.save();
          ctx.beginPath();
          ctx.arc(avatarX, avatarY, avatarSize / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(avatarImage, avatarX - avatarSize / 2, avatarY - avatarSize / 2, avatarSize, avatarSize);
          ctx.restore();
        } catch (avatarError) {
          console.error("Avatar load karne mein error:", avatarError.message);
        }

        // Draw title
        ctx.textAlign = 'center';
        ctx.font = 'bold 46px Arial, Helvetica, sans-serif';
        ctx.fillStyle = 'black';
        ctx.fillText('USER KI JANKARI', 450, 75);
        ctx.font = 'bold 45px Arial, Helvetica, sans-serif';
        ctx.fillStyle = borderColor;
        ctx.fillText('USER KI JANKARI', 450, 75);

        // Draw main info box
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.fillRect(230, 110, 635, 60);

        // Draw user name
        ctx.textAlign = 'left';
        ctx.font = 'bold 38px Arial, Helvetica, sans-serif';
        ctx.fillStyle = 'white';
        let displayName = userName;
        if (displayName.length > 18) {
          displayName = displayName.substring(0, 15) + "...";
        }
        ctx.fillText(displayName, 280, 155);

        // Draw detailed info box
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.fillRect(230, 180, 635, 250);
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(230, 180, 635, 250);

        // Draw detailed info
        ctx.fillStyle = 'white';
        ctx.font = '25px Arial, Helvetica, sans-serif';
        const infoStartY = 225;
        const lineHeight = 35;
        ctx.fillText(`➤ ID: ${targetID}`, 280, infoStartY);
        ctx.fillText(`➤ Ling: ${userGender}`, 280, infoStartY + lineHeight);
        ctx.fillText(`➤ Janmdin: ${userBirthday}`, 280, infoStartY + lineHeight * 2);
        ctx.fillText(`➤ Nickname: ${nickname}`, 280, infoStartY + lineHeight * 3);
        ctx.fillText(`➤ Role: ${role}`, 280, infoStartY + lineHeight * 4);

        // Save and send card
        const outputPath = `/cache/card_${random}.png`;
        const buffer = card.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);

        api.sendMessage(
          {
            attachment: fs.createReadStream(outputPath)
          },
          threadID,
          () => {
            // Clean up temporary files
            if (fs.existsSync(avatarPath)) fs.unlinkSync(avatarPath);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
          }
        );
      } catch (canvasError) {
        console.error("Card banane mein error:", canvasError.message);
        api.sendMessage(`❌ Card banane mein error: ${canvasError.message}`, threadID);
      }
    } else {
      api.sendMessage("❌ Canvas ya jimp library nahi hai, card nahi bana sakta.", threadID);
    }
  } catch (error) {
    console.error("Card banane mein error:", error);
    api.sendMessage(`❌ Card banane mein error aaya: ${error.message}`, threadID);
  }
}
