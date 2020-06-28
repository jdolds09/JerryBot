const Pornsearch = require("pornsearch");

module.exports = {
	name: 'buttsgif',
	description: 'Post a butt gif (Must be in NSFW channel).',
    async execute(message) 
    {
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            try
            {
                const Searcher = new Pornsearch.search("butt");
                const gifs = await Searcher.gifs();

                const result = Math.floor(Math.random() * gifs.length);
                const { url } = gifs[result - 1];

                return message.channel.send({url});
            }
            catch(error)
            {
                console.log(error);
                return;
            }
        }
    },
};