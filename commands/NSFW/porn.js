const Pornsearch = require("pornsearch");

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
                const Searcher = await Pornsearch.search("teen", "pornhub").gifs();

                const result = Math.floor(Math.random() * Searcher.length);
                const { url } = Searcher[result - 1];

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