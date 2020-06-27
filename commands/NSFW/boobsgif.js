const Pornsearch = require("pornsearch");
const Discord = require("discord.js")

module.exports = {
	name: 'boobsgif',
	description: 'Post a gif of boobs (Must be in NSFW channel).',
	execute(message) {
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            try
            {
                const Search = new Pornsearch("boobs");
                const gifs = await Search.gifs();
                const result = Math.floor(Math.random() * gifs.length);
                const { url } = gifs[result - 1];
                
                const embed = new Discord.MessageEmbed()
                    .setImage(url)
                    .setColor('#ff0000')
                    .setURL(url)
                    .setAuthor(url);

                return msg.channel.send({embed});
            }

            catch (error)
            {
                return msg.reply("There was an issue bringing up a boobs gif.");
            }
        }
	},
};