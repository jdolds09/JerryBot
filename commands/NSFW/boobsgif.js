const Pornsearch = require("pornsearch");
const Discord = require("discord.js");

module.exports = {
	name: 'boobsgif',
	description: 'Post a boobs gif (Must be in NSFW channel).',
    async execute(message) 
    {
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            try
            {
                const Searcher = await Pornsearch.search("boobs", "pornhub").gifs();

                const result = Math.floor(Math.random() * Searcher.length);
                const { url } = Searcher[result - 1];

                message.channel.send({url});
            }
            catch(error)
            {
                console.log(error);
            }
        }
    },
};