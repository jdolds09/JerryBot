const fs = require('fs') // For file parsing
const Discord = require('discord.js'); // For Discord functions
const Client = require('./classes/Client'); // To save commands
const random_word = require('random-words'); // Random word for hangman game

// This is what must be put immediately before commands
prefix = '!';

// Servers variable so all servers aint playing same hangman game screwing it up
var servers = {};

// Declare command variale
const client = new Client();
client.commands = new Discord.Collection();

// Get all commands
const music_command_files = fs.readdirSync('./commands/Music').filter(file => file.endsWith('.js'));
const misc_command_files = fs.readdirSync('./commands/Misc').filter(file => file.endsWith('.js'));
const nsfw_command_files = fs.readdirSync('./commands/NSFW').filter(file => file.endsWith('.js'));
const fun_command_files = fs.readdirSync('./commands/Fun').filter(file => file.endsWith('.js'));

// Set all music commands
for (const file of music_command_files)
{
    const command = require(`./commands/Music/${file}`);
    client.commands.set(command.name, command);
}

// Set all miscellaneous commands
for (const file of misc_command_files)
{
    const command = require(`./commands/Misc/${file}`);
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
client.commands.set(command.name, command);

// Announce that the bot is online
client.once('ready', () => {
    console.log("JerryBot is online!");
});

// Listen to discord messages
client.on('message', async message => {

    // Tell Alex to fuck off if he says anything about JerryBot
    if(message.author.username == "ThatSaltySnipezGuy")
    {
        var msg = message.content.toLowerCase();
        if((msg.includes("jerry") && msg.includes("bot")) || msg.includes("@jerrybot"))
        {
            message.channel.send("Fuck you Alex :)");
        }
    }

    var msg = message.content.toLowerCase();

    // Kindly tell Alex to fuck off if requested
    if((msg.includes("alex") && msg.includes("fuck") && msg.includes("off")) && !(message.author.bot))
    {
        const alex = "ThatSaltySnipezGuy";
        message.channel.send(alex, "Fuck off Alex you poo poo head.");
    }

    // Check to see if discord message sent is a command
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    // Not a command so do nothing
	if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    // Hangman command
    if(message.content.toLowerCase().includes("!hangman"))
    {
        if(!servers[message.guild.id])
        {
            servers[message.guild.id] = 
            {
                // Hangman variables
                word: random_word(),
                letters: [],
                strikes: 0,
                hit: false,
                dashes: false
            }
        }

        const arguments = message.content.split(" ");
        const letter = arguments[1].charAt(0);
        // If letter guessed is in word
        if(servers[message.guild.id].word.includes(letter))
        {
            // If no dashes are output, this stays false and player wins
            servers[message.guild.id].dashes = false;
            // Add letters guessed correctly to array 
            servers[message.guild.id].letters.push(letter);

            // Output picture of current state of hangman game
            message.channel.send("", {files: [`./images/hangman_${servers[message.guild.id].strikes}.png`]});

            // Output current state of game
            var i = 0;
            var str = "";
            for(i = 0; i < servers[message.guild.id].word.length; i++)
            {
                servers[message.guild.id].hit = false;
                for(j = 0; j < servers[message.guild.id].letters.length; j++)
                {
                    if(servers[message.guild.id].letters[j] == servers[message.guild.id].word.charAt(i))
                    {
                        str += `${letters[j]} `;
                        servers[message.guild.id].hit = true;
                    }
                }
                if(!servers[message.guild.id].hit)
                {
                    str += '- ';
                    servers[message.guild.id].dashes = true;
                }
            }

            message.channel.send(str);

            // Check to see if player won
            if(!servers[message.guild.id].dashes)
            {
                message.channel.send("**YOU WIN!**");
                servers[message.guild.id].word = random_word();
                servers[message.guild.id].letters = [];
                servers[message.guild.id].strikes = 0;
            }
        }

        // If letter guessed is not in word
        else
        {
            // Add one to letters incorrectly guessed
            servers[message.guild.id].strikes += 1;

            // Output picture of current state of hangman game
            message.channel.send("", {files: [`./images/hangman_${servers[message.guild.id].strikes}.png`]});

            // Output current state of game
            var i = 0;
            var str = "";
            for(i = 0; i < servers[message.guild.id].word.length; i++)
            {
                servers[message.guild.id].hit = false;
                for(j = 0; j < servers[message.guild.id].letters.length; j++)
                {
                    if(servers[message.guild.id].letters[j] == servers[message.guild.id].word.charAt(i))
                    {
                        str += `${letters[j]} `;
                        servers[message.guild.id].hit = true;
                    }
                }
                if(!servers[message.guild.id].hit)
                    str += '- ';
            }

            message.channel.send(str);

            // Check to see if player lost
            if(servers[message.guild.id].strikes == 6)
            {
                message.channel.send(`**HAHAHAHA YOU LOST! THE WORD WAS ${word.toUpperCase()} DUMBASS!**`);
                servers[message.guild.id].word = random_word();
                servers[message.guild.id].letters = [];
                servers[message.guild.id].strikes = 0;
            }
        }
    }

    // Execute command
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