const Pornsearch = require("pornsearch");
const Discord = require("discord.js")

module.exports = {
	name: 'buttsgif',
	description: 'Post a gif of a butt (Must be in NSFW channel).',
    execute(message) {
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            try
            {
                const Search = new Pornsearch("butts");
                const gifs = Search.gifs();
                const result = Math.floor(Math.random() * gifs.length);
                const { url } = gifs[result - 1];
                
                const embed = new Discord.MessageEmbed()
                    .setImage(url)
                    .setColor('#ff0000')
                    .setURL(url)
                    .setAuthor(url);

                return message.channel.send({embed});
            }

            catch (error)
            {
                return message.reply("There was an issue bringing up a butt gif.");
            }
        }
	},
};