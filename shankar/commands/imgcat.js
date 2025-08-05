const axios = require("axios");
const FormData = require('form-data');
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "imgcat",
    version: "1.3.1",
    author: "ChatGPT & Rst",
    description: "Imgur se Catbox par tasveer/video badlein",
    usage: "[link1] [link2] ... ya link wale message ka jawab dein",
    commandCategory: "Upyogita",
    cooldowns: 5
  },

  run: async function ({ api, event, args }) {
    let links = [];

    // Reply se links nikalna aur saaf karna
    if (event.type === "message_reply" && event.messageReply.body) {
      const cleanBody = event.messageReply.body.replace(/["[\],]/g, '');
      links = cleanBody.match(/https?:\/\/(?:i\.)?imgur\.com\/[^\s]+/g) || [];
    }

    // Args se links nikalna aur saaf karna
    if (args.length > 0) {
      const rawInput = args.join(" ").replace(/["[\],]/g, '');
      const fromArgs = rawInput.match(/https?:\/\/(?:i\.)?imgur\.com\/[^\s]+/g) || [];
      links = links.concat(fromArgs);
    }

    if (links.length === 0) {
      return api.sendMessage("Kripaya ek ya zyada valid Imgur links daalein ya link wale message ka jawab dein.", event.threadID, event.messageID);
    }

    // Duplicates hatao aur links ki sankhya seemit karo
    links = [...new Set(links)];
    if (links.length > 1000) {
      return api.sendMessage("Ek baar mein sirf 300 links tak anumati hai.", event.threadID, event.messageID);
    }

    api.sendMessage(`Abhi ${links.length} links badle ja rahe hain...`, event.threadID);

    // Cache directory banayein agar nahi hai
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    // Imgur links ko standardize karna
    function normalizeImgurLink(link) {
      if (!link.includes("i.imgur.com")) {
        const id = link.split("/").pop().split(".")[0];
        return `https://i.imgur.com/${id}.jpg`;
      }
      return link;
    }

    links = links.map(normalizeImgurLink);

    const results = [];

    for (const imgurUrl of links) {
      try {
        const res = await axios.get(imgurUrl, {
          responseType: 'arraybuffer',
          headers: { "User-Agent": "Mozilla/5.0" }
        });

        // File extension nikalna
        let ext = path.extname(imgurUrl.split("?")[0]);
        if (!ext || ext === "") {
          const contentType = res.headers['content-type'];
          if (contentType.includes('image/png')) ext = ".png";
          else if (contentType.includes('image/gif')) ext = ".gif";
          else if (contentType.includes('image/jpeg')) ext = ".jpg";
          else if (contentType.includes('image/webp')) ext = ".webp";
          else if (contentType.includes('video/mp4')) ext = ".mp4";
          else if (contentType.includes('video/webm')) ext = ".webm";
          else ext = ".jpg";
        }

        // Temporary file save karna
        const uniqueID = Date.now() + "_" + Math.floor(Math.random() * 10000);
        const filePath = path.join(cacheDir, `temp_${uniqueID}${ext}`);
        fs.writeFileSync(filePath, Buffer.from(res.data));

        // Catbox par upload karna
        const form = new FormData();
        form.append("reqtype", "fileupload");
        form.append("fileToUpload", fs.createReadStream(filePath));

        const upload = await axios.post("https://catbox.moe/user/api.php", form, {
          headers: form.getHeaders()
        });

        fs.unlinkSync(filePath);
        results.push(`"${upload.data}",`);
      } catch (err) {
        console.error(`Lỗi với ${imgurUrl}:`, err.message || err);
        const errorMsg = err.response?.status
          ? `${err.response.status} - ${err.response.statusText}`
          : err.message || "Asankhya error";
        results.push(`• ${imgurUrl} → Error: ${errorMsg}`);
      }
    }

    const success = results.filter(r => !r.includes("Error"));
    const failed = results.filter(r => r.includes("Error"));

    return api.sendMessage(
      `${success.join("\n")}${failed.length ? `\n\nError:\n${failed.join("\n")}` : ""}`,
      event.threadID, event.messageID
    );
  }
};
