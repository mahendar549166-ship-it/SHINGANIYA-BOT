module.exports.config = {
    name: "setting",
    version: "1.0.0",
    hasPermssion: 3,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Bot ka account set kare!",
    commandCategory: "Admin",
    cooldowns: 5
};

const appState = require("../../fbstate.json");
const cookie = appState.map(item => item = item.key + "=" + item.value).join(";");
const headers = {
    "Host": "mbasic.facebook.com",
    "user-agent": "Mozilla/5.0 (Linux; Android 11; M2101K7BG Build/RP1A.200720.011;) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/97.0.4692.98 Mobile Safari/537.36",
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "navigate",
    "sec-fetch-user": "?1",
    "sec-fetch-dest": "document",
    "referer": "https://mbasic.facebook.com/?refsrc=deprecated&_rdr",
    "accept-encoding": "gzip, deflate",
    "accept-language": "hi-IN,hi;q=0.9,en-US;q=0.8,en;q=0.7",
    "Cookie": cookie
};

module.exports.handleReply = async function({ api, event, handleReply }) {
    const botID = api.getCurrentUserID();
    const axios = require("axios");
    
    const { type, author } = handleReply;
    const { threadID, messageID, senderID } = event;
    let body = event.body || "";
    if (author != senderID) return;
    
    const args = body.split(" ");
    
    const reply = function(msg, callback) {
        if (callback) api.sendMessage(msg, threadID, callback, messageID);
        else api.sendMessage(msg, threadID, messageID);
    };
    
    if (type == 'menu') {
        if (["01", "1", "02", "2"].includes(args[0])) {
            reply(`📌 Is sandesh ka jawab de aur bot ke liye ${["01", "1"].includes(args[0]) ? "bio" : "nickname"} daale ya 'delete' likhe agar ${["01", "1"].includes(args[0]) ? "bio" : "nickname"} hatana ho`, (err, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    type: ["01", "1"].includes(args[0]) ? "changeBio" : "changeNickname"
                });
            });
        }
        else if (["03", "3"].includes(args[0])) {
            const messagePending = await api.getThreadList(500, null, ["PENDING"]);
            const msg = messagePending.reduce((a, b) => a += `» ${b.name} | ${b.threadID} | Sandesh: ${b.snippet}\n`, "");
            return reply(`📌 Bot ke prateeksha mein sandesh ki suchi:\n\n${msg}`);
        }
        else if (["04", "4"].includes(args[0])) {
            const messagePending = await api.getThreadList(500, null, ["unread"]);
            const msg = messagePending.reduce((a, b) => a += `» ${b.name} | ${b.threadID} | Sandesh: ${b.snippet}\n`, "") || "❎ Koi sandesh nahi hai";
            return reply(`📌 Bot ke padhe nahi gaye sandesh ki suchi:\n\n${msg}`);
        }
        else if (["05", "5"].includes(args[0])) {
            const messagePending = await api.getThreadList(500, null, ["OTHER"]);
            const msg = messagePending.reduce((a, b) => a += `» ${b.name} | ${b.threadID} | Sandesh: ${b.snippet}\n`, "") || "❎ Koi sandesh nahi hai";
            return reply(`Bot ke spam sandesh ki suchi:\n\n${msg}`);
        }
        else if (["06", "6"].includes(args[0])) {
            reply(`📌 Is sandesh ka jawab de aur tasveer ya tasveer ka link daale jo bot ka avatar banaya jana hai`, (err, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    type: "changeAvatar"
                });
            });
        }
        else if (["07", "7"].includes(args[0])) {
            if (!args[1] || !["on", "off"].includes(args[1])) return reply('❎ Kripya on ya off chune');
            const form = {
                av: botID,
                variables: JSON.stringify({
                    "0": {
                        is_shielded: args[1] == 'on' ? true : false,
                        actor_id: botID,
                        client_mutation_id: Math.round(Math.random()*19)
                    }
                }),
                doc_id: "1477043292367183"
            };
            api.httpPost("https://www.facebook.com/api/graphql/", form, (err, data) => {
                if (err || JSON.parse(data).errors) reply("❎ Error ho gaya, kripya dobara koshish kare");
                else reply(`✅ Bot ka avatar shield ${args[1] == 'on' ? 'chalu' : 'band'} kar diya gaya`);
            });
        }
        else if (["08", "8"].includes(args[0])) {
            return reply(`📌 Is sandesh ka jawab de aur un logon ke ID daale jinhe messenger par block karna hai, ek se zyada ID space ya new line se alag kare`, (e, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    type: "blockUser"
                });
            });
        }
        else if (["09", "9"].includes(args[0])) {
            return reply(`📌 Is sandesh ka jawab de aur un logon ke ID daale jinhe messenger par unblock karna hai, ek se zyada ID space ya new line se alag kare`, (e, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    type: "unBlockUser"
                });
            });
        }
        else if (["10"].includes(args[0])) {
            return reply(`📌 Is sandesh ka jawab de aur post ke liye content daale`, (e, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    type: "createPost"
                });
            });
        }
        else if (["11"].includes(args[0])) {
            return reply(`📌 Is sandesh ka jawab de aur un post ke ID daale jinhe delete karna hai, ek se zyada ID space ya new line se alag kare`, (e, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    type: "deletePost"
                });
            });
        }
        else if (["12", "13"].includes(args[0])) {
            return reply(`📌 Is sandesh ka jawab de aur postID daale jisme comment karna hai (${args[0] == "12" ? "user ka" : "group par"}), ek se zyada ID space ya new line se alag kare`, (e, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    type: "choiceIdCommentPost",
                    isGroup: args[0] == "12" ? false : true
                });
            });
        }
        else if (["14", "15", "16", "17", "18", "19"].includes(args[0])) {
            reply(`📌 Is sandesh ka jawab de aur ${args[0] == "14" ? "post" : "user"} ke ID daale jisme ${args[0] == "14" ? "reaction dena hai" : args[0] == "15" ? "friend request bhejna hai" : args[0] == "16" ? "friend request accept karna hai" : args[0] == "17" ? "friend request reject karna hai" : args[0] == "18" ? "dost hatana hai" : "sandesh bhejna hai"}, ek se zyada ID space ya new line se alag kare`, (e, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    type: args[0] == "14" ? "choiceIdReactionPost" : args[0] == "15" ? "addFiends" : args[0] == "16" ? "acceptFriendRequest" : args[0] == "17" ? "deleteFriendRequest" : args[0] == "18" ? "unFriends" : "choiceIdSendMessage"
                });
            });
        }
        else if (["20"].includes(args[0])) {
            reply('📌 Is sandesh ka jawab de aur code daale jo note ke roop mein banaya jana hai', (e, info) => {
                global.client.handleReply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    type: "noteCode",
                    isGroup: args[0] == "12" ? false : true
                });
            });
        }
        else if (["21"].includes(args[0])) {
            api.logout((e) => {
                if (e) return reply('❎ Error ho gaya, kripya dobara koshish kare');
                else console.log('✅ LOGOUT SAFAL');
            });
        }
    }
    
    
    else if (type == 'changeBio') {
        const bio = body.toLowerCase() == 'delete' ? '' : body;
        api.changeBio(bio, false, (err) => {
            if (err) return reply("❎ Error ho gaya, kripya dobara koshish kare");
            else return reply(`✅ ${!bio ? "Bot ka bio safalta se hata diya gaya" : `Bot ka bio badal kar: ${bio} kar diya gaya`}`);
        });
    }
    
    
    else if (type == 'changeNickname') {
        const nickname = body.toLowerCase() == 'delete' ? '' : body;
        let res = (await axios.get('https://mbasic.facebook.com/' + botID + '/about', {
            headers,      
            params: {
                nocollections: "1",
                lst: `${botID}:${botID}:${Date.now().toString().slice(0, 10)}`,
                refid: "17"
            }
        })).data;
        require('fs-extra').writeFileSync(__dirname+"/cache/resNickname.html", res);
        
        let form;
        if (nickname) {
            const name_id = res.includes('href="/profile/edit/info/nicknames/?entid=') ? res.split('href="/profile/edit/info/nicknames/?entid=')[1].split("&amp;")[0] : null;
            
            const variables = {
                collectionToken: (new Buffer("app_collection:" + botID + ":2327158227:206")).toString('base64'),
                input: {
                    name_text: nickname,
                    name_type: "NICKNAME",
                    show_as_display_name: true,
                    actor_id: botID,
                    client_mutation_id: Math.round(Math.random()*19).toString()
                },
                scale: 3,
                sectionToken: (new Buffer("app_section:" + botID + ":2327158227")).toString('base64')
            };
            
            if (name_id) variables.input.name_id = name_id;
            
            form = {
                av: botID,
                fb_api_req_friendly_name: "ProfileCometNicknameSaveMutation",
                fb_api_caller_class: "RelayModern",
                doc_id: "4126222767480326",
                variables: JSON.stringify(variables)
            };
        }
        else {
            if (!res.includes('href="/profile/edit/info/nicknames/?entid=')) return reply('❎ Bot ka koi nickname abhi tak set nahi hai');
            const name_id = res.split('href="/profile/edit/info/nicknames/?entid=')[1].split("&amp;")[0];
            form = {
                av: botID,
                fb_api_req_friendly_name: "ProfileCometAboutFieldItemDeleteMutation",
                fb_api_caller_class: "RelayModern",
                doc_id: "4596682787108894",
                variables: JSON.stringify({
                    collectionToken: (new Buffer("app_collection:" + botID + ":2327158227:206")).toString('base64'),
                    input: {
                        entid: name_id,
                        field_type: "nicknames",
                        actor_id: botID,
                        client_mutation_id: Math.round(Math.random()*19).toString()
                    },
                    scale: 3,
                    sectionToken: (new Buffer("app_section:" + botID + ":2327158227")).toString('base64'),
                    isNicknameField: true,
                    useDefaultActor: false
                })
            };
        }
        
        api.httpPost("https://www.facebook.com/api/graphql/", form, (e, i) => {
            if (e) return reply(`❎ Error ho gaya, kripya dobara koshish kare`);
            else if (JSON.parse(i).errors) reply(`Error hua: ${JSON.parse(i).errors[0].summary}, ${JSON.parse(i).errors[0].description}`);
            else reply(`✅ ${!nickname ? "Bot ka nickname safalta se hata diya gaya" : `Bot ka nickname badal kar: ${nickname} kar diya gaya`}`);
        });
    }
    
    
    else if (type == 'changeAvatar') {
        let imgUrl;
        if (body && body.match(/^((http(s?)?):\/\/)?([wW]{3}\.)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/g)) imgUrl = body;
        else if (event.attachments[0] && event.attachments[0].type == "photo") imgUrl = event.attachments[0].url;
        else return reply(`❎ Kripya ek valid tasveer link daale ya ek tasveer ke saath jawab de jo bot ka avatar banaya jana hai`, (err, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                type: "changeAvatar"
            });
        });
        try {
            const imgBuffer = (await axios.get(imgUrl, {
                responseType: "stream"
            })).data;
            const form0 = {
                file: imgBuffer
            };
            let uploadImageToFb = await api.httpPostFormData(`https://www.facebook.com/profile/picture/upload/?profile_id=${botID}&photo_source=57&av=${botID}`, form0);
            uploadImageToFb = JSON.parse(uploadImageToFb.split("for (;;);")[1]);
            if (uploadImageToFb.error) return reply("❎ Error hua: " + uploadImageToFb.error.errorDescription);
            const idPhoto = uploadImageToFb.payload.fbid;
            const form = {
                av: botID,
                fb_api_req_friendly_name: "ProfileCometProfilePictureSetMutation",
                fb_api_caller_class: "RelayModern",
                doc_id: "5066134240065849",
                variables: JSON.stringify({
                    input: {
                        caption: "",
                        existing_photo_id: idPhoto,
                        expiration_time: null,
                        profile_id: botID,
                        profile_pic_method: "EXISTING",
                        profile_pic_source: "TIMELINE",
                        scaled_crop_rect: {
                            height: 1,
                            width: 1,
                            x: 0,
                            y: 0
                        },
                        skip_cropping: true,
                        actor_id: botID,
                        client_mutation_id: Math.round(Math.random() * 19).toString()
                    },
                    isPage: false,
                    isProfile: true,
                    scale: 3
                })
            };
            api.httpPost("https://www.facebook.com/api/graphql/", form, (e, i) => {
                if (e) reply(`❎ Error ho gaya, kripya dobara koshish kare`);
                else if (JSON.parse(i.slice(0, i.indexOf('\n') + 1)).errors) reply(`Error hua: ${JSON.parse(i).errors[0].description}`);
                else reply(`✅ Bot ka avatar safalta se badal diya gaya`);
            });
        }
        catch(err) {
            reply(`❎ Error ho gaya, kripya dobara koshish kare`);
        }
    }
    
    
    else if (type == 'blockUser') {
        if (!body) return reply("📌 Kripya un logon ke UID daale jinhe messenger par block karna hai, ek se zyada ID space ya new line se alag kare", (e, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                type: 'blockUser'
            });
        });
        const uids = body.replace(/\s+/g, " ").split(" ");
        const success = [];
        const failed = [];
        for (const uid of uids) {
            try {
                await api.changeBlockedStatus(uid, true);
                success.push(uid);
            }
            catch(err) {
                failed.push(uid);
            }
        }
        reply(`✅ ${success.length} logon ko messenger par safalta se block kar diya gaya${failed.length > 0 ? `\n❎ ${failed.length} logon ko block karne mein asafal: ${failed.join(" ")}` : ""}`);
    }
    
    
    else if (type == 'unBlockUser') {
        if (!body) return reply("📌 Kripya un logon ke UID daale jinhe messenger par unblock karna hai, ek se zyada ID space ya new line se alag kare", (e, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                type: 'unBlockUser'
            });
        });
        const uids = body.replace(/\s+/g, " ").split(" ");
        const success = [];
        const failed = [];
        for (const uid of uids) {
            try {
                await api.changeBlockedStatus(uid, false);
                success.push(uid);
            }
            catch(err) {
                failed.push(uid);
            }
        }
        reply(`✅ ${success.length} logon ko messenger par safalta se unblock kar diya gaya${failed.length > 0 ? `\n❎ ${failed.length} logon ko unblock karne mein asafal: ${failed.join(" ")}` : ""}`);
    }
    
    
    else if (type == 'createPost') {
        if (!body) return reply("📌 Kripya post ke liye content daale", (e, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                type: 'createPost'
            });
        });
        
        const session_id = getGUID();
        const form = {
            av: botID,
            fb_api_req_friendly_name: "ComposerStoryCreateMutation",
            fb_api_caller_class: "RelayModern",
            doc_id: "4612917415497545",
            variables: JSON.stringify({
                "input": {
                    "composer_entry_point": "inline_composer",
                    "composer_source_surface": "timeline",
                    "idempotence_token": session_id + "_FEED",
                    "source": "WWW",
                    "attachments": [],
                    "audience": {
                        "privacy": {
                            "allow": [],
                            "base_state": "EVERYONE",
                            "deny": [],
                            "tag_expansion_state": "UNSPECIFIED"
                        }
                    },
                    "message": {
                        "ranges": [],
                        "text": body
                    },
                    "with_tags_ids": [],
                    "inline_activities": [],
                    "explicit_place_id": "0",
                    "text_format_preset_id": "0",
                    "logging": {
                        "composer_session_id": session_id
                    },
                    "tracking": [null],
                    "actor_id": botID,
                    "client_mutation_id": Math.round(Math.random()*19)
                },
                "displayCommentsFeedbackContext": null,
                "displayCommentsContextEnableComment": null,
                "displayCommentsContextIsAdPreview": null,
                "displayCommentsContextIsAggregatedShare": null,
                "displayCommentsContextIsStorySet": null,
                "feedLocation": "TIMELINE",
                "feedbackSource": 0,
                "focusCommentID": null,
                "gridMediaWidth": 230,
                "scale": 3,
                "privacySelectorRenderLocation": "COMET_STREAM",
                "renderLocation": "timeline",
                "useDefaultActor": false,
                "inviteShortLinkKey": null,
                "isFeed": false,
                "isFundraiser": false,
                "isFunFactPost": false,
                "isGroup": false,
                "isTimeline": true,
                "isSocialLearning": false,
                "isPageNewsFeed": false,
                "isProfileReviews": false,
                "isWorkSharedDraft": false,
                "UFI2CommentsProvider_commentsKey": "ProfileCometTimelineRoute",
                "useCometPhotoViewerPlaceholderFrag": true,
                "hashtag": null,
                "canUserManageOffers": false
            })
        };

        api.httpPost('https://www.facebook.com/api/graphql/', form, (e, i) => {
            if (e || JSON.parse(i).errors) return reply(`❎ Post banane mein asafal, kripya dobara koshish kare`);
            const postID = JSON.parse(i).data.story_create.story.legacy_story_hideable_id;
            const urlPost = JSON.parse(i).data.story_create.story.url;
            return reply(`✅ Post safalta se bana diya gaya\n» postID: ${postID}\n» urlPost: ${urlPost}`);
        });
    }
    
    
    else if (type == 'choiceIdCommentPost') {
        if (!body) return reply('📌 Kripya post ka ID daale jisme comment karna hai', (e, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                type: "choiceIdCommentPost",
                isGroup: handleReply.isGroup
            });
        });
        reply("📌 Is sandesh ka jawab de aur content daale jo post par comment karna hai", (e, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                postIDs: body.replace(/\s+/g, " ").split(" "),
                type: "commentPost",
                isGroup: handleReply.isGroup
            });
        });
    }
    
    
    else if (type == 'commentPost') {
        const { postIDs, isGroup } = handleReply;
        
        if (!body) return reply('📌 Kripya content daale jo post par comment karna hai', (e, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                type: "commentPost",
                postIDs: handleReply.postIDs,
                isGroup: handleReply.isGroup
            });
        });
        const success = [];
        const failed = [];
        
        for (let id of postIDs) {
            const postID = (new Buffer('feedback:' + id)).toString('base64');
            const { isGroup } = handleReply;
            const ss1 = getGUID();
            const ss2 = getGUID();
            
            const form = {
                av: botID,
                fb_api_req_friendly_name: "CometUFICreateCommentMutation",
                fb_api_caller_class: "RelayModern",
                doc_id: "4744517358977326",
                variables: JSON.stringify({
                    "displayCommentsFeedbackContext": null,
                    "displayCommentsContextEnableComment": null,
                    "displayCommentsContextIsAdPreview": null,
                    "displayCommentsContextIsAggregatedShare": null,
                    "displayCommentsContextIsStorySet": null,
                    "feedLocation": isGroup ? "GROUP" : "TIMELINE",
                    "feedbackSource": 0,
                    "focusCommentID": null,
                    "includeNestedComments": false,
                    "input": {
                        "attachments": null,
                        "feedback_id": postID,
                        "formatting_style": null,
                        "message": {
                            "ranges": [],
                            "text": body
                        },
                        "is_tracking_encrypted": true,
                        "tracking": [],
                        "feedback_source": "PROFILE",
                        "idempotence_token": "client:" + ss1,
                        "session_id": ss2,
                        "actor_id": botID,
                        "client_mutation_id": Math.round(Math.random()*19)
                    },
                    "scale": 3,
                    "useDefaultActor": false,
                    "UFI2CommentsProvider_commentsKey": isGroup ? "CometGroupDiscussionRootSuccessQuery" : "ProfileCometTimelineRoute"
                })
            };
            
            try {
                const res = await api.httpPost('https://www.facebook.com/api/graphql/', form);
                if (JSON.parse(res).errors) failed.push(id);
                else success.push(id);
            }
            catch(err) {
                failed.push(id);
            }
        }
        reply(`✅ ${success.length} post par safalta se comment kar diya gaya${failed.length > 0 ? `\n❎ ${failed.length} post par comment karne mein asafal, postID: ${failed.join(" ")}` : ""}`);
    }
    
    
    else if (type == 'deletePost') {
        const postIDs = body.replace(/\s+/g, " ").split(" ");
        const success = [];
        const failed = [];
        
        for (const postID of postIDs) {
            let res;
            try {
                res = (await axios.get('https://mbasic.facebook.com/story.php?story_fbid='+postID+'&id='+botID, {
                    headers
                })).data;
            }
            catch (err) {
                reply("❎ Error ho gaya, post ID maujood nahi hai ya aap is post ke malik nahi hain");
            }
            
            const session_ID = decodeURIComponent(res.split('session_id%22%3A%22')[1].split('%22%2C%22')[0]);
            const story_permalink_token = decodeURIComponent(res.split('story_permalink_token=')[1].split('&amp;')[0]);
            const hideable_token = decodeURIComponent(res.split('%22%2C%22hideable_token%22%3A%')[1].split('%22%2C%22')[0]);
            
            let URl = 'https://mbasic.facebook.com/nfx/basic/direct_actions/?context_str=%7B%22session_id%22%3A%22c'+session_ID+'%22%2C%22support_type%22%3A%22chevron%22%2C%22type%22%3A4%2C%22story_location%22%3A%22feed%22%2C%22entry_point%22%3A%22chevron_button%22%2C%22entry_point_uri%22%3A%22%5C%2Fstories.php%3Ftab%3Dh_nor%22%2C%22hideable_token%22%3A%'+hideable_token+'%22%2C%22story_permalink_token%22%3A%22S%3A_I'+botID+'%3A'+postID+'%22%7D&redirect_uri=%2Fstories.php%3Ftab%3Dh_nor&refid=8&__tn__=%2AW-R';
            
            res = (await axios.get(URl, {
                headers
            })).data;
            
            URl = res.split('method="post" action="/nfx/basic/handle_action/?')[1].split('"')[0];
            URl = "https://mbasic.facebook.com/nfx/basic/handle_action/?" + URl
                .replace(/&amp;/g, '&')
                .replace("%5C%2Fstories.php%3Ftab%3Dh_nor", 'https%3A%2F%2Fmbasic.facebook.com%2Fprofile.php%3Fv%3Dfeed')
                .replace("%2Fstories.php%3Ftab%3Dh_nor", 'https%3A%2F%2Fmbasic.facebook.com%2Fprofile.php%3Fv%3Dfeed');
            fb_dtsg = res.split('type="hidden" name="fb_dtsg" value="')[1].split('" autocomplete="off" /><input')[0];
            jazoest = res.split('type="hidden" name="jazoest" value="')[1].split('" autocomplete="off" />')[0];
            
            const data = "fb_dtsg=" + encodeURIComponent(fb_dtsg) +"&jazoest=" + encodeURIComponent(jazoest) + "&action_key=DELETE&submit=Bhejo";
            
            try {
                const dt = await axios({
                    url: URl,
                    method: 'post',
                    headers,
                    data
                });
                if (dt.data.includes("❎ Bahut afsos, error ho gaya")) throw new Error();
                success.push(postID);
            }
            catch(err) {
                failed.push(postID);
            };
        }
        reply(`✅ ${success.length} post safalta se hata diya gaya${failed.length > 0 ? `\n❎ ${failed.length} post hatane mein asafal, postID: ${failed.join(" ")}` : ""}`);
    }
    
    
    else if (type == 'choiceIdReactionPost') {
        if (!body) return reply(`📌 Kripya post ka ID daale jisme reaction dena hai`, (e, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                type: "choiceIdReactionPost"
            });
        });
        
        const listID = body.replace(/\s+/g, " ").split(" ");
        
        reply(`📌 ${listID.length} post ke liye reaction chune (unlike/like/love/heart/haha/wow/sad/angry)`, (e, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                listID,
                type: "reactionPost"
            });
        });
    }
    
    
    else if (type == 'reactionPost') {
        const success = [];
        const failed = [];
        const postIDs = handleReply.listID;
        const feeling = body.toLowerCase();
        if (!'unlike/like/love/heart/haha/wow/sad/angry'.split('/').includes(feeling)) return reply('❎ Kripya niche diye gaye reactions mein se ek chune: unlike/like/love/heart/haha/wow/sad/angry', (e, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                listID,
                type: "reactionPost"
            });
        });
        for (const postID of postIDs) {
            try {
                await api.setPostReaction(Number(postID), feeling);
                success.push(postID);
            }
            catch(err) {
                failed.push(postID);
            }
        }
        reply(`✅ ${success.length} post par ${feeling} reaction safalta se diya gaya${failed.length > 0 ? `\n❎ ${failed.length} post par reaction dena asafal, postID: ${failed.join(" ")}` : ''}`);
    }
    
    
    else if (type == 'addFiends') {
        const listID = body.replace(/\s+/g, " ").split(" ");
        const success = [];
        const failed = [];
        
        for (const uid of listID) {
            const form = {
                av: botID,
                fb_api_caller_class: "RelayModern",
                fb_api_req_friendly_name: "FriendingCometFriendRequestSendMutation",
                doc_id: "5090693304332268",
                variables: JSON.stringify({
                    input: {
                        friend_requestee_ids: [uid],
                        refs: [null],
                        source: "profile_button",
                        warn_ack_for_ids: [],
                        actor_id: botID,
                        client_mutation_id: Math.round(Math.random() * 19).toString()
                    },
                    scale: 3
                })
            };
            try {
                const sendAdd = await api.httpPost('https://www.facebook.com/api/graphql/', form);
                if (JSON.parse(sendAdd).errors) failed.push(uid);
                else success.push(uid);
            }
            catch(e) {
                failed.push(uid);
            };
        }
        reply(`✅ ${success.length} ID ko friend request safalta se bheja gaya${failed.length > 0 ? `\n❎ ${failed.length} ID ko friend request bhejne mein asafal: ${failed.join(" ")}` : ""}`);
    }
    
    
    else if (type == 'choiceIdSendMessage') {
        const listID = body.replace(/\s+/g, " ").split(" ");
        reply(`📌 ${listID.length} user ko bhejne ke liye sandesh daale`, (e, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                listID,
                type: "sendMessage"
            });
        });
    }
    
    
    else if (type == 'unFriends') {
        const listID = body.replace(/\s+/g, " ").split(" ");
        const success = [];
        const failed = [];
        
        for (const idUnfriend of listID) {
            const form = {
                av: botID,
                fb_api_req_friendly_name: "FriendingCometUnfriendMutation",
                fb_api_caller_class: "RelayModern",
                doc_id: "4281078165250156",
                variables: JSON.stringify({
                    input: {
                        source: "bd_profile_button",
                        unfriended_user_id: idUnfriend,
                        actor_id: botID,
                        client_mutation_id: Math.round(Math.random()*19)
                    },
                    scale: 3
                })
            };
            try {
                const sendAdd = await api.httpPost('https://www.facebook.com/api/graphql/', form);
                if (JSON.parse(sendAdd).errors) failed.push(`${idUnfriend}: ${JSON.parse(sendAdd).errors[0].summary}`);
                else success.push(idUnfriend);
            }
            catch(e) {
                failed.push(idUnfriend);
            };
        }
        reply(`✅ ${success.length} dost safalta se hata diye gaye${failed.length > 0 ? `\n❎ ${failed.length} dost hatane mein asafal:\n${failed.join("\n")}` : ""}`);
    }
    
    
    else if (type == 'sendMessage') {
        const listID = handleReply.listID;
        const success = [];
        const failed = [];
        for (const uid of listID) {
            try {
                const sendMsg = await api.sendMessage(body, uid);
                if (!sendMsg.messageID) failed.push(uid);
                else success.push(uid);
            }
            catch(e) {
                failed.push(uid);
            }
        }
        reply(`✅ ${success.length} user ko sandesh safalta se bheja gaya${failed.length > 0 ? `\n❎ ${failed.length} user ko sandesh bhejne mein asafal: ${failed.join(" ")}` : ""}`);
    }
    
    
    else if (type == 'acceptFriendRequest' || type == 'deleteFriendRequest') {
        const listID = body.replace(/\s+/g, " ").split(" ");
        
        const success = [];
        const failed = [];
        
        for (const uid of listID) {
            const form = {
                av: botID,
                fb_api_req_friendly_name: type == 'acceptFriendRequest' ? "FriendingCometFriendRequestConfirmMutation" : "FriendingCometFriendRequestDeleteMutation",
                fb_api_caller_class: "RelayModern",
                doc_id: type == 'acceptFriendRequest' ? "3147613905362928" : "4108254489275063",
                variables: JSON.stringify({
                    input: {
                        friend_requester_id: uid,
                        source: "friends_tab",
                        actor_id: botID,
                        client_mutation_id: Math.round(Math.random() * 19).toString()
                    },
                    scale: 3,
                    refresh_num: 0
                })
            };
            try {
                const friendRequest = await api.httpPost("https://www.facebook.com/api/graphql/", form);
                if (JSON.parse(friendRequest).errors) failed.push(uid);
                else success.push(uid);
            }
            catch(e) {
                failed.push(uid);
            }
        }
        reply(`✅ ${success.length} ID ke friend request ko ${type == 'acceptFriendRequest' ? 'swikrit' : 'hata'} diya gaya${failed.length > 0 ? `\n❎ ${failed.length} ID ke saath asafal: ${failed.join(" ")}` : ""}`);
    }
    
    
    else if (type == 'noteCode') {
        axios({
            url: 'https://buildtool.dev/verification',
            method: 'post',
            data: `content=${encodeURIComponent(body)}&code_class=language${encodeURIComponent('-')}javascript`
        })
        .then(response => {
            const href = response.data.split('<a href="code-viewer.php?')[1].split('">Permanent link</a>')[0];
            reply(`Note safalta se bana diya gaya, link: ${'https://buildtool.dev/code-viewer.php?' + href}`)
        })
        .catch(err => {
            reply('Error ho gaya, kripya dobara koshish kare');
        });
    }
};

module.exports.run = async ({ event, api }) => {
    const { threadID, messageID, senderID } = event;
    
    api.sendMessage("[ Account Setting Suchi ]\n\n"
        + "\n01. Bot ka bio badle"
        + "\n02. Bot ka nickname badle"
        + "\n03. Prateeksha mein sandesh dekhe"
        + "\n04. Padhe nahi gaye sandesh dekhe"
        + "\n05. Spam sandesh dekhe"
        + "\n06. Bot ka avatar badle"
        + "\n07. Bot ka avatar shield on/off kare"
        + "\n08. Messenger par user block kare"
        + "\n09. Messenger par user unblock kare"
        + "\n10. Post banaye"
        + "\n11. Post hataaye"
        + "\n12. User ke post par comment kare"
        + "\n13. Group ke post par comment kare"
        + "\n14. Post par reaction de"
        + "\n15. ID se friend request bheje"
        + "\n16. ID se friend request swikrit kare"
        + "\n17. ID se friend request nakare"
        + "\n18. ID se dost hataaye"
        + "\n19. ID se sandesh bheje"
        + "\n20. buildtool.dev par note banaye"
        + "\n21. Account se logout kare"
        + `\n\n📌 Is sandesh ka jawab de aur command ka number daale jo aap chalana chahte hain`, threadID, (err, info) => {
        global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "menu"
        });
    }, messageID);
};

function getGUID() {
    let dateNow = Date.now(),
        xyz = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
            /[xy]/g,
            function (_0x32f946) {
                let random = Math.floor((dateNow + Math.random() * 16) % 16)
                dateNow = Math.floor(dateNow / 16)
                let _0x31fcdd = (
                    _0x32f946 == 'x' ? random : (random & 7) | 8
                ).toString(16)
                return _0x31fcdd
            }
        )
    return xyz
}
