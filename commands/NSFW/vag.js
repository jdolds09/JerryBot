const Images = require("dabi-images");
const Client = new Images.Client();
const Discord = require("discord.js")

module.exports = {
	name: 'vag',
	description: 'Post an image of a vag (Must be in NSFW channel).',
    execute(message) 
    {
        Client.nsfw.real.vag().then(json => {
            embed = new Discord.MessageEmbed()
                .setImage(json.url)
                .setColor('RANDOM')
                .setURL(json.url)
                .setAuthor(json.url);
            return message.channel.send({embed});
            }).catch(error => {
                console.log(error);
            });
    },
};