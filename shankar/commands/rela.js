module.exports.config = {
	name: "rela",
	version: "1.1.0",
	hasPermssion: 0,
	credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
	description: "1: Command ke sath tag karein\n2: Command ke sath info ya fake likhein\n\nInfo credit jaise jankari dekhne ke liye\nFake jankari ke sath fake banner banane ke liye",
	commandCategory: "Game",
	usages: "[mention] | [info] | [fake]"
};

module.exports.languages = {"vi": {}}

//Package ko read karna
const fs = require("fs-extra");
const { loadImage, createCanvas, registerFont, Canvas} = require("canvas");

//Quick setup
var D = __dirname + "/cache/rela/"; //Output file path
var expole = D + "rela.png", //Image output file
    bg     = D + "bg.png", //Background image file ko read karna
    dicon  = D + "icon.png", //Heart icon image file ko read karna
    font   = D + "AmaticSC.ttf"; //Font file ko read karna

//File links
var token = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662", //FB token
    bglink = "https://blogger.googleusercontent.com/img/a/AVvXsEgiT494Po7Onhcft4jFS2cTSb2-7wbRYaoCCGFH09X53RtuI3YABGgYfMJsCAmsDs8hfpMU2k28PKwImiP6Go9LiOquM0CYR4bEgzH8yXIfsJ8CJHdnRcogIOef0tgdzIjTBsGROv-12T60AI2njz0p_N9ipS5T4_KMatV8Erl6GYJ6PLou2HeIRWrA=s1278",
    iconlink = "https://blogger.googleusercontent.com/img/a/AVvXsEgQpVe6Q9RLyMZolNU3K7PqmAyKbIz53aIcAux5P9X7gbXydjEbkbZSKHxiwTLrY_XmgSeJJgrTi8-jh6g8RuWvq8h4mfQOA470attJaNuHWI9AP28SVUiTF8gaggPUeeQ4zq7OT5kgO4qvQsloqIVxJue7cFZmDwaxHNI8UVHqxrCsA_BXwvEYskq9=s45",
    fontlink = "https://drive.google.com/u/0/uc?id=1ZzgC7nyGaBw-zP3V2GKK0azoFgF5aXup&export=download";

//onload (leak by aesn)
module.exports.onLoad = async() => {
  const { resolve } = global.nodemodule["path"];
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { downloadFile } = global.utils;
  if (!existsSync(D)) mkdirSync(D, { recursive: true });
  if (!existsSync(bg)) await downloadFile(bglink, resolve(bg));
  if (!existsSync(dicon)) await downloadFile(iconlink, resolve(dicon));
  if (!existsSync(font)) await downloadFile(fontlink, resolve(font));
}

//Data array
var data = [
  "Kismat mein judaai likhi hai...",
  "Thodi si kismat, lekin koshish jari rakhein!",
  "3 hissa kismat, 7 hissa mehnat",
  "Is rishte ke safal hone ka chance thoda kam hai! Aur koshish karein",
  "Date par jao. Rishta aage badhane ke liye",
  "Zyada baat cheet shuru karein. Aap dono kaafi jachate hain",
  "Kismat par bharosa rakhein, yeh sach mein kaam karta hai!",
  "Bahut jachate hain. Is rishte ka aur khayal rakhein!",
  "Number save kar lo, shaadi mein ek doosre ko bula lena!",
  "Shaadi kar lo, intezaar kyun!"
];

//Shankar ka shuruaat
module.exports.run = async function({ api, event, args, Threads, Users, permssion}) {

//Input image load karne ka function
background = await loadImage(bg);
icon = await loadImage(dicon);

//UID lena
uid = event.senderID;

//////////////////////////////////////////////////////////
var mentions1 = Object.keys(event.mentions);
name1 = await Users.getNameUser(uid);

if(mentions1.length == 0 && !event.messageReply){
  return api.sendMessage(`1: Command ke sath [tag] ya [reply] karein\n2: Command ke sath info ya fake [tag] ya [reply] karein\n\nInfo credit jaise jankari dekhne ke liye\nFake jankari ke sath fake banner banane ke liye\n\n==========\nKripya report karein\nhttps://m.me/bangprocode\nagar koi samasya ho`,event.threadID,event.messageID)
};

//UID2 lena
if(mentions1.length != 0) {
  uid2 = Object.keys(event.mentions)[0];
  console.log(mentions1.length)
}else{ 
  uid2 = event.messageReply.senderID;
}

//Name lena
name2 = await Users.getNameUser(uid2);
  
//////////////////////////////////////////////////////////
  
//Check args (Input check karna)
if(args[0] == "info"){
  return api.sendMessage(`©Code By DVB Developer\n©Design By DVB Design\n\n=============\n- Code support: Nguyễn Thái Hảo\n- Idea: Lê Định\n\n=============\nAgar koi sujhav dena ho toh inbox karein https://m.me/bangprocode`,event.threadID,event.messageID)
}
  
//Check args (Input check karna)
if(args[0] == "fake"){
  
  //Handle reply chalana
  return api.sendMessage(`Apne dil ke number daalein jaise 8|8|8|8|8`, event.threadID, (err, info) => {
      return global.client.handleReply.push({
      type: "create",
      name: this.config.name,
      author: event.senderID,
      messageID: info.messageID
    });
  }, event.messageID);
}

//Random array banane ka function
MissionC = Array.from({length: 5}, () => Math.floor(Math.random() * 8));

//Total calculate karne ka function
var allmath = (MissionC[0]+MissionC[1]+MissionC[2]+MissionC[3]+MissionC[4]) * 2.5;

//Text lene ke liye compare function chalana
var message = sosanh(allmath);
  
//Avatar lene aur activate karne ka function
var getboyavt = await loadImage(await getavt(event.senderID)),
    getgirlavt = await loadImage(await getavt(uid2));

//Render function activate karna (Image banane ka)
var render = await irender(allmath, message, name1, name2, getboyavt, getgirlavt);

//Render ke baad image save karna (Cache mein)
fs.writeFileSync(expole, Buffer.from(render,'utf8'));

//Message jo bheja jayega - customize kar sakte hain
var send = {
  body: "Badhai ho "+name1+" & "+name2+`\n`+ message,
  attachment: fs.createReadStream(expole)
};

//FCA par message bhejne ka function
api.sendMessage(send,event.threadID,event.messageID);
  
};

module.exports.handleReply = async function({ api, event, args, handleReply, client, __GLOBAL, Threads, Users, Currencies }) {
    var info = await api.getUserInfo(event.senderID);
    var nameSender = info[event.senderID].name;
    var arraytag = [];
        arraytag.push({id: event.senderID, tag: nameSender});
    if (handleReply.author != event.senderID) return;
    const {threadID, messageID, senderID } = event;
    switch (handleReply.type) {
    case "create": {
    try{
    var tym = event.body;
    MissionC = tym.split("|");
      
    //Avatar lene ka function
    var getboyavt = await loadImage(await getavt(senderID)),
        getgirlavt = await loadImage(await getavt(uid2));

      
    //Array check karne ka function
    if(MissionC.length != "5"){return api.sendMessage(`Kami, zyada ya galat format, kripya dobara karein`, threadID, messageID)}

    for(var i of MissionC){
      if(i > 8 && i > "8"){
        return api.sendMessage(`8 dil se zyada nahi ho sakta, kripya dobara karein`, threadID, messageID);
      }
    }
    //Total calculate karne ka function
    var allmath = (parseInt(MissionC[0])+parseInt(MissionC[1])+parseInt(MissionC[2])+parseInt(MissionC[3])+parseInt(MissionC[4])) * 2.5;
    }catch(e){
      return api.sendMessage(`Ek error hua hai: ${e}`, threadID, messageID);
    };
    
    //Text lene ke liye compare function chalana
    var message = sosanh(allmath);
      
    //Render function activate karna (Image banane ka)
    var render = await irender(allmath, message, name1, name2, getboyavt, getgirlavt);
    
    //Render ke baad image save karna (Cache mein)
    fs.writeFileSync(expole, Buffer.from(render,'utf8'));
    
    //Message jo bheja jayega - customize kar sakte hain
    var send = {
    body: "Badhai ho "+name1+" & "+name2+`\n`+ message +`\n ${MissionC}`,
    attachment: fs.createReadStream(expole)
    }
      
    //FCA par message bhejne ka function
    api.sendMessage(send, threadID, messageID);

    //Secret =))
    if ((this.config.credits) != "DVB Developer") { return api.sendMessage(`Bhai Bằng ko credit wapas de do :3`, event.threadID, event.messageID)}
}
}
};

////////////////////////////
/// Functions (Kaam) ///
////////////////////////////

//Text compare karne aur output dene ka function
function sosanh(rd) {
  let ss;
  if(rd < 10) {
    ss = data[0];
  }else if(rd < 20){
    ss = data[1];
  }else if(rd < 30){
    ss = data[2];
  }else if(rd < 40){
    ss = data[3];
  }else if(rd < 50){
    ss = data[4];
  }else if(rd < 60){
    ss = data[5];
  }else if(rd < 70){
    ss = data[6];
  }else if(rd < 80){
    ss = data[7];
  }else if(rd < 90){
    ss = data[8];
  }else {
    ss = data[9];
  }
  return ss;
};

//Avatar lene ka function
async function getavt(uid) {
  var axios = require("axios");
  var { data } = await axios.get(`https://graph.facebook.com/v12.0/${uid}/picture?height=240&width=240&access_token=${token}`,{ responseType:"arraybuffer" });
  return data;
};

//Image render karne ka function (Image banane ka)
function irender( tile, msg, boyname, girlname, getboyavt, getgirlavt) {
  registerFont(font, {family: "AmaticSCbold"});
  var canvas = createCanvas(background.width, background.height);
  var ctx = canvas.getContext("2d");

  //2 avatar draw karna
  ctx.drawImage(getboyavt, 114, 581, 98 , 98);
  ctx.drawImage(getgirlavt, 509, 581, 98 , 98);
  ctx.restore();
  ctx.save();

  //Background draw karna (Nen)
  ctx.drawImage(background, 0, 0);
  ctx.font = "150px AmaticSCbold";
  ctx.textAlign = "center";
  ctx.fillStyle = "#FFFFFE";
  ctx.fillText(tile+"%", 360, 340);
  ctx.restore();
  ctx.save();

  //Hearts draw karna aur calculate karna
  var math = 806;
  math -= 50;
  for(var i = 0; i < 5; i+=1) {
    var leftmath = 170;
    math += 50;
    for(var ii = 0; ii < MissionC[i]; ii+=1) {
      leftmath += 55;
      ctx.drawImage(icon, leftmath , math);
    }
  }
  ctx.restore();
  ctx.save();

  //Text draw karna
  ctx.font = "50px AmaticSCbold";
  ctx.textAlign = "center";
  ctx.fillStyle = "#000000";
  ctx.fillText(boyname, 163, 746);
  ctx.fillText(girlname, 557, 746);
  ctx.restore();
  ctx.save();
  
  //Text draw karna
  ctx.font = "45px AmaticSCbold";
  ctx.textAlign = "start";
  ctx.fillStyle = "#000000";
  //Text align karne ka function activate
  const xuongdong = wrapText(ctx, msg, 640);
  ctx.fillText(xuongdong.join("\n"), 60, 1145);
  ctx.restore();
  ctx.save();

  //Image output karna
  return canvas.toBuffer("image/png");
};

//Text adjust aur align karne ka function
function wrapText(ctx, text, max){
  const lines = [];
  if (ctx.measureText(text).width > max){
    const words = text.split(" ");
    let line = "";
    while (words.length > 0) {
      let split = false;
      while (ctx.measureText(words[0]).width >= max) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) words[1] = temp.slice(-1) + words[1];
        else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }
      if (ctx.measureText(line+words[0]).width < max)
        line += words.shift()+" ";
      else {
        lines.push(line.trim());
        line = "";
      }
      if (words.length === 0) lines.push(line.trim());
    }
    }else{
      lines.push(text);
    }
    return lines;
};
