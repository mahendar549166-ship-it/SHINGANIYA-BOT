const axios = require("axios");
const fs = require("fs");
const ytdl = require('@distube/ytdl-core');

// Spotify और CapCut लिंक्स के लिए रेगुलर एक्सप्रेशन
const regexSpotify = /https:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]+(\?si=[a-zA-Z0-9]+)?/g;
const regexZingMP3 = /https:\/\/zingmp3\.vn\/bai-hat\/[A-Za-z0-9\-]+\/[A-Za-z0-9]+\.html/g;
const regexCapCut = /https:\/\/www\.capcut\.com\/(t|template-detail|video|clip)\/[a-zA-Z0-9\-\_]+/g;

module.exports = class {
  static config = {
    name: "atdytb",
    version: "1000.0.0",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "YouTube, Facebook, TikTok, Pinterest, CapCut से वीडियो और SoundCloud से ऑडियो डाउनलोड करें",
    commandCategory: "उपयोगिता",
    usages: "",
    cooldowns: 5
  }

  static run() {}

  // URL की जाँच करें कि यह https:// से शुरू होता है या नहीं
  static check_url(url) {
    return /^https:\/\//.test(url);
  }

  // URL से स्ट्रीम डाउनलोड करें और अस्थायी फ़ाइल बनाएँ
  static async streamURL(url, type) {
    const path = __dirname + `/cache/${Date.now()}.${type}`;
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    fs.writeFileSync(path, res.data);
    setTimeout(() => fs.unlinkSync(path), 1000 * 60);
    return fs.createReadStream(path);
  }

  // सेकंड को HMS (घंटे:मिनट:सेकंड) प्रारूप में बदलें
  static convertHMS(value) {
    const sec = parseInt(value, 10);
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = sec - (hours * 3600) - (minutes * 60);
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return (hours !== '00' ? hours + ':' : '') + minutes + ':' + seconds;
  }

  // प्रकाशन तिथि को प्रारूपित करें
  static formatPublishDate(publishDate) {
    const dateObj = new Date(publishDate);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds().toString().padStart(2, '0');
    
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHour = (hours % 12 || 12).toString().padStart(2, '0');

    return `${day}/${month}/${year} || ${formattedHour}:${minutes}:${seconds} ${ampm}`;
  }

  static async handleEvent(o) {
    const { threadID: t, messageID: m, body: b } = o.event;
    const send = msg => o.api.sendMessage(msg, t, m);
    const head = t => ` ऑटोडाउन - [ ${t} ]\n──────────────────`;

    // CapCut लिंक्स की जाँच करें
    const capCutUrls = b.match(regexCapCut);
    if (capCutUrls) {
      for (const url of capCutUrls) {
        try {
          const response = await axios.get(`http://sudo.pylex.xyz:10966/media/url?url=${encodeURIComponent(url)}`);
          const data = response.data;

          if (!data.error && data.medias && data.medias.length > 0) {
            // HD गुणवत्ता वाला वीडियो बिना वॉटरमार्क के ढूँढें
            const videoMedia = data.medias.find(media => media.type === "video" && media.quality === "HD No Watermark");

            if (videoMedia) {
              send({
                body: `${head('CAPCUT')}\n⩺ शीर्षक: ${data.title}\n⩺ अवधि: ${data.duration}\n⩺ लेखक: ${data.author}`,
                attachment: await this.streamURL(videoMedia.url, videoMedia.extension)
              });
            } else {
              console.error("CapCut से HD बिना वॉटरमार्क वीडियो नहीं मिला।");
            }
          } else {
            console.error("CapCut से डेटा डाउनलोड नहीं हो सका।");
          }
        } catch (err) {
          console.error("CapCut से सामग्री डाउनलोड करने में त्रुटि:", err);
        }
      }
      return;
    }

    // Zing MP3 लिंक्स की जाँच करें
    if (regexZingMP3.test(b)) {
      const zingMP3Urls = b.match(regexZingMP3);
      for (const url of zingMP3Urls) {
        try {
          const response = await axios.get(`https://subhatde.id.vn/zingmp3?link=${encodeURIComponent(url)}`);
          const data = response.data;
          const title = data.title;
          const artist = data.artist;
          const downloadUrl = data.download_url;

          if (downloadUrl) {
            send({
              body: `${head('ZING MP3')}\n⩺ शीर्षक: ${title} \n⩺ कलाकार: ${artist}`,
              attachment: await this.streamURL(downloadUrl, 'mp3')
            });
          } else {
            console.error("Zing MP3 से डेटा डाउनलोड नहीं हो सका।");
          }
        } catch (err) {
          console.error("Zing MP3 से सामग्री डाउनलोड करने में त्रुटि:", err);
        }
      }
      return;
    }

    // SoundCloud लिंक्स के लिए रेगुलर एक्सप्रेशन
    const regex = /(?:Listen to (.+?) by (.+?) on #SoundCloud\s+)?(https?:\/\/(?:on\.soundcloud\.com|soundcloud\.com|m\.soundcloud\.com)\/[^\s]+)/;
    const match = b.match(regex);

    if (match) {
      const title = match[1]?.trim() || "अज्ञात";
      const artist = match[2]?.trim() || "अज्ञात";
      const url = match[3].trim();

      try {
        const response = await axios.get(`https://j2-2rfa.onrender.com/media/url?url=${encodeURIComponent(url)}&client_id=YOUR_CLIENT_ID`);
        const data = response.data;

        if (!data.error && data.medias && data.medias.length > 0) {
          const audioData = data.medias[0];
          const attachment = await this.streamURL(audioData.url, audioData.extension);

          send({
            body: `${head('SOUNDCLOUD')}\n⩺ शीर्षक: ${title}\n⩺ कलाकार: ${artist}\n⩺ अवधि: ${data.duration}\n`,
            attachment: attachment,
          });
        } else {
          console.error('SoundCloud से डाउनलोड करने के लिए कोई वैध डेटा नहीं मिला।');
        }
      } catch (error) {
        console.error('SoundCloud से ऑडियो डाउनलोड करने में त्रुटि:', error);
      }
      return;
    }

    if (this.check_url(b)) {
      // YouTube लिंक्स की जाँच करें
      if (/(^https:\/\/)((www)\.)?(youtube|youtu|watch)(PP)*\.(com|be)\//.test(b)) {
        ytdl.getInfo(b).then(async info => {
          let detail = info.videoDetails;
          let format = info.formats.find(f => f.qualityLabel && f.qualityLabel.includes('360p') && f.audioBitrate);

          if (format) {
            const publishDate = this.formatPublishDate(detail.publishDate);
            send({
              body: `${head('YOUTUBE')}\n` +
                    `⩺ शीर्षक: ${detail.title}\n` +
                    `⩺ अवधि: ${this.convertHMS(Number(detail.lengthSeconds))}\n` +
                    `⩺ लेखक: ${detail.author.name}\n` +
                    `⩺ प्रकाशन तिथि: ${publishDate}\n` +
                    `⩺ लाइक्स: ${detail.likes || 'उपलब्ध नहीं'}\n` +
                    `⩺ टिप्पणियाँ: ${detail.comments || 'उपलब्ध नहीं'}\n` +
                    `⩺ शेयर: ${detail.shares || 'उपलब्ध नहीं'}`,
              attachment: await this.streamURL(format.url, 'mp4')
            });
          } else {
            console.error('YouTube वीडियो के लिए उपयुक्त प्रारूप नहीं मिला।');
          }
        }).catch(err => console.error('YouTube वीडियो जानकारी डाउनलोड करने में त्रुटि:', err));

      // Spotify लिंक्स की जाँच करें
      } else if (regexSpotify.test(b)) {
        const spotifyUrls = b.match(regexSpotify);
        for (const url of spotifyUrls) {
          try {
            const response = await axios.get(`https://j2-2rfa.onrender.com/media/url?url=${encodeURIComponent(url)}`);
            const data = response.data;

            if (!data.error && data.medias && data.medias.length > 0) {
              const audioMedia = data.medias.find(media => media.type === "audio");
              if (audioMedia) {
                send({
                  body: `${head('SPOTIFY')}\n⩺ शीर्षक: ${data.title}\n⩺ अवधि: ${data.duration}`,
                  attachment: await this.streamURL(audioMedia.url, audioMedia.extension)
                });
              } else {
                console.error("Spotify से वैध ऑडियो फ़ाइल नहीं मिली।");
              }
            } else {
              console.error("Spotify से डेटा डाउनलोड नहीं हो सका।");
            }
          } catch (err) {
            console.error("Spotify से सामग्री डाउनलोड करने में त्रुटि:", err);
          }
        }
        return;

      // Facebook लिंक्स की जाँच करें
      } else if (/^https:\/\/(www\.facebook\.com\/(groups|events|marketplace|watch|share|stories|posts|reel|r|videos|live|gaming)\/|www\.facebook\.com\/[a-zA-Z0-9.]+\/(posts|videos|photos|live|reels)\/|www\.facebook\.com\/share\/v\/[a-zA-Z0-9]+\/|www\.facebook\.com\/permalink\.php\?story_fbid=[0-9]+&id=[0-9]+|www\.facebook\.com\/[a-zA-Z0-9.]+\/?(\?app=fbl)?)/.test(b)) {
        axios.get(`http://sudo.pylex.xyz:10966/media/url?url=${encodeURIComponent(b)}`)
          .then(async res => {
            const data = res.data;

            if (data.error || !data.medias || data.medias.length === 0) {
              console.error('डेटा डाउनलोड नहीं हो सका या कोई वैध डेटा नहीं है।');
              return;
            }

            const uniqueUrls = new Set();
            const attachments = [];

            // URL को सामान्य करें (अनावश्यक क्वेरी हटाएँ)
            const normalizeUrl = (url) => {
              const [baseUrl] = url.split('?');
              return baseUrl;
            };

            // वैध और गैर-दोहराए गए मीडिया को फ़िल्टर करें
            const filteredMedia = data.medias.filter(media => {
              const normalizedUrl = normalizeUrl(media.url);

              if (normalizedUrl === normalizeUrl(data.thumbnail)) return false;
              if (media.type === 'image' && media.url.includes('s80x80')) return false;
              if (uniqueUrls.has(normalizedUrl)) return false;

              uniqueUrls.add(normalizedUrl);
              return true;
            });

            if (filteredMedia.length === 0) {
              console.error('कोई वैध मीडिया भेजने के लिए नहीं है।');
              return;
            }

            // मीडिया डाउनलोड और भेजें
            for (const media of filteredMedia) {
              try {
                const fileExtension = media.extension || (media.type === 'video' ? 'mp4' : 'jpg');
                const attachment = await this.streamURL(media.url, fileExtension);
                attachments.push(attachment);
              } catch (error) {
                console.error(`फ़ाइल डाउनलोड करने में त्रुटि: ${media.url}`, error);
              }
            }

            if (attachments.length > 0) {
              const messageBody = `${head('FACEBOOK')}\n⩺ शीर्षक: ${data.title}\n⩺ स्रोत: ${data.source}`;
              send({ body: messageBody, attachment: attachments });
            } else {
              console.error('कोई फ़ाइल सफलतापूर्वक डाउनलोड नहीं हुई।');
            }
          })
          .catch(err => console.error('Facebook से सामग्री डाउनलोड करने में त्रुटि:', err));

      // Pinterest लिंक्स की जाँच करें
      } else if (/https:\/\/pin\.it\/[a-zA-Z0-9]+/.test(b)) {
        const pinterestUrl = b;
        const apiUrl = `https://pinterestdownloader.io/frontendService/DownloaderService?url=${encodeURIComponent(pinterestUrl)}`;

        axios.get(apiUrl)
          .then(async response => {
            const data = response.data;

            if (data && data.medias && data.medias.length > 0) {
              const message = data.title || 'Pinterest Media';
              const attachments = [];
              let videoFound = false;

              for (const media of data.medias) {
                if (media.videoAvailable && media.extension === 'mp4') {
                  attachments.push(await this.streamURL(media.url, 'mp4'));
                  videoFound = true;
                  break;
                }
              }

              if (videoFound) {
                send({ body: `${head('PINTEREST')}\n⩺ शीर्षक: ${message}`, attachment: attachments });
              } else {
                for (const media of data.medias) {
                  if (media.extension === 'gif') {
                    attachments.push(await this.streamURL(media.url, 'gif'));
                    send({ body: `${head('PINTEREST')}\n⩺ शीर्षक: ${message}`, attachment: attachments });
                    return;
                  } else if (media.extension === 'jpg' || media.extension === 'png') {
                    attachments.push(await this.streamURL(media.url, media.extension));
                    send({ body: `${head('PINTEREST')}\n⩺ शीर्षक: ${message}`, attachment: attachments });
                    return;
                  }
                }
              }

              if (!videoFound && attachments.length === 0) {
                console.error(`${head('PINTEREST')}\n⩺ कोई वैध सामग्री भेजने के लिए नहीं है।`);
              }
            } else {
              console.error('कोई Pinterest डेटा नहीं है।');
            }
          })
          .catch(err => {
            console.error('Pinterest से सामग्री डाउनलोड करने में त्रुटि:', err);
          });

      // TikTok या Douyin लिंक्स की जाँच करें
      } else if (/(^https:\/\/)((vm|vt|www|v|lite)\.)?(tiktok|douyin)\.com\//.test(b)) {
        const json = await this.infoPostTT(b);
        let attachment = [];
        let audioAttachment = null;

        if (json.music_info && json.music_info.play) {
          audioAttachment = await this.streamURL(json.music_info.play, 'mp3');
          send({
            body: `${head('TIKTOK')}\n⩺ लेखक: ${json.author.nickname}\n⩺ शीर्षक: ${json.title}\n\n💿 ऑडियो:`,
            attachment: audioAttachment
          });
        }

        if (json.images && json.images.length > 0) {
          for (const imageUrl of json.images) {
            attachment.push(await this.streamURL(imageUrl, 'png'));
          }
        } else if (json.play) {
          attachment.push(await this.streamURL(json.play, 'mp4'));
        }

        if (attachment.length > 0) {
          send({
            body: `${head('TIKTOK')}\n⩺ लेखक: ${json.author.nickname}\n⩺ URL: https://www.tiktok.com/@${json.author.unique_id}\n⩺ शीर्षक: ${json.title || json.description || 'कोई शीर्षक नहीं'}\n⩺ लाइक्स: ${json.digg_count}\n⩺ टिप्पणियाँ: ${json.comment_count}\n⩺ शेयर: ${json.share_count}\n⩺ डाउनलोड: ${json.download_count}`,
            attachment: attachment
          });
        }

        return;
      }
    }
  }

  // TikTok पोस्ट विवरण प्राप्त करें
  static async infoPostTT(url) {
    return axios({
      method: 'post',
      url: `https://tikwm.com/api/`,
      data: {
        url
      },
      headers: {
        'content-type': 'application/json'
      }
    }).then(res => res.data.data);
  }
}

exports.handleReaction = async function ({ api, event, Threads, handleReaction }) {
  // रिएक्शन हैंडलिंग कोड हटाया गया
};
