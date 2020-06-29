const fs = require('fs') // For file parsing
const Discord = require('discord.js'); // For Discord functions
const Client = require('./classes/Client'); // To save commands
const random_word = require('random-words'); // Random word for hangman game

// This is what must be put immediately before commands
prefix = '!';

// Hangman variables
var word = random_word();
var letters = [];
var hits = 0;
var strikes = 0;
var hit = false;
var dashes = false;

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
        const arguments = message.content.split(" ");
        const letter = arguments[1].charAt(0);
        // If letter guessed is in word
        if(word.includes(letter))
        {
            // If no dashes are output, this stays false and player wins
            dashes = false;
            // Add letters guessed correctly to array 
            letters.push(letter);

            // Output picture of current state of hangman game
            message.channel.send("", {files: [`./images/hangman_${strikes}.png`]});

            // Output current state of game
            var i = 0;
            var str = "";
            for(i = 0; i < word.length; i++)
            {
                hit = false;
                for(j = 0; j < letters.length; j++)
                {
                    if(letters[j] == word.charAt(i))
                    {
                        str += `${letters[j]} `;
                        hits += 1;
                        hit = true;
                    }
                }
                if(!hit)
                {
                    str += '- ';
                    dashes = true;
                }
            }

            message.channel.send(str);

            // Check to see if player won
            if(!dashes)
            {
                message.channel.send("**YOU WIN!**");
                word = random_word();
                letters = [];
                hits = 0;
                strikes = 0;
            }
        }

        // If letter guessed is not in word
        else
        {
            // Add one to letters incorrectly guessed
            strikes += 1;

            // Output picture of current state of hangman game
            message.channel.send("", {files: [`./images/hangman_${strikes}.png`]});

            // Output current state of game
            var i = 0;
            var str = "";
            for(i = 0; i < word.length; i++)
            {
                hit = false;
                for(j = 0; j < letters.length; j++)
                {
                    if(letters[j] == word.charAt(i))
                    {
                        str += `${letters[j]} `;
                        hit = true;
                    }
                }
                if(!hit)
                    str += '- ';
            }

            message.channel.send(str);

            // Check to see if player lost
            if(strikes == 6)
            {
                message.channel.send(`**HAHAHAHA YOU LOST! THE WORD WAS ${word} DUMBASS!**`);
                word = random_word();
                letters = [];
                hits = 0;
                strikes = 0;
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