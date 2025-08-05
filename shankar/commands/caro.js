module.exports.config = {
    name: 'caro',
    version: '1.0.0',
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: '2 logon ke liye 5x5 caro khel',
    commandCategory: 'Game',
    usages: '@tag',
    cooldowns: 5,
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "canvas": "",
      "jimp": "",
      "node-superfetch": ""
    }
};

module.exports.handleReply = async ({ handleReply, event, api, Users }) => {
  function delay(ms) {
       return new Promise(resolve => setTimeout(resolve, ms));
  };
  var {x, y, d, d1, sizeboard, sectionSize, boardbuffer} = handleReply;
    var { threadID, senderID, messageID, body } = event;
    const chalk = global.nodemodule["chalk"];
    var args   = body.split(' ');
    if(!args[1]) return api.sendMessage("Aapne Y toado nahi dala", threadID, messageID);
    var toadoX = parseInt(args[0]),
        toadoY = parseInt(args[1]);
          //check error coordinates
          if(toadoX == NaN || toadoY == NaN) return api.sendMessage("Toado X ya Y sahi nahi hai", threadID, messageID);
          if(toadoX > sizeboard) return api.sendMessage("Toado X ban ke o se bada nahi ho sakta", threadID, messageID);
          if(toadoY > sizeboard) return api.sendMessage("Toado Y ban ke o se bada nahi ho sakta", threadID, messageID);
      //get game data
    var gameint  = global.game[threadID];
    var luot     = gameint.ditruoc;
    var luotuser = gameint.luot[senderID];
    //===========
    if (global.game[threadID].toadogame.includes(toadoX.toString() + toadoY)) return api.sendMessage('Yeh sthaan pehle se chinhit hai', threadID, messageID);

var _0xb4b2=["\x6C\x75\x6F\x74","\x6B\x65\x79\x73","\x66\x69\x6C\x74\x65\x72","\x6E\x61\x6D\x65","\x67\x65\x74\x44\x61\x74\x61"];var arrluot=Object[_0xb4b2[1]](gameint[_0xb4b2[0]]);var iddoithu=parseInt(arrluot[_0xb4b2[2]]((_0xd327x3)=>{return _0xd327x3!= senderID}));var namedoithu=( await Users[_0xb4b2[4]](iddoithu))[_0xb4b2[3]]
    //=============Check turn===========//
    if (luotuser != luot) {
      return api.sendMessage({body: 'Abhi aapki baari nahi hai!! Is baari ka turn hai '+namedoithu, mentions: [{tag: namedoithu,id: iddoithu}]}, threadID, messageID);
    };
    if (luot == 0) {
        global.game[threadID].ditruoc = 1;
        var quanco = 'X';
        var linkCo = 'https://i.ibb.co/ByyrhMs/Xpng.png';
    };
    if (luot == 1) {
        global.game[threadID].ditruoc = 0;
        var quanco = 'O';
        var linkCo = 'https://i.ibb.co/FgtkNM9/Opng.png';
    };
    
  //d thứ [x+y][x]
  //X = 4, Y = 2;
  //set piece into data to check WIN;
  //==============PUSH DATA===========//
  if(toadoY > toadoX) var soptu = toadoY-toadoX;
  else var soptu = toadoX-toadoY;
  var soo = sizeboard - 1;//number of cells
    x[toadoY][toadoX]               = quanco;
    y[toadoX][toadoY]               = quanco;
    d[toadoX +toadoY][toadoX]       = quanco;
    d1[soo-soptu][toadoX]           = quanco;
    //===============declare==============
    const Canvas = global.nodemodule["canvas"];
    const fs = global.nodemodule["fs-extra"];
    var path1 = __dirname+'/cache/caro1'+threadID+'.png';
    var path2 = __dirname+'/cache/caro2'+threadID+'.png';
    //===========CANVAS============//
    //redraw boardgame then draw on background
    const boardgame = await Canvas.loadImage(boardbuffer);//board from handleReply
    var xboard = boardgame.width,
        yboard = boardgame.height;
    const canvas = Canvas.createCanvas(xboard, yboard);
    let ctx = canvas.getContext('2d');
    ctx.drawImage(boardgame, 0, 0, xboard, yboard);
    var quanCo = await Canvas.loadImage(linkCo);//load piece image
    ctx.drawImage(quanCo, toadoX * sectionSize, toadoY * sectionSize, sectionSize, sectionSize);
    var boardbuffer = canvas.toBuffer();//draw board game
    //=============BACKGROUND================
    const background = await Canvas.loadImage(path2);
    var xbground = background.width,
        ybground = background.height;
    const canvasbg = Canvas.createCanvas(xbground, ybground);
    const ctxx = canvasbg.getContext('2d');
    ctxx.drawImage(background, 0, 0, xbground, ybground);
    const board = await Canvas.loadImage(boardbuffer);
    ctxx.drawImage(board, (xbground-880)/2, 320, 880, 880);
    //==============================
    global.game[threadID].toadogame.push(toadoX.toString() + toadoY);
    //=========FUNCTION CHECK WIN??===========
  function checkWin(x, y, d, d1, toadoX, toadoY, quanco, sizeboard, sectionSize) {
    var dem = 0;
    //============CHECK X=============
    for (let X of x[toadoY]) {
        if(X == quanco) {
          dem++;
        } else {
          dem = 0;
        }
        if (dem == 5) {
          return {
            WIN: true
          }
        }
    };
    dem = 0;
    //============CHECK Y============
    for (let Y of y[toadoX]) {
        if (Y == quanco) {
            dem++;
        } else { 
            dem = 0;
        }
        if (dem == 5) {
          return {
            WIN: true
          }
        }
    }
    //============CHECK D============
    dem = 0;
    for (let D of d[toadoX+toadoY]) {
        if (D == quanco) {
            dem++;
        } else {
            dem = 0;
        }
        if (dem == 5) {
          return {
            WIN: true
          }
        };
    };
  //==============CHECK D1===========
    dem = 0;
    var soo = sizeboard-1;
    if(toadoY > toadoX) {var soptu = toadoY-toadoX;}
    else {var soptu = toadoX-toadoY;};
    for (let D1 of d1[soo-soptu]) {
        if (D1 == quanco) {
            dem++;
        } else {dem = 0;}
        if(dem == 5) {
          return {
            WIN: true
          }
        }
    };
    return {WIN: false};
  };
  
 var _0xfb59=["\x6E\x61\x6D\x65","\x67\x65\x74\x44\x61\x74\x61"];var myname=( await Users[_0xfb59[1]](senderID))[_0xfb59[0]]
  //==========CHECK WIN OR NOT==============//
  var CHECKWIN = checkWin(x, y, d, d1, toadoX, toadoY, quanco, sizeboard, sectionSize);
  if(CHECKWIN.WIN == true) {
    fs.writeFileSync(path2, canvasbg.toBuffer());
      api.unsendMessage(handleReply.messageID, () => {
        api.sendMessage({
          body: "Aap jeet gaye 🥳🥳 "+myname,
          attachment: fs.createReadStream(path2),
          mentions: [{
            tag: myname,
            id: senderID
          }]
        }, threadID, messageID);
      });
    return global.game[threadID] = {};
  };
  fs.writeFileSync(path2, canvasbg.toBuffer());
  api.unsendMessage(handleReply.messageID, () => {
    api.sendMessage({body: 'Is sandesh ka jawab X Y toado ke saath dein, jaise:\n1 5\nAgla turn hai '+namedoithu, attachment: fs.createReadStream(path2), mentions: [{
      tag: namedoithu,
      id: iddoithu
    }]},threadID, (e, info) => {
            client.handleReply.push({
                name: this.config.name,
                author: senderID,
                messageID: info.messageID,
                x: x,
                y: y,
                d: d,
                d1: d1,
                sizeboard: sizeboard,
                sectionSize: sectionSize,
                boardbuffer: boardbuffer
            });
        },messageID);
  })
};

module.exports.run = async ({ event, api, args }) => {
    var { threadID, senderID, messageID } = event;
    if (!global.game) {
        global.game = {};
    };
    if (!global.game[threadID]) {
        global.game[threadID] = {};
    };
    if(args[0] == "clear"){
      var author = global.game[threadID].author;
      if(!author) return api.sendMessage('Aapke group mein koi ban nahi bana hai', threadID, messageID);
      if (senderID != author) return api.sendMessage('Sirf ban banane wala '+author+' is ban ko khatam kar sakta hai', threadID, messageID);
      global.game[threadID] = {};
      return api.sendMessage('Caro ban mita diya gaya!!', threadID, messageID);
    }
    
    if (global.game[threadID].author) {
        return api.sendMessage('Is group mein pehle se ek ban bana hai, ise khatam karne ke liye "$caro clear" likhein', threadID, messageID);
    };
    var player2 = Object.keys(event.mentions)[0];
    if(!player2) return api.sendMessage("Saath khelne wale dost ko tag karna zaroori hai!!", event.threadID, event.messageID);
    global.game[threadID] = {
        luot: {
            [senderID]: 1,
            [player2]: 0
        },
        toadogame: [],
        ditruoc: 1,
        author: senderID
    };
    /**/
    //CREATE BOARD GAME
    var kytu = "@";
    var x = [], y = [], d = [], d1 = [];
    var size = 16;
    //Create horizon and Column ( X and Y )
    for (let i = 0; i < size; i++) {
        x[i] = [];
        y[i] = [];
        for(let j = 0; j < size; j++) {
          x[i][j] = kytu;
          y[i][j] = kytu;
        }
    }
    //Create diagonal lines
    var auto = '+';
    var so_d = 0;
    var chieudaio = size*2-1;//number of diagonal lines
    for (var i = 0; i < chieudaio; i++) {
        if(auto == '+') so_d++;
        if(auto == "-") so_d--;
        d[i] = [];
        d1[i] = [];
        for(let j = 0; j < so_d; j++) {
          d[i][j] = "@";
          d1[i][j] = "@";
          if(so_d == size) auto = "-";
        };
    };
    //==============================
    const Canvas = global.nodemodule["canvas"];
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    const spf = global.nodemodule["node-superfetch"];
    var path1 = __dirname+'/cache/caro1'+threadID+'.png';
    var path2 = __dirname+'/cache/caro2'+threadID+'.png';
    
    //==============================
    const imgboard = await Canvas.loadImage(
        'https://vn112.com/wp-content/uploads/2018/01/pxsolidwhiteborderedsvg-15161310048lcp4.png');
    var xboard = imgboard.width,
        yboard = imgboard.height;
    const canvas = Canvas.createCanvas(xboard, yboard);
    let ctx = canvas.getContext('2d');
    ctx.drawImage(imgboard, 0, 0, canvas.width, canvas.height);
    var sizeboard = parseInt(16);//number of cells

    // draw boardgame and save
    var sectionSize = xboard/sizeboard; //size of each cell
    //=============draw grid=================
    for (i = 0; i <= sizeboard; i++) {
        for (j = 0; j <= sizeboard; j++) {
            // Horizontal lines
            ctx.moveTo(0, sectionSize * j);
            ctx.lineTo(sectionSize * sizeboard, sectionSize * j);
            ctx.stroke();
            // Vertical lines
            ctx.moveTo(sectionSize * i, 0);
            ctx.lineTo(sectionSize * i, sectionSize * sizeboard);
            ctx.stroke();
        }
    };
    
    const boardbuffer = canvas.toBuffer();
    //draw background and place boardgame on it
    var background = await Canvas.loadImage("https://i.ibb.co/WVgwgtc/0afd2951b10413352a363ea51b4606ac.jpg");
    var xbground = background.width,
        ybground = background.height;
    const canvasbg = Canvas.createCanvas(xbground, ybground);
    let ctxx = canvasbg.getContext('2d');
    ctxx.drawImage(background, 0, 0, xbground, ybground);
    //reg font
    ctxx.fillStyle = "#000000";
    ctxx.textAlign = "center";
    if(!fs.existsSync(__dirname+'/cache/bold-font.ttf')) {
      let getfont = (await axios.get("https://drive.google.com/u/0/uc?id=1Kx2hi9VX5X4KjwO1uFR6048fm4dKAMnp&export=download", { responseType: "arraybuffer" })).data;
      fs.writeFileSync(__dirname+'/cache/bold-font.ttf', Buffer.from(getfont, "utf-8"));
    };
    Canvas.registerFont(__dirname+'/cache/bold-font.ttf', {
        family: "caro",
        weight: "regular",
        style: "normal"
    });
    ctxx.font = "bold 36px caro";
    //draw board on background
    var boardCv = await Canvas.loadImage(boardbuffer);
    ctxx.drawImage(boardCv, (xbground-880)/2, 320, 880, 880);
    console.log((xbground-880)/2);
    //draw coordinates
    for(let i = 0; i < 16; i++) {
      ctxx.fillText(i, (xbground-880)/2+i*(880/16)+27.5, 310);
      ctxx.fillText(i, (xbground-880)/2-30, 330+i*(880/16)+27.5)
    }
    //
    try{
    var avt1 = (await spf.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;
    var avt2 = (await spf.get(`https://graph.facebook.com/${player2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;
    ctxx.drawImage(await Canvas.loadImage(avt1), xbground/2-100-200, (320-200)/2, 200, 200);
    ctxx.drawImage(await Canvas.loadImage(avt2), xbground/2+100    , (320-200)/2, 200, 200);
    }
    catch(e) {};
    var VS = (await spf.get("https://i.ibb.co/RQjPz7f/1624961650011.png")).body;
    var logoVS = await Canvas.loadImage(VS);
    ctxx.drawImage(logoVS, xbground/2-200/2, (320-200)/2, 200, 200);
    fs.writeFileSync(path2, canvasbg.toBuffer());
    api.sendMessage({body: "Caro khel safalta se shuru ho gaya, aap pehle chalte hain, is sandesh ka jawab X Y toado ke saath dein, jaise:\n1 5", attachment: fs.createReadStream(path2)}, threadID, (e, info) => {
            client.handleReply.push({
                name: this.config.name,
                author: senderID,
                messageID: info.messageID,
                x: x,
                y: y,
                d: d,
                d1: d1,
                sizeboard: sizeboard,
                sectionSize: sectionSize,
                boardbuffer: boardbuffer
            });
        }
    );
};
