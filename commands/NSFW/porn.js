const Images = require("dabi-images");
const Client = new Images.Client();
const Discord = require("discord.js");

module.exports = {
	name: 'porn',
	description: 'Post a porn gif (Must be in NSFW channel).',
    execute(message) 
    {
        Client.nsfw.real.porn().then(json => {
            return message.channel.send(json.url);
            }).catch(error => {
                console.log(error);
            });
    },
};