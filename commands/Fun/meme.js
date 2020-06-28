const Images = require("dabi-images");
const Client = new Images.Client();
const Discord = require("discord.js");
const Client2 = require('../../client/Client');
const client = new Client2();
const prefix = '!';

module.exports = {
	name: 'meme',
	description: 'Post a meme (Must be in NSFW channel).',
    execute(message) 
    {
        Client.nsfw.real.meme().then(json => {
            return message.channel.send(json.url);
            }).catch(error => {
                console.log(json.url);
                console.log(error);
                const args = message.content.slice(prefix.length).split(/ +/);
                const commandName = args.shift().toLowerCase();
                const command = client.commands.get(commandName);
                command.execute(message);
            });
    },
};