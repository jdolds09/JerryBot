const Images = require("dabi-images");
const Client = new Images.Client();

// Hentai command
module.exports = {
	name: 'hentai',
	description: 'Post an image of hentai (Must be in NSFW channel).',
    execute(message) 
    {
        // Check to see if message was sent in NSFW channel
        if(!message.channel.nsfw)
            message.channel.send("Must be in a NSFW channel.");
        else
        {
            // Get hentai image
            Client.nsfw.real.hentai().then(json => {
                // Send image
                return message.channel.send(json.url);
                }).catch(error => {
                    message.channel.send("Unable to fetch image. Please try again.");
                    console.log(error);
                });
        }
    },
};