module.exports.config = {
  name: 'locmem',
  version: '1.0.0',
  hasPermssion: 1,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: 'Group mein inactive members ko filter karta hai',
  commandCategory: 'Utility',
  usages: 'filter [num]',
  cooldowns: 5,
  info: [
    {
      key: 'locmem',
      prompt: 'Minimum tin nhắn ki sankhya | default = 0',
      type: 'number',
      example: 'filter 1',
    },
    {
      key: 'note',
      prompt: 'Module rankup ko delete na karein, warna pura group crash ho sakta hai =))',
      type: '',
      example: '',
    },
  ],
}

const _0x2565 = [
  '1021697XivoWr',
  'messageID',
  'nfo',
  'exp',
  'name',
  'undefined',
  '12344CQNmYu',
  'log',
  '16dtAcoD',
  'saphal ',
  '159902EDwOfu',
  ' upyog kar sakte ',
  '1hYLyAR',
  'sendMessag',
  '3092hIEygj',
  'exports',
  ' is command ka ',
  '15GnEYwM',
  'adminIDs',
  'length',
  ' admin ',
  'getCurrent',
  'message',
  'Filter asaphal ',
  'ke liye admin ',
  ' filter ',
  ' filter kar raha...',
  '529813NpzzDE',
  ' members ',
  'threadID',
  '32245uOElwc',
  '25123mXLvNw',
  ' ke sath level ',
  '16nKNcMJ',
  'some',
  'Abhi ',
  'Bot ko ',
  'push',
  ' Shuru kar raha hai ',
  ' messages.',
  ' members ko filter kar raha hai ',
  'map',
  'userInfo',
  'getData',
  'FromGroup',
  'removeUser',
  'getThreadI',
  'Koi bhi ',
  'filter ke liye ',
  'nahi.',
]

const _0xefe468 = function (_0x5e2f71, _0x124fa8) {
  return _0x42da(_0x5e2f71 - -56, _0x124fa8)
}

function _0x42da(_0x344e04, _0x599ea3) {
  _0x344e04 = _0x344e04 - 379
  let _0x2565bc = _0x2565[_0x344e04]
  return _0x2565bc
}

;(function (_0x16035e, _0x4e5190) {
  const _0x58bf8c = function (_0x1fec6d, _0x2d9c5d) {
    return _0x42da(_0x2d9c5d - 983, _0x1fec6d)
  }
  while (true) {
    try {
      const _0x53ac24 =
        -parseInt(_0x58bf8c(1396, 1410)) * parseInt(_0x58bf8c(1379, 1366)) +
        -parseInt(_0x58bf8c(1392, 1369)) * -parseInt(_0x58bf8c(1377, 1382)) +
        -parseInt(_0x58bf8c(1386, 1408)) +
        -parseInt(_0x58bf8c(1371, 1379)) +
        -parseInt(_0x58bf8c(1391, 1385)) * parseInt(_0x58bf8c(1390, 1383)) +
        -parseInt(_0x58bf8c(1362, 1362)) +
        parseInt(_0x58bf8c(1414, 1402)) * parseInt(_0x58bf8c(1349, 1364))
      if (_0x53ac24 === _0x4e5190) {
        break
      } else {
        _0x16035e.push(_0x16035e.shift())
      }
    } catch (_0x19b515) {
      _0x16035e.push(_0x16035e.shift())
    }
  }
})(_0x2565, 351873)

module[_0xefe468(328, 334)].run = async function ({
  api: _0x26732c,
  event: _0x2e3fa6,
  args: _0x551521,
  client: _0x3f749a,
  Threads: _0x374f99,
  Currencies: _0x4ed1a9,
}) {
  const _0x7f564c = function (_0x1883eb, _0x4aeb8d) {
    return _0xefe468(_0x1883eb - -975, _0x4aeb8d)
  }
  var _0x23a5b2 = await _0x26732c[
    _0x7f564c(-616, -634) + _0x7f564c(-610, -598)
  ](_0x2e3fa6[_0x7f564c(-633, -640)])
  let _0x563b97 = [],
    _0x48ff72,
    _0x491fbb = 0,
    _0x2a7100 = 0,
    _0x528498 = 0
  if (!isNaN(_0x551521[0])) {
    _0x48ff72 = _0x551521[0]
  } else {
    _0x48ff72 = 0
  }
  if (
    !_0x23a5b2[_0x7f564c(-644, -652)]
      [_0x7f564c(-621, -646)]((_0x1366cc) => _0x1366cc.id)
      [_0x7f564c(-628, -649)](
        (_0x3c427b) =>
          _0x3c427b == _0x26732c[_0x7f564c(-641, -616) + 'UserID']()
      )
  ) {
    return _0x26732c.sendMessage(
      _0x7f564c(-626, -635) +
        _0x7f564c(-642, -630) +
        _0x7f564c(-638, -639) +
        _0x7f564c(-651, -640) +
        _0x7f564c(-646, -622) +
        ' sakta.',
      _0x2e3fa6[_0x7f564c(-633, -626)],
      _0x2e3fa6[_0x7f564c(-611, -614)]
    )
  }
  for (const _0x149869 of _0x23a5b2[_0x7f564c(-620, -595)]) {
    const _0x142ce8 = await _0x4ed1a9[_0x7f564c(-619, -643)](_0x149869.id)
    if (
      typeof _0x142ce8[_0x7f564c(-609, -601)] == _0x7f564c(-607, -599) ||
      _0x142ce8[_0x7f564c(-609, -584)] <= _0x48ff72
    ) {
      _0x563b97[_0x7f564c(-625, -641)](_0x149869.id)
    }
  }
  _0x563b97 = _0x563b97.filter(
    (_0x375604) =>
      !_0x23a5b2[_0x7f564c(-644, -649)]
        [_0x7f564c(-621, -619)]((_0x3aafe9) => _0x3aafe9.id)
        [_0x7f564c(-628, -613)]((_0x30fd2e) => _0x30fd2e == _0x375604)
  )
  if (_0x563b97.length != 0) {
    _0x26732c[_0x7f564c(-649, -625) + 'e'](
      _0x7f564c(-627, -611) +
        ' hai ' +
        _0x563b97[_0x7f564c(-643, -656)].toString() +
        (_0x7f564c(-630, -621) + _0x7f564c(-637, -630)) +
        _0x48ff72 +
        (_0x7f564c(-624, -643) + _0x7f564c(-636, -638)),
      _0x2e3fa6.threadID,
      async () => {
        const _0x3ef6aa = function (_0x487884, _0x5b504a) {
          return _0x7f564c(_0x487884 - -806, _0x5b504a)
        }
        for (const _0x53b987 of _0x563b97) {
          try {
            await new Promise((_0x5c190b) => setTimeout(_0x5c190b, 1000))
            await _0x26732c[_0x3ef6aa(-1423, -1439) + _0x3ef6aa(-1424, -1408)](
              parseInt(_0x53b987),
              _0x2e3fa6.threadID
            )
            _0x491fbb++
          } catch (_0x33c25d) {
            console[_0x3ef6aa(-1411, -1404)](
              _0x33c25d[_0x3ef6aa(-1414, -1429)] +
                ': ' +
                _0x33c25d[_0x3ef6aa(-1446, -1439)]
            )
            _0x2a7100++
          }
          _0x528498++
        }
        if (_0x528498 == _0x563b97.length) {
          return _0x26732c.sendMessage(
            'Filter saphal ho gaya ' +
              _0x3ef6aa(-1409, -1391) +
              _0x491fbb +
              (_0x3ef6aa(-1440, -1447) + _0x3ef6aa(-1419, -1404)),
            _0x2e3fa6[_0x3ef6aa(-1439, -1451)],
            () =>
              _0x2a7100 == 0
                ? ''
                : _0x26732c.sendMessage(
                    _0x3ef6aa(-1445, -1428) +
                      ' hua ' +
                      _0x2a7100 +
                      (_0x3ef6aa(-1440, -1465) + _0x3ef6aa(-1419, -1443)),
                    _0x2e3fa6[_0x3ef6aa(-1439, -1437)]
                  )
          )
        }
      },
      _0x2e3fa6[_0x7f564c(-611, -629)]
    )
  } else {
    return _0x26732c.sendMessage(
      _0x7f564c(-615, -593) +
        _0x7f564c(-622, -609) +
        ' member nahi hai jo ' +
        _0x7f564c(-614, -612) +
        _0x48ff72 +
        (_0x7f564c(-623, -603) + '.'),
      _0x2e3fa6[_0x7f564c(-633, -646)],
      _0x2e3fa6.messageID
    )
  }
}
