module.exports.config = {
  name: 'file',
  version: '1.2.0',
  hasPermission: 2,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: 'View, manage, and manipulate files/folders',
  commandCategory: 'Admin',
  usages: '[path]',
  cooldowns: 0,
  dependencies: {
    'fs-extra': '',
    'axios': '',
    'form-data': '',
    'archiver': ''
  }
};

const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const archiver = require('archiver');

// Cache for node_shankar folder size
const _node_shankar_path = path.join(process.cwd(), 'node_shankar');
let _node_shankar = fs.readdirSync(_node_shankar_path);
let _node_shankar_bytes = calculateFolderSize(_node_shankar_path);

module.exports.run = function({ api, event, args }) {
  const targetPath = args[0] ? path.join(process.cwd(), args[0]) : process.cwd();
  openFolder(api, event, targetPath);
};

module.exports.handleReply = async function({ handleReply: $, api, event }) {
  try {
    if (!global.config.ADMINBOT.includes(event.senderID)) {
      return api.sendMessage('⚠️ Access denied - Admin only', event.threadID, event.messageID);
    }

    const action = event.args[0].toLowerCase();
    const selectedIndex = event.args[1] - 1;
    const selectedItem = $.data[selectedIndex];

    if (!['create'].includes(action) && !selectedItem) {
      return api.sendMessage('⚠️ Invalid file/folder index', event.threadID, event.messageID);
    }

    switch (action) {
      case 'open':
        if (selectedItem.info.isDirectory()) {
          openFolder(api, event, selectedItem.dest);
        } else {
          api.sendMessage('⚠️ Selected path is not a directory', event.threadID, event.messageID);
        }
        break;

      case 'delete': {
        const deletedItems = [];
        for (const i of event.args.slice(1).map(num => parseInt(num) - 1) {
          const { dest, info } = $.data[i];
          const name = path.basename(dest);
          
          if (info.isFile()) {
            fs.unlinkSync(dest);
            deletedItems.push(`📄 ${name}`);
          } else if (info.isDirectory()) {
            fs.rmdirSync(dest, { recursive: true });
            deletedItems.push(`🗂️ ${name}`);
          }
        }
        api.sendMessage(`✅ Deleted items:\n${deletedItems.join('\n')}`, event.threadID, event.messageID);
        break;
      }

      case 'send':
        const fileContent = fs.readFileSync(selectedItem.dest, 'utf8');
        const uploadLink = await uploadToBin(fileContent);
        api.sendMessage(uploadLink, event.threadID, event.messageID);
        break;

      case 'view': {
        const filePath = selectedItem.dest;
        let tempPath;
        
        if (filePath.endsWith('.js')) {
          tempPath = filePath.replace('.js', '.txt');
          fs.copyFileSync(filePath, tempPath);
        }
        
        api.sendMessage({
          attachment: fs.createReadStream(tempPath || filePath),
        }, event.threadID, () => {
          if (tempPath) fs.unlinkSync(tempPath);
        }, event.messageID);
        break;
      }

      case 'create': {
        const isDirectory = event.args[1].endsWith('/');
        const fullPath = path.join($.directory, event.args[1]);
        const content = event.args.slice(2).join(' ');
        
        if (isDirectory) {
          fs.mkdirSync(fullPath, { recursive: true });
        } else {
          fs.writeFileSync(fullPath, content || '');
        }
        
        api.sendMessage(`✅ Created ${isDirectory ? 'folder' : 'file'}: ${event.args[1]}`, event.threadID, event.messageID);
        break;
      }

      case 'copy': {
        const newPath = selectedItem.dest.replace(/(\.|\/)[^./]+$/, (match, char) => 
          char === '.' ? ' (COPY)' + match : char === '/' ? match + ' (COPY)' : match
        );
        fs.copyFileSync(selectedItem.dest, newPath);
        api.sendMessage('✅ Copy created successfully', event.threadID, event.messageID);
        break;
      }

      case 'rename': {
        const newName = event.args[2];
        if (!newName) {
          return api.sendMessage('⚠️ Please provide a new name', event.threadID, event.messageID);
        }
        
        const newPath = path.join(path.dirname(selectedItem.dest), newName);
        fs.renameSync(selectedItem.dest, newPath);
        api.sendMessage('✅ Renamed successfully', event.threadID, event.messageID);
        break;
      }

      case 'zip': {
        const selectedPaths = event.args.slice(1)
          .map(num => $.data[parseInt(num) - 1].dest)
          .filter(p => fs.existsSync(p));
        
        const zipStream = createZip(selectedPaths);
        const uploadLink = await uploadToCatbox(zipStream);
        api.sendMessage(uploadLink, event.threadID, event.messageID);
        break;
      }

      default:
        api.sendMessage(
          'Available commands:\n' +
          '• open [index] - Open folder\n' +
          '• delete [indexes] - Delete items\n' +
          '• send [index] - Upload file to bin\n' +
          '• view [index] - View file content\n' +
          '• create [name] - Create file/folder\n' +
          '• copy [index] - Create copy\n' +
          '• rename [index] [new name] - Rename\n' +
          '• zip [indexes] - Create and upload zip',
          event.threadID, event.messageID
        );
    }
  } catch (error) {
    console.error('File manager error:', error);
    api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);
  }
};

function openFolder(api, event, folderPath) {
  try {
    const items = fs.readdirSync(folderPath);
    const { folders, files } = items.reduce((acc, item) => {
      const fullPath = path.join(folderPath, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        stats.size = calculateFolderSize(fullPath);
        acc.folders.push({ name: item, stats, path: fullPath });
      } else {
        acc.files.push({ name: item, stats, path: fullPath });
      }
      return acc;
    }, { folders: [], files: [] });

    // Sort alphabetically
    folders.sort((a, b) => a.name.localeCompare(b.name));
    files.sort((a, b) => a.name.localeCompare(b.name));

    let message = `📂 Directory: ${folderPath}\n\n`;
    let itemList = [];
    let totalSize = 0;

    // Add folders first
    folders.forEach((item, index) => {
      totalSize += item.stats.size;
      message += `${index + 1}. 🗂️ ${item.name} (${formatSize(item.stats.size)})\n`;
      itemList.push({ dest: item.path, info: item.stats });
    });

    // Then files
    files.forEach((item, index) => {
      totalSize += item.stats.size;
      const itemNumber = folders.length + index + 1;
      message += `${itemNumber}. 📄 ${item.name} (${formatSize(item.stats.size)})\n`;
      itemList.push({ dest: item.path, info: item.stats });
    });

    message += `\n📊 Total size: ${formatSize(totalSize)}\n` +
      'Reply with command + index to manage items';

    api.sendMessage(message, event.threadID, (err, info) => {
      global.client.handleReply.push({
        name: module.exports.config.name,
        messageID: info.messageID,
        author: event.senderID,
        data: itemList,
        directory: folderPath + path.sep
      });
    }, event.messageID);
  } catch (error) {
    api.sendMessage(`❌ Error accessing folder: ${error.message}`, event.threadID, event.messageID);
  }
}

function calculateFolderSize(folderPath) {
  if (folderPath === _node_shankar_path) {
    const currentFiles = fs.readdirSync(folderPath);
    if (currentFiles.length !== _node_shankar.length) {
      _node_shankar = currentFiles;
      _node_shankar_bytes = undefined;
    }
    if (_node_shankar_bytes !== undefined) return _node_shankar_bytes;
  }

  let totalSize = 0;
  const items = fs.readdirSync(folderPath);

  for (const item of items) {
    try {
      const itemPath = path.join(folderPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        totalSize += calculateFolderSize(itemPath);
      } else {
        totalSize += stats.size;
      }
    } catch (error) {
      console.error(`Error calculating size for ${item}:`, error);
      continue;
    }
  }

  if (folderPath === _node_shankar_path) {
    _node_shankar_bytes = totalSize;
  }

  return totalSize;
}

function formatSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

async function uploadToCatbox(stream) {
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', stream);

  const response = await axios.post('https://catbox.moe/user/api.php', form, {
    headers: form.getHeaders(),
    responseType: 'text'
  });

  return response.data;
}

function createZip(filePaths, outputPath) {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const output = outputPath ? fs.createWriteStream(outputPath) : null;

  if (output) {
    archive.pipe(output);
  }

  filePaths.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        archive.file(filePath, { name: path.basename(filePath) });
      } else if (stats.isDirectory()) {
        archive.directory(filePath, path.basename(filePath));
      }
    }
  });

  archive.finalize();

  if (outputPath) {
    return new Promise((resolve, reject) => {
      output.on('close', () => resolve(outputPath));
      archive.on('error', reject);
    });
  }

  archive.path = 'temp.zip';
  return archive;
}

async function uploadToBin(content) {
  const response = await axios.post('https://api.mocky.io/api/mock', {
    status: 200,
    content: content,
    content_type: "text/plain",
    charset: "UTF-8",
    secret: "LeMinhTien",
    expiration: "never"
  });

  return response.data.link;
}
