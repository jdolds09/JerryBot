const Pornsearch = require("pornsearch");

module.exports = {
	name: 'porn',
	description: 'Post a porn gif (Must be in NSFW channel).',
    execute(message) 
    {
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            try
            {
                const Searcher = new Pornsearch('teen', 'pornhub');
                Searcher.gifs()
                    .then(gif => message.channel.send(gif.url));
            }
        }
    },
};