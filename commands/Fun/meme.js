const Images = require("dabi-images");
const Client = new Images.Client();
const Discord = require("discord.js");

module.exports = {
	name: 'meme',
	description: 'Post a meme!',
    execute(message) 
    {
        Client.nsfw.real.meme().then(json => {
            return message.channel.send(json.url);
            }).catch(error => {
                console.log(error);
            });
    },
};