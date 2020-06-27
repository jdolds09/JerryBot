const fs = require('fs')
const Discord = require('discord.js');
const Client = require('./client/Client');

prefix = '!';

const client = new Client();
client.commands = new Discord.Collection();

const music_command_files = fs.readdirSync('./commands/Music').filter(file => file.endsWith('.js'));
const misc_command_files = fs.readdirSync('./commands/Misc').filter(file => file.endsWith('.js'));
const nsfw_command_files = fs.readdirSync('./commands/NSFW').filter(file => file.endsWith('.js'));
const fun_command_files = fs.readdirSync('./commands/Fun').filter(file => file.endsWith('.js'));
const help_command_file = fs.readdirSync('./commands').filter(file => 'help.js');

for (const file of music_command_files)
{
    const command = require(`./commands/Music/${file}`);
    client.commands.set(command.name, command);
}

for (const file of misc_command_files)
{
    const command = require(`./commands/Misc/${file}`);
    client.commands.set(command.name, command);
}

for (const file of nsfw_command_files)
{
    const command = require(`./commands/NSFW/${file}`);
    client.commands.set(command.name, command);
}

for (const file of fun_command_files)
{
    const command = require(`./commands/Fun/${file}`);
    client.commands.set(command.name, command);
}

const command = require(`./commands/help`);
client.commands.set(command.name, command);

client.once('ready', () => {
    console.log("JerryBot is online!");
});

client.on('message', async message => {

    if(message.author.username == "ThatSaltySnipezGuy")
    {
        var msg = message.content.toLowerCase();
        if((msg.includes("jerry") && msg.includes("bot")) || msg.includes("@jerrybot"))
        {
            message.channel.send("Fuck you Alex :)");
        }
    }

    var msg = message.content.toLowerCase();

    if((msg.includes("alex") && msg.includes("fuck") && msg.includes("off")) && !(message.author.bot))
    {
        message.channel.send("Fuck off Alex you poo poo head.");
    }

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

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