module.exports.config = {
  name: "getlink",
  version: "1.1.0",
  hasPermission: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Get download URL from attachments (video/audio/image)",
  commandCategory: "Utility",
  usages: "[reply to attachment]",
  cooldowns: 5,
  usePrefix: true
};

module.exports.languages = {
  "en": {
    "invalidFormat": "⚠️ Please reply to a message containing an attachment (audio/video/image)",
    "multipleAttachments": "⚠️ Please reply to a message with only one attachment",
    "noAttachment": "⚠️ The replied message has no attachments"
  }
};

module.exports.run = async ({ api, event, getText }) => {
  try {
    // Check if user replied to a message
    if (event.type !== "message_reply") {
      return api.sendMessage(getText("invalidFormat"), event.threadID, event.messageID);
    }

    const repliedMessage = event.messageReply;
    
    // Check if replied message has attachments
    if (!repliedMessage.attachments || repliedMessage.attachments.length === 0) {
      return api.sendMessage(getText("noAttachment"), event.threadID, event.messageID);
    }

    // Check if only one attachment exists
    if (repliedMessage.attachments.length > 1) {
      return api.sendMessage(getText("multipleAttachments"), event.threadID, event.messageID);
    }

    // Get the first attachment URL
    const attachmentUrl = repliedMessage.attachments[0].url;
    
    // Send the download URL back to user
    return api.sendMessage({
      body: `🔗 Download URL:\n${attachmentUrl}`,
      attachment: null
    }, event.threadID, event.messageID);

  } catch (error) {
    console.error("Error in getlink command:", error);
    return api.sendMessage("❎ An error occurred while processing your request", event.threadID, event.messageID);
  }
};
