const Pornsearch = require("pornsearch");
const Discord = require('discord.js');

module.exports = {
	name: 'porn',
	description: 'Post a porn gif (Must be in NSFW channel).',
    async execute(message) 
    {
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            try
            {
                const Searcher = new Pornsearch("teen");
                const gifs = await Searcher.gifs();

                const result = Math.floor(Math.random() * gifs.length);
                const { url } = gifs[result - 1];

                const embed = new Discord.MessageEmbed()
                    .setImage(url)
                    .setColor("RANDOM")
                    .setURL(url)
                    .setAuthor(url);

                return message.channel.send({embed});
            }
            catch(error)
            {
                console.log(error);
                return;
            }
        }
    },
};