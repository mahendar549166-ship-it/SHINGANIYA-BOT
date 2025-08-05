const request = require("request");
const fs = require("fs");
const axios = require("axios");

module.exports.config = {
  name: 'hunter',
  version: '1.1.1',
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: 'Ek Hunter Khel',
  commandCategory: 'Khel',
  usages: '',
  cooldowns: 5,
  dependencies: {
    'axios': '',
    'fs': '',
    'canvas': ''
  },
  envConfig: {
    userToken: 'D7tTFhgD',
    adminToken: 'ZkSy3UsT'
  }
};

module.exports.languages = {
  'hi': {
    'menu': `
    === [ HUNTER ] ===
    1. Register
    2. Aapka Profile
    3. Leaderboard
    4. Hamla
    5. Hathiyar
    » Is message ka jawab dein aur apna vikalp chunein.
    `,
    'invalid_option': 'Amanya vikalp. Kripaya fir se koshish karein.',
    'register_success': 'Safalta se register kiya gaya!\nAapko knife-F mila!',
    'already_registered': 'Aap pehle se register kar chuke hain!',
    'invalid_token': 'Amanya Token, kripaya admin se sampark karein!',
    'profile': '=== [ HUNTER PROFILE ] ===\nNaam: %1\nHathiyar: %2\nShuriken: %3\nShakti: %4\nJeet: %5\nHaar: %6',
    'user_not_exist': 'Aapne abhi tak register nahi kiya hai!',
    'cannot_get_info': 'Jankari prapt nahi kar sake, kripaya baad mein koshish karein!',
    'leaderboard': '=== [ LEADERBOARD ] ===\n\n%1\nAapka rank: %2',
    'no_user_in_thread': 'Is samuh mein koi khiladi register nahi hai.',
    'no_user': 'Database mein koi user nahi mila.',
    'prepare_game': '=== [ MATCH MILA ] ===\n\nKhiladi 1: %1 (%2)\nKhiladi 2: %3 (%4)\n\n» Khel shuru karne ke liye, dono ko is message par reaction dena hoga!',
    'game_canceled': 'Khel radd ho gaya kyunki dono khiladiyon ne samay par is message par reaction nahi diya.',
    'game_start': 'Hunter Khel Shuru!\nShikari: %1 (%2)\nShikar: %3 (%4)\nParinaam gantana ho raha hai...',
    'hunter_win': 'Shikari jeet gaya aur usne shikar ke balance se %1% paisa le liya!',
    'victim_win': 'Shikar ne apna bachav kiya aur shikari ke balance se %1% paisa le liya!',
    'weapon_menu': '=== [ HATHIYAR ] ===\n\n1. Mera Hathiyar\n2. Hathiyar ki Dukaan\n\n» Is message ka jawab dein aur apna vikalp chunein.',
    'weapon_info': 'Naam: %1\nShuriken: %2\nShakti: %3',
    'no_weapon_available': 'Dukaan mein koi hathiyar uplabdh nahi hai.',
    'weapons': '=== [ HATHIYAR KI DUKAAN ] ===\n%1\n» Jis hathiyar ko kharidna chahte hain, uska number jawab mein likhein.',
    'not_enough_money': 'Aapke paas is hathiyar ko kharidne ke liye paryapt paisa nahi hai.',
    'weapon_bought': 'Aapne %1 safalta se kharid liya.\nAapki shakti ab %2 ho gayi hai.',
    'buying_shuriken': '» Kripaya jawab mein shuriken ki sankhya likhein jo aap kharidna chahte hain.\n» Kharidne yogya shuriken: %1',
    'shuriken_bought': 'Aapne %1 shuriken safalta se kharid liye.\nAapke paas ab kul %2 shuriken hain.',
  }
};

const hunterAPI = 'https://Ryanair-Hello-Word-Api-Hunter.chauminhtri2022.repl.co';
const hunterBanner = 'https://i.ibb.co/3CqkfyS/banner.jpg';

module.exports.onLoad = async function () {
  await global.nodemodule['axios'].get("https://raw.githubusercontent.com/RFS-ADRENO/mirai-shankar/main/version.json").then(res => {
    if (res.data["hunter_x055"] != this.config.version);
  });
  if (!global.client.hasOwnProperty('hunterDU')) global.client.hunterDU = [];
};

module.exports.handleReply = async function ({ api, event, getText, Users, Threads, Currencies, handleReply }) {
  if (!global.client.hasOwnProperty('hunterDU')) global.client.hunterDU = [];
  const { threadID, messageID, senderID, body } = event;
  const { author, type, step } = handleReply;
  const { get, post } = global.nodemodule['axios'];
  if (!body) return;
  const chosenIndex = parseInt(body);
  if (isNaN(chosenIndex) || chosenIndex < 1) return api.sendMessage(getText('invalid_option'), threadID, messageID);
  if (type == 'menu') {
    if (chosenIndex > 5) return api.sendMessage(getText('invalid_option'), threadID, messageID);
    else if (chosenIndex == 1) {
      const info = {
        userID: senderID,
        accessToken: global.configModule[this.config.name].userToken
      };
      post(hunterAPI + '/register', info)
        .then(async res => {
          if (res.data.data) {
            try {
              const weaponImage = (await get(res.data.image, { responseType: 'stream' })).data;
              api.sendMessage({
                body: getText('register_success'),
                attachment: weaponImage
              }, threadID, messageID);
            } catch (e) {
              return api.sendMessage(getText('cannot_get_info'), threadID, messageID);
            }
          } else {
            api.sendMessage(getText('already_registered'), threadID, messageID);
          }
        })
        .catch(err => {
          return api.sendMessage(this.getErrorMessage(getText, err), threadID, messageID);
        });
    } else if (chosenIndex == 2) {
      get(hunterAPI + `/info?userID=${senderID}&accessToken=${global.configModule[this.config.name].adminToken}`)
        .then(async (res) => {
          const user = res.data.data;
          let userName = await Users.getNameUser(senderID);
          if (user) {
            try {
              const userPower = user.weapon.power + (user.shuriken ? 15 : 0);
              const msg = getText('profile', userName, user.weapon.name, user.shuriken, userPower, user.win, user.lose);
              const weaponImage = (await get(user.weapon.image, { responseType: 'stream' })).data;
              return api.sendMessage({
                body: msg,
                attachment: weaponImage
              }, threadID, messageID);
            } catch (err) {
              return api.sendMessage(getText('cannot_get_info'), threadID, messageID);
            }
          } else {
            return api.sendMessage(getText('user_not_exist'), threadID, messageID);
          }
        })
        .catch(err => {
          return api.sendMessage(this.getErrorMessage(getText, err), threadID, messageID);
        });
    } else if (chosenIndex == 3) {
      get(hunterAPI + `/list?accessToken=${global.configModule[this.config.name].adminToken}`)
        .then(async (res) => {
          let msg = null;
          let allUsers = res.data.data;
          let scores = await allUsers.map(async (user) => {
            return {
              userID: user.userID,
              name: await Users.getNameUser(user.userID),
              score: (user.win * 3) - (user.lose),
              win: user.win,
              lose: user.lose
            };
          });
          scores = await Promise.all(scores);
          scores.sort((a, b) => {
            if (a.score > b.score) return -1;
            if (a.score < b.score) return 1;
            return a.name.localeCompare(b.name);
          });
          if (scores.length == 0) {
            return api.sendMessage(getText('no_user'), threadID, messageID);
          }
          let userRank = scores.findIndex(user => user.userID == senderID) + 1;
          scores = scores.slice(0, 10);
          let top_10 = '';
          scores.forEach((user, index) => {
            top_10 += `${index + 1}. ${user.name} - ${user.score}\n`;
          });
          msg = getText('leaderboard', top_10, userRank);
          return api.sendMessage(msg, threadID, messageID);
        })
        .catch(err => {
          return api.sendMessage(this.getErrorMessage(getText, err), threadID, messageID);
        });
    } else if (chosenIndex == 4) {
      try {
        await get(hunterAPI + `/info?userID=${senderID}&accessToken=${global.configModule[this.config.name].adminToken}`);
      } catch (e) {
        return api.sendMessage(this.getErrorMessage(getText, e), threadID, messageID);
      }
      const participantIDs = (await Threads.getInfo(threadID)).participantIDs;
      get(hunterAPI + `/list?accessToken=${global.configModule[this.config.name].adminToken}`)
        .then(async (res) => {
          let msg = null;
          const allUsers = res.data.data.filter(user => participantIDs.includes(user.userID) && user.userID != senderID);
          if (allUsers.length == 0) return api.sendMessage(getText('no_user_in_thread'), threadID, messageID);

          const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
          const _1ST_PLAYER = {
            userID: senderID,
            name: await Users.getNameUser(senderID)
          };
          const _2ND_PLAYER = {
            userID: randomUser.userID,
            name: await Users.getNameUser(randomUser.userID)
          };

          const random = Math.random();
          let hunter = _1ST_PLAYER;
          let victim = _2ND_PLAYER;
          if (random > 0.5) {
            hunter = _2ND_PLAYER;
            victim = _1ST_PLAYER;
          }

          msg = getText('prepare_game', _1ST_PLAYER.name, _1ST_PLAYER.userID, _2ND_PLAYER.name, _2ND_PLAYER.userID);
          return api.sendMessage({
            body: msg,
            mentions: [
              {
                tag: _1ST_PLAYER.name,
                id: _1ST_PLAYER.userID
              },
              {
                tag: _2ND_PLAYER.name,
                id: _2ND_PLAYER.userID
              }
            ]
          }, threadID, (err, info) => {
            global.client.hunterDU.push(info.messageID);
            global.client.handleReaction.push({
              name: this.config.name,
              messageID: info.messageID,
              hunter,
              victim,
              hunterConfirm: false,
              victimConfirm: false
            });
            setTimeout(() => {
              if (global.client.hunterDU.some(id => id == info.messageID)) {
                global.client.hunterDU.splice(global.client.hunterDU.indexOf(info.messageID), 1);
                api.unsendMessage(info.messageID, () => {
                  api.sendMessage(getText('game_canceled'), threadID, messageID);
                });
              }
            }, 2 * 60 * 1000);
          }, messageID);
        })
        .catch(err => {
          return api.sendMessage(this.getErrorMessage(getText, err), threadID, messageID);
        });
    } else {
      return api.sendMessage(getText('weapon_menu'), threadID, (err, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          type: 'weapon_menu'
        });
      }, messageID);
    }
  } else if (type == 'weapon_menu') {
    if (chosenIndex > 2) return api.sendMessage(getText('invalid_option'), threadID, messageID);
    else if (chosenIndex == 1) {
      get(hunterAPI + `/info?userID=${senderID}&accessToken=${global.configModule[this.config.name].adminToken}`)
        .then(async (res) => {
          const user = res.data.data;
          if (user) {
            try {
              const userPower = user.weapon.power + (user.shuriken ? 15 : 0);
              const msg = getText('weapon_info', user.weapon.name, user.shuriken, userPower);
              const weaponImage = (await get(user.weapon.image, { responseType: 'stream' })).data;
              return api.sendMessage({
                body: msg,
                attachment: weaponImage
              }, threadID, messageID);
            } catch (err) {
              return api.sendMessage(getText('cannot_get_info'), threadID, messageID);
            }
          } else {
            return api.sendMessage(getText('user_not_exist'), threadID, messageID);
          }
        })
        .catch(err => {
          return api.sendMessage(this.getErrorMessage(getText, err), threadID, messageID);
        });
    } else {
      get(hunterAPI + `/weapons?accessToken=${global.configModule[this.config.name].userToken}`)
        .then(res => {
          const weapons = res.data;
          get(hunterAPI + `/info?userID=${senderID}&accessToken=${global.configModule[this.config.name].adminToken}`)
            .then(async res => {
              const userWeapon = res.data.data.weapon;
              const userShuriken = res.data.data.shuriken;
              const filteredWeapons = weapons.filter(weapon => weapon.id > userWeapon.id);
              if (userShuriken >= 20) filteredWeapons.splice(filteredWeapons.findIndex(weapon => weapon.id == 6), 1);

              if (filteredWeapons.length == 0) return api.sendMessage(getText('no_weapon_available'), threadID, messageID);

              const allWeaponsImages = [];
              for (const weapon of filteredWeapons) {
                try {
                  const weaponImage = (await get(weapon.image, { responseType: 'stream' })).data;
                  allWeaponsImages.push(weaponImage);
                } catch (e) {
                  filteredWeapons.splice(filteredWeapons.indexOf(weapon), 1);
                }
              }
              let list = filteredWeapons.map((weapon, index) => {
                return `\n${index + 1}. ${weapon.name}\n 💥 ${weapon.power}\n 💵 ${weapon.cost}$\n`;
              });
              let msg = getText('weapons', list.join(''));
              return api.sendMessage(msg, threadID, (err, info) => {
                global.client.handleReply.push({
                  name: this.config.name,
                  messageID: info.messageID,
                  author: senderID,
                  weapons: filteredWeapons,
                  userShuriken,
                  type: 'weapon_buy'
                });
              }, messageID);
            })
            .catch(err => {
              return api.sendMessage(this.getErrorMessage(getText, err), threadID, messageID);
            });
        }).catch(err => {
          return api.sendMessage(this.getErrorMessage(getText, err), threadID, messageID);
        });
    }
  } else {
    if (senderID != author) return;
    const { weapons, userShuriken, shuriken } = handleReply;
    const { money } = await Currencies.getData(senderID);
    var weaponCost = null,
      chosenWeapon = null,
      info = {
        userID: senderID,
        accessToken: global.configModule[this.config.name].userToken
      };

    if (step == 'shuriken') {
      if (chosenIndex > (20 - userShuriken)) return api.sendMessage(getText('invalid_option'), threadID, messageID);
      weaponCost = chosenIndex * shuriken.cost;

      info.weaponID = 6;
      info.amount = chosenIndex;
    } else {
      if (chosenIndex > weapons.length) return api.sendMessage(getText('invalid_option'), threadID, messageID);
      chosenWeapon = weapons[chosenIndex - 1];
      weaponCost = chosenWeapon.cost;

      if (chosenWeapon.id == 6) {
        api.unsendMessage(handleReply.messageID);
        return api.sendMessage(getText("buying_shuriken", (20 - userShuriken)), threadID, (err, info) => {
          if (err) return api.sendMessage(getText('cannot_get_info'), threadID, messageID);
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            type: 'weapon_buy',
            step: 'shuriken',
            author: senderID,
            userShuriken,
            weapons,
            shuriken: chosenWeapon
          });
        }, messageID);
      }

      info.weaponID = chosenWeapon.id;
    }

    if (weaponCost > money) return api.sendMessage(getText('not_enough_money'), threadID, messageID);
    await Currencies.decreaseMoney(senderID, weaponCost);
    post(hunterAPI + '/buy', info)
      .then(async res => {
        try {
          let msg = null;
          api.unsendMessage(handleReply.messageID);
          if (step == 'shuriken') {
            msg = getText('shuriken_bought', chosenIndex, res.data.shuriken.amount);
          } else {
            const weaponImage = (await get(res.data.weapon.image, { responseType: 'stream' })).data;
            msg = {
              body: getText('weapon_bought', res.data.weapon.name, res.data.weapon.power),
              attachment: weaponImage
            };
          }
          return api.sendMessage(msg, threadID, messageID);
        } catch (e) {
          return api.sendMessage(getText('cannot_get_info'), threadID, messageID);
        }
      })
      .catch(async err => {
        await Currencies.increaseMoney(senderID, weaponCost);
        return api.sendMessage(this.getErrorMessage(getText, err), threadID, messageID);
      });
  }
};

module.exports.handleReaction = async function ({ api, event, getText, Currencies, handleReaction }) {
  if (!global.client.hasOwnProperty('hunterDU')) global.client.hunterDU = [];
  const { post } = global.nodemodule['axios'];
  const { threadID, userID, messageID } = event;
  const { hunter, victim } = handleReaction;
  const { userID: hunterID, name: hunterName } = hunter;
  const { userID: victimID, name: victimName } = victim;
  if (userID == hunterID || userID == victimID) {
    if (userID == hunterID) {
      handleReaction.hunterConfirm = !handleReaction.hunterConfirm;
    } else {
      handleReaction.victimConfirm = !handleReaction.victimConfirm;
    }
    if (handleReaction.hunterConfirm && handleReaction.victimConfirm) {
      api.unsendMessage(handleReaction.messageID);
      global.client.hunterDU.splice(global.client.hunterDU.indexOf(messageID), 1);

      const { writeFileSync, createReadStream, unlinkSync } = global.nodemodule['fs'];
      let imagePath = __dirname + `/cache/${Date.now()}_${userID}_hunter.png`;
      let imageBuffer = await this.generatePicture(hunterID, victimID);
      writeFileSync(imagePath, Buffer.from(imageBuffer, 'utf8'));

      return api.sendMessage({
        body: getText('game_start', hunterName, hunterID, victimName, victimID),
        attachment: createReadStream(imagePath)
      }, threadID, () => {
        unlinkSync(imagePath);
        const info = {
          accessToken: global.configModule[this.config.name].userToken,
          hunterID,
          victimID
        };
        post(hunterAPI + '/fight', info)
          .then(async res => {
            await new Promise(resolve => setTimeout(resolve, 3000));
            let msg = '',
              winnerID = '',
              loserID = '';

            const percentMoneyStolen = Math.random() * 0.4 + 0.2;
            const { result } = res.data;
            if (result == 0) {
              msg = getText('hunter_win', Math.floor(percentMoneyStolen * 100));
              winnerID = hunterID;
              loserID = victimID;
            } else {
              msg = getText('victim_win', Math.floor(percentMoneyStolen * 100));
              winnerID = victimID;
              loserID = hunterID;
            }

            const loserMoney = Math.floor((await Currencies.getData(loserID)).money * percentMoneyStolen);
            await Currencies.increaseMoney(winnerID, loserMoney);
            await Currencies.decreaseMoney(loserID, loserMoney);

            return api.sendMessage(msg, threadID);
          })
          .catch(err => {
            return api.sendMessage(this.getErrorMessage(getText, err), threadID);
          });
      });
    }
  }
};

const baseVSImageURL = 'https://i.ibb.co/mc4XjjJ/image-2022-05-06-110732721.png';
module.exports.generatePicture = function (hunterID, victimID) {
  return new Promise(async (resolve, reject) => {
    try {
      const { createCanvas, loadImage } = global.nodemodule['canvas'];
      const { get } = global.nodemodule['axios'];

      const canvas = createCanvas(626, 438);
      const ctx = canvas.getContext('2d');

      const baseImage = await loadImage(baseVSImageURL);

      const hunterAva = await loadImage(`https://graph.facebook.com/${hunterID}/picture?width=144&height=144&access_token=1073911769817594|aa417da57f9e260d1ac1ec4530b417de`);
      const victimAva = await loadImage(`https://graph.facebook.com/${victimID}/picture?width=144&height=144&access_token=1073911769817594|aa417da57f9e260d1ac1ec4530b417de`);

      ctx.drawImage(baseImage, 0, 0);

      ctx.drawImage(hunterAva, 50, 145);
      ctx.drawImage(victimAva, 430, 145);

      resolve(canvas.toBuffer());
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.getErrorMessage = (getText, error) => {
  const errorMessage = error.response ? error.response.data.message : error;
  let msg = '';
  if (errorMessage == 'Invalid Token') msg = getText('invalid_token');
  else if (errorMessage == 'Invalid User ID') msg = getText('user_not_exist');
  else if (errorMessage == 'Already registered') msg = getText('already_registered');
  else msg = getText('cannot_get_info');

  return msg;
};

module.exports.run = async function ({ api, event, getText }) {
  var msg = getText('menu').replace(/\t/g, '');
  try {
    const hunterBannerData = (await global.nodemodule['axios'].get(hunterBanner, { responseType: 'stream' })).data;
    return api.sendMessage({
      body: msg,
      attachment: hunterBannerData
    }, event.threadID, (err, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        type: 'menu'
      });
    });
  } catch (err) {
    return api.sendMessage(this.getErrorMessage(getText, err), event.threadID, event.messageID);
  }
};
