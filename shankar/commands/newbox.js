module.exports.config = {
	name: "newbox",	
	version: "1.0.0", 
	hasPermssion: 0,
	credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
	description: "Tag kiye gaye logon ke sath naya group chat banayein",
	commandCategory: "Box chat",
	usages: '"$newbox [tag] | [naye group ka naam] ya "$newbox me [tag] | [naye group ka naam]"',
	cooldowns: 5, 
	dependencies: "",
};

module.exports.run = async function({ api, Users, args, event }) {
	if (args[0] == "me")
		var id = [event.senderID]
	else id = [];
	var main = event.body; 
	var groupTitle = main.slice(main.indexOf("|") +2)
	for (var i = 0; i < Object.keys(event.mentions).length; i++)
		id.push(Object.keys(event.mentions)[i]);
	api.createNewGroup(id, groupTitle,() => {api.sendMessage(`Group ${groupTitle} safalta se banaya gaya`, event.threadID)})
}
