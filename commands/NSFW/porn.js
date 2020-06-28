const Images = require("dabi-images");
const Client = new Images.Client();
const Discord = require("discord.js");
const Client2 = require('../../client/Client');
const client = new Client2();
const prefix = '!';

module.exports = {
	name: 'porn',
	description: 'Post a porn gif (Must be in NSFW channel).',
    execute(message) 
    {
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            Client.nsfw.real.porn().then(json => {
                const embed = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setURL(json.url)
                    .setImage(json.url)
                    .setAuthor(json.url);
                return message.channel.send({embed});
                }).catch(error => {
                    console.log(error);
                });
        }
    },
};