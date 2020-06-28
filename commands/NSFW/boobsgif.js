const Pornsearch = require("pornsearch");

module.exports = {
	name: 'boobsgif',
	description: 'Post a boobs gif (Must be in NSFW channel).',
    execute(message) 
    {
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            try
            {
                const Searcher = new Pornsearch('boobs', 'pornhub');
                Searcher.gifs()
                    .then(gif => message.channel.send(gif.url));
            }
            catch(error)
            {
                console.log(error);
            }
        }
    },
};