const Images = require("dabi-images");
const Client = new Images.Client();
const Discord = require("discord.js");

module.exports = {
	name: 'hentai',
	description: 'Post a hentai image (Must be in NSFW channel).',
    execute(message) 
    {
        Client.nsfw.real.hentai().then(json => {
            return message.channel.send(json.url);
            }).catch(error => {
                console.log(error);
            });
    },
};