const Images = require("dabi-images");
const Client = new Images.Client();
const Discord = require("discord.js");

module.exports = {
	name: 'boobsgif',
	description: 'Post a boob gif (Must be in NSFW channel).',
    execute(message) 
    {
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            Client.nsfw.real.boobsgifs().then(json => {
                return message.channel.send(json.url);
                }).catch(error => {
                    console.log(error);
                });
        }
    },
};