const Discord = require('discord.js');
const Moment = require('moment');
const Cron = require('node-cron');
const keep_alive = require('./alive.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
const Embeds = require('./Embeds.js');

/*I only used this to insert into the db*/
	// let dates = [
	// 	["Unit 2 Professional Practice Quiz",	"2022-05-17","10%"],
	// 	["Unit 3 Ethics Quiz","2022-05-24","10%"],
	// 	["Unit 4.1 Environmental Ethics Quiz","2022-05-31","20%"],
	// 	["Unit 4.2 Workplace Health and Safety Quiz","2022-06-07","20%"],
	// 	["Unit 4.3 Conflict of Interest Quiz","2022-06-14","20%"],
	// 	["Unit 4.4 Whistleblowing Quiz","2022-06-21","20%"],
	// 	["Unit 5 Reflective Report","2022-07-05","20%?","**Must Pass**"],
	// 	["Final Response/End of Course Survey","2022-08-05","1% Each","**Bonus**"]
	// ];

client.on('ready',async () => {
	client.user.setActivity('!due');
	await Embeds.connect();
	await getMessages();
	Cron.schedule('* 0 * * *', async () => {
		let x = await Embeds.getDelta();
		if (x === 0) {
			const channel = client.channels.cache.find(channel => channel.name === "r");
			const y = await Embeds.alertEmbed();
			channel.send({content: '<@&888443669282193438>', embeds: [y]});
		}
	});
	
	//dates.map(x => Embeds.insert(...x));
	
	console.log('ready');
});

async function getMessages() {
	return await client.guilds.fetch('595102402168750081').then(guild => guild.channels.cache.get('905194097214648360').messages.fetch('970902395783618620'));
}


let roleName = "ping me plz"
client.on('messageReactionAdd', async (reaction, user) => {
    //is bot and message
    if (reaction.message.author.id === '970859792740524042') {
        try {
            let a = await reaction.message.embeds[0].footer.text;
            if (a.includes('ken')) {//correct message
                let role = reaction.message.guild.roles.cache.find(role => role.name === roleName);
                let reactor = await reaction.message.guild.members.fetch(user.id);
                reactor.roles.add(role);
            }
        } catch (e) {
            //no embeds
            console.log(e);
            return;
        }
    }
});


client.on('messageCreate', async (msg) => {
	if (msg.content === "!due") {
		msg.channel.send({embeds: [await Embeds.commandEmbed()]});
	}
	if (msg.content === "!setup1" && msg.author.id === '290630197458501633') {
        const embed = {
            "title": `React below if you want to be pinged before due dates (FOR PD22 ONLY)`,
            "color": 4234428,
            "footer": { text: `ken is not liable for you missing anything, this is merely an aid` },
            "thumbnail": { url: "https://c.tenor.com/aHOgP2bHycEAAAAM/minnie-minnie-nicha.gif" }
        };
        let sent = await msg.channel.send({embeds:[embed]});
        await sent.react("⭐");
	}
	// if (msg.content === "!test3") {
	// 	const res = await Embeds.getAll();
	// 	for (x of res) {
	// 		const t = await Embeds.interpEmbed(...Object.values(x));
	// 		msg.channel.send({embeds:[t]});
	// 	}
	// }
	// if (msg.content === "!test2") {
	// 	console.log('boom');
	// 	const x = await Embeds.commandEmbed();
	// 	msg.channel.send({embeds: [x]});
	// }
	// if (msg.content === "!alert") {
	// 	const y = await Embeds.alertEmbed();
	// 	msg.channel.send({content: '<@&888443669282193438>', embeds: [y]});
	// }
})

client.login(process.env['token']);