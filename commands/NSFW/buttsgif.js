const Images = require("dabi-images");
const Client = new Images.Client();
const Discord = require("discord.js");

module.exports = {
	name: 'buttsgif',
	description: 'Post a butt gif (Must be in NSFW channel).',
    execute(message) 
    {
        Client.nsfw.real.buttgifs().then(json => {
            return message.channel.send(json.url);
            }).catch(error => {
                console.log(error);
            });
    },
};