const fs = require('fs') // For file parsing
const Discord = require('discord.js'); // For Discord functions
const Client = require('./classes/Client'); // To save commands

// Create dialogflow client
const dialogflow = require('dialogflow');

const dialogflowClient = new dialogflow.SessionsClient();

// Session path
const sessionPath = dialogflowClient.sessionPath(process.env.PROJECT_ID, 'JerryBot');

// This is what must be put immediately before commands
prefix = '!';

// Servers variable so all servers aint playing same hangman game screwing it up
var servers = {}

// Declare command variale
const client = new Client();
client.commands = new Discord.Collection();

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
    client.user.setActivity("Your every move", {type: "WATCHING"});
});

// Listen to discord messages
client.on('message', async message => {

    var msg = message.content.toLowerCase();
    
    if(msg.startsWith('<@723893316592074782>') || msg.startsWith('<@!723893316592074782>'))
        msg.reply("fuck");

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

    else if(msg.includes("lul"))
    {
        if(msg.includes("omega"))
            message.channel.send("", {files: ['./images/omegalul.jpg']});

        else
            message.channel.send("", {files: ['./images/lul.png']});
    }

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

    if(message.author.username == "jdolds09")
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
            message.channel.send("Because Aaron took the time to write this message instead of working, the entire Chili's franchise has gone bankrupt and will cease to exist. Nice going Aaron, nobody will ever enjoy chicken crispers ever again.");
            message.channel.send("", {files: ['./images/aaron.gif']});
        }
    }

    // Kindly tell Alex to fuck off if requested
    if((msg.includes("alex") && msg.includes("fuck") && msg.includes("off")) && !(message.author.bot))
    {
        message.channel.send("Fuck off Alex you doo doo head");
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