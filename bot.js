const Discord = require("discord.js");
const client = new Discord.Client();
const tokens = require("./tokens.json");

const im_live = "401517959652311045";

const commands = {
	'clear': (msg) => {
		try {
			if (msg.author.id !== tokens.owner){
				return;
			}
			var args = msg.content.toLowerCase().split(' ').slice(1)[0];
			msg.channel.bulkDelete(parseInt(args)+1).then(messages =>	console.log(`Bulk deleted ${messages.size} messages`)).catch(console.error);
		}
		catch(err) {
			msg.channel.send(err.message);
		}
	},
	'ping': (msg) => {
		msg.channel.send("**Consult a staff member for the raider role.**\n\n :letsGo: :letsGo: :letsGo: :letsGo: :letsGo: :letsGo: :letsGo: :letsGo: :letsGo: :letsGo: :letsGo: :letsGo: ");
	},
	'invite': (msg) => {
		let id = 402138100031029248;
		let permissions = 8;
		msg.channel.send('', embedded(`https://discordapp.com/api/oauth2/authorize?client_id=${id}&scope=bot&permissions=${permissions}`));
	},
	'role': (msg) => {
		var args = msg.content.toLowerCase().split(' ').slice(1)[0];
		if (args === undefined){
			return msg.channel.send('', embedded('Specify a valid role..'));
		}
		
		if (args === 'streamer'){
			var guild = client.guilds.get("328739848615624706");
			var member = guild.members.get(msg.author.id);
			for (const role of member.roles.values()){
				if (role.id === "401517820434972673"){
					msg.channel.send('', embedded(`**${msg.author.tag}** you already have the streamer role.`));
					return;
				}
			}
			for (const role of guild.roles.values()){
				if (role.id === "401517820434972673"){
					member.addRole(role.id);
					msg.channel.send('', embedded(`**${msg.author.tag}** you now have streamer role.`));
					break;
				}
			}
		}
	}
}

client.on('guildMemberAdd', (member) => {
	var guild = client.guilds.get("328739848615624706");
	for (const role of guild.roles.values()){
		if (role.id === "329053795080339456"){
			member.addRole(role.id);
		}
	}
	
	client.channels.get("390540275279331338").send('', embedded(`**${member.user.tag}** has joined Furry Streamers`));
});

client.on('presenceUpdate', (oldMember, newMember) => {
	if (newMember.presence.game != null){
		if (newMember.presence.game.streaming){
			var channel = client.channels.get(im_live);
			channel.fetchMessages({limit: 2}).then(messages => {
				console.log(messages[size].content);
				console.log(messages[size-1].content);
				for (var i = 0; i < messages.size; i++){
					if (messages.size > 1){
						if (messages[size].content !== messages[size-1].content){
							channel.send('', embedded(`**${newMember.user.tag}** is now streaming at <${newMember.presence.game.url}>`));
						}
					}
				}
			});
		}
	}
});

client.on('ready', () => {
	client.user.setGame("Beta", "https://www.twitch.tv/valkyrienyanko");
	console.log(`${client.user.tag} running on ${client.guilds.size} guilds with ${client.users.size} users.`);
});

client.on('message', msg => {
  if (isCmd(msg)){
		if (msg.channel.id !== "401271379862749184" && !msg.content.includes(`${tokens.prefix}clear`)){
			msg.delete();
			msg.channel.send('', embedded(`**${msg.author.tag}** please use commands in #bots-commands-music`)).then(m => {m.delete(5000)});
			client.channels.get("402855128631345163").send('', embedded(`:warning: **${msg.author.tag}** used commands in the wrong place.`));
			return;
		}
		console.log(msg.content);
		//msg.delete(1000);
		let cmd = msg.content.toLowerCase().slice(tokens.prefix.length).split(' ')[0];
		if (commands.hasOwnProperty(cmd)){
			commands[cmd](msg);
		}
	}
	
	if (msg.content.includes("twitch.tv")){
		var emotes = client.guilds.get("328739848615624706").emojis;
		for (const emote of emotes.values()){
			if (emote.name.includes("TehePelo")){
				msg.react(emote.id);
			}
			if (emote.name.includes("letsGo")){
				msg.react(emote.id);
			}
		}
	}
	
	if (msg.channel.id === "401269575670562826"){
		var channel = client.channels.get("401269575670562826");
		var count = 0;
		
		channel.fetchMessages({limit: 100}).then(messages => {
			for (const message of messages.values()){
				if (message.author === msg.author){
					count++;
				}
				
				if (count > 1){
					msg.delete();
					msg.channel.send('', embedded(`**${msg.author.tag}** please send no more than one message here. Instead edit your previous message.`)).then(m => {m.delete(5000)});
					break;
				}
			}
		});
	}
	
	if (msg.channel.id === "401906665659695104"){
		var channel = client.channels.get("401906665659695104");
		var count = 0;
		
		channel.fetchMessages({limit: 100}).then(messages => {
			for (const message of messages.values()){
				if (message.author === msg.author){
					count++;
				}
				
				if (count > 1){
					msg.delete();
					msg.channel.send('', embedded(`**${msg.author.tag}** please send no more than one message here. Instead edit your previous message.`)).then(m => {m.delete(5000)});
					break;
				}
			}
		});
	}
});

client.login(process.env.BOT_TOKEN);

function createTable(id){
	sql.run('CREATE TABLE IF NOT EXISTS settings (guildid TEXT, streaming BIT)').then(() => {
		sql.run('INSERT INTO settings (guildid, streaming) VALUES (?, ?)', [id, false]);
	});
}

function embedded(str){
	var object = {
		embed:{
			description: str,
			color: 0xffc4f9
		}
	};
	return object;
}

function isCmd(msg){
	return msg.content.startsWith(tokens.prefix);
}