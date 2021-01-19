const fs = require('fs') // For file parsing
const Discord = require('discord.js'); // For Discord functions
const Client = require('./classes/Client'); // To save commands
const Datastore = require('nedb');
const hash = require("string-hash");

const numEmojis = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣", "🔟"];
const handEmojis = ["👍", "👎"];

class Poll {
	constructor(msg, question, answers, time, type) {
		if (msg) { // if the constructor have parameters
			this.guildId = msg.guild.id;
			this.channelId = msg.channel.id;
			this.msgId = null;
			this.question = question;
			this.answers = answers;
			this.createdOn = Date.now();
			this.isTimed = (time != 0);
			this.hasFinished = false;
			this.finishTime = new Date(this.createdOn + time).getTime();
			this.type = type;
			this.emojis = this.getEmojis(type);
			this.results = [];
			this.id = this.generateId();
		}
	}

	static copyConstructor (other) {
		let p = new Poll();

		p.guildId = other.guildId;
		p.channelId = other.channelId;
		p.msgId = other.msgId;
		p.question = other.question;
		p.answers = other.answers;
		p.createdOn = other.createdOn;
		p.isTimed = other.isTimed;
		p.finishTime = other.finishTime;
		p.hasFinished = other.hasFInished;
		p.type = other.type;
		p.emojis = other.emojis;
		p.results = other.results;
		p.id = other.id;

		return p;
	}

	async start(msg, type) {
		const message = await msg.channel.send({ embed: this.generateEmbed() })
		this.msgId = message.id;
		for (let i = 0; i < this.answers.length && i < 10; ++i) {
			try {
                if(type == "yn")
                    await message.react(handEmojis[i]);
                else
				    await message.react(numEmojis[i]);
			} catch (error) {
				console.log(error);
			}
		}
		return message.id;
	}

	async finish(client) {
		const now = new Date();
		const message = await this.getPollMessage(client);
		if (!message) {
			console.error("Cant find poll message");
			return;
		}
		if (message.embeds.length < 1) {
			console.error("The poll message ha no embeds.");
			return;
		}
		
		this.hasFinished = true;
		
		const embed = new Discord.RichEmbed(message.embeds[0]);
		embed.setColor("FF0800")
			.setAuthor(`${this.question} [FINISHED]`)
			.setFooter(`Poll ${this.id} finished ${now.toUTCString()}`);

		try {
			await message.edit({ embed: embed });
			await this.getVotes(message);
			await this.showResults(message.channel);
		} catch (error) {
			console.error(error);
		}
	}

	async getVotes(message) {
		if (this.hasFinished) {
			const reactionCollection = message.reactions;
			for (let i = 0; i < this.answers.length; i++) {
				this.results[i] = reactionCollection.get(this.emojis[i]).count - 1;
			}
		} else {
			throw new Error("Poll not ended");
		}
	}

	async showResults(channel) {
		if (!this.hasFinished) {
			throw new Error("The poll is not finished");
		}
		if (this.results.length < 2) {
			throw new Error("There are no results");
		}

		return await channel.send({ embed: this.generateResultsEmbed() });
	}

	generateEmbed() {
		let str = new String();

		if (this.type !== "yn") {
			for (let i = 0; i < this.answers.length && i < 10; i++) {
				str += `${this.emojis[i]}. ${this.answers[i]}\n`;
			}
		}

		let footer = `React with the emojis below | ID: ${this.id}`;
		if (this.isTimed) footer += ` | This poll ends in ${new Date(this.finishTime).toUTCString()}`;

		let embed = new Discord.MessageEmbed()
			.setColor("#50C878")
			.setAuthor("📊" + this.question)
			.setDescription(str)
			.setFooter(footer);

		return embed;
	}

	generateResultsEmbed() {
		let description = new String();
		let totalVotes = 0;

		this.results.forEach((answer) => totalVotes += answer);
		if (totalVotes == 0) totalVotes = 1;

		let finalResults = [];

		for (let i = 0; i < this.results.length; i++) {
			let percentage = (this.results[i] / totalVotes * 100);
			let result = {
				emoji: this.emojis[i],
				answer: this.answers[i],
				votes: this.results[i],
				percentage: percentage.toFixed(2)
			}

			finalResults.push(result);
		}

		if (this.type !== "yn") { // only sort if its not a yn poll
			finalResults.sort((a, b) => { return b.votes - a.votes });
		}

		finalResults.forEach((r) => {
			description += `${r.emoji} ${r.answer} :: ** ${r.votes} ** :: ${r.percentage}% \n`;
		});

		let footer = `Results from poll ${this.id} finished on ${new Date(this.finishTime).toUTCString()}`;
		let resultsEmbed = new Discord.RichEmbed()
			.setAuthor("Results of: " + this.question)
			.setDescription(description)
			.setFooter(footer)
			.setColor("#0080FF");

		return resultsEmbed;
	}

	generateId() {
		let id = new String("");
		if (this.id) {
			id += this.id + Date.now();
		} else {
			const d = new Date(this.createdOn);
			id += d.getUTCFullYear();
			id += d.getUTCDate();
			id += d.getUTCHours();
			id += d.getUTCMinutes();
			id += d.getUTCMilliseconds();
			id += this.question;
		}
		this.id = hash(id);
		return this.id;
	}

	getEmojis(type) {
		switch (type) {
			case "yn":
				return handEmojis;
			case "default":
				return numEmojis;
			default:
				throw new Error("The poll type is not known");
		}
	}

	async getPollMessage(client) {
		try {
			return await client.guilds.get(this.guildId).channels.get(this.channelId).fetchMessage(this.msgId);
		} catch (err) {
			return;
		}
	}
}

// This is what must be put immediately before commands
prefix = '!';

// Server variables so other servers aint screwing up other server's hangman and DND games
var servers = {}
var server = {}

// Declare command variale
const client = new Client();
client.commands = new Discord.Collection();
    
    let database = new Datastore('database.db');
    database.loadDatabase();
    database.persistence.setAutocompactionInterval(3600000);

async function poll(msg, args) {
    try
    {
        const timeToVote = await parseTime(msg, args);
    
        const question = args.shift();
        let answers = [];
        let type;
    
        switch (args.length) {
            case 0:
                answers = ["", ""];
                type = "yn";
                break;
            case 1:
                msg.reply("You cannot create a poll with only one answer");
                return;
            default:
                answers = args;
                type = "default";
                break;
        }
    
        
        const p = await new Poll(msg, question, answers, timeToVote, type);

        await p.start(msg, type);
    
        if (p.hasFinished == false) {
            database.insert(p);
            // maybe we can get a duplicated id...
        }
    }
    catch(error)
    {
        console.log(error);
    }
}

    async function finishTimedPolls() {
        const now = Date.now()
        database.find({ isTimed: true, finishTime: { $lte: now } }, (err, dbps) => {
            if (err) console.error(err);
    
            dbps.forEach((dbp) => {
                const p = Poll.copyConstructor(dbp);
    
                if (p instanceof Poll && p.isTimed && p.finishTime <= now) {
                    p.finish(client);
                    database.remove({ id: p.id });
                }
            });
        });
    }

    async function end(msg, args) {
        const inputid = Number(args[1]);
    
        database.findOne({ id: inputid }, (err, dbp) => {
            if (err) { console.errror(err); }
            if (dbp) {
                const p = Poll.copyConstructor(dbp);
                if (!p.hasFinished && p.guildId === msg.guild.id) {
                    p.finish(client)
                    database.remove({ id: p.id });
                }
            } else {
                msg.reply("Cannot find the poll.");
            }
        });
    }

    function parseTime(msg, args) {
        let time = 0;
    
        //parse the time limit if it exists
        if (args[0].startsWith("time=")) {
            const timeRegex = /\d+/;
            const unitRegex = /s|m|h|d/i;
            let timeString = args.shift();
            let unit = "s";
    
            let match;
    
            // check if the time is correct
            match = timeString.match(timeRegex);
            if (match != null) {
                time = parseInt(match.shift());
            } else {
                msg.reply("Wrong time syntax!");
                return;
            }
    
            // check the units of the time
            match = timeString.split("=").pop().match(unitRegex);
            if (match != null) unit = match.shift();
    
            switch (unit) {
                case "s": time *= 1000;
                    break;
                case "m": time *= 60000;
                    break;
                case "h": time *= 3600000;
                    break;
                case "d": time *= 86400000;
                    break;
                default: time *= 60000;
            }
        }
    
        if (time > 604800000) return 604800000; // no more than a week.
        else return time;
    }

    function parseToArgs(msg) {
        const poll_prefix = "!poll";
        let args = msg.content.slice(poll_prefix.length)
            .trim()
            .split("\"")
            .filter((phrase) => phrase.trim() !== "");
        for (let i = 0; i < args.length; i++)
            args[i] = args[i].trim();
        if (args[0].startsWith("end")) {
            let aux = args[0].split(" ");
            args[0] = aux[0];
            args.push(aux[1]);
        }
        return args;
    }

    function cleanDatabase() {
        console.log("Cleaning the database...");
        const aWeekAgo = Date.now() - 604800000;
        database.remove({ createdOn: { $lt: aWeekAgo } }, { multi: true }, (err, n) => console.log(n + " entries removed."));
    }

// Get all commands
const music_command_files = fs.readdirSync('./commands/Music').filter(file => file.endsWith('.js'));
const nsfw_command_files = fs.readdirSync('./commands/NSFW').filter(file => file.endsWith('.js'));
const fun_command_files = fs.readdirSync('./commands/Fun').filter(file => file.endsWith('.js'));

// Set all music commands
for (const file of music_command_files)
{
    const command = require(`./commands/Music/${file}`);
    client.commands.set(command.name, command);
}

// Set all NSFW commands
for (const file of nsfw_command_files)
{
    const command = require(`./commands/NSFW/${file}`);
    client.commands.set(command.name, command);
}

// Set all fun commands
for (const file of fun_command_files)
{
    const command = require(`./commands/Fun/${file}`);
    client.commands.set(command.name, command);
}

// Set help command
const command = require(`./commands/help`);
const { Response } = require('node-fetch');
client.commands.set(command.name, command);

// Announce that the bot is online
client.once('ready', () => {
    console.log("JerryBot is online!");
    setInterval(finishTimedPolls, 10000); // 10s
	setInterval(cleanDatabase, 86400000); // 24h
    client.user.setActivity("Your every move", {type: "WATCHING"});
});

// Listen to discord messages
client.on('message', async message => {

    if(message.author.bot)
        return;

    var msg = message.content.toLowerCase();

    // Delete message from vote channel
    if((message.author.username != "ThatSaltySnipezGuy" && message.author.username != "Jerryatric") && message.channel.id == 774857738039459850)
    {
        message.delete();
    }

    if(message.channel.id != 774857738039459850)
    {
        // Twitch emote reactions
        if(msg.includes("monka"))
        {
            if(msg.includes("monkaw"))
                message.channel.send("", {files: ['./images/Monkaw.jpg']});
            
            else if(msg.includes("monkagiga"))
                message.channel.send("", {files: ['./images/monkagiga.png']});

            else
                message.channel.send("", {files: ['./images/monkashake.jpg']});
        }

        else if(msg.includes("corona"))
            message.channel.send("", {files: ['./images/coronas.png']});

        else if(msg.includes("hmm"))
            message.channel.send("", {files: ['./images/pepehmm.gif']});

        else if(msg.includes("gachi"))
        {
            if(msg.includes("gasm"))
                message.channel.send("", {files: ['./images/gachigasm.gif']});

            else
                message.channel.send("", {files: ['./images/gachi.gif']});
        }

        else if(msg.includes("gasm") && !msg.includes("gachi"))
            message.channel.send("", {files: ['./images/gasm.png']});
            
        else if(msg.includes("kek"))
            message.channel.send("", {files: ['./images/kek.gif']});
    
        else if(msg.includes("painschamp"))
            message.channel.send("", {files: ['./images/painschamp.jpg']});

        else if(msg.includes("lul"))
        {
            if(msg.includes("omega"))
                message.channel.send("", {files: ['./images/omegalul.jpg']});

            else
                message.channel.send("", {files: ['./images/lul.png']});
        }

        else if(msg.includes("residentsleeper"))
            message.channel.send("", {files: ['./images/sleeper.png']});

        else if(msg.includes("pepega"))
            message.channel.send("", {files: ['./images/pepega.png']});

        else if(msg.includes("pepehands"))
            message.channel.send("", {files: ['./images/pepehands.gif']});

        else if(msg.includes("jebait"))
            message.channel.send("", {files: ['./images/jebait.png']});

        else if(msg.includes("pog"))
        {
            if(msg.includes("pogu"))
                message.channel.send("", {files: ['./images/pogu.jpg']});

            else if(msg.includes("poggers"))
                message.channel.send("", {files: ['./images/poggers.png']});

            else
                message.channel.send("", {files: ['./images/pogchamp.gif']});
        }

        else if(msg.includes("kapp"))
        {
            if(msg.includes("pride"))
                message.channel.send("", {files: ['./images/kappapride.png']});

            else if(msg.includes("ross"))
                message.channel.send("", {files: ['./images/kappaross.png']});

            else
                message.channel.send("", {files: ['./images/kapp.png']});
        }

        else if(msg.includes("4head"))
            message.channel.send("", {files: ['./images/4head.jpg']});
        
        else if(msg.includes("5head"))
            message.channel.send("", {files: ['./images/5head.jpg']});

        else if(msg.includes("feelsgood"))
            message.channel.send("", {files: ['./images/feelsgood.png']});

        else if(msg.includes("feelsbad"))
            message.channel.send("", {files: ['./images/feelsbadman.png']});
        
        else if(msg.includes("ez") && msg.includes("clap"))
            message.channel.send("", {files: ['./images/ez.gif']});

        else if(msg.includes("weirdchamp"))
            message.channel.send("", {files: ['./images/weirdchamp.gif']});

        else if(msg.includes("angelthump"))
            message.channel.send("", {files: ['./images/angelthump.gif']});

        else if(msg.includes("biblethump"))
            message.channel.send("", {files: ['./images/biblethump.png']});

        else if(msg.includes("wut"))
            message.channel.send("", {files: ['./images/wutface.jpg']});

        else if(msg.includes("kkona"))
            message.channel.send("", {files: ['./images/kkona.jpg']});

        else if(msg.includes("ayaya"))
            message.channel.send("", {files: ['./images/ayaya.gif']});

        else if(msg.includes("failfish"))
            message.channel.send("", {files: ['./images/failfish.jpg']});

        else if(msg.includes("babyrage"))
            message.channel.send("", {files: ['./images/babyrage.png']});

        else if(msg.includes("dansgame"))
            message.channel.send("", {files: ['./images/dansgame.png']});

        else if(msg.includes("cmon") && msg.includes("bruh"))
            message.channel.send("", {files: ['./images/cmonbruh.jpg']});

        else if((msg.includes("tri") && msg.includes("hard")) || (msg.includes("try") && msg.includes("hard")))
            message.channel.send("", {files: ['./images/trihard.gif']});

        else if(msg.includes("blessrng"))
            message.channel.send("", {files: ['./images/blessrng.jpg']});

        else
        {}

        if(message.author.username == "ThatSaltySnipezGuy")
        {
            if((msg.includes("jerry") && msg.includes("bot")) && !(msg.includes("!")))
            {
                message.channel.send("Fuck you Alex :)");
            }
        }

        if(message.author.username == "Machen Gaming")
        {
            if((msg.includes("jerry") && msg.includes("bot")) && !(msg.includes("!")))
            {
                message.channel.send("", {files: ['./images/taylor.gif']});
            }
        }

        if(message.author.username == "Jerryatric")
        {
            if(((msg.includes("jerry") && msg.includes("bot"))) && msg.includes("thanks"))
            {
                message.channel.send("No problem my very intelligent and handsome creator. You are the best.");
            }
        }

        if(message.author.username == "tguy")
        {
            if((msg.includes("jerry") && msg.includes("bot")) && !(msg.includes("!")))
            {
                message.channel.send("A wild Tguy has appeared!");
                message.channel.send("Tguy uses Teleport!");
                message.channel.send("Tguy got away!");
            }
        }

        if(message.author.username == "Blueslyfox")
        {
            if((msg.includes("jerry") && msg.includes("bot")) && !(msg.includes("!")))
            {
                message.channel.send("Don't you have some hentai to watch you weeb?");
            }
        }

        if(message.author.username == "a159159")
        {
            if((msg.includes("jerry") && msg.includes("bot")) && !(msg.includes("!")))
            {
                message.channel.send("Fun fact: Max has already drank 3 bottles of whiskey today :)");
            }
        }

        if(message.author.username == "KingKazma8292")
        {
            if((msg.includes("jerry") && msg.includes("bot")) && !(msg.includes("!")))
            {
                message.channel.send("", {files: ['./images/pride.gif']});
            }
        }

        if(message.author.username == "Jab7red")
        {
            if((msg.includes("jerry") && msg.includes("bot")) && !(msg.includes("!")))
            {
                message.channel.send("Uh oh I must've pissed Jared off...");
            }
        }

        if(message.author.username == "DrunkenMaster89")
        {
            if((msg.includes("jerry") && msg.includes("bot")) && !(msg.includes("!")))
            {
                message.channel.send("Because Aaron took the time to write this message instead of working, he got fired.");
                message.channel.send("", {files: ['./images/aaron.gif']});
            }
        }

        // Kindly tell Alex to fuck off if requested
        if((msg.includes("alex") && msg.includes("fuck") && msg.includes("off")) && !(message.author.bot))
        {
            message.channel.send("Fuck off Alex you doo doo head");
        }
    }

    // Check to see if discord message sent is a command
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    // Not a command so do nothing
	if (message.author.bot && !(msg.includes("!roll"))) return;
    if (!message.content.startsWith(prefix)) return;
       
    // Execute hangman command
    if(commandName == "hangman")
    {
        try
        {
            command.execute(message, servers);
        }
        catch(error)
        {
            console.error(error);
            message.reply('That command doesn\'t exist dumbass.');
        }
    }

    // Execute DND command
    else if(commandName == "dnd")
    {
        try
        {
            command.execute(message, server);
        }
        catch(error)
        {
            console.error(error);
            message.reply('That command doesn\'t exist dumbass.');
        }
    }
    
    else if(msg.includes("!poll"))
    {
        let args = parseToArgs(message);
        if (args.length > 0) {
            switch (args[0]) {
                case "end":
                    end(message, args);
                    break;
                default:
                    poll(message, args);
                    break;
            }
        } else {
            message.reply("Sorry, give me more at least a question");
        }
    }

    // Execute all other commands
    else
    {
        try 
        {
            command.execute(message);
        } 
        catch (error) 
        {
            console.error(error);
            message.reply('That command doesn\'t exist dumbass.');
        }
    }
});

client.login(process.env.token);