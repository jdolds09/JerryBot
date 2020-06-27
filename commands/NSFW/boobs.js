const Images = require("dabi-images");
const Client = new Images.Client();
const Discord = require("discord.js");

module.exports = {
	name: 'boobs',
	description: 'Post an image of boobs (Must be in NSFW channel).',
    execute(message) 
    {
        Client.nsfw.real.boobs().then(json => {
            return message.channel.send(json.url);
            }).catch(error => {
                console.log(error);
            });
    },
};