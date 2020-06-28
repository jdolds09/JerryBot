const fs = require('fs') // For file parsing
const Discord = require('discord.js'); // For Discord functions
const Client = require('./classes/Client'); // To save commands

// This is what must be put immediately before commands
prefix = '!';

// Declare command variale
const client = new Client();
client.commands = new Discord.Collection();

// Get all commands
const music_command_files = fs.readdirSync('./commands/Music').filter(file => file.endsWith('.js'));
const misc_command_files = fs.readdirSync('./commands/Misc').filter(file => file.endsWith('.js'));
const nsfw_command_files = fs.readdirSync('./commands/NSFW').filter(file => file.endsWith('.js'));
const fun_command_files = fs.readdirSync('./commands/Fun').filter(file => file.endsWith('.js'));
const help_command_file = fs.readdirSync('./commands').filter(file => 'help.js');

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

    // Execute the command
    try 
    {
        command.execute(message);
    } 
    catch (error) 
    {
		console.error(error);
		message.reply('That command doesn\'t exist dumbass.');
    }
});

client.login(process.env.token);