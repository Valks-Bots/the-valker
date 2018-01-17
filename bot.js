const Discord = require("discord.js");
const client = new Discord.Client();
const tokens = require("./tokens.json");

const im_live = "401517959652311045";

const commands = {
	'ping': (msg) => {
		msg.channel.send('', embedded("Hello world!"));
	},
	'invite': (msg) => {
		let id = 402138100031029248;
		let permissions = 8;
		msg.channel.send('', embedded(`https://discordapp.com/api/oauth2/authorize?client_id=${id}&scope=bot&permissions=${permissions}`));
	}
}

client.on('presenceUpdate', (oldMember, newMember) => {
	if (newMember.presence.game != null){
		if (newMember.presence.game.streaming){
			client.channels.get(im_live).send('', embedded(`**${newMember.user.tag}** is now streaming at <${newMember.presence.game.url}>`));
		}
	}
});

client.on('ready', () => {
	client.user.setGame("Beta", "https://www.twitch.tv/valkyrienyanko");
	console.log(`${client.user.tag} running on ${client.guilds.size} guilds with ${client.users.size} users.`);
});

client.on('message', msg => {
  if (isCmd(msg)){
		if (msg.channel.id === "402276815709798400"){
			msg.delete();
			msg.channel.send(`**${msg.author.tag}** please use commands in #bots-commands-music`);
			return;
		}
		console.log(msg.content);
		//msg.delete(1000);
		let cmd = msg.content.toLowerCase().slice(tokens.prefix.length).split(' ')[0];
		if (commands.hasOwnProperty(cmd)){
			commands[cmd](msg);
		}
	}
	
	if (msg.channel.id === im_live){
		if (msg.content.includes("twitch.tv")){
			var emotes = client.guilds.get("328739848615624706").emojis;
			for (const emote of emotes.values()){
				if (emote.name.includes("TehePelo")){
					msg.react(emote.id);
					break;
				}
			}
		}
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
			color: FFC0CB
		}
	};
	return object;
}

function isCmd(msg){
	return msg.content.startsWith(tokens.prefix);
}