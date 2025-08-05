module.exports.config = {
    name: "family",
    version: "1.0.1",
    hasPermission: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Group ke sabhi members ka combined photo banata hai",
    commandCategory: "Group",
    usages: "<size> [#color code] ya family <size>\nAvatar size aur text color set karne ke liye syntax:\n$family <size> <color code> <title>\nJisme:\n•size: Har member ka avatar size\n•color code: Hex color code\n•title: Photo ka title, default group name hoga\nExample: $family 200 #ffffff Hum ek parivaar\nAgar size = 0 choose karein to auto adjust hoga, agar title na likhein to group name use hoga",
    cooldowns: 5,
    dependencies: {
      "fs-extra": "", 
      "axios":"", 
      "canvas": "", 
      "jimp": "", 
      "node-superfetch": "",
      "chalk": ""
    }
};

module.exports.run = async ({ event, api, args }) => {
  var TOKEN = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
  try {
    if(global.client.family == true) return api.sendMessage("System dusre group ke request ko process kar raha hai, thodi der baad try karein", event.threadID, event.messageID);
    global.client.family = true;
	  var timestart = Date.now();
	  const fs = global.nodemodule["fs-extra"];
	  const axios = global.nodemodule["axios"];
	  const { threadID, messageID } = event;
	  const request = global.nodemodule["request"];
	  const superfetch=global.nodemodule["node-superfetch"];
	  if(!fs.existsSync(__dirname+'/cache/fontfamily.ttf')) {
	    let getfont = (await axios.get(`https://drive.google.com/u/0/uc?id=1Z_EWBv9i3iBx9Qu2snkaaZ-7M9qXiGmx&export=download`, { responseType: "arraybuffer" })).data;
       fs.writeFileSync(__dirname+"/cache/fontfamily.ttf", Buffer.from(getfont, "utf-8"));
	  };
	  
	  if(!args[0] || isNaN(args[0]) == true || args[0] == "help") {
	    if(!fs.existsSync(__dirname+"/cache/hexcolor.png")) {
	     let getimg = (await axios.get(`https://www.htlvietnam.com/images/bai-viet/code-mau/bang-ma-mau-02.jpg`, { responseType: "arraybuffer" })).data;
       fs.writeFileSync(__dirname+"/cache/hexcolor.png", Buffer.from(getimg, "utf-8"));
	    }
	    global.client.family = false;
		return api.sendMessage({body: "Avatar size aur text color set karne ke liye syntax:\n$family <size> <color code> <title>\nJisme:\n•size: Har member ka avatar size\n•color code: Hex color code\n•title: Photo ka title, default group name hoga\nExample: $family 200 #ffffff Hum ek parivaar\nAgar size = 0 choose karein to auto adjust hoga, agar title na likhein to group name use hoga",
		attachment: fs.createReadStream(__dirname+"/cache/hexcolor.png")}, threadID, messageID);
	  };
    
    const jimp = global.nodemodule["jimp"];
    const chalk = global.nodemodule["chalk"];
    const Canvas = global.nodemodule["canvas"];
  

    var threadInfo = await api.getThreadInfo(threadID);
    var arrob = threadInfo.adminIDs;
    var arrad = [];
    for(let qtv of arrob) {
      arrad.push(qtv.id)
    };
    const background = await Canvas.loadImage("https://i.imgur.com/5AaxqG6.jpg");
    
    var idtv = threadInfo.participantIDs;
  
    var xbground = background.width,
        ybground = background.height;

    var dem = 1;
    var tds = 200,
        s = parseInt(args[0]);//size
        //AUTO SIZE
    var mode = "";
    if(s == 0) {
      var dtich = xbground*(ybground-tds);
      var dtichtv = Math.floor(dtich/idtv.length);
      var s = Math.floor(Math.sqrt(dtichtv));
      mode += " (Auto size)"
    };
        //===============================
    var l = parseInt(s/15),//lines
        x = parseInt(l),//
        y = parseInt(tds),//
        xcrop = parseInt(idtv.length*s),
        ycrop = parseInt(tds+s);
        console.log(s);
    s = s-l*2;
    //===============================
    
    var color = args[1];
    if(!color || !color.includes("#")) {
      color = "#000000";
      autocolor = true;
    };
        if(s > ybground || s > xbground) {
          global.client.family = false;
          return api.sendMessage(`Avatar size background se chhota hona chahiye\nBackground size: X: ${xbground}, Y: ${ybground}`, threadID, messageID);
        }
        api.sendMessage(`💚 Estimated photos: ${idtv.length}\n💜 Background size: ${xbground} x ${ybground}\n❤️ Each avatar size: ${s}${mode}\n🧡 Color: ${color}\n❤️‍🔥Bot aapka request process kar raha hai, 5 minutes lagega...`,threadID, messageID);
    var loadkhung = await Canvas.loadImage("https://i.ibb.co/sqJwkY9/neon-frame-transparent-background-16-700x700-1.png");
    var title = args.slice(2).join(" ") || threadInfo.name;
    var path_alltv = __dirname+`/cache/alltv${threadID}${Date.now()}.png`;
    function delay(ms) {
       return new Promise(resolve => setTimeout(resolve, ms));
    };
    const canvas = Canvas.createCanvas(xbground, ybground);
    let ctx = canvas.getContext('2d');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    var ngdung = 0;// count dead accounts
    //======FOR LOOP DRAW AVATAR=====//
    
    for(let id of idtv) {
      console.log(dem, chalk.green("FAMILY: ")+"Drawing avatar for id "+id);
        try {
        	var avatar = await superfetch.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=${TOKEN}`);
        	if(avatar.url.includes(".gif")) {throw Error};
        }
        catch(e) {
            ngdung += 1;
            continue; 
        };

        if(x+s > xbground) {
          xcrop = x;
        	x += (-x)+l;
        	y += s+l;
        	ycrop += s+l;
        };
        
        if(ycrop > ybground) {
          ycrop += (-s);
          break;
        }; 
      
        avatar = avatar.body;
        const img = new Canvas.Image();
        var avatarload = await Canvas.loadImage(avatar);
        img.src = avatarload;

        ctx.drawImage(avatarload, x, y, s, s);

        if(arrad.includes(id)) {
        ctx.drawImage(loadkhung, x, y, s, s);
        };
        console.log(chalk.green("Family: ")+"Drawn avatar for id "+id);
        dem++;
        img.onerror = err => { throw err };
        x += parseInt(s+l);
    };
   Canvas.registerFont(__dirname+"/cache/fontfamily.ttf", {
        family: "Manrope"
    });
    ctx.font = "100px Manrope";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(title, xcrop/2, 133);
    
    console.log(chalk.yellow("Converting to buffer..."));
    console.log(chalk.blue(`Success X: ${xcrop}, Y: ${ycrop}`));
    try{
      const imagecut = await jimp.read(canvas.toBuffer());
      console.log("Image read", xcrop, ycrop);
      //=========== CUT IMAGE ===========//
      imagecut.crop(0, 0, xcrop, ycrop+l-30).writeAsync(path_alltv);
      console.log("Image cropped and saved to cache");
      await delay(200);
       api.sendMessage({body: `🍓 Total photos: ${dem} (Filtered ${ngdung} Dead accounts)\n🍇 Background size: ${xbground} x ${ybground}\n🍊 Each avatar size: ${s}${mode}\n🍩 Processing time: ${Math.floor((Date.now()-timestart)/1000)} seconds`,
          attachment: fs.createReadStream(path_alltv, { 'highWaterMark': 128 * 1024 })
       }, threadID, (e, info) => {
         if(e) {
            api.sendMessage("Error aaya hai, baad mein try karein", threadID, messageID);
         };
         fs.unlinkSync(path_alltv);
       }, messageID);
       global.client.family = false
    }
    catch(e) {
      console.log(e.stack);
      fs.writeFileSync(path_alltv, canvas.toBuffer());
       api.sendMessage({
        body: `Auto cut mein error aaya\n🍓 Total photos: ${dem} (Filtered ${ngdung} Dead accounts)\n🍇 Background size: ${xbground} x ${ybground}\n🍊 Each avatar size: ${s}${mode}\n🍩 Processing time: ${Math.floor((Date.now()-timestart)/1000)} seconds`,
            attachment: fs.createReadStream(path_alltv, { 'highWaterMark': 128 * 1024 })
         }, threadID, (e, info) => {
           if(e) {
              api.sendMessage("Error aaya hai, baad mein try karein", threadID, messageID);
           };
           fs.unlinkSync(path_alltv);
         }, messageID);
         global.client.family = false;
    }
  }
  catch(e) {global.client.family = false};
}
