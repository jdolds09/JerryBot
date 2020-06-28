const Images = require("dabi-images");
const Client = new Images.Client();
const Discord = require("discord.js");
const Client2 = require('../../client/Client');
const client = new Client2();
const prefix = '!';

module.exports = {
	name: 'vag',
	description: 'Post an image of a vag (Must be in NSFW channel).',
    execute(message) 
    {
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            Client.nsfw.real.vag().then(json => {
                return message.channel.send(json.url);
                }).catch(error => {
                    console.log(json.url);
                    console.log(error);
                    const args = message.content.slice(prefix.length).split(/ +/);
                    const commandName = args.shift().toLowerCase();
                    const command = client.commands.get(commandName);
                    command.execute(message);
                });
        }
    },
};