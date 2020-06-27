const Images = require("dabi-images");
const Client = new Images.Client();
const Discord = require("discord.js");

module.exports = {
	name: 'wiener',
	description: 'Post an image of a wiener (Must be in NSFW channel).',
    execute(message) 
    {
        Client.nsfw.real.wiener().then(json => {
            return message.channel.send(json.url);
            }).catch(error => {
                console.log(error);
            });
    },
};